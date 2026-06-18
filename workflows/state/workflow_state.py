from typing import TypedDict, List, Dict, Any

class WorkflowState(TypedDict):
    project_id: str
    workflow_id: str
    project_context: Dict[str, Any]
    requirements: List[Dict[str, Any]]
    architecture: Dict[str, Any]
    implementation_plan: Dict[str, Any]
    qa_findings: List[Dict[str, Any]]
    security_findings: List[Dict[str, Any]]
    approval_report: Dict[str, Any]
    artifacts: List[Dict[str, Any]]
    messages: List[Dict[str, Any]]
