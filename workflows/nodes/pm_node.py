from workflows.state.workflow_state import WorkflowState
from packages.directus_client import DirectusClient
from packages.band_adapter import DirectusBandClient
from packages.workflow_sdk import AgentExecutor
from packages.shared_types import Requirement
import agents.pm_agent as pm_agent

async def pm_node(state: WorkflowState) -> dict:
    directus = DirectusClient()
    band = DirectusBandClient(directus)
    executor = AgentExecutor(directus, band)

    workflow_id = state.get("workflow_id")
    project_id = state.get("project_id")
    context = state.get("project_context", {})
    project_name = context.get("name", "Demo Project")
    project_description = context.get("description", "")

    # Run the PM Agent
    async def run_pm(ctx):
        return await pm_agent.run(project_name, project_description)

    pm_output = await executor.execute_agent(
        workflow_id=workflow_id,
        agent_code="pm",
        input_context={"project_name": project_name, "description": project_description},
        run_func=run_pm
    )

    # Save generated requirements to Directus
    saved_reqs = []
    for req in pm_output.requirements:
        db_req = Requirement(
            project_id=project_id,
            requirement_id=req.requirement_id,
            title=req.title,
            description=req.description,
            priority=req.priority,
            status=req.status or "pending"
        )
        saved = await directus.create_requirement(db_req)
        saved_reqs.append(saved.model_dump())

    # Publish message on the band
    await band.publish(
        workflow_id=workflow_id,
        event_type="requirements.generated",
        title="Requirements Discovery Completed",
        content=f"Generated {len(saved_reqs)} formal product requirements.",
        severity="success"
    )

    return {
        "requirements": saved_reqs
    }
