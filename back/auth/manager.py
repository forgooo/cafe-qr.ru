from typing import Optional

from fastapi import Depends, Request
from fastapi_users import BaseUserManager, IntegerIDMixin, exceptions, models, schemas
from fastapi_users import FastAPIUsers
from fastapi_users.authentication import AuthenticationBackend  # ← если ещё не импортирован
import config
from db.database import User, get_user_db
from auth.auth import auth_backend  # ← важно: auth_backend — твоя стратегия авторизации

SECRET = config.SECRET


class UserManager(IntegerIDMixin, BaseUserManager[User, int]):
    reset_password_token_secret = SECRET
    verification_token_secret = SECRET

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        print(f"User {user.id} has registered.")

    async def create(
        self,
        user_create: schemas.UC,
        safe: bool = False,
        request: Optional[Request] = None,
    ) -> models.UP:
        await self.validate_password(user_create.password, user_create)

        existing_user = await self.user_db.get_by_email(user_create.email)
        if existing_user is not None:
            raise exceptions.UserAlreadyExists()

        user_dict = (
            user_create.create_update_dict()
            if safe
            else user_create.create_update_dict_superuser()
        )
        password = user_dict.pop("password")
        user_dict["hashed_password"] = self.password_helper.hash(password)
        user_dict["role_id"] = 1

        created_user = await self.user_db.create(user_dict)

        await self.on_after_register(created_user, request)

        return created_user


async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)


# 👇 добавляем FastAPIUsers-инстанс
fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)


# 👇 вот это — ключевая функция для получения опционального пользователя
async def get_user_optional(request: Request) -> Optional[User]:
    try:
        return await fastapi_users.current_user(optional=True)(request)
    except Exception:
        return None