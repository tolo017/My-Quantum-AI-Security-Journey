# Beba Beba - Database Design

To support dynamic clustering, virtual stages, and secure commuter pools, the database must handle geospatial data and complex relationships. We will use **PostgreSQL** with the **PostGIS** extension.

## 1. Core Entities

### A. Users & Authentication
*   **Users:** `id`, `name`, `phone_number`, `national_id`, `role` (Commuter, Conductor, SaccoAdmin, HRManager, SuperAdmin), `created_at`.
*   **CommuterProfiles:** `user_id`, `work_id_image_url`, `is_verified`, `company_id`, `home_location` (Point), `subscription_status`, `balance`.
*   **Companies:** `id`, `name`, `location` (Point), `verification_code`, `created_at`.
*   **CompanyEmployees:** `id`, `company_id`, `national_id` (used for verification), `status` (Active, Inactive).

### B. Fleet & Saccos
*   **Saccos:** `id`, `name`, `registration_number`, `admin_user_id`.
*   **Vehicles:** `id`, `sacco_id`, `plate_number`, `capacity` (e.g., 14, 33), `current_conductor_id`.
*   **Routes:** `id`, `sacco_id`, `name` (e.g., "Ngong - CBD"), `standard_fare`.

### C. Booking & Virtual Stages
*   **VirtualStages:** `id`, `name`, `location` (Point), `route_id`, `is_dynamic` (Boolean).
*   **Bookings:** `id`, `commuter_id`, `vehicle_id`, `pickup_stage_id`, `dropoff_location` (Point), `status` (Pending, Confirmed, Boarded, NoShow, Completed), `fare_paid`, `commission_deducted`, `scheduled_time`.
*   **Trips:** `id`, `vehicle_id`, `route_id`, `start_time`, `end_time`, `status` (Scheduled, InProgress, Finished).

### D. Payments
*   **Transactions:** `id`, `user_id`, `amount`, `transaction_type` (Subscription, SingleRide, Withdrawal), `mpesa_receipt_number`, `status`.
*   **Subscriptions:** `id`, `commuter_id`, `plan_type` (Weekly, Monthly), `start_date`, `end_date`, `remaining_rides`.

---

## 2. Key Relationships
1.  **Commuters to Companies:** Many-to-One. Used for secure workplace-based clustering.
2.  **Trips to Bookings:** One-to-Many. A trip (a specific Matatu run) contains many passenger bookings.
3.  **Virtual Stages to Routes:** Many-to-One. A route has multiple predefined or dynamic pickup points.

---

## 3. Geospatial Queries (PostGIS)
*   **Clustering Algorithm:**
    ```sql
    -- Find commuters within 500m of a proposed route line
    SELECT user_id FROM CommuterProfiles
    WHERE ST_DWithin(home_location, ST_GeomFromText('LINESTRING(...)'), 500);
    ```
*   **Virtual Stage Optimization:**
    ```sql
    -- Find the centroid of a cluster of 10 commuters to place a dynamic stage
    SELECT ST_Centroid(ST_Collect(home_location)) FROM CommuterProfiles
    WHERE user_id IN (...);
    ```

---

## 4. Security & Compliance
*   **Data Privacy:** National IDs and Work IDs will be encrypted at rest.
*   **Audit Logs:** Every status change in `Bookings` and `Transactions` will be logged with a timestamp and the initiating `user_id`.
