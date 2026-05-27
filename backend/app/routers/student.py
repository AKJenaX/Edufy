from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel, Field
from typing import Optional
from app.dependencies import get_current_user, require_student
from app.schemas.auth import UserResponse
from app.models.student import PerformanceMetrics
from app.services.document_processor import document_processor
from database.connection import (
    get_students_collection,
    get_attendance_collection,
    get_documents_collection,
    get_sticky_notes_collection
)
from datetime import datetime
from bson import ObjectId
import os
import shutil

router = APIRouter(prefix="/student", tags=["Student"])


class StickyNoteCreate(BaseModel):
    title: str = Field(default="Untitled note", max_length=80)
    content: str = Field(default="", max_length=4000)
    color: str = "yellow"
    page_number: Optional[int] = Field(default=None, ge=1)
    position_x: int = Field(default=0, ge=0)
    position_y: int = Field(default=0, ge=0)
    pinned: bool = False
    tags: list[str] = Field(default_factory=list)


class StickyNoteUpdate(BaseModel):
    title: Optional[str] = Field(default=None, max_length=80)
    content: Optional[str] = Field(default=None, max_length=4000)
    color: Optional[str] = None
    page_number: Optional[int] = Field(default=None, ge=1)
    position_x: Optional[int] = Field(default=None, ge=0)
    position_y: Optional[int] = Field(default=None, ge=0)
    pinned: Optional[bool] = None
    tags: Optional[list[str]] = None


NOTE_COLORS = {"yellow", "pink", "blue", "green", "purple", "orange"}


def serialize_document(document: dict, include_content: bool = False) -> dict:
    document["_id"] = str(document["_id"])
    if not include_content:
        document.pop("content", None)
    return document


def serialize_note(note: dict) -> dict:
    note["_id"] = str(note["_id"])
    return note


async def get_owned_document_or_404(document_id: str, user_id: str) -> dict:
    if not ObjectId.is_valid(document_id):
        raise HTTPException(status_code=400, detail="Invalid document id")

    documents_collection = get_documents_collection()
    document = await documents_collection.find_one({
        "_id": ObjectId(document_id),
        "user_id": user_id
    })

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    return document


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
        serialize_document(doc)
    
    return {"documents": documents}


@router.get("/document/{document_id}")
async def get_document(
    document_id: str,
    current_user: UserResponse = Depends(require_student)
):
    """Get specific document"""
    document = await get_owned_document_or_404(document_id, current_user.id)
    return serialize_document(document, include_content=True)


@router.get("/document/{document_id}/notes")
async def get_document_notes(
    document_id: str,
    current_user: UserResponse = Depends(require_student)
):
    """Get sticky notes for a student-owned document."""
    await get_owned_document_or_404(document_id, current_user.id)

    notes_collection = get_sticky_notes_collection()
    notes = await notes_collection.find({
        "document_id": document_id,
        "user_id": current_user.id
    }).sort([("pinned", -1), ("updated_at", -1)]).to_list(length=200)

    return {"notes": [serialize_note(note) for note in notes]}


@router.post("/document/{document_id}/notes", status_code=201)
async def create_document_note(
    document_id: str,
    note_data: StickyNoteCreate,
    current_user: UserResponse = Depends(require_student)
):
    """Create a sticky note attached to a student-owned document."""
    await get_owned_document_or_404(document_id, current_user.id)

    color = note_data.color if note_data.color in NOTE_COLORS else "yellow"
    now = datetime.utcnow()
    note = {
        "document_id": document_id,
        "user_id": current_user.id,
        "title": note_data.title.strip() or "Untitled note",
        "content": note_data.content.strip(),
        "color": color,
        "page_number": note_data.page_number,
        "position_x": note_data.position_x,
        "position_y": note_data.position_y,
        "pinned": note_data.pinned,
        "tags": [tag.strip() for tag in note_data.tags if tag.strip()][:8],
        "created_at": now,
        "updated_at": now
    }

    notes_collection = get_sticky_notes_collection()
    result = await notes_collection.insert_one(note)
    created = await notes_collection.find_one({"_id": result.inserted_id})

    return {"note": serialize_note(created)}


@router.patch("/notes/{note_id}")
async def update_document_note(
    note_id: str,
    note_data: StickyNoteUpdate,
    current_user: UserResponse = Depends(require_student)
):
    """Update a sticky note owned by the current student."""
    if not ObjectId.is_valid(note_id):
        raise HTTPException(status_code=400, detail="Invalid note id")

    notes_collection = get_sticky_notes_collection()
    existing = await notes_collection.find_one({
        "_id": ObjectId(note_id),
        "user_id": current_user.id
    })

    if not existing:
        raise HTTPException(status_code=404, detail="Sticky note not found")

    updates = {}
    for field, value in note_data.model_dump(exclude_unset=True).items():
        if field == "color" and value not in NOTE_COLORS:
            continue
        if field in {"title", "content"} and isinstance(value, str):
            value = value.strip()
        if field == "title" and not value:
            value = "Untitled note"
        if field == "tags" and value is not None:
            value = [tag.strip() for tag in value if tag.strip()][:8]
        updates[field] = value

    if updates:
        updates["updated_at"] = datetime.utcnow()
        await notes_collection.update_one(
            {"_id": ObjectId(note_id), "user_id": current_user.id},
            {"$set": updates}
        )

    updated = await notes_collection.find_one({"_id": ObjectId(note_id)})
    return {"note": serialize_note(updated)}


@router.delete("/notes/{note_id}")
async def delete_document_note(
    note_id: str,
    current_user: UserResponse = Depends(require_student)
):
    """Delete a sticky note owned by the current student."""
    if not ObjectId.is_valid(note_id):
        raise HTTPException(status_code=400, detail="Invalid note id")

    notes_collection = get_sticky_notes_collection()
    result = await notes_collection.delete_one({
        "_id": ObjectId(note_id),
        "user_id": current_user.id
    })

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Sticky note not found")

    return {"message": "Sticky note deleted"}

# Made with Bob
