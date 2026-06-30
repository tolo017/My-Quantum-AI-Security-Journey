from fastapi import APIRouter, Form
from typing import Optional

router = APIRouter(prefix="/ussd", tags=["USSD"])

@router.post("/")
async def handle_ussd(
    sessionId: str = Form(...),
    serviceCode: str = Form(...),
    phoneNumber: str = Form(...),
    text: str = Form(default="")
):
    """
    Standard Africa's Talking USSD callback interface.
    """
    input_parts = text.split("*")
    current_input = input_parts[-1]

    # Simple Menu Logic
    if text == "":
        response = "CON Welcome to Beba Beba\n"
        response += "1. Book Morning Commute\n"
        response += "2. Check Subscription\n"
        response += "3. Conductor Menu"

    elif text == "1":
        response = "CON Enter Virtual Stage Code:"

    elif text.startswith("1*"):
        stage_code = current_input
        response = f"END Booking confirmed for Stage {stage_code}. You will receive an SMS 10 mins before arrival."

    elif text == "2":
        response = "END You have 12 rides remaining on your Monthly Commuter Pass."

    elif text == "3":
        response = "CON Conductor Login\nEnter Vehicle Plate:"

    else:
        response = "END Invalid option. Please try again."

    return response
