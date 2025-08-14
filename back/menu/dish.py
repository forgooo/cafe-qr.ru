from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from db.database import get_async_session, get_category_by_id, get_dishes_by_category_id, get_dish_by_id


router = APIRouter()

@router.get("/categories/{category_id}")
async def read_category(category_id: int, session: AsyncSession = Depends(get_async_session)):
    category = await get_category_by_id(session, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return {
        "category_id": category.category_id,
        "name": category.name,
        "description": category.description,
        "url": category.url
    }

@router.get("/categories/{category_id}/dishes")
async def read_dishes(category_id: int, session: AsyncSession = Depends(get_async_session)):
    dishes = await get_dishes_by_category_id(session, category_id)
    return [
        {
            "dish_id": dish.dish_id,
            "name": dish.name,
            "description": dish.description,
            "price": dish.price,
            "is_available": dish.is_available,
            "image_url": dish.image_url,
            "calories": dish.calories,
            "protein": dish.protein,
            "fat": dish.fat,
            "carbohydrates": dish.carbohydrates,
            "ingredients": dish.ingredients,
        }
        for dish in dishes
    ]

@router.get("/dishes/{dish_id}")
async def read_dish(dish_id: int, session: AsyncSession = Depends(get_async_session)):
    dish = await get_dish_by_id(session, dish_id)
    if not dish:
        raise HTTPException(status_code=404, detail="Dish not found")
    return {
        "dish_id": dish.dish_id,
        "name": dish.name,
        "description": dish.description,
        "price": dish.price,
        "is_available": dish.is_available,
        "image_url": dish.image_url,
        "calories": dish.calories,
        "protein": dish.protein,
        "fat": dish.fat,
        "carbohydrates": dish.carbohydrates,
        "ingredients": dish.ingredients,
    }
