from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Request
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from db.database import get_async_session, Order
from db.schemas import OrderCreate, OrderRead, OrderUpdate  
from db.models import dishes
from sqlalchemy.future import select
from depen import current_user
from db.database import User
import logging 
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


router = APIRouter()

@router.post("/create/", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
async def create_order(
    request: Request,
    order_create: OrderCreate,
    session: AsyncSession = Depends(get_async_session),
):
    new_order = Order(
        user_id=-1,  # user_id может быть None для анонимных пользователей
        temp_token=request.cookies.get("session_id"),  # Сохраняем токен только для анонимных пользователей
        dish_ids=order_create.dish_ids,
        total_amount=order_create.total_amount,
        comment=order_create.comment,
        is_ordered=order_create.is_ordered,
        is_delivered=order_create.is_delivered,
        is_finished=order_create.is_finished
    )

    session.add(new_order)
    await session.commit()
    await session.refresh(new_order)

    return new_order

async def mark_order_as_finished(order_id: int, session: AsyncSession):
    await asyncio.sleep(120)  # Ждем 2 минуты

    # Получаем заказ из базы данных
    query = select(Order).where(Order.id == order_id)
    result = await session.execute(query)
    order = result.scalar_one_or_none()

    # Если заказ выдан (is_delivered = True) и ещё не завершён (is_finished = False)
    if order and order.is_delivered and not order.is_finished:
        order.is_finished = True  # Меняем статус на "завершённый"
        await session.commit()


@router.put("/update/{order_id}", response_model=OrderRead)
async def update_order_status(
    order_id: int,
    order_update: OrderUpdate,
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_user),  # Получаем текущего пользователя
):
    # Проверяем, является ли пользователь суперпользователем
    if not user.is_superuser:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to perform this action.")

    query = select(Order).where(Order.id == order_id)
    result = await session.execute(query)
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found.")

    # Сохраняем предыдущее значение is_delivered
    previous_is_delivered = order.is_delivered

    # Обновляем только те поля, которые были переданы
    if order_update.is_ordered is not None:  # Обновляем is_ordered, только если оно передано
        order.is_ordered = order_update.is_ordered
    if order_update.is_delivered is not None:  # Обновляем is_delivered, только если оно передано
        order.is_delivered = order_update.is_delivered
    if order_update.is_finished is not None:  # Обновляем is_finished, только если оно передано
        order.is_finished = order_update.is_finished

    # Если статус is_delivered изменился с False на True, запускаем фоновую задачу
    if order_update.is_delivered is not None and order_update.is_delivered and not previous_is_delivered:
        background_tasks.add_task(mark_order_as_finished, order_id, session)

    await session.commit()
    await session.refresh(order)

    return order

@router.get("/pending-orders/", response_model=list[OrderRead])
async def get_pending_orders(
    session: AsyncSession = Depends(get_async_session),
):
    query = select(Order).where(Order.is_finished == False)
    result = await session.execute(query)
    pending_orders = result.scalars().all()
    return pending_orders
