from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Request, Response
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from db.database import get_async_session, Order
from db.schemas import OrderCreate, OrderRead, OrderUpdate  
from db.models import dishes
from db.database import User
import uuid
import logging
from typing import Optional
from auth.manager import get_user_optional  # ✅ правильный импорт

from depen import current_user  # оставить для других маршрутов

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/create/", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
async def create_order(
    request: Request,
    response: Response,
    order_create: OrderCreate,
    session: AsyncSession = Depends(get_async_session),
):
    temp_token = request.cookies.get("session_id")
    if not temp_token:
        temp_token = str(uuid.uuid4())
        response.set_cookie(key="session_id", value=temp_token, httponly=True)

    # проверка блюд (оставляем как было)
    for dish_id in order_create.dish_ids:
        result = await session.execute(select(dishes).where(dishes.c.dish_id == dish_id))
        if not result.scalar_one_or_none():
            raise HTTPException(status_code=404, detail=f"Dish {dish_id} not found")

    new_order = Order(
        user_id=None,
        temp_token=temp_token,
        dish_ids=order_create.dish_ids,
        total_amount=order_create.total_amount,
        comment=order_create.comment,
        phone_number=order_create.phone_number,   # ← сохраняем номер
        is_ordered=order_create.is_ordered,
        is_delivered=order_create.is_delivered,
        is_finished=order_create.is_finished,
    )

    session.add(new_order)
    await session.commit()
    await session.refresh(new_order)
    return new_order


async def mark_order_as_finished(order_id: int, session: AsyncSession):
    await asyncio.sleep(120)
    result = await session.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if order and order.is_delivered and not order.is_finished:
        order.is_finished = True
        await session.commit()

@router.put("/update/{order_id}", response_model=OrderRead)
async def update_order_status(
    order_id: int,
    order_update: OrderUpdate,
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_user),
):
    if not user.is_superuser:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    result = await session.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    previous_is_delivered = order.is_delivered

    if order_update.is_ordered is not None:
        order.is_ordered = order_update.is_ordered
    if order_update.is_delivered is not None:
        order.is_delivered = order_update.is_delivered
    if order_update.is_finished is not None:
        order.is_finished = order_update.is_finished

    if order_update.is_delivered and not previous_is_delivered:
        background_tasks.add_task(mark_order_as_finished, order_id, session)

    await session.commit()
    await session.refresh(order)

    return order

@router.get("/pending-orders/", response_model=list[OrderRead])
async def get_pending_orders(
    session: AsyncSession = Depends(get_async_session),
):
    result = await session.execute(select(Order).where(Order.is_finished == False))
    return result.scalars().all()

# ✅ Обновлённый маршрут для авторизованных и анонимных пользователей
@router.get("/my-orders/", response_model=list[OrderRead])
async def get_my_orders(
    request: Request,
    session: AsyncSession = Depends(get_async_session),
    user: Optional[User] = Depends(get_user_optional),  # 👈 вот правильная зависимость
):
    if user:
        query = select(Order).where(Order.user_id == user.id)
    else:
        temp_token = request.cookies.get("session_id")
        if not temp_token:
            raise HTTPException(status_code=400, detail="Session cookie not found")
        query = select(Order).where(Order.temp_token == temp_token)

    result = await session.execute(query)
    orders = result.scalars().all()
    return orders