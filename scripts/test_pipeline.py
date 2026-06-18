import os
import sys
import asyncio
import uuid
import datetime

# Configure Prefect to connect to local test server
os.environ["PREFECT_API_URL"] = "http://127.0.0.1:4200/api"

# Ensure project root is in sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from dotenv import load_dotenv
load_dotenv()

from packages.directus_client import DirectusClient
from packages.band_adapter import DirectusBandClient
from packages.workflow_sdk import WorkflowManager
from workflows.flows import software_delivery_flow
from packages.shared_types import Project

async def main():
    print("==================================================")
    print("Testing CodeBand AI Intelligence Pipeline")
    print("==================================================")

    # 1. Check imports and configure environment
    print("\n[1/3] Checking environment & connection...")
    directus_url = os.getenv("NEXT_PUBLIC_DIRECTUS_URL", "http://localhost:8055")
    print(f"Directus Endpoint: {directus_url}")
    print(f"Ollama Endpoint: {os.getenv('LLM_BASE_URL', 'http://localhost:11434/v1')}")
    print(f"Ollama Model: {os.getenv('LLM_MODEL', 'qwen3:8b')}")

    directus = DirectusClient()
    
    # 2. Check if Directus is up and write test data
    online = False
    test_project_id = None
    try:
        # Check connection
        projects = await directus.get_projects()
        print(f"Directus Connection Successful! Found {len(projects)} existing projects.")
        online = True
        
        # Create a test project to run the workflow
        test_project = Project(
            name=f"Test Pipeline Project - {datetime.datetime.now().strftime('%Y%m%d-%H%M')}",
            description="A modern web dashboard built with Next.js, FastAPI, and Postgres database integrations.",
            business_requirements="User auth, project list visualization, and real-time event logging.",
            target_users="Software developer teams and product managers.",
            technology_preferences="TypeScript, Next.js, FastAPI, PostgreSQL, Directus",
            status="draft",
            approval_status="pending"
        )
        saved = await directus.create_project(test_project)
        test_project_id = saved.id
        print(f"Created temporary test project in Directus with ID: {test_project_id}")
    except Exception as e:
        print(f"Directus connection test failed: {e}")
        print("Will proceed in MOCK PERSISTENCE mode to verify LangGraph & Agent structure.")
        os.environ["DIRECTUS_MOCK_MODE"] = "true"
        # Generate a dummy UUID for local mock execution
        test_project_id = str(uuid.uuid4())

    # 3. Run the workflow flow
    print("\n[2/3] Starting multi-agent execution...")
    if not online:
        # Mocking DirectusClient & DirectusBandClient internally within the flow for testing
        from unittest.mock import AsyncMock, MagicMock
        import packages.directus_client.client as directus_module
        import packages.band_adapter.client as band_module
        
        print("Mocking Directus API calls...")
        
        # Create Mock Directus Client
        mock_client = AsyncMock()
        mock_client.url = directus_url
        mock_client.token = "mock-token"
        
        # Define mock behavior
        mock_project = Project(
            id=test_project_id,
            name="Mock Test Project",
            description="Testing agent flows offline",
            status="draft",
            approval_status="pending"
        )
        mock_client.get_project.return_value = mock_project
        mock_client.create_project.return_value = mock_project
        mock_client.update_project.return_value = mock_project
        
        from packages.shared_types import Workflow, Agent, AgentRun, Message, Requirement, Finding, Report, Artifact
        mock_client.create_workflow.side_effect = lambda wf: asyncio.sleep(0.01) or AsyncMock(id=str(uuid.uuid4()), project_id=wf.project_id, status="pending")
        mock_client.update_workflow.side_effect = lambda wf_id, d: asyncio.sleep(0.01) or AsyncMock(id=wf_id, status=d.get("status", "running"))
        mock_client.get_agent_by_code.side_effect = lambda code: asyncio.sleep(0.01) or Agent(id=str(uuid.uuid4()), name=f"{code.upper()} Agent", code=code, sort_order=1)
        mock_client.create_agent_run.side_effect = lambda run: asyncio.sleep(0.01) or AgentRun(id=str(uuid.uuid4()), workflow_id=run.workflow_id, agent_id=run.agent_id, status="running")
        mock_client.update_agent_run.side_effect = lambda run_id, d: asyncio.sleep(0.01) or AgentRun(id=run_id, status=d.get("status", "completed"))
        mock_client.create_message.side_effect = lambda msg: asyncio.sleep(0.01) or Message(id=str(uuid.uuid4()), workflow_id=msg.workflow_id, event_type=msg.event_type, title=msg.title, content=msg.content)
        mock_client.create_requirement.side_effect = lambda req: asyncio.sleep(0.01) or Requirement(id=str(uuid.uuid4()), project_id=req.project_id, requirement_id=req.requirement_id, title=req.title, priority=req.priority)
        mock_client.create_artifact.side_effect = lambda art: asyncio.sleep(0.01) or Artifact(id=str(uuid.uuid4()), workflow_id=art.workflow_id, title=art.title, artifact_type=art.artifact_type)
        mock_client.create_finding.side_effect = lambda fnd: asyncio.sleep(0.01) or Finding(id=str(uuid.uuid4()), workflow_id=fnd.workflow_id, type=fnd.type, title=fnd.title)
        mock_client.create_report.side_effect = lambda rep: asyncio.sleep(0.01) or Report(id=str(uuid.uuid4()), workflow_id=rep.workflow_id, summary=rep.summary, approval_decision=rep.approval_decision)
        
        # Patching DirectusClient in the runtime module
        directus_module.DirectusClient = lambda *args, **kwargs: mock_client

    start_time = datetime.datetime.now()
    try:
        # Execute the flow
        result = await software_delivery_flow(test_project_id)
        
        duration = (datetime.datetime.now() - start_time).total_seconds()
        print("\n[3/3] Execution completed successfully!")
        print(f"Total Execution Time: {duration:.2f} seconds")
        print("\n==================================================")
        print("Final Workflow Output State Summary:")
        print("==================================================")
        print(f"Project ID: {result.get('project_id')}")
        print(f"Workflow ID: {result.get('workflow_id')}")
        print(f"Requirements Discovered: {len(result.get('requirements', []))}")
        print(f"Architecture services defined: {len(result.get('architecture', {}).get('services', []))}")
        print(f"Engineering Backlog Items (Stories): {len(result.get('implementation_plan', {}).get('stories', []))}")
        print(f"QA Findings: {len(result.get('qa_findings', []))}")
        print(f"Security Findings: {len(result.get('security_findings', []))}")
        print(f"Final Decision: {result.get('approval_report', {}).get('decision', 'N/A').upper()}")
        print(f"Review Summary: {result.get('approval_report', {}).get('summary', 'N/A')}")
        print("==================================================")
        
    except Exception as e:
        print(f"\n[!] Workflow failed during execution: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
