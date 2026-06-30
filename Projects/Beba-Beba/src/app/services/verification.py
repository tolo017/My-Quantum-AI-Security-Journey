class VerificationService:
    @staticmethod
    def verify_work_badge(image_data: str, national_id: str) -> bool:
        """
        Simulates OCR processing of a badge and matching it against
        an HR-provided list of National IDs.
        """
        # In a real scenario, we'd use an OCR library like Tesseract or a cloud Vision API
        # and then query our database for the matching National ID in the CompanyEmployees table.

        # MOCK LOGIC: For demonstration, IDs starting with 'BEBA' are valid.
        if national_id.startswith("BEBA"):
            return True
        return False

    @staticmethod
    def update_hr_list(company_id: int, employee_ids: list[str]):
        """
        Syncs the HR database with our internal CompanyEmployees table.
        """
        # Real logic would perform a diff (upsert/delete) on the table.
        return len(employee_ids)
