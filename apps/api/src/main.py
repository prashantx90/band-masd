import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Ensure the root of the workspace is in python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))

load_dotenv()

from apps.api.src.routers import projects, workflows, agents, reports, dashboard

app = FastAPI(
    title="CodeBand AI API", 
    description="Intelligence backend orchestrating PydanticAI and LangGraph workflows", 
    version="1.0.0"
)

# Enable CORS for frontend web application access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(projects.router, prefix="/projects", tags=["Projects"])
app.include_router(workflows.router, prefix="/workflows", tags=["Workflows"])
app.include_router(agents.router, prefix="/agents", tags=["Agents"])
app.include_router(reports.router, prefix="/reports", tags=["Reports"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])

@app.get("/")
async def root():
    return {
        "status": "healthy",
        "service": "CodeBand AI API",
        "features": ["PydanticAI", "LangGraph", "Prefect", "Ollama"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
