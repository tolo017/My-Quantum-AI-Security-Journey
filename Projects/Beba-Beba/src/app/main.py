from fastapi import FastAPI
from .api import auth, ussd
from .models.user import init_db

app = FastAPI(title="Beba Beba Backend", version="0.1.0")

# Initialize DB on startup
@app.on_event("startup")
def startup_event():
    init_db()

app.include_router(auth.router)
app.include_router(ussd.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Beba Beba API", "status": "Lively and Fun"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
