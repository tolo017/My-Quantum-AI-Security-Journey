import random
import string

class MpesaService:
    @staticmethod
    def trigger_stk_push(phone_number: str, amount: float):
        """
        Simulates the Safaricom Daraja API STK Push.
        """
        # In production, this would call https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest
        print(f"DEBUG: Triggering M-Pesa STK Push for {phone_number} - Amount: {amount}")

        # Mocking a successful request response
        merchant_request_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
        return {
            "MerchantRequestID": merchant_request_id,
            "CheckoutRequestID": f"ws_CO_{merchant_request_id}",
            "ResponseCode": "0",
            "CustomerMessage": "Success. Request accepted for processing"
        }

    @staticmethod
    def verify_payment(checkout_request_id: str):
        """
        Simulates the M-Pesa callback verification.
        """
        return {
            "ResultCode": 0,
            "ResultDesc": "The service request is processed successfully.",
            "Amount": 100.0,
            "MpesaReceiptNumber": "NLJ7RT6VAD"
        }
