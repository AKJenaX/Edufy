from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId


class StudentProfile(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    user_id: str
    student_id: str
    full_name: str
    email: str
    department: Optional[str] = None
    semester: Optional[int] = None
    enrolled_courses: List[str] = []
    attendance_percentage: float = 0.0
    average_score: float = 0.0
    risk_level: str = "Low"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class AttendanceRecord(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    student_id: str
    course_id: str
    subject: str
    date: str
    status: str  # "present" or "absent"
    marked_by: str  # faculty_id
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class PerformanceMetrics(BaseModel):
    student_id: str
    total_classes: int = 0
    attended_classes: int = 0
    attendance_percentage: float = 0.0
    average_score: float = 0.0
    risk_level: str = "Low"
    recommendations: List[str] = []

# Made with Bob
