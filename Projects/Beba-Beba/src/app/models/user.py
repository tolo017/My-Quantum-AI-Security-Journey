from sqlalchemy import Column, Integer, String, Boolean, Enum as SQLEnum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
import enum

Base = declarative_base()

class UserRole(enum.Enum):
    COMMUTER = "commuter"
    CONDUCTOR = "conductor"
    SACCO_ADMIN = "sacco_admin"
    HR_MANAGER = "hr_manager"
    SUPER_ADMIN = "super_admin"

class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String, unique=True, index=True)
    name = Column(String)
    national_id = Column(String, unique=True)
    role = Column(SQLEnum(UserRole))
    is_verified = Column(Boolean, default=False)
    hashed_password = Column(String)

# Database Setup (SQLite for local MVP development)
SQLALCHEMY_DATABASE_URL = "sqlite:///./beba_beba.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)
