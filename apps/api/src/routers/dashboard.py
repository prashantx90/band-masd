from fastapi import APIRouter, HTTPException
from packages.directus_client import DirectusClient
from pydantic import BaseModel

router = APIRouter()
directus = DirectusClient()

class DashboardStats(BaseModel):
    activeProjects: int
    totalAgentRuns: int
    completedTasks: int
    approvalRate: float

@router.get("", response_model=DashboardStats)
async def get_dashboard_stats():
    try:
        # Load data to compute aggregate metrics
        projects = await directus.get_projects()
        agent_runs = await directus.get_all_agent_runs()
        reports = await directus.get_all_reports()

        active_count = sum(1 for p in projects if p.status in ["running", "draft", "blocked"])
        completed_count = sum(1 for p in projects if p.status == "completed")
        total_runs = len(agent_runs)

        # Compute approval rate from reviewer reports
        total_reports = len(reports)
        if total_reports > 0:
            approved_count = sum(1 for r in reports if r.approval_decision == "approved")
            approval_rate = (approved_count / total_reports) * 100.0
        else:
            approval_rate = 100.0

        return DashboardStats(
            activeProjects=active_count,
            totalAgentRuns=total_runs,
            completedTasks=completed_count,
            approvalRate=round(approval_rate, 2)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to compute dashboard stats: {str(e)}")
