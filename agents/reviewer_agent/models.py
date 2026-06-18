from typing import List
from pydantic import BaseModel

class ReviewOutput(BaseModel):
    decision: str  # approved, rejected, changes_requested
    summary: str
    recommendations: List[str]
