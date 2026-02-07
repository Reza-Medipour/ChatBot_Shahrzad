"""
Script to create an admin user for testing
Run this after starting the docker containers:
  docker-compose exec backend python create_admin.py
"""

from app.database import SessionLocal
from app import models
from app.auth import get_password_hash

def create_admin_user():
    db = SessionLocal()

    try:
        # Check if admin user exists
        existing_user = db.query(models.User).filter(
            models.User.username == "admin"
        ).first()

        if existing_user:
            print("Admin user already exists!")
            return

        # Create admin user
        admin_user = models.User(
            phone_number="09123456789",
            username="admin",
            password=get_password_hash("admin123"),
            is_registered=True
        )

        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)

        print("✅ Admin user created successfully!")
        print(f"   Username: admin")
        print(f"   Password: admin123")
        print(f"   Phone: 09123456789")
        print(f"   User ID: {admin_user.id}")

    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()
