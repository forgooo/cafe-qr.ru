from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from db.database import get_async_session, Order
from db.schemas import OrderCreate, OrderRead, OrderUpdate  
from db.models import dishes
from sqlalchemy.future import select
from depen import current_user
from db.database import User 

router = APIRouter()

@router.post("/create/", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_create: OrderCreate,
    current_user: User = Depends(current_user),  # Получаем текущего пользователя,
    session: AsyncSession = Depends(get_async_session),
):
    user_id = current_user.id

    # Проверка на наличие блюд
    for dish_id in order_create.dish_ids:
        query = select(dishes).where(dishes.c.dish_id == dish_id)
        result = await session.execute(query)
        dish = result.scalar_one_or_none()
        if not dish:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Dish with ID {dish_id} not found.")

    # Создание нового заказа
    new_order = Order(
        user_id=user_id,  # Указываем user_id
        dish_ids=order_create.dish_ids,
        total_amount=order_create.total_amount,
        comment=order_create.comment,
        is_ordered=order_create.is_ordered,
        is_delivered=order_create.is_delivered
    )

    session.add(new_order)
    await session.commit()
    await session.refresh(new_order)

    return new_order



@router.put("/update/{order_id}", response_model=OrderRead)
async def update_order_status(
    order_id: int,
    order_update: OrderUpdate,
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

    # Обновляем только те поля, которые были переданы
    if order_update.is_ordered is not None:
        order.is_ordered = order_update.is_ordered
    if order_update.is_delivered is not None:
        order.is_delivered = order_update.is_delivered

    await session.commit()
    await session.refresh(order)

    return order


@router.get("/pending-orders/", response_model=list[OrderRead])
async def get_pending_orders(
    session: AsyncSession = Depends(get_async_session),
):
    query = select(Order).where(
        Order.is_ordered == False,
        Order.is_delivered == False
    )
    result = await session.execute(query)
    pending_orders = result.scalars().all()
    
    return pending_orders
