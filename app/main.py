from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.db.database import engine, Base
from app.routes import auth, client

app = FastAPI()

# Создаём таблицы в БД
Base.metadata.create_all(bind=engine)

# Подключаем маршруты API
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(client.router, prefix="/clients", tags=["Clients"])

# Подключаем статику
app.mount("/", StaticFiles(directory="app/static", html=True), name="static")

@app.get("/")
def read_root():
    return {"message": "CRM API is running!"}
