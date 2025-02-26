from pydantic import BaseModel
from typing import Optional

class ClientBase(BaseModel):
    full_name: str
    short_name: str
    legal_form: str
    inn: str
    ogrn: str
    registration_date: str
    legal_address: str
    actual_address: Optional[str] = None
    phone: str
    email: str
    website: Optional[str] = None
    director_name: str
    representation_basis: str
    authorized_capital: float
    main_activity: str
    expected_turnover: Optional[float] = None
    employee_count: Optional[int] = None
    owner_name: str
    owner_share: float
    owner_birth_date: Optional[str] = None
    owner_company_name: Optional[str] = None
    owner_inn: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class ClientResponse(ClientBase):
    id: int
    status: str
    is_verified: bool

    class Config:
        orm_mode = True

class ClientUpdate(BaseModel):
    status: Optional[str] = None
    is_verified: Optional[bool] = None