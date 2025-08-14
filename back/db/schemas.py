from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from fastapi_users import schemas
from pydantic import BaseModel, validator
from typing import List, Optional
import json


class UserRead(schemas.BaseUser[int]):
    id: int
    email: str
    username: str
    role_id: int
    is_active: bool = True
    is_superuser: bool = False

    class Config:
        orm_mode = True


class UserCreate(schemas.BaseUserCreate):
    username: str
    email: str
    password: str
    role_id: int
    is_active: Optional[bool] = True
    is_superuser: Optional[bool] = False

class OrderCreate(BaseModel):
    user_id: Optional[int] = None          # для авторизованных
    temp_token: Optional[str] = None       # для анонимных
    dish_ids: List[int]
    total_amount: float
    comment: Optional[str] = None
    phone_number: Optional[str] = None     # ← новое поле
    is_ordered: bool = False
    is_delivered: bool = False
    is_finished: bool = False

class OrderRead(BaseModel):
    id: int
    user_id: Optional[int] = None
    dish_ids: List[int]
    total_amount: float
    comment: Optional[str] = None
    phone_number: Optional[str] = None     # ← новое поле
    is_ordered: bool
    is_delivered: bool
    is_finished: bool

    @validator('dish_ids', pre=True)
    def parse_dish_ids(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                raise ValueError("Невозможно распарсить dish_ids")
        return v


class OrderUpdate(BaseModel):
    is_ordered: Optional[bool] = None
    is_delivered: Optional[bool] = None
    is_finished: Optional[bool] = None

class VerifyRequest(BaseModel):
    phone_number: str
    verification_code: str
