from typing import List, Optional
from pydantic import BaseModel

class MilestoneInfo(BaseModel):
    name: str
    description: str
    target_date: Optional[str] = None

class StoryInfo(BaseModel):
    id: str
    title: str
    points: int
    description: Optional[str] = None

class ImplementationOutput(BaseModel):
    modules: List[str]
    milestones: List[MilestoneInfo]
    repositories: List[str]
    stories: List[StoryInfo]
