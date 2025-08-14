from datetime import datetime
from sqlalchemy import MetaData, Table, Column, Integer, String, TIMESTAMP, ForeignKey, JSON, Boolean, Float
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base
Base: DeclarativeMeta = declarative_base()

metadata = MetaData()

role = Table(
    "role",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String, nullable=False),
    Column("permissions", JSON),
)

user = Table(
    "user",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("email", String, nullable=False),
    Column("username", String, nullable=False),
    Column("registered_at", TIMESTAMP, default=datetime.utcnow),
    Column("role_id", Integer, ForeignKey('role.id')),
    Column("hashed_password", String, nullable=False),
    Column("is_active", Boolean, default=True, nullable=False),
    Column("is_superuser", Boolean, default=False, nullable=False),
    Column("is_verified", Boolean, default=False, nullable=False),
)

categories = Table(
    "categories",
    metadata,
    Column("category_id", Integer, primary_key=True),
    Column("name", String(255), nullable=False),
    Column("description", String, nullable=True),
    Column("url", String(255), nullable=False),
)

dishes = Table(
    "dishes",
    metadata,
    Column("dish_id", Integer, primary_key=True),
    Column("name", String(255), nullable=False),
    Column("description", String, nullable=True),
    Column("price", Float, nullable=False),  # Используйте Float для цен
    Column("category_id", Integer, ForeignKey(categories.c.category_id)),
    Column("is_available", Boolean, default=True),
    Column("image_url", String(255), nullable=True),
    Column("calories", Integer, nullable=True),
    Column("protein", Float, nullable=True),
    Column("fat", Float, nullable=True),
    Column("carbohydrates", Float, nullable=True),
    Column("ingredients", String, nullable=True),  # Можно использовать String для текста
)


orders = Table(
    "orders",
    metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("user_id", Integer, ForeignKey('user.id', ondelete='CASCADE'), nullable=True),
    Column("temp_token", String, nullable=True),
    Column("dish_ids", JSON, nullable=False),
    Column("order_time", TIMESTAMP, default=datetime.utcnow),
    Column("total_amount", Float, nullable=False),
    Column("comment", String, nullable=True),
    Column("phone_number", String, nullable=True),          # ← новое поле
    Column("is_ordered", Boolean, default=False, nullable=False),
    Column("is_delivered", Boolean, default=False, nullable=False),
    Column("is_finished", Boolean, default=False, nullable=False),
)