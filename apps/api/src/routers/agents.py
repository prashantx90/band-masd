from fastapi import APIRouter, HTTPException
from typing import List
from packages.directus_client import DirectusClient
from packages.shared_types import Agent

router = APIRouter()
directus = DirectusClient()

@router.get("", response_model=List[Agent])
async def get_agents():
    try:
        return await directus.get_agents()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
