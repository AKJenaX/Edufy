from pydantic import BaseModel, EmailStr
from typing import Optional, Literal


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: Literal["student", "faculty", "admin"]
    student_id: Optional[str] = None
    faculty_id: Optional[str] = None


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    is_active: bool
    
    class Config:
        from_attributes = True

# Made with Bob
