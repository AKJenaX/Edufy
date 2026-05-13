from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from app.dependencies import get_current_user
from app.schemas.auth import UserResponse
from app.services.ollama_service import ollama_service
from database.connection import get_documents_collection, get_ai_interactions_collection
from bson import ObjectId
from datetime import datetime
import json
import re

router = APIRouter(prefix="/ai", tags=["AI Assistant"])


class SummarizeRequest(BaseModel):
    document_id: str


class ExplainRequest(BaseModel):
    concept: str
    context: Optional[str] = None


class QuizRequest(BaseModel):
    document_id: str
    num_questions: int = 5


class ChatRequest(BaseModel):
    message: str
    document_id: Optional[str] = None


@router.post("/summarize")
async def summarize_document(
    request: SummarizeRequest,
    current_user: UserResponse = Depends(get_current_user)
):
    """Summarize a document using AI"""
    documents_collection = get_documents_collection()
    
    # Get document
    document = await documents_collection.find_one({
        "_id": ObjectId(request.document_id),
        "user_id": current_user.id
    })
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Generate summary
    try:
        summary = ollama_service.summarize(document["content"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")
    
    # Save interaction
    ai_interactions_collection = get_ai_interactions_collection()
    interaction_data = {
        "user_id": current_user.id,
        "interaction_type": "summarize",
        "input_text": document["content"][:500],  # Store first 500 chars
        "output_text": summary,
        "document_id": request.document_id,
        "created_at": datetime.utcnow()
    }
    await ai_interactions_collection.insert_one(interaction_data)
    
    return {
        "summary": summary,
        "document_id": request.document_id,
        "document_name": document["filename"]
    }


@router.post("/explain")
async def explain_concept(
    request: ExplainRequest,
    current_user: UserResponse = Depends(get_current_user)
):
    """Explain a concept using AI"""
    try:
        explanation = ollama_service.explain(request.concept, request.context)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")
    
    # Save interaction
    ai_interactions_collection = get_ai_interactions_collection()
    interaction_data = {
        "user_id": current_user.id,
        "interaction_type": "explain",
        "input_text": request.concept,
        "output_text": explanation,
        "created_at": datetime.utcnow()
    }
    await ai_interactions_collection.insert_one(interaction_data)
    
    return {
        "concept": request.concept,
        "explanation": explanation
    }


@router.post("/quiz")
async def generate_quiz(
    request: QuizRequest,
    current_user: UserResponse = Depends(get_current_user)
):
    """Generate quiz questions from a document"""
    documents_collection = get_documents_collection()
    
    # Get document
    document = await documents_collection.find_one({
        "_id": ObjectId(request.document_id),
        "user_id": current_user.id
    })
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Generate quiz
    try:
        quiz_text = ollama_service.generate_quiz(document["content"], request.num_questions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")
    
    # Parse quiz text into structured format
    questions = parse_quiz_text(quiz_text)
    
    # Save interaction
    ai_interactions_collection = get_ai_interactions_collection()
    interaction_data = {
        "user_id": current_user.id,
        "interaction_type": "quiz",
        "input_text": document["content"][:500],
        "output_text": quiz_text,
        "document_id": request.document_id,
        "created_at": datetime.utcnow()
    }
    await ai_interactions_collection.insert_one(interaction_data)
    
    return {
        "document_id": request.document_id,
        "document_name": document["filename"],
        "questions": questions,
        "raw_quiz": quiz_text
    }


@router.post("/chat")
async def chat_with_ai(
    request: ChatRequest,
    current_user: UserResponse = Depends(get_current_user)
):
    """Chat with AI assistant"""
    context = None
    
    # If document_id provided, use document as context
    if request.document_id:
        documents_collection = get_documents_collection()
        document = await documents_collection.find_one({
            "_id": ObjectId(request.document_id),
            "user_id": current_user.id
        })
        
        if document:
            # Use first 2000 characters as context
            context = document["content"][:2000]
    
    # Generate response
    try:
        response = ollama_service.chat(request.message, context)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")
    
    # Save interaction
    ai_interactions_collection = get_ai_interactions_collection()
    interaction_data = {
        "user_id": current_user.id,
        "interaction_type": "chat",
        "input_text": request.message,
        "output_text": response,
        "document_id": request.document_id,
        "created_at": datetime.utcnow()
    }
    await ai_interactions_collection.insert_one(interaction_data)
    
    return {
        "message": request.message,
        "response": response,
        "has_context": context is not None
    }


@router.get("/history")
async def get_ai_history(
    current_user: UserResponse = Depends(get_current_user),
    limit: int = 20
):
    """Get AI interaction history"""
    ai_interactions_collection = get_ai_interactions_collection()
    
    interactions = await ai_interactions_collection.find(
        {"user_id": current_user.id}
    ).sort("created_at", -1).limit(limit).to_list(length=limit)
    
    for interaction in interactions:
        interaction["_id"] = str(interaction["_id"])
    
    return {"interactions": interactions}


def parse_quiz_text(quiz_text: str) -> List[dict]:
    """Parse quiz text into structured format"""
    questions = []
    
    # Split by question markers
    question_blocks = re.split(r'\n\s*Q:', quiz_text)
    
    for block in question_blocks:
        if not block.strip():
            continue
        
        lines = block.strip().split('\n')
        if len(lines) < 6:  # Need at least question + 4 options + correct answer
            continue
        
        question_text = lines[0].strip()
        options = {}
        correct_answer = None
        
        for line in lines[1:]:
            line = line.strip()
            if line.startswith(('A)', 'B)', 'C)', 'D)')):
                key = line[0]
                value = line[2:].strip()
                options[key] = value
            elif line.startswith('Correct:'):
                correct_answer = line.split(':')[1].strip()
        
        if question_text and len(options) >= 4 and correct_answer:
            questions.append({
                "question": question_text,
                "options": options,
                "correct_answer": correct_answer
            })
    
    return questions

# Made with Bob
