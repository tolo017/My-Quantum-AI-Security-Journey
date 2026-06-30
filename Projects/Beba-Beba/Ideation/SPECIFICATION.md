# Beba Beba - Product Specification & Architecture

## 1. Vision & Mission
**Beba Beba** is a secure, tech-enabled public transport solution designed to formalize the commute for office workers and geolocation clusters in urban centers (starting with Nairobi). By leveraging existing Matatu infrastructure and "Virtual Stages," Beba Beba aims to reduce peak-hour congestion, ensure commuter safety, and provide guaranteed seating through an efficient booking and subscription model.

---

## 2. Business Model & Founder's Revenue
*   **Revenue Source:** 8% commission deducted from the standard Matatu fare per seat occupied.
    *   *Why 8%?* It remains competitive enough for Saccos (who save on fuel and time by having guaranteed full loads) while providing a sustainable margin for Beba Beba.
*   **Pricing Engine:** Follows the standard Sacco/Google-listed price chart to maintain trust and prevent overcharging.
*   **Subscription Model:**
    *   **Weekly/Monthly Tiers:** Users pay upfront for a set number of commutes.
    *   **Revenue Logic:** Beba Beba holds the subscription funds and pays Saccos per ride taken, minus the 8% commission.
    *   **"Float" Interest:** By holding subscription funds, the company can generate additional interest/float income (standard in fintech).
    *   **Guaranteed Seating:** This is the primary value prop for subscribers.
*   **Daily Commuters:** Pay-as-you-go via M-Pesa STK push. Commission is deducted at the point of transaction.

---

## 3. User Personas & Features

### A. The Commuter (Mobile App & USSD)
*   **Onboarding:** Secure login via Work ID/Badge scanning (for corporate clusters) or National ID.
*   **Booking:** Select "Virtual Stage" and destination. Receive arrival alerts 10 mins before pickup.
*   **Payment:** One-tap M-Pesa STK Push.
*   **Security:** QR Code generation for boarding verification.

### B. The Conductor/Driver (Mobile App & USSD)
*   **Smartphone App:** View passenger manifest, scan commuter QR codes, and mark seats as "Taken" for walk-ins.
*   **USSD Interface:** Simple interface for feature phones to verify passenger codes and check manifest.
*   **Navigation:** Dynamic routing hitting specific "Virtual Stages" based on the morning's cluster.
*   **Offline Mode:** Local manifest storage for areas with poor connectivity.

### C. The Sacco Admin (Web Dashboard)
*   **Fleet Management:** Register and verify PSVs (Public Service Vehicles).
*   **Pricing Engine:** Update route prices based on time of day or Sacco standards.
*   **Revenue Tracking:** View earnings and commissions deducted by Beba Beba.

### D. The HR Manager (Corporate Portal)
*   **Employee Management:** Upload and manage employee lists for "Secure Corporate Pools."
*   **Automated Sync:** Dashboard to add/remove employees as they join or leave the firm.

---

## 4. Technical Architecture

### High-Level Stack
*   **Backend:** Python (FastAPI) for core business logic, M-Pesa API, and USSD session management.
*   **Matching Engine:** Rust (optional/future) or Python with PostGIS for high-performance geospatial clustering.
*   **Database:** PostgreSQL with PostGIS for location-based queries and "Virtual Stage" calculations.
*   **Frontend:**
    *   Cross-platform Mobile App (Flutter or React Native).
    *   React/Next.js for Sacco and HR Dashboards.
*   **Infrastructure:** Docker-based microservices for scalability and isolation.

### The "Virtual Stage" Logic
1.  **Clustering:** The system analyzes the home locations of commuters moving towards the same area (e.g., Westlands to CBD).
2.  **Point Creation:** It identifies a safe "Virtual Stage" (near main highways/safe points) that minimizes walking for passengers while maximizing speed for the Matatu.
3.  **Optimization:** Routes are updated dynamically each morning based on who booked 24 hours in advance.

---

## 5. Security & Verification
*   **Badge Scanning:** First-time registration requires scanning a physical Work ID. OCR/Image recognition validates the ID against HR-provided lists.
*   **Boarding:** Conductor scans the user's Beba Beba QR code. This confirms the fare is paid and the user is authorized.

---

## 6. Roadmap
*   **Phase 1:** Backend Architecture, Database Design, and Mock M-Pesa/USSD.
*   **Phase 2:** HR Portal & Employee Verification Logic.
*   **Phase 3:** Geospatial Clustering (Virtual Stages) Engine.
*   **Phase 4:** Mobile App (MVP) for Commuters & Conductors.
*   **Phase 5:** Pilot Program in Nairobi.
