from datetime import datetime
import uuid
from enum import Enum
from typing import List, Optional, Union
from pydantic import BaseModel, Field, ValidationError
from auth.manager import get_user_manager
from db.database import User
from fastapi import FastAPI, Request, status, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
from auth.auth import auth_backend
from db.database import User
from db.schemas import UserRead, UserCreate
from menu.dish import router as menu_router
from user.user import router as user_router
from order.order import router as order_router
from depen import current_user
from fastapi_users import fastapi_users, FastAPIUsers


fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)

app = FastAPI(
    title="Меню"
)
app.mount("/static", StaticFiles(directory="static"), name="static")
@app.get("/oplata-druzhbi")
async def oplata_druzhbi():
    return FileResponse("static/o.html")


@app.middleware("http")
async def create_session(request: Request, call_next):
    if "session_id" not in request.cookies:
        session_id = str(uuid.uuid4())
        response = await call_next(request)
        response.set_cookie(key="session_id", value=session_id)
        return response
    return await call_next(request)

app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth/jwt",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)

app.include_router(
    menu_router,
    prefix="/menu",
    tags=["menu"]
)

app.include_router(
    user_router,
    prefix="/user",
    tags=["user"]
)

app.include_router(
    order_router,
    prefix="/order",
    tags=["order"]
)

@app.get("/protected-route")
def protected_route(user: User = Depends(current_user)):
    return f"Hello, {user.username}"


@app.get("/unprotected-route")
def unprotected_route():
    return f"Hello, anonym"
