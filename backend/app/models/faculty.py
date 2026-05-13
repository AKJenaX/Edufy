from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId


class FacultyProfile(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    user_id: str
    faculty_id: str
    full_name: str
    email: str
    department: Optional[str] = None
    designation: Optional[str] = None
    subjects: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class LeaveRequest(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    faculty_id: str
    start_date: str
    end_date: str
    reason: str
    status: str = "pending"  # pending, approved, rejected
    applied_at: datetime = Field(default_factory=datetime.utcnow)
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class Schedule(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    faculty_id: str
    day: str
    time_slot: str
    subject: str
    room: str
    course_id: str
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Made with Bob
