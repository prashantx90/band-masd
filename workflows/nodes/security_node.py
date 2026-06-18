from workflows.state.workflow_state import WorkflowState
from packages.directus_client import DirectusClient
from packages.band_adapter import DirectusBandClient
from packages.workflow_sdk import AgentExecutor
from packages.shared_types import Finding
import agents.security_agent as security_agent

async def security_node(state: WorkflowState) -> dict:
    directus = DirectusClient()
    band = DirectusBandClient(directus)
    executor = AgentExecutor(directus, band)

    workflow_id = state.get("workflow_id")
    implementation_plan = state.get("implementation_plan", {})

    # Get security agent metadata
    agent = await directus.get_agent_by_code("security")
    agent_id = agent.id if agent else None

    # Run the Security Agent
    async def run_security(ctx):
        return await security_agent.run(implementation_plan)

    sec_output = await executor.execute_agent(
        workflow_id=workflow_id,
        agent_code="security",
        input_context={"implementation_plan": implementation_plan},
        run_func=run_security
    )

    # Save security findings to Directus
    saved_findings = []
    for finding in sec_output.vulnerabilities:
        db_finding = Finding(
            workflow_id=workflow_id,
            agent_id=agent_id,
            type="security",
            severity=finding.severity,
            title=finding.title,
            description=f"{finding.description} (OWASP: {finding.owasp_category or 'N/A'})",
            status="open"
        )
        saved = await directus.create_finding(db_finding)
        saved_findings.append(saved.model_dump())

    # Publish message on the band
    await band.publish(
        workflow_id=workflow_id,
        event_type="security.completed",
        title="Security Verification Completed",
        content=f"Security agent successfully scanned the architecture backlog and flagged {len(saved_findings)} concerns.",
        severity="success"
    )

    return {
        "security_findings": saved_findings
    }
