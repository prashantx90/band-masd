from fastapi import APIRouter, HTTPException
from typing import List
from packages.directus_client import DirectusClient
from packages.shared_types import Workflow, Message, AgentRun, Report

router = APIRouter()
directus = DirectusClient()

@router.get("/{workflow_id}", response_model=Workflow)
async def get_workflow(workflow_id: str):
    try:
        return await directus.get_workflow(workflow_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Workflow not found")

@router.get("/{workflow_id}/messages", response_model=List[Message])
async def get_workflow_messages(workflow_id: str):
    try:
        return await directus.get_messages(workflow_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/{workflow_id}/agent-runs", response_model=List[AgentRun])
async def get_workflow_agent_runs(workflow_id: str):
    try:
        return await directus.get_agent_runs(workflow_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/{workflow_id}/report", response_model=Report)
async def get_workflow_report(workflow_id: str):
    try:
        report = await directus.get_report(workflow_id)
        if not report:
            raise HTTPException(status_code=404, detail="No report generated yet for this workflow")
        return report
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
