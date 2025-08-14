from fastapi import APIRouter, Depends
from db.database import User
from depen import current_user


router = APIRouter()

@router.get("/get_user_data")
async def user_data(user: User = Depends(current_user)):
    user_data = {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "role_id": user.role_id,
        "is_active": user.is_active,
        "is_superuser": user.is_superuser,
        "is_verified": user.is_verified
    }
    return user_data