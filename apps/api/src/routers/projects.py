from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import List
from packages.directus_client import DirectusClient
from packages.shared_types import Project, Workflow
from workflows.flows import software_delivery_flow

router = APIRouter()
directus = DirectusClient()

@router.get("", response_model=List[Project])
async def get_projects():
    try:
        return await directus.get_projects()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/{project_id}", response_model=Project)
async def get_project(project_id: str):
    try:
        return await directus.get_project(project_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Project not found")

@router.post("", response_model=Project)
async def create_project(project: Project):
    try:
        return await directus.create_project(project)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create project: {str(e)}")

@router.get("/{project_id}/workflow", response_model=Workflow)
async def get_project_workflow(project_id: str):
    try:
        wf = await directus.get_workflow_by_project(project_id)
        if not wf:
            raise HTTPException(status_code=404, detail="No workflow found for this project")
        return wf
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.post("/{project_id}/start")
async def start_project_workflow(project_id: str, background_tasks: BackgroundTasks):
    try:
        # Verify project exists first
        await directus.get_project(project_id)
        
        # Trigger the Prefect flow asynchronously using FastAPI background tasks
        background_tasks.add_task(software_delivery_flow, project_id)
        
        return {
            "status": "started",
            "message": "Software delivery workflow execution has been queued.",
            "project_id": project_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start workflow: {str(e)}")
