from workflows.state.workflow_state import WorkflowState
from packages.directus_client import DirectusClient
from packages.band_adapter import DirectusBandClient
from packages.workflow_sdk import AgentExecutor
from packages.shared_types import Artifact
import agents.architect_agent as architect_agent
import json

async def architect_node(state: WorkflowState) -> dict:
    directus = DirectusClient()
    band = DirectusBandClient(directus)
    executor = AgentExecutor(directus, band)

    workflow_id = state.get("workflow_id")
    requirements = state.get("requirements", [])

    # Get architect agent metadata
    agent = await directus.get_agent_by_code("architect")
    agent_id = agent.id if agent else None

    # Run the Architect Agent
    async def run_architect(ctx):
        return await architect_agent.run(requirements)

    arch_output = await executor.execute_agent(
        workflow_id=workflow_id,
        agent_code="architect",
        input_context={"requirements": requirements},
        run_func=run_architect
    )

    # Save the architecture design to the artifacts collection
    content_str = arch_output.model_dump_json()
    artifact = Artifact(
        workflow_id=workflow_id,
        agent_id=agent_id,
        artifact_type="architecture",
        title="System Architecture Design Blueprint",
        content=content_str,
        metadata={"services_count": len(arch_output.services)}
    )
    saved_art = await directus.create_artifact(artifact)

    # Publish message on the band
    await band.publish(
        workflow_id=workflow_id,
        event_type="architecture.generated",
        title="Architecture Design Completed",
        content="Architect agent successfully defined backend services, database schema, and deployment stack.",
        severity="success"
    )

    return {
        "architecture": arch_output.model_dump()
    }
