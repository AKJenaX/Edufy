from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.dependencies import get_current_user, require_faculty
from app.schemas.auth import UserResponse
from app.models.faculty import LeaveRequest, Schedule
from app.models.student import AttendanceRecord
from database.connection import (
    get_faculty_collection,
    get_attendance_collection,
    get_leave_collection,
    get_students_collection
)
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/faculty", tags=["Faculty"])


class AttendanceMarkRequest(BaseModel):
    student_id: str
    subject: str
    date: str
    status: str  # present or absent


class BulkAttendanceRequest(BaseModel):
    subject: str
    date: str
    attendance_list: List[dict]  # [{"student_id": "...", "status": "..."}]


class LeaveApplicationRequest(BaseModel):
    start_date: str
    end_date: str
    reason: str


class TimetableRequest(BaseModel):
    subjects: List[str]
    constraints: Optional[List[str]] = None
    rooms: Optional[List[str]] = None


@router.get("/profile")
async def get_faculty_profile(current_user: UserResponse = Depends(require_faculty)):
    """Get faculty profile"""
    faculty_collection = get_faculty_collection()
    
    faculty = await faculty_collection.find_one({"user_id": current_user.id})
    
    if not faculty:
        # Create default profile
        faculty_data = {
            "user_id": current_user.id,
            "faculty_id": current_user.id,
            "full_name": current_user.full_name,
            "email": current_user.email,
            "department": "Computer Science",
            "designation": "Assistant Professor",
            "subjects": ["Data Structures", "Algorithms"],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        result = await faculty_collection.insert_one(faculty_data)
        faculty = await faculty_collection.find_one({"_id": result.inserted_id})
    
    faculty["_id"] = str(faculty["_id"])
    return faculty


@router.get("/dashboard")
async def get_faculty_dashboard(current_user: UserResponse = Depends(require_faculty)):
    """Get faculty dashboard data"""
    attendance_collection = get_attendance_collection()
    
    # Get today's date
    today = datetime.utcnow().strftime("%Y-%m-%d")
    
    # Count today's attendance marked
    today_attendance = await attendance_collection.count_documents({
        "marked_by": current_user.id,
        "date": today
    })
    
    # Get total students (placeholder)
    total_students = 120
    
    # Get pending evaluations (placeholder)
    pending_evaluations = 15
    
    return {
        "total_students": total_students,
        "classes_today": 5,
        "attendance_marked_today": today_attendance,
        "pending_evaluations": pending_evaluations,
        "attendance_rate": 0,
        "recent_classes": [],
        "at_risk_students": []
    }


@router.post("/attendance/mark")
async def mark_attendance(
    request: AttendanceMarkRequest,
    current_user: UserResponse = Depends(require_faculty)
):
    """Mark attendance for a student"""
    attendance_collection = get_attendance_collection()
    
    # Check if attendance already marked
    existing = await attendance_collection.find_one({
        "student_id": request.student_id,
        "subject": request.subject,
        "date": request.date
    })
    
    if existing:
        # Update existing record
        await attendance_collection.update_one(
            {"_id": existing["_id"]},
            {
                "$set": {
                    "status": request.status,
                    "marked_by": current_user.id,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return {"message": "Attendance updated successfully"}
    else:
        # Create new record
        attendance_data = {
            "student_id": request.student_id,
            "course_id": "default",
            "subject": request.subject,
            "date": request.date,
            "status": request.status,
            "marked_by": current_user.id,
            "created_at": datetime.utcnow()
        }
        await attendance_collection.insert_one(attendance_data)
        return {"message": "Attendance marked successfully"}


@router.post("/attendance/bulk")
async def mark_bulk_attendance(
    request: BulkAttendanceRequest,
    current_user: UserResponse = Depends(require_faculty)
):
    """Mark attendance for multiple students"""
    attendance_collection = get_attendance_collection()
    
    marked_count = 0
    
    for item in request.attendance_list:
        student_id = item.get("student_id")
        status = item.get("status", "present")
        
        # Check if already marked
        existing = await attendance_collection.find_one({
            "student_id": student_id,
            "subject": request.subject,
            "date": request.date
        })
        
        if existing:
            await attendance_collection.update_one(
                {"_id": existing["_id"]},
                {
                    "$set": {
                        "status": status,
                        "marked_by": current_user.id,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
        else:
            attendance_data = {
                "student_id": student_id,
                "course_id": "default",
                "subject": request.subject,
                "date": request.date,
                "status": status,
                "marked_by": current_user.id,
                "created_at": datetime.utcnow()
            }
            await attendance_collection.insert_one(attendance_data)
        
        marked_count += 1
    
    return {
        "message": f"Bulk attendance marked for {marked_count} students",
        "count": marked_count
    }


@router.get("/students")
async def get_students_list(current_user: UserResponse = Depends(require_faculty)):
    """Get list of students"""
    students_collection = get_students_collection()
    
    students = await students_collection.find().limit(100).to_list(length=100)
    
    for student in students:
        student["_id"] = str(student["_id"])
    
    return {"students": students}


@router.post("/leave/apply")
async def apply_leave(
    request: LeaveApplicationRequest,
    current_user: UserResponse = Depends(require_faculty)
):
    """Apply for leave"""
    leave_collection = get_leave_collection()
    
    leave_data = {
        "faculty_id": current_user.id,
        "start_date": request.start_date,
        "end_date": request.end_date,
        "reason": request.reason,
        "status": "pending",
        "applied_at": datetime.utcnow(),
        "reviewed_by": None,
        "reviewed_at": None
    }
    
    result = await leave_collection.insert_one(leave_data)
    
    return {
        "message": "Leave application submitted successfully",
        "leave_id": str(result.inserted_id),
        "status": "pending"
    }


@router.get("/leave/status")
async def get_leave_status(current_user: UserResponse = Depends(require_faculty)):
    """Get leave application status"""
    leave_collection = get_leave_collection()
    
    leave_requests = await leave_collection.find(
        {"faculty_id": current_user.id}
    ).sort("applied_at", -1).to_list(length=50)
    
    for leave in leave_requests:
        leave["_id"] = str(leave["_id"])
    
    return {"leave_requests": leave_requests}


@router.get("/schedule")
async def get_schedule(current_user: UserResponse = Depends(require_faculty)):
    """Get faculty schedule"""
    # Placeholder schedule
    schedule = [
        {
            "day": "Monday",
            "time_slot": "9:00 - 10:00",
            "subject": "Data Structures",
            "room": "Room 101"
        },
        {
            "day": "Monday",
            "time_slot": "11:00 - 12:00",
            "subject": "Algorithms",
            "room": "Room 102"
        },
        {
            "day": "Tuesday",
            "time_slot": "10:00 - 11:00",
            "subject": "Data Structures",
            "room": "Room 101"
        },
        {
            "day": "Wednesday",
            "time_slot": "9:00 - 10:00",
            "subject": "Algorithms",
            "room": "Room 102"
        },
        {
            "day": "Thursday",
            "time_slot": "11:00 - 12:00",
            "subject": "Data Structures",
            "room": "Room 101"
        },
        {
            "day": "Friday",
            "time_slot": "10:00 - 11:00",
            "subject": "Algorithms",
            "room": "Room 102"
        }
    ]
    
    return {"schedule": schedule}


@router.post("/timetable/generate")
async def generate_faculty_timetable(
    request: TimetableRequest,
    current_user: UserResponse = Depends(require_faculty)
):
    """Generate a simple class timetable for faculty users."""
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    time_slots = [
        "9:00 - 10:00",
        "10:00 - 11:00",
        "11:00 - 12:00",
        "2:00 - 3:00",
        "3:00 - 4:00",
    ]
    rooms = request.rooms if request.rooms else [f"Room {100 + i}" for i in range(10)]

    timetable = {day: [] for day in days}

    for index, subject in enumerate(request.subjects):
        day = days[index % len(days)]
        slot = time_slots[index % len(time_slots)]
        room = rooms[index % len(rooms)]
        timetable[day].append({
            "subject": subject,
            "time": slot,
            "room": room,
            "faculty": current_user.full_name
        })

    return {
        "message": "Timetable generated successfully",
        "constraints": request.constraints or [],
        "timetable": timetable,
        "total_subjects": len(request.subjects),
        "total_classes": len(request.subjects)
    }

# Made with Bob
