from datetime import datetime
from typing import AsyncGenerator
from sqlalchemy.types import JSON
from fastapi import Depends
from fastapi_users.db import SQLAlchemyBaseUserTable, SQLAlchemyUserDatabase
from sqlalchemy import Column, String, Boolean, Integer, TIMESTAMP, ForeignKey, Float, ARRAY, DateTime, Text
from sqlalchemy import func 
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.future import select 
from config import DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER
#from .models import categories, dishes, role

DATABASE_URL = f"postgresql+asyncpg://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
Base: DeclarativeMeta = declarative_base()

class Order(Base):
    __tablename__ = 'orders'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=True)
    temp_token = Column(String, nullable=True)
    dish_ids = Column(ARRAY(Integer), nullable=False)
    order_time = Column(DateTime(timezone=True), server_default=func.now())  # < исправлено
    total_amount = Column(Float, nullable=False)
    comment = Column(Text)
    phone_number = Column(String, nullable=True)  # ← ДОБАВЬ ЭТО ПОЛЕ
    is_ordered = Column(Boolean, nullable=False, default=False)
    is_delivered = Column(Boolean, nullable=False, default=False)
    is_finished = Column(Boolean, nullable=False, default=False)

class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    username = Column(String, nullable=False)
    registered_at = Column(TIMESTAMP, server_default=func.now())
    role_id = Column(Integer, ForeignKey('role.id'), nullable=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)

class Dish(Base):
    __tablename__ = 'dishes'
    dish_id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    category_id = Column(Integer, ForeignKey('categories.category_id'))
    is_available = Column(Boolean, default=True)
    image_url = Column(String(255), nullable=True)
    calories = Column(Integer, nullable=True)
    protein = Column(Float, nullable=True)
    fat = Column(Float, nullable=True)
    carbohydrates = Column(Float, nullable=True)
    ingredients = Column(String, nullable=True)


class Category(Base):
    __tablename__ = 'categories'
    category_id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(String, nullable=True)
    url = Column(String(255), nullable=False)


class Role(Base):
    __tablename__ = 'role'
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    permissions = Column(JSON)



engine = create_async_engine(DATABASE_URL)
async_session_maker = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session


async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(session, User)


async def get_category_by_id(session: AsyncSession, category_id: int):
    """Получить категорию по идентификатору."""
    return await session.get(Category, category_id)  


async def get_dishes_by_category_id(session: AsyncSession, category_id: int):
    """Получить все блюда по идентификатору категории."""
    result = await session.execute(select(Dish).where(Dish.category_id == category_id))
    return result.scalars().all() 


async def get_dish_by_id(session: AsyncSession, dish_id: int):
    return await session.get(Dish, dish_id)  

