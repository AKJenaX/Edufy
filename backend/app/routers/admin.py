from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.dependencies import get_current_user, require_admin
from app.schemas.auth import UserResponse, RegisterRequest
from app.models.user import UserCreate
from app.services.auth import get_password_hash
from database.connection import (
    get_users_collection,
    get_attendance_collection,
    get_ai_interactions_collection,
    get_faculty_collection,
    get_students_collection
)
from datetime import datetime, timedelta
from bson import ObjectId
import random

router = APIRouter(prefix="/admin", tags=["Admin"])


class TimetableRequest(BaseModel):
    subjects: List[str]
    faculty_ids: Optional[List[str]] = None
    rooms: Optional[List[str]] = None


class TimetableConstraints(BaseModel):
    subjects: List[str]
    faculty_preferences: Optional[Dict[str, List[str]]] = None  # faculty_id: [preferred_times]
    room_types: Optional[Dict[str, str]] = None  # subject: room_type (lab/lecture)


@router.get("/dashboard")
async def get_admin_dashboard(current_user: UserResponse = Depends(require_admin)):
    """Get admin dashboard statistics"""
    cache_key = "admin:dashboard"
    cached_data = await cache.get(cache_key)
    if cached_data:
        return cached_data

    users_collection = get_users_collection()
    attendance_collection = get_attendance_collection()
    students_collection = get_students_collection()
    faculty_collection = get_faculty_collection()
    
    # Count users by role
    total_students = await users_collection.count_documents({"role": "student"})
    total_faculty = await users_collection.count_documents({"role": "faculty"})
    total_admins = await users_collection.count_documents({"role": "admin"})
    
    # Get total courses (placeholder)
    total_courses = 25

    total_records = await attendance_collection.count_documents({})
    present_records = await attendance_collection.count_documents({"status": "present"})
    avg_attendance = (present_records / total_records * 100) if total_records else 0

    response_data = {
        "total_students": total_students,
        "total_faculty": total_faculty,
        "total_admins": total_admins,
        "total_courses": total_courses,
        "active_courses": total_courses,
        "system_health": "Good",
        "performance_metrics": {
            "avg_attendance": round(avg_attendance, 2),
            "avg_score": 75
        },
        "recent_activities": [],
        "active_users": total_students + total_faculty
    }
    
    await cache.set(cache_key, response_data, expire_seconds=300)
    return response_data


@router.get("/analytics")
async def get_admin_analytics(current_user: UserResponse = Depends(require_admin)):
    """Get combined analytics data used by the admin dashboard."""
    cache_key = "admin:analytics"
    cached_data = await cache.get(cache_key)
    if cached_data:
        return cached_data

    attendance_collection = get_attendance_collection()
    students_collection = get_students_collection()

    total_students = await students_collection.count_documents({})
    total_records = await attendance_collection.count_documents({})
    present_records = await attendance_collection.count_documents({"status": "present"})
    completion_rate = (present_records / total_records * 100) if total_records else 0

    at_risk_count = await students_collection.count_documents({"risk_level": "High"})

    response_data = {
        "total_enrollments": total_students,
        "completion_rate": round(completion_rate, 2),
        "at_risk_count": at_risk_count,
        "department_stats": {
            "Computer Science": {
                "students": total_students,
                "attendance_records": total_records
            }
        }
    }
    
    await cache.set(cache_key, response_data, expire_seconds=300)
    return response_data


@router.get("/analytics/attendance")
async def get_attendance_analytics(current_user: UserResponse = Depends(require_admin)):
    """Get attendance analytics"""
    attendance_collection = get_attendance_collection()
    
    # Get total attendance records
    total_records = await attendance_collection.count_documents({})
    present_records = await attendance_collection.count_documents({"status": "present"})
    absent_records = await attendance_collection.count_documents({"status": "absent"})
    
    # Calculate overall percentage
    overall_percentage = (present_records / total_records * 100) if total_records > 0 else 0
    
    # Get last 7 days data
    today = datetime.utcnow()
    last_7_days = []
    
    for i in range(7):
        date = (today - timedelta(days=i)).strftime("%Y-%m-%d")
        day_total = await attendance_collection.count_documents({"date": date})
        day_present = await attendance_collection.count_documents({"date": date, "status": "present"})
        
        last_7_days.append({
            "date": date,
            "total": day_total,
            "present": day_present,
            "percentage": (day_present / day_total * 100) if day_total > 0 else 0
        })
    
    return {
        "overall_attendance_percentage": round(overall_percentage, 2),
        "total_records": total_records,
        "present_records": present_records,
        "absent_records": absent_records,
        "last_7_days": last_7_days
    }


@router.get("/analytics/faculty")
async def get_faculty_analytics(current_user: UserResponse = Depends(require_admin)):
    """Get faculty activity analytics"""
    attendance_collection = get_attendance_collection()
    faculty_collection = get_faculty_collection()
    
    # Get all faculty
    faculty_list = await faculty_collection.find().to_list(length=100)
    
    faculty_stats = []
    
    for faculty in faculty_list:
        faculty_id = str(faculty.get("_id"))
        
        # Count attendance marked by this faculty
        marked_count = await attendance_collection.count_documents({"marked_by": faculty_id})
        
        faculty_stats.append({
            "faculty_id": faculty_id,
            "name": faculty.get("full_name", "Unknown"),
            "department": faculty.get("department", "N/A"),
            "attendance_marked": marked_count
        })
    
    return {"faculty_activity": faculty_stats}


@router.get("/analytics/ai-usage")
async def get_ai_usage_analytics(current_user: UserResponse = Depends(require_admin)):
    """Get AI usage statistics"""
    ai_interactions_collection = get_ai_interactions_collection()
    
    # Count by interaction type
    total_interactions = await ai_interactions_collection.count_documents({})
    summarize_count = await ai_interactions_collection.count_documents({"interaction_type": "summarize"})
    explain_count = await ai_interactions_collection.count_documents({"interaction_type": "explain"})
    quiz_count = await ai_interactions_collection.count_documents({"interaction_type": "quiz"})
    chat_count = await ai_interactions_collection.count_documents({"interaction_type": "chat"})
    
    # Get recent interactions
    recent = await ai_interactions_collection.find().sort("created_at", -1).limit(10).to_list(length=10)
    
    for interaction in recent:
        interaction["_id"] = str(interaction["_id"])
    
    return {
        "total_interactions": total_interactions,
        "by_type": {
            "summarize": summarize_count,
            "explain": explain_count,
            "quiz": quiz_count,
            "chat": chat_count
        },
        "recent_interactions": recent
    }


@router.get("/users")
async def get_all_users(
    current_user: UserResponse = Depends(require_admin),
    role: Optional[str] = None
):
    """Get all users"""
    users_collection = get_users_collection()
    
    query = {}
    if role:
        query["role"] = role
    
    users = await users_collection.find(query).limit(100).to_list(length=100)
    
    for user in users:
        user["_id"] = str(user["_id"])
        user.pop("hashed_password", None)  # Don't return password hash
    
    return {"users": users}


@router.post("/user/create")
async def create_user(
    user_data: RegisterRequest,
    current_user: UserResponse = Depends(require_admin)
):
    """Create a new user (admin only)"""
    users_collection = get_users_collection()
    
    # Check if user exists
    existing = await users_collection.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_dict = {
        "email": user_data.email,
        "full_name": user_data.full_name,
        "role": user_data.role,
        "hashed_password": get_password_hash(user_data.password),
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    if user_data.student_id:
        user_dict["student_id"] = user_data.student_id
    if user_data.faculty_id:
        user_dict["faculty_id"] = user_data.faculty_id
    
    result = await users_collection.insert_one(user_dict)
    
    return {
        "message": "User created successfully",
        "user_id": str(result.inserted_id),
        "email": user_data.email,
        "role": user_data.role
    }


@router.post("/users")
async def create_user_compat(
    user_data: RegisterRequest,
    current_user: UserResponse = Depends(require_admin)
):
    """Create a new user using the frontend's /admin/users route."""
    return await create_user(user_data, current_user)


@router.get("/system/stats")
async def get_system_stats(current_user: UserResponse = Depends(require_admin)):
    """Get lightweight system status for the admin dashboard."""
    users_collection = get_users_collection()
    attendance_collection = get_attendance_collection()
    ai_interactions_collection = get_ai_interactions_collection()

    return {
        "database": "Connected",
        "ai_service": "Configured",
        "total_users": await users_collection.count_documents({}),
        "attendance_records": await attendance_collection.count_documents({}),
        "ai_interactions": await ai_interactions_collection.count_documents({}),
        "generated_at": datetime.utcnow().isoformat()
    }


@router.delete("/user/{user_id}")
async def delete_user(
    user_id: str,
    current_user: UserResponse = Depends(require_admin)
):
    """Delete a user"""
    users_collection = get_users_collection()
    
    result = await users_collection.delete_one({"_id": ObjectId(user_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "User deleted successfully"}


@router.post("/timetable/generate")
async def generate_timetable(
    request: TimetableRequest,
    current_user: UserResponse = Depends(require_admin)
):
    """Generate timetable with constraints"""
    
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    time_slots = [
        "9:00 - 10:00",
        "10:00 - 11:00",
        "11:00 - 12:00",
        "12:00 - 1:00",
        "2:00 - 3:00",
        "3:00 - 4:00",
        "4:00 - 5:00"
    ]
    
    # Default rooms if not provided
    rooms = request.rooms if request.rooms else [f"Room {100 + i}" for i in range(10)]
    
    timetable = {}
    used_slots = {}  # Track used time slots to avoid clashes
    
    for day in days:
        timetable[day] = []
        used_slots[day] = set()
    
    # Distribute subjects across days and time slots
    subject_index = 0
    
    for day in days:
        # Assign 2-3 classes per day
        classes_per_day = min(3, len(request.subjects) - subject_index)
        
        for i in range(classes_per_day):
            if subject_index >= len(request.subjects):
                break
            
            subject = request.subjects[subject_index]
            time_slot = time_slots[i * 2]  # Space out classes
            room = rooms[subject_index % len(rooms)]
            
            timetable[day].append({
                "subject": subject,
                "time": time_slot,
                "room": room,
                "faculty": f"Faculty {subject_index + 1}"
            })
            
            used_slots[day].add(time_slot)
            subject_index += 1
    
    return {
        "message": "Timetable generated successfully",
        "timetable": timetable,
        "total_subjects": len(request.subjects),
        "total_classes": sum(len(classes) for classes in timetable.values())
    }

# Made with Bob
