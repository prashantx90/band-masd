from typing import List, Optional
from pydantic import BaseModel

class SecurityVulnerability(BaseModel):
    title: str
    description: str
    severity: str  # critical, high, medium, low
    owasp_category: Optional[str] = None

class SecurityOutput(BaseModel):
    vulnerabilities: List[SecurityVulnerability]
