"""
Create demo users for Edufy system
Run this script to populate the database with test accounts
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext  # type: ignore
from datetime import datetime, timezone

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_demo_users():
    """Create demo users in MongoDB"""
    print("Connecting to MongoDB...")
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["edify"]
    users_collection = db["users"]
    
    # Clear existing demo users
    print("Clearing existing demo users...")
    await users_collection.delete_many({
        "email": {"$in": [
            "student@edify.com",
            "faculty@edify.com",
            "admin@edify.com"
        ]}
    })
    
    # Demo users
    now = datetime.now(timezone.utc)
    demo_users = [
        {
            "email": "student@edify.com",
            "full_name": "Demo Student",
            "role": "student",
            "hashed_password": pwd_context.hash("student123"),
            "is_active": True,
            "student_id": "STU001",
            "created_at": now,
            "updated_at": now
        },
        {
            "email": "faculty@edify.com",
            "full_name": "Demo Faculty",
            "role": "faculty",
            "hashed_password": pwd_context.hash("faculty123"),
            "is_active": True,
            "faculty_id": "FAC001",
            "created_at": now,
            "updated_at": now
        },
        {
            "email": "admin@edify.com",
            "full_name": "Demo Admin",
            "role": "admin",
            "hashed_password": pwd_context.hash("admin123"),
            "is_active": True,
            "created_at": now,
            "updated_at": now
        }
    ]
    
    print("Creating demo users...")
    result = await users_collection.insert_many(demo_users)
    print(f"SUCCESS: Created {len(result.inserted_ids)} demo users!")
    
    print("\n" + "=" * 50)
    print("Demo Accounts Created:")
    print("=" * 50)
    print("\nStudent Account:")
    print("  Email: student@edify.com")
    print("  Password: student123")
    print("\nFaculty Account:")
    print("  Email: faculty@edify.com")
    print("  Password: faculty123")
    print("\nAdmin Account:")
    print("  Email: admin@edify.com")
    print("  Password: admin123")
    print("=" * 50)
    
    client.close()
    print("\nAll done! You can now login with these accounts.")

if __name__ == "__main__":
    try:
        asyncio.run(create_demo_users())
    except Exception as e:
        print(f"ERROR: {e}")
        print("\nMake sure MongoDB is running on localhost:27017")
        print("Start MongoDB with: net start MongoDB")

# Made with Bob
