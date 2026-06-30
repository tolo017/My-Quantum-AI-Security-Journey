from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum

class UserRole(str, Enum):
    COMMUTER = "commuter"
    CONDUCTOR = "conductor"
    SACCO_ADMIN = "sacco_admin"
    HR_MANAGER = "hr_manager"
    SUPER_ADMIN = "super_admin"

class UserBase(BaseModel):
    phone_number: str
    name: str
    role: UserRole

class UserCreate(UserBase):
    national_id: str
    password: str

class User(UserBase):
    id: int
    is_verified: bool = False

    class Config:
        from_attributes = True

class BadgeScanRequest(BaseModel):
    image_base64: str  # Simulated badge scan
    national_id: str

class HRListUpdate(BaseModel):
    company_id: int
    employee_ids: list[str]  # List of National IDs or Employee IDs
