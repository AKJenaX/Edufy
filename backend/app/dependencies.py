from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Optional
from app.services.auth import decode_access_token
from app.schemas.auth import TokenData, UserResponse
from database.connection import get_users_collection

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserResponse:
    """Get current authenticated user"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    
    email: str = payload.get("sub")
    role: str = payload.get("role")
    
    if email is None:
        raise credentials_exception
    
    # Get user from database
    users_collection = get_users_collection()
    user = await users_collection.find_one({"email": email})
    
    if user is None:
        raise credentials_exception
    
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    
    return UserResponse(
        id=str(user["_id"]),
        email=user["email"],
        full_name=user["full_name"],
        role=user["role"],
        is_active=user.get("is_active", True)
    )


def require_role(required_role: str):
    """Dependency factory to require specific role"""
    async def role_checker(current_user: UserResponse = Depends(get_current_user)):
        role_hierarchy = {
            "admin": 3,
            "faculty": 2,
            "student": 1
        }
        
        user_level = role_hierarchy.get(current_user.role, 0)
        required_level = role_hierarchy.get(required_role, 0)
        
        if user_level < required_level:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Required role: {required_role}"
            )
        
        return current_user
    
    return role_checker


# Role-specific dependencies
require_student = require_role("student")
require_faculty = require_role("faculty")
require_admin = require_role("admin")

# Made with Bob
