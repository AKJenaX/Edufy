from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import List, Optional
from app.dependencies import get_current_user, require_student
from app.schemas.auth import UserResponse
from app.models.student import AttendanceRecord, PerformanceMetrics
from app.models.document import Document, AIInteraction
from app.services.ollama_service import ollama_service
from app.services.document_processor import document_processor
from database.connection import (
    get_students_collection,
    get_attendance_collection,
    get_documents_collection,
    get_ai_interactions_collection
)
from datetime import datetime
from bson import ObjectId
import os
import shutil

router = APIRouter(prefix="/student", tags=["Student"])


@router.get("/profile")
async def get_student_profile(current_user: UserResponse = Depends(require_student)):
    """Get student profile"""
    students_collection = get_students_collection()
    
    student = await students_collection.find_one({"user_id": current_user.id})
    
    if not student:
        # Create default profile if not exists
        student_data = {
            "user_id": current_user.id,
            "student_id": current_user.id,
            "full_name": current_user.full_name,
            "email": current_user.email,
            "department": "Computer Science",
            "semester": 1,
            "enrolled_courses": [],
            "attendance_percentage": 0.0,
            "average_score": 0.0,
            "risk_level": "Low",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        result = await students_collection.insert_one(student_data)
        student = await students_collection.find_one({"_id": result.inserted_id})
    
    student["_id"] = str(student["_id"])
    return student


@router.get("/attendance")
async def get_student_attendance(current_user: UserResponse = Depends(require_student)):
    """Get student attendance records"""
    attendance_collection = get_attendance_collection()
    
    records = await attendance_collection.find(
        {"student_id": current_user.id}
    ).sort("date", -1).to_list(length=100)
    
    for record in records:
        record["_id"] = str(record["_id"])
    
    return {"attendance_records": records}


@router.get("/performance")
async def get_student_performance(current_user: UserResponse = Depends(require_student)):
    """Get student performance metrics"""
    attendance_collection = get_attendance_collection()
    
    # Calculate attendance
    total_records = await attendance_collection.count_documents({"student_id": current_user.id})
    present_records = await attendance_collection.count_documents({
        "student_id": current_user.id,
        "status": "present"
    })
    
    attendance_percentage = (present_records / total_records * 100) if total_records > 0 else 0.0
    
    # Determine risk level
    if attendance_percentage >= 75:
        risk_level = "Low"
        recommendations = [
            "Maintain current attendance",
            "Keep up the good work",
            "Continue active participation"
        ]
    elif attendance_percentage >= 60:
        risk_level = "Medium"
        recommendations = [
            "Improve attendance to avoid issues",
            "Attend more classes regularly",
            "Consult with faculty if facing difficulties"
        ]
    else:
        risk_level = "High"
        recommendations = [
            "Urgent: Improve attendance immediately",
            "Meet with academic advisor",
            "Risk of failing due to low attendance"
        ]
    
    metrics = PerformanceMetrics(
        student_id=current_user.id,
        total_classes=total_records,
        attended_classes=present_records,
        attendance_percentage=round(attendance_percentage, 2),
        average_score=75.0,  # Placeholder
        risk_level=risk_level,
        recommendations=recommendations
    )
    
    return metrics.dict()


@router.get("/insight")
async def get_student_insight(current_user: UserResponse = Depends(require_student)):
    """Get student insight data for legacy dashboard components."""
    performance = await get_student_performance(current_user)
    return {
        "summary": "Academic insight generated from attendance and performance data.",
        "performance": performance,
        "attendance_percentage": performance["attendance_percentage"],
        "risk_level": performance["risk_level"],
        "recommendations": performance["recommendations"]
    }


@router.post("/document/upload")
async def upload_document(
    file: UploadFile = File(...),
    current_user: UserResponse = Depends(require_student)
):
    """Upload a document for AI processing"""
    
    # Validate file type
    allowed_extensions = ['pdf', 'docx', 'txt']
    file_extension = file.filename.split('.')[-1].lower()
    
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"File type not supported. Allowed: {', '.join(allowed_extensions)}"
        )
    
    # Create uploads directory if not exists
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Save file
    file_path = os.path.join(upload_dir, f"{current_user.id}_{datetime.utcnow().timestamp()}_{file.filename}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Extract text
    try:
        content = document_processor.process_document(file_path, file_extension)
    except Exception as e:
        os.remove(file_path)
        raise HTTPException(status_code=500, detail=str(e))
    
    # Save to database
    documents_collection = get_documents_collection()
    
    document_data = {
        "user_id": current_user.id,
        "filename": file.filename,
        "file_type": file_extension,
        "file_path": file_path,
        "content": content,
        "processed": True,
        "uploaded_at": datetime.utcnow()
    }
    
    result = await documents_collection.insert_one(document_data)
    
    return {
        "message": "Document uploaded successfully",
        "document_id": str(result.inserted_id),
        "filename": file.filename,
        "content_length": len(content)
    }


@router.get("/documents")
async def get_user_documents(current_user: UserResponse = Depends(require_student)):
    """Get all uploaded documents"""
    documents_collection = get_documents_collection()
    
    documents = await documents_collection.find(
        {"user_id": current_user.id}
    ).sort("uploaded_at", -1).to_list(length=50)
    
    for doc in documents:
        doc["_id"] = str(doc["_id"])
        # Don't return full content in list
        doc.pop("content", None)
    
    return {"documents": documents}


@router.get("/document/{document_id}")
async def get_document(
    document_id: str,
    current_user: UserResponse = Depends(require_student)
):
    """Get specific document"""
    documents_collection = get_documents_collection()
    
    document = await documents_collection.find_one({
        "_id": ObjectId(document_id),
        "user_id": current_user.id
    })
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    document["_id"] = str(document["_id"])
    return document

# Made with Bob
