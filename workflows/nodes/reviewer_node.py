import datetime
from workflows.state.workflow_state import WorkflowState
from packages.directus_client import DirectusClient
from packages.band_adapter import DirectusBandClient
from packages.workflow_sdk import AgentExecutor
from packages.shared_types import Report
import agents.reviewer_agent as reviewer_agent

async def reviewer_node(state: WorkflowState) -> dict:
    directus = DirectusClient()
    band = DirectusBandClient(directus)
    executor = AgentExecutor(directus, band)

    workflow_id = state.get("workflow_id")
    project_id = state.get("project_id")
    qa_findings = state.get("qa_findings", [])
    security_findings = state.get("security_findings", [])

    # Run the Reviewer Agent
    async def run_reviewer(ctx):
        return await reviewer_agent.run(qa_findings, security_findings)

    review_output = await executor.execute_agent(
        workflow_id=workflow_id,
        agent_code="reviewer",
        input_context={"qa_findings": qa_findings, "security_findings": security_findings},
        run_func=run_reviewer
    )

    # Save report to reports in Directus
    db_report = Report(
        workflow_id=workflow_id,
        summary=review_output.summary,
        architecture_summary="System architecture designed and validated.",
        implementation_summary="Software implementation plan and engineering milestones generated.",
        qa_summary=f"QA audit successfully completed. Omissions identified: {len(qa_findings)}.",
        security_summary=f"Security scan completed. Vulnerabilities flagged: {len(security_findings)}.",
        approval_decision=review_output.decision,
        generated_at=datetime.datetime.utcnow().isoformat()
    )
    saved_report = await directus.create_report(db_report)

    # Update Project status in Directus based on the decision
    approval_status = review_output.decision  # approved, rejected, changes_requested
    project_status = "completed" if approval_status == "approved" else "blocked"
    await directus.update_project(project_id, {
        "status": project_status,
        "approval_status": approval_status,
        "updated_at": datetime.datetime.utcnow().isoformat()
    })

    # Update Workflow status
    wf_status = "completed" if approval_status == "approved" else "failed"
    await directus.update_workflow(workflow_id, {
        "status": wf_status,
        "completed_at": datetime.datetime.utcnow().isoformat()
    })

    # Publish final message on the band
    await band.publish(
        workflow_id=workflow_id,
        event_type="workflow.completed",
        title=f"Review Decision: {approval_status.upper()}",
        content=f"Reviewer decision finalized with status: {approval_status}. Details: {review_output.summary}",
        severity="success" if approval_status == "approved" else "warning"
    )

    return {
        "approval_report": review_output.model_dump()
    }
