from workflows.state.workflow_state import WorkflowState
from packages.directus_client import DirectusClient
from packages.band_adapter import DirectusBandClient
from packages.workflow_sdk import AgentExecutor
from packages.shared_types import Artifact
import agents.engineer_agent as engineer_agent

async def engineer_node(state: WorkflowState) -> dict:
    directus = DirectusClient()
    band = DirectusBandClient(directus)
    executor = AgentExecutor(directus, band)

    workflow_id = state.get("workflow_id")
    architecture = state.get("architecture", {})

    # Get engineer agent metadata
    agent = await directus.get_agent_by_code("engineer")
    agent_id = agent.id if agent else None

    # Run the Engineer Agent
    async def run_engineer(ctx):
        return await engineer_agent.run(architecture)

    eng_output = await executor.execute_agent(
        workflow_id=workflow_id,
        agent_code="engineer",
        input_context={"architecture": architecture},
        run_func=run_engineer
    )

    # Save the implementation plan to the artifacts collection
    content_str = eng_output.model_dump_json()
    artifact = Artifact(
        workflow_id=workflow_id,
        agent_id=agent_id,
        artifact_type="implementation_plan",
        title="Software Implementation Plan Blueprint",
        content=content_str,
        metadata={"stories_count": len(eng_output.stories)}
    )
    saved_art = await directus.create_artifact(artifact)

    # Publish message on the band
    await band.publish(
        workflow_id=workflow_id,
        event_type="implementation.generated",
        title="Implementation Planning Completed",
        content="Engineer agent successfully translated architecture specs to actionable backlog stories and milestones.",
        severity="success"
    )

    return {
        "implementation_plan": eng_output.model_dump()
    }
