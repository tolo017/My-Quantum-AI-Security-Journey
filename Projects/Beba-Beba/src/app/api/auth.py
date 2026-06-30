from fastapi import APIRouter, HTTPException, Depends
from ..schemas.user import UserCreate, User, BadgeScanRequest
from ..services.verification import VerificationService

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=User)
async def register_user(user: UserCreate):
    # Logic to save user to DB would go here
    return {**user.dict(), "id": 1, "is_verified": False}

@router.post("/verify-badge")
async def verify_badge(request: BadgeScanRequest):
    # Simulation of OCR and HR list matching
    is_valid = VerificationService.verify_work_badge(request.image_base64, request.national_id)
    if not is_valid:
        raise HTTPException(status_code=400, detail="Badge verification failed. ID not found in corporate records.")
    return {"status": "verified", "message": "Welcome to Beba Beba corporate pool!"}
