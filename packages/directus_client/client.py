import os
import httpx
from typing import List, Dict, Any, Optional
from packages.shared_types import (
    Project,
    Workflow,
    Agent,
    AgentRun,
    Message,
    Requirement,
    Finding,
    Report,
    Artifact,
)

class DirectusClient:
    def __init__(self, url: Optional[str] = None, token: Optional[str] = None):
        self.url = url or os.getenv("NEXT_PUBLIC_DIRECTUS_URL", "http://localhost:8055")
        self.token = token or os.getenv("DIRECTUS_API_TOKEN", "")
        self.headers = {
            "Content-Type": "application/json"
        }
        if self.token:
            self.headers["Authorization"] = f"Bearer {self.token}"

    async def _request(
        self, 
        method: str, 
        path: str, 
        json_data: Any = None, 
        params: Optional[Dict[str, Any]] = None
    ) -> Any:
        if os.getenv("DIRECTUS_MOCK_MODE", "false") == "true":
            import uuid
            if method in ["POST", "PATCH"]:
                mock_data = json_data.copy() if isinstance(json_data, dict) else (json_data or {})
                if isinstance(mock_data, dict):
                    if "id" not in mock_data:
                        mock_data["id"] = str(uuid.uuid4())
                    
                    # Merge with default fields based on endpoint
                    if "projects" in path:
                        defaults = {
                            "name": "Mock Project",
                            "description": "Mock description",
                            "status": "draft",
                            "approval_status": "pending"
                        }
                    elif "workflows" in path:
                        defaults = {
                            "project_id": str(uuid.uuid4()),
                            "status": "pending"
                        }
                    elif "agent_runs" in path:
                        defaults = {
                            "workflow_id": str(uuid.uuid4()),
                            "agent_id": str(uuid.uuid4()),
                            "status": "running"
                        }
                    elif "messages" in path:
                        defaults = {
                            "workflow_id": str(uuid.uuid4()),
                            "event_type": "info",
                            "title": "Mock Message",
                            "content": "Mock content"
                        }
                    elif "requirements" in path:
                        defaults = {
                            "project_id": str(uuid.uuid4()),
                            "requirement_id": "REQ-MOCK",
                            "title": "Mock Requirement",
                            "description": "Mock description",
                            "priority": "P0"
                        }
                    elif "findings" in path:
                        defaults = {
                            "workflow_id": str(uuid.uuid4()),
                            "type": "qa",
                            "title": "Mock Finding",
                            "description": "Mock description",
                            "severity": "low"
                        }
                    elif "reports" in path:
                        defaults = {
                            "workflow_id": str(uuid.uuid4()),
                            "summary": "Mock Report",
                            "approval_decision": "approved"
                        }
                    elif "artifacts" in path:
                        defaults = {
                            "workflow_id": str(uuid.uuid4()),
                            "title": "Mock Artifact",
                            "content": "Mock content",
                            "artifact_type": "other"
                        }
                    else:
                        defaults = {}
                    
                    for k, v in defaults.items():
                        if k not in mock_data:
                            mock_data[k] = v
                return mock_data
            elif method == "GET":
                if "/items/projects/" in path:
                    return {
                        "id": path.split("/")[-1],
                        "name": "Mock Test Project",
                        "description": "Mock description",
                        "business_requirements": "Mock requirements",
                        "target_users": "Mock users",
                        "technology_preferences": "TypeScript, Python",
                        "status": "draft",
                        "approval_status": "pending"
                    }
                elif "/items/agents" in path:
                    code = "pm"
                    if params:
                        for k, v in params.items():
                            if "filter[code]" in k:
                                code = v
                    return [{
                        "id": str(uuid.uuid4()),
                        "name": f"{code.upper()} Agent",
                        "code": code,
                        "description": f"Mock {code} agent",
                        "sort_order": 1
                    }]
                elif "/items/workflows/" in path:
                    return {
                        "id": path.split("/")[-1],
                        "project_id": str(uuid.uuid4()),
                        "status": "pending"
                    }
                if params and "limit" in params and params["limit"] == 1:
                    return None
                return []

        async with httpx.AsyncClient() as client:
            url = f"{self.url.rstrip('/')}/{path.lstrip('/')}"
            response = await client.request(
                method, 
                url, 
                json=json_data, 
                params=params, 
                headers=self.headers,
                timeout=30.0
            )
            response.raise_for_status()
            data = response.json()
            return data.get("data") if isinstance(data, dict) and "data" in data else data

    # Projects
    async def get_projects(self) -> List[Project]:
        params = {"sort": "-created_at"}
        data = await self._request("GET", "/items/projects", params=params)
        return [Project(**item) for item in data]

    async def get_project(self, project_id: str) -> Project:
        data = await self._request("GET", f"/items/projects/{project_id}")
        return Project(**data)

    async def create_project(self, project: Project) -> Project:
        payload = project.model_dump(exclude_none=True)
        data = await self._request("POST", "/items/projects", json_data=payload)
        return Project(**data)

    async def update_project(self, project_id: str, data: Dict[str, Any]) -> Project:
        updated = await self._request("PATCH", f"/items/projects/{project_id}", json_data=data)
        return Project(**updated)

    # Workflows
    async def get_workflow(self, workflow_id: str) -> Workflow:
        data = await self._request("GET", f"/items/workflows/{workflow_id}")
        return Workflow(**data)

    async def get_workflow_by_project(self, project_id: str) -> Optional[Workflow]:
        params = {
            "filter[project_id][_eq]": project_id,
            "sort": "-started_at",
            "limit": 1
        }
        data = await self._request("GET", "/items/workflows", params=params)
        if data and len(data) > 0:
            return Workflow(**data[0])
        return None

    async def create_workflow(self, workflow: Workflow) -> Workflow:
        payload = workflow.model_dump(exclude_none=True)
        data = await self._request("POST", "/items/workflows", json_data=payload)
        return Workflow(**data)

    async def update_workflow(self, workflow_id: str, data: Dict[str, Any]) -> Workflow:
        updated = await self._request("PATCH", f"/items/workflows/{workflow_id}", json_data=data)
        return Workflow(**updated)

    # Agents Catalog
    async def get_agents(self) -> List[Agent]:
        data = await self._request("GET", "/items/agents")
        return [Agent(**item) for item in data]

    async def get_agent_by_code(self, code: str) -> Optional[Agent]:
        params = {
            "filter[code][_eq]": code,
            "limit": 1
        }
        data = await self._request("GET", "/items/agents", params=params)
        if data and len(data) > 0:
            return Agent(**data[0])
        return None

    # Agent Runs
    async def get_agent_runs(self, workflow_id: str) -> List[AgentRun]:
        params = {
            "filter[workflow_id][_eq]": workflow_id,
            "sort": "created_at"
        }
        data = await self._request("GET", "/items/agent_runs", params=params)
        return [AgentRun(**item) for item in data]

    async def create_agent_run(self, agent_run: AgentRun) -> AgentRun:
        payload = agent_run.model_dump(exclude_none=True)
        data = await self._request("POST", "/items/agent_runs", json_data=payload)
        return AgentRun(**data)

    async def update_agent_run(self, agent_run_id: str, data: Dict[str, Any]) -> AgentRun:
        updated = await self._request("PATCH", f"/items/agent_runs/{agent_run_id}", json_data=data)
        return AgentRun(**updated)

    # Messages
    async def get_messages(self, workflow_id: str) -> List[Message]:
        params = {
            "filter[workflow_id][_eq]": workflow_id,
            "sort": "created_at"
        }
        data = await self._request("GET", "/items/messages", params=params)
        return [Message(**item) for item in data]

    async def create_message(self, message: Message) -> Message:
        payload = message.model_dump(exclude_none=True)
        data = await self._request("POST", "/items/messages", json_data=payload)
        return Message(**data)

    # Requirements
    async def get_requirements(self, project_id: str) -> List[Requirement]:
        params = {
            "filter[project_id][_eq]": project_id
        }
        data = await self._request("GET", "/items/requirements", params=params)
        return [Requirement(**item) for item in data]

    async def create_requirement(self, requirement: Requirement) -> Requirement:
        payload = requirement.model_dump(exclude_none=True)
        data = await self._request("POST", "/items/requirements", json_data=payload)
        return Requirement(**data)

    # Findings
    async def get_findings(self, workflow_id: str) -> List[Finding]:
        params = {
            "filter[workflow_id][_eq]": workflow_id
        }
        data = await self._request("GET", "/items/findings", params=params)
        return [Finding(**item) for item in data]

    async def create_finding(self, finding: Finding) -> Finding:
        payload = finding.model_dump(exclude_none=True)
        data = await self._request("POST", "/items/findings", json_data=payload)
        return Finding(**data)

    # Reports
    async def get_report(self, workflow_id: str) -> Optional[Report]:
        params = {
            "filter[workflow_id][_eq]": workflow_id,
            "limit": 1
        }
        data = await self._request("GET", "/items/reports", params=params)
        if data and len(data) > 0:
            return Report(**data[0])
        return None

    async def create_report(self, report: Report) -> Report:
        payload = report.model_dump(exclude_none=True)
        data = await self._request("POST", "/items/reports", json_data=payload)
        return Report(**data)

    # Artifacts
    async def get_artifacts(self, workflow_id: str) -> List[Artifact]:
        params = {
            "filter[workflow_id][_eq]": workflow_id
        }
        data = await self._request("GET", "/items/artifacts", params=params)
        return [Artifact(**item) for item in data]

    async def create_artifact(self, artifact: Artifact) -> Artifact:
        payload = artifact.model_dump(exclude_none=True)
        data = await self._request("POST", "/items/artifacts", json_data=payload)
        return Artifact(**data)

    async def get_all_agent_runs(self) -> List[AgentRun]:
        data = await self._request("GET", "/items/agent_runs")
        return [AgentRun(**item) for item in data]

    async def get_all_reports(self) -> List[Report]:
        data = await self._request("GET", "/items/reports")
        return [Report(**item) for item in data]

