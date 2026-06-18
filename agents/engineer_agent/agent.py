import os
from openai import AsyncOpenAI
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel
from agents.engineer_agent.models import ImplementationOutput, MilestoneInfo, StoryInfo

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

engineer_agent = Agent(
    model=model,
    output_type=ImplementationOutput,
    system_prompt=(
        "You are an expert Software Engineer Agent. "
        "Your task is to analyze the system architecture design and generate an actionable implementation plan. "
        "Define application modules, development milestones, repository layout, and software stories (tasks)."
    )
)

async def run(architecture: Any) -> ImplementationOutput:
    prompt = f"System Architecture:\n{str(architecture)}"
    try:
        result = await engineer_agent.run(prompt)
        return result.data
    except Exception as e:
        print(f"Warning: Engineer Agent LLM execution failed ({e}). Returning robust fallback data.")
        return ImplementationOutput(
            modules=[
                "authentication-module",
                "workspace-dashboard-module",
                "multi-agent-orchestrator-gateway"
            ],
            milestones=[
                MilestoneInfo(
                    name="Milestone 1: Project Scaffolding & Shared Packages", 
                    description="Setup the core structure, share models, Directus client, and Band adapter.", 
                    target_date="2026-06-20"
                ),
                MilestoneInfo(
                    name="Milestone 2: Agent Implementations", 
                    description="Implement the PM, Architect, and Engineer agent behaviors and output formats.", 
                    target_date="2026-06-25"
                ),
                MilestoneInfo(
                    name="Milestone 3: Reviewer Sign-off & Integration Testing", 
                    description="Set up QA/Security agent verification steps and Reviewer approval logic.", 
                    target_date="2026-06-30"
                )
            ],
            repositories=["band-masd"],
            stories=[
                StoryInfo(
                    id="STORY-001", 
                    title="Implement Directus Persistence Client", 
                    points=3, 
                    description="Setup Directus client using httpx to enable async CRUD operations."
                ),
                StoryInfo(
                    id="STORY-002", 
                    title="Design LangGraph Workflow Routing Engine", 
                    points=5, 
                    description="Define the state diagram and handle agent routing dynamically in LangGraph."
                ),
                StoryInfo(
                    id="STORY-003", 
                    title="Setup Prefect Automation Flow", 
                    points=3, 
                    description="Wrap the LangGraph state machine inside a Prefect flow to manage retries."
                )
            ]
        )
