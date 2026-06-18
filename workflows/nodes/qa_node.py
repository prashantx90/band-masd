from workflows.state.workflow_state import WorkflowState
from packages.directus_client import DirectusClient
from packages.band_adapter import DirectusBandClient
from packages.workflow_sdk import AgentExecutor
from packages.shared_types import Finding
import agents.qa_agent as qa_agent

async def qa_node(state: WorkflowState) -> dict:
    directus = DirectusClient()
    band = DirectusBandClient(directus)
    executor = AgentExecutor(directus, band)

    workflow_id = state.get("workflow_id")
    implementation_plan = state.get("implementation_plan", {})

    # Get QA agent metadata
    agent = await directus.get_agent_by_code("qa")
    agent_id = agent.id if agent else None

    # Run the QA Agent
    async def run_qa(ctx):
        return await qa_agent.run(implementation_plan)

    qa_output = await executor.execute_agent(
        workflow_id=workflow_id,
        agent_code="qa",
        input_context={"implementation_plan": implementation_plan},
        run_func=run_qa
    )

    # Save findings to the database
    saved_findings = []
    for finding in qa_output.findings:
        db_finding = Finding(
            workflow_id=workflow_id,
            agent_id=agent_id,
            type="qa",
            severity=finding.severity,
            title=finding.title,
            description=finding.description,
            status="open"
        )
        saved = await directus.create_finding(db_finding)
        saved_findings.append(saved.model_dump())

    # Publish message on the band
    await band.publish(
        workflow_id=workflow_id,
        event_type="qa.completed",
        title="QA Audit Completed",
        content=f"QA agent identified {len(saved_findings)} potential functional testing opportunities.",
        severity="success"
    )

    return {
        "qa_findings": saved_findings
    }
