from typing import List, Optional
from pydantic import BaseModel

class PMRequirement(BaseModel):
    requirement_id: str
    title: str
    description: Optional[str] = None
    priority: str  # P0, P1, P2
    status: Optional[str] = "pending"

class PMOutput(BaseModel):
    requirements: List[PMRequirement]
    assumptions: List[str]
    acceptance_criteria: List[str]
