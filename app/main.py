from fastapi import FastAPI, Form, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from app.db.database import engine, Base
from app.routes import auth, client, document

app = FastAPI()

# Создаём таблицы в БД
Base.metadata.create_all(bind=engine)

# Подключаем маршруты API
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(client.router, prefix="/clients", tags=["Clients"])
app.include_router(document.router, prefix="/documents", tags=["Documents"])

# Подключаем статику
app.mount("/", StaticFiles(directory="app/static", html=True), name="static")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Фиктивные учетные данные
FAKE_USERS = {
    "admin": "password123",
    "user": "1234"
}


@app.get("/")
def home():
    return RedirectResponse(url="/login.html")


@app.post("/login")
def login(username: str = Form(...), password: str = Form(...)):
    # Проверяем логин/пароль
    if username in FAKE_USERS and FAKE_USERS[username] == password:
        return RedirectResponse(url="/index.html", status_code=303)
    else:
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")
