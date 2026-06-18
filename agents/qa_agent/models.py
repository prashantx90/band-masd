from typing import List
from pydantic import BaseModel

class QAFinding(BaseModel):
    title: str
    description: str
    severity: str  # critical, high, medium, low

class QAOutput(BaseModel):
    findings: List[QAFinding]
