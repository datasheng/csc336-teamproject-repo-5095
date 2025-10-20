from fastapi import FastAPI

# 1. Initialize the FastAPI app
app = FastAPI()

# 2. Define your first endpoint (a test route)
@app.get("/")
def read_root():
    return {"Hello": "Restaurant Ordering Backend"}
