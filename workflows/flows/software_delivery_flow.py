from prefect import flow, task
from packages.directus_client import DirectusClient
from packages.band_adapter import DirectusBandClient
from packages.workflow_sdk import WorkflowManager
from workflows.graphs import software_delivery_graph

@task(name="Run LangGraph State Machine")
async def run_langgraph_workflow(initial_state: dict) -> dict:
    # Execute compiled LangGraph graph asynchronously
    result = await software_delivery_graph.ainvoke(initial_state)
    return result

@flow(name="Software Delivery Flow")
async def software_delivery_flow(project_id: str) -> dict:
    directus = DirectusClient()
    band = DirectusBandClient(directus)
    manager = WorkflowManager(directus, band)

    # 1. Register workflow execution in database
    workflow = await manager.create_workflow(project_id)

    try:
        # 2. Load latest project requirements context
        project = await directus.get_project(project_id)
        
        # 3. Mark workflow as running
        await manager.start_workflow(workflow.id)

        # 4. Prepare execution state
        initial_state = {
            "project_id": project_id,
            "workflow_id": workflow.id,
            "project_context": {
                "name": project.name,
                "description": project.description or "",
                "business_requirements": project.business_requirements or "",
                "target_users": project.target_users or "",
                "technology_preferences": project.technology_preferences or ""
            },
            "requirements": [],
            "architecture": {},
            "implementation_plan": {},
            "qa_findings": [],
            "security_findings": [],
            "approval_report": {},
            "artifacts": [],
            "messages": []
        }

        # 5. Execute LangGraph flow
        result = await run_langgraph_workflow(initial_state)

        # 6. Finalize workflow execution success
        await manager.complete_workflow(workflow.id)
        
        return result

    except Exception as e:
        print(f"Workflow execution failed: {e}")
        # Finalize workflow execution failure
        await manager.fail_workflow(workflow.id)
        raise e
