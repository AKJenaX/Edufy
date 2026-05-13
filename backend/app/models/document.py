from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId


class Document(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    user_id: str
    filename: str
    file_type: str  # pdf, docx, txt
    file_path: str
    content: str  # Extracted text content
    processed: bool = False
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class AIInteraction(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    user_id: str
    interaction_type: str  # summarize, explain, quiz, chat
    input_text: str
    output_text: str
    document_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class Quiz(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    document_id: str
    user_id: str
    questions: List[dict]  # List of question objects
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Made with Bob
