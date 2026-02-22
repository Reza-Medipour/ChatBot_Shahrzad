from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from .. import models, schemas, auth
from ..database import get_db
from ..config import get_settings

router = APIRouter(tags=["Authentication"])
settings = get_settings()


@router.post("/register", response_model=schemas.Token)
async def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user with phone number exists
    db_user = db.query(models.User).filter(models.User.phone_number == user.phone_number).first()

    if db_user and db_user.is_registered:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already registered"
        )

    # Check if username exists
    if user.username:
        username_exists = db.query(models.User).filter(models.User.username == user.username).first()
        if username_exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )

    # Create or update user
    if db_user:
        db_user.username = user.username
        db_user.password = auth.get_password_hash(user.password) if user.password else None
        db_user.is_registered = True
    else:
        hashed_password = auth.get_password_hash(user.password) if user.password else None
        db_user = models.User(
            phone_number=user.phone_number,
            username=user.username,
            password=hashed_password,
            is_registered=True
        )
        db.add(db_user)

    db.commit()
    db.refresh(db_user)

    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": str(db_user.id)}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login", response_model=schemas.Token)
async def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, user_credentials.username, user_credentials.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Update last login
    user.last_login = models.func.now()
    db.commit()

    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=schemas.UserResponse)
async def get_current_user(current_user: models.User = Depends(auth.get_current_user)):
    return current_user


@router.post("/auto-login", response_model=schemas.Token)
async def auto_login(data: schemas.ShahrzaadAutoLogin, db: Session = Depends(get_db)):
    """Auto-login endpoint for Shahrzaad users"""

    # Check if user with shahrzaad_id exists
    db_user = db.query(models.User).filter(models.User.shahrzaad_id == data.shahrzaad_id).first()

    if db_user:
        # User exists, update last_login
        db_user.last_login = models.func.now()
        db.commit()
        db.refresh(db_user)
    else:
        # Create new user with shahrzaad_id
        db_user = models.User(
            shahrzaad_id=data.shahrzaad_id,
            is_registered=True
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": str(db_user.id)}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}
