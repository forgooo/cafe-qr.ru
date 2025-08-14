from fastapi_users import fastapi_users, FastAPIUsers
from auth.manager import get_user_manager
from auth.auth import auth_backend
from db.database import User


fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)


current_user = fastapi_users.current_user()