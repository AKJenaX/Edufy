from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from config import settings
import logging

logger = logging.getLogger(__name__)


class Database:
    client: AsyncIOMotorClient = None
    
    @classmethod
    async def connect_db(cls):
        """Connect to MongoDB"""
        try:
            cls.client = AsyncIOMotorClient(settings.MONGODB_URL)
            # Test connection
            await cls.client.admin.command('ping')
            logger.info(f"Connected to MongoDB at {settings.MONGODB_URL}")
        except Exception as e:
            logger.error(f"Could not connect to MongoDB: {e}")
            raise
    
    @classmethod
    async def close_db(cls):
        """Close MongoDB connection"""
        if cls.client:
            cls.client.close()
            logger.info("Closed MongoDB connection")
    
    @classmethod
    def get_database(cls):
        """Get database instance"""
        return cls.client[settings.DATABASE_NAME]
    
    @classmethod
    def get_collection(cls, collection_name: str):
        """Get collection from database"""
        db = cls.get_database()
        return db[collection_name]


# Database instance
db = Database()


# Collection getters
def get_users_collection():
    return db.get_collection("users")


def get_students_collection():
    return db.get_collection("students")


def get_faculty_collection():
    return db.get_collection("faculty")


def get_attendance_collection():
    return db.get_collection("attendance")


def get_courses_collection():
    return db.get_collection("courses")


def get_documents_collection():
    return db.get_collection("documents")


def get_timetable_collection():
    return db.get_collection("timetable")


def get_leave_collection():
    return db.get_collection("leave_requests")


def get_ai_interactions_collection():
    return db.get_collection("ai_interactions")

# Made with Bob