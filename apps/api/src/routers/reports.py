from fastapi import APIRouter, HTTPException
from packages.directus_client import DirectusClient
from packages.shared_types import Report

router = APIRouter()
directus = DirectusClient()

@router.get("/{workflow_id}", response_model=Report)
async def get_report_by_workflow(workflow_id: str):
    try:
        report = await directus.get_report(workflow_id)
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        return report
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
