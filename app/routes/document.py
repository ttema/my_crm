from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.document import Document
from app.models.client import Client
import shutil
import os

router = APIRouter()

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/clients/{client_id}/upload")
def upload_document(client_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Клиент не найден")

    file_path = f"{UPLOAD_FOLDER}/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    document = Document(client_id=client_id, filename=file.filename, file_path=file_path)
    db.add(document)
    db.commit()
    db.refresh(document)

    return {"message": "Файл загружен", "filename": file.filename}


@router.get("/clients/{client_id}/documents")
def get_client_documents(client_id: int, db: Session = Depends(get_db)):
    documents = db.query(Document).filter(Document.client_id == client_id).all()
    if not documents:
        return []
    return [{"id": doc.id, "filename": doc.filename, "file_path": doc.file_path} for doc in documents]

@router.put("/{document_id}/approve")
def approve_document(document_id: int, db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Документ не найден")

    document.first_approve = True
    db.commit()
    return {"message": "Документ заверен", "document_id": document_id}

@router.put("/{document_id}/reject")
def reject_document(document_id: int, db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Документ не найден")

    document.first_approve = False
    db.commit()
    return {"message": "Документ отклонён", "document_id": document_id}