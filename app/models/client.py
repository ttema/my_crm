from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Float
from sqlalchemy.orm import relationship
from app.db.database import Base


class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)

    # Основная информация
    full_name = Column(String, nullable=False)
    short_name = Column(String, nullable=False)
    legal_form = Column(String, nullable=False)
    inn = Column(String, unique=True, nullable=False)
    ogrn = Column(String, unique=True, nullable=False)
    registration_date = Column(String, nullable=False)

    # Контактные данные
    legal_address = Column(String, nullable=False)
    actual_address = Column(String, nullable=True)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=False)
    website = Column(String, nullable=True)

    # Сведения об управлении
    director_name = Column(String, nullable=False)
    representation_basis = Column(String, nullable=False)

    # Финансовая информация
    authorized_capital = Column(Float, nullable=False)
    main_activity = Column(String, nullable=False)
    expected_turnover = Column(Float, nullable=True)
    employee_count = Column(Integer, nullable=True)

    # Бенефициары и учредители
    owner_name = Column(String, nullable=False)
    owner_share = Column(Float, nullable=False)
    owner_birth_date = Column(String, nullable=True)
    owner_company_name = Column(String, nullable=True)
    owner_inn = Column(String, nullable=True)

    # Статусы проверки
    status = Column(String, default="pending")
    is_verified = Column(Boolean, default=False)
