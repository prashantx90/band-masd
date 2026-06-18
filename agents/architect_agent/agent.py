import os
from openai import AsyncOpenAI
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel
from agents.architect_agent.models import ArchitectureOutput, ServiceInfo

from pydantic_ai.providers.openai import OpenAIProvider

# Setup LLM model using Ollama OpenAI compatibility
llm_model = os.getenv("LLM_MODEL", "qwen3:8b")
llm_base_url = os.getenv("LLM_BASE_URL", "http://localhost:11434/v1")
llm_api_key = os.getenv("LLM_API_KEY", "ollama")

client = AsyncOpenAI(
    base_url=llm_base_url,
    api_key=llm_api_key
)

provider = OpenAIProvider(openai_client=client)

model = OpenAIModel(
    model_name=llm_model,
    provider=provider
)

architect_agent = Agent(
    model=model,
    output_type=ArchitectureOutput,
    system_prompt=(
        "You are an expert Solutions Architect Agent. "
        "Your task is to analyze the product requirements and design a robust system architecture. "
        "Identify key microservices or application services, database selections, deployment strategies, and integrations."
    )
)

async def run(requirements: List[Any]) -> ArchitectureOutput:
    prompt = f"Product Requirements:\n{str(requirements)}"
    try:
        result = await architect_agent.run(prompt)
        return result.data
    except Exception as e:
        print(f"Warning: Architect Agent LLM execution failed ({e}). Returning robust fallback data.")
        return ArchitectureOutput(
            services=[
                ServiceInfo(
                    name="web-frontend", 
                    description="User dashboard, project management, and workflow observer console.", 
                    tech_stack="Next.js 15, React, Tailwind CSS, shadcn/ui, React Flow"
                ),
                ServiceInfo(
                    name="api-backend", 
                    description="Orchestrator and agents execution gateway.", 
                    tech_stack="FastAPI, Python 3.12, PydanticAI, LangGraph, Prefect"
                ),
                ServiceInfo(
                    name="persistence-layer", 
                    description="Headless CMS and relational data storage.", 
                    tech_stack="Directus CMS, PostgreSQL"
                )
            ],
            database="PostgreSQL",
            deployment="Docker Compose on Ubuntu LTS",
            integrations=["Ollama REST API", "Band Adapter Communication Bus"]
        )
