from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import get_settings
from .database import engine, Base
# from .routes import auth, conversations, chat
from .routes import conversations, chat
from sqlalchemy import text
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()

# Run migration on startup
def run_migration():
    """Run database migration on startup"""
    migration_sql = """
    -- Drop existing tables if they exist
    DROP TABLE IF EXISTS messages CASCADE;
    DROP TABLE IF EXISTS chat_sessions CASCADE;
    DROP TABLE IF EXISTS users CASCADE;

    -- Create simplified users table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    -- Create chat_sessions table
    CREATE TABLE IF NOT EXISTS chat_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT DEFAULT 'چت جدید',
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated_at ON chat_sessions(updated_at DESC);

    -- Create messages table
    CREATE TABLE IF NOT EXISTS messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      is_user BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
    CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
    """

    try:
        logger.info("Running database migration...")
        with engine.connect() as conn:
            with conn.begin():
                conn.execute(text(migration_sql))
        logger.info("Database migration completed successfully!")
        return True
    except Exception as e:
        logger.error(f"Error during migration: {e}")
        # Continue anyway, tables might already exist
        return False

# Run migration
run_migration()

app = FastAPI(
    title="Shahrzad Chat API",
    description="Backend API for Shahrzad Chatbot",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with /api prefix
app.include_router(auth.router, prefix="/api/auth")
app.include_router(conversations.router, prefix="/api/conversations")
app.include_router(chat.router, prefix="/api")


@app.get("/")
async def root():
    return {
        "message": "Shahrzad Chat API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
