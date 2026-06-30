from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Beba Beba API", "status": "Lively and Fun"}

def test_ussd_menu():
    response = client.post("/ussd/", data={"sessionId": "123", "serviceCode": "*123#", "phoneNumber": "+254712345678", "text": ""})
    assert response.status_code == 200
    assert "Welcome to Beba Beba" in response.text

def test_ussd_booking():
    response = client.post("/ussd/", data={"sessionId": "123", "serviceCode": "*123#", "phoneNumber": "+254712345678", "text": "1*STAGE10"})
    assert response.status_code == 200
    assert "Booking confirmed for Stage STAGE10" in response.text

def test_verify_badge_success():
    response = client.post("/auth/verify-badge", json={"image_base64": "dummy", "national_id": "BEBA12345"})
    assert response.status_code == 200
    assert response.json()["status"] == "verified"

def test_verify_badge_fail():
    response = client.post("/auth/verify-badge", json={"image_base64": "dummy", "national_id": "NOTVALID"})
    assert response.status_code == 400
