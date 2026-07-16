from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.search_router import router as search_router

app = FastAPI(
    title="Campus Insider API",
    description="Public search and lead collection service for Campus Insider",
    version="1.0.0",
)

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(search_router)


@app.get("/")
def read_root():
    return {"status": "ok", "app": "Campus Insider MVP API"}
