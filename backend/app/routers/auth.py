from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from app.schemas.auth import RegisterRequest, Token, UserResponse
from app.models.user import UserInDB, UserCreate
from app.services.auth import (
    verify_password,
    get_password_hash,
    create_access_token
)
from app.dependencies import get_current_user
from database.connection import get_users_collection
from config import settings
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: RegisterRequest):
    """Register a new user"""
    users_collection = get_users_collection()
    
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user document
    user_dict = {
        "email": user_data.email,
        "full_name": user_data.full_name,
        "role": user_data.role,
        "hashed_password": get_password_hash(user_data.password),
        "is_active": True,
        "created_at": None,  # Will be set by UserInDB default
        "updated_at": None
    }
    
    if user_data.student_id:
        user_dict["student_id"] = user_data.student_id
    if user_data.faculty_id:
        user_dict["faculty_id"] = user_data.faculty_id
    
    # Insert user
    result = await users_collection.insert_one(user_dict)
    
    # Return user response
    return UserResponse(
        id=str(result.inserted_id),
        email=user_data.email,
        full_name=user_data.full_name,
        role=user_data.role,
        is_active=True
    )


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login and get access token"""
    users_collection = get_users_collection()
    
    # Find user by email (username field in OAuth2 form)
    user = await users_collection.find_one({"email": form_data.username})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user account"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"], "role": user["role"]},
        expires_delta=access_token_expires
    )
    
    return Token(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: UserResponse = Depends(get_current_user)):
    """Get current user information"""
    return current_user


@router.post("/logout")
async def logout(current_user: UserResponse = Depends(get_current_user)):
    """Logout user (client should delete token)"""
    return {"message": "Successfully logged out"}

# Made with Bob
