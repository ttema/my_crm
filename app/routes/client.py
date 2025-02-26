import random
from fastapi import APIRouter, Depends, HTTPException, status
from app.routes.auth import oauth2_scheme, get_current_user
from app.schemas.client import ClientCreate, ClientUpdate, ClientResponse
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.client import Client
from app.models.user import User
from app.core.auth import decode_access_token

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=ClientResponse)
def create_client(client_data: ClientCreate, db: Session = Depends(get_db)):
    existing_client = db.query(Client).filter(Client.inn == client_data.inn).first()
    if existing_client:
        raise HTTPException(status_code=400, detail="Клиент с таким ИНН уже существует")

    new_client = Client(**client_data.dict())
    db.add(new_client)
    db.commit()
    db.refresh(new_client)

    return new_client


@router.get("/", response_model=list[ClientResponse])
def get_clients(db: Session = Depends(get_db)):
    clients = db.query(Client).all()

    if not clients:  # Если список пуст
        return [{"full_name": "Список пуст"}]

    return clients


@router.get("/{client_id}", response_model=ClientResponse)
def get_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Клиент не найден")
    return client


@router.put("/{client_id}", response_model=ClientResponse)
def update_client(client_id: int, update_data: ClientUpdate, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Клиент не найден")

    for key, value in update_data.dict(exclude_unset=True).items():
        setattr(client, key, value)

    db.commit()
    db.refresh(client)
    return client


@router.delete("/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Клиент не найден")

    db.delete(client)
    db.commit()
    return {"detail": "Клиент удалён"}


@router.get("/{client_id}/verify")
def verify_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Клиент не найден")

    # Симуляция запроса к API проверки контрагентов
    fake_verification_result = {
        "client_id": client_id,
        "risk_score": random.randint(1, 100),
        "blacklist_status": random.choice(["Не в черном списке", "В черном списке"]),
        "financial_risk": random.choice(["Низкий", "Средний", "Высокий"]),
        "tax_debt": random.choice(["Нет задолженности", "Есть задолженность"]),
        "sanctions": random.choice(["Не под санкциями", "Под санкциями"]),
    }

    return fake_verification_result


@router.put("/{client_id}/approve")
def approve_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Клиент не найден")

    # Меняем статус на "предодобрен"
    client.status = "Предодобрен"
    db.commit()
    db.refresh(client)

    return {"message": "Статус клиента изменён на 'Предодобрен'", "client_id": client_id, "new_status": client.status}


@router.put("/{client_id}/reset_status")
def reset_client_status(client_id: int, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Клиент не найден")

    # Меняем статус обратно на "pending"
    client.status = "pending"
    db.commit()
    db.refresh(client)

    return {"message": "Статус клиента изменён на 'pending'", "client_id": client_id, "new_status": client.status}