from typing import List
from pydantic import BaseModel

class ServiceInfo(BaseModel):
    name: str
    description: str
    tech_stack: str

class ArchitectureOutput(BaseModel):
    services: List[ServiceInfo]
    database: str
    deployment: str
    integrations: List[str]
