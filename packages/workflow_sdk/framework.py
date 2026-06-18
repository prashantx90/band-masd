import datetime
from typing import Any, Callable, Dict, Optional
from packages.shared_types import Workflow, AgentRun, Message
from packages.directus_client import DirectusClient
from packages.band_adapter import DirectusBandClient

class WorkflowContext:
    def __init__(
        self, 
        workflow_id: str, 
        project_id: str, 
        directus: DirectusClient, 
        band: DirectusBandClient
    ):
        self.workflow_id = workflow_id
        self.project_id = project_id
        self.directus = directus
        self.band = band

class AgentExecutor:
    def __init__(self, directus_client: DirectusClient, band_client: DirectusBandClient):
        self.directus = directus_client
        self.band = band_client

    async def execute_agent(
        self, 
        workflow_id: str, 
        agent_code: str, 
        input_context: Dict[str, Any], 
        run_func: Callable[[Dict[str, Any]], Any]
    ) -> Any:
        # Get agent metadata
        agent = await self.directus.get_agent_by_code(agent_code)
        agent_id = agent.id if agent else "unknown"
        agent_name = agent.name if agent else f"{agent_code.upper()} Agent"

        # Create Agent Run record
        agent_run = AgentRun(
            workflow_id=workflow_id,
            agent_id=agent_id,
            status="running",
            progress=10,
            started_at=datetime.datetime.utcnow().isoformat(),
            input_context=input_context
        )
        agent_run = await self.directus.create_agent_run(agent_run)

        # Publish start message
        await self.band.publish(
            workflow_id=workflow_id,
            event_type="log",
            title=f"{agent_name} Initialized",
            content=f"Analyzing context and preparing outputs.",
            from_agent_id=agent_id,
            severity="info"
        )

        start_time = datetime.datetime.utcnow()
        try:
            # Update progress to indicate running state
            await self.directus.update_agent_run(agent_run.id, {"progress": 40})
            
            # Execute the agent logic
            result = await run_func(input_context)
            
            await self.directus.update_agent_run(agent_run.id, {"progress": 80})
            
            end_time = datetime.datetime.utcnow()
            duration_ms = int((end_time - start_time).total_seconds() * 1000)
            
            # Estimate tokens for local model execution logs
            tokens_in = len(str(input_context)) // 4
            tokens_out = len(str(result)) // 4
            
            # Update agent run to completed
            await self.directus.update_agent_run(agent_run.id, {
                "status": "completed",
                "progress": 100,
                "completed_at": end_time.isoformat(),
                "execution_time_ms": duration_ms,
                "output_summary": str(result)[:300] + "..." if len(str(result)) > 300 else str(result),
                "tokens_in": tokens_in,
                "tokens_out": tokens_out
            })

            # Publish completion message
            await self.band.publish(
                workflow_id=workflow_id,
                event_type="completion",
                title=f"{agent_name} Completed",
                content=f"Successfully generated structured outcomes.",
                from_agent_id=agent_id,
                severity="success"
            )

            return result
        except Exception as e:
            end_time = datetime.datetime.utcnow()
            duration_ms = int((end_time - start_time).total_seconds() * 1000)
            
            # Update agent run to failed
            await self.directus.update_agent_run(agent_run.id, {
                "status": "failed",
                "progress": 100,
                "completed_at": end_time.isoformat(),
                "execution_time_ms": duration_ms,
                "output_summary": f"Failed with error: {str(e)}"
            })

            # Publish failure message
            await self.band.publish(
                workflow_id=workflow_id,
                event_type="failure",
                title=f"{agent_name} Failed",
                content=f"Execution error: {str(e)}",
                from_agent_id=agent_id,
                severity="error"
            )
            raise e

class WorkflowManager:
    def __init__(self, directus_client: DirectusClient, band_client: DirectusBandClient):
        self.directus = directus_client
        self.band = band_client

    async def create_workflow(self, project_id: str) -> Workflow:
        # Create a new workflow record in Directus
        workflow = Workflow(
            project_id=project_id,
            status="pending",
            current_agent="PM Agent"
        )
        saved_wf = await self.directus.create_workflow(workflow)
        
        # Publish project created event
        await self.band.publish(
            workflow_id=saved_wf.id,
            event_type="system",
            title="Workflow Created",
            content=f"Workflow initialized for project ID {project_id}.",
            severity="info"
        )
        
        return saved_wf

    async def start_workflow(self, workflow_id: str) -> Workflow:
        # Update workflow to running
        updated_wf = await self.directus.update_workflow(workflow_id, {
            "status": "running",
            "started_at": datetime.datetime.utcnow().isoformat()
        })
        return updated_wf

    async def complete_workflow(self, workflow_id: str) -> Workflow:
        # Update workflow to completed
        updated_wf = await self.directus.update_workflow(workflow_id, {
            "status": "completed",
            "completed_at": datetime.datetime.utcnow().isoformat()
        })
        return updated_wf

    async def fail_workflow(self, workflow_id: str) -> Workflow:
        # Update workflow to failed
        updated_wf = await self.directus.update_workflow(workflow_id, {
            "status": "failed",
            "completed_at": datetime.datetime.utcnow().isoformat()
        })
        return updated_wf
