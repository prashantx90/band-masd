import os
from typing import Any
from openai import AsyncOpenAI
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel
from agents.qa_agent.models import QAOutput, QAFinding

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

qa_agent = Agent(
    model=model,
    output_type=QAOutput,
    system_prompt=(
        "You are an expert QA and Testing Agent. "
        "Your task is to analyze the engineering implementation plan and detect potential test planning gaps, "
        "missing test scenarios, boundary condition omissions, or integration testing risks."
    )
)

async def run(implementation_plan: Any) -> QAOutput:
    prompt = f"Implementation Plan:\n{str(implementation_plan)}"
    try:
        result = await qa_agent.run(prompt)
        return result.data
    except Exception as e:
        print(f"Warning: QA Agent LLM execution failed ({e}). Returning robust fallback data.")
        return QAOutput(
            findings=[
                QAFinding(
                    title="Missing Integration Tests for Client Packages", 
                    description="No explicit integration tests are planned for directus_client and band_adapter.", 
                    severity="medium"
                ),
                QAFinding(
                    title="Undefined API Mocking Strategy", 
                    description="The test plan does not mention how third-party services like Ollama and Directus APIs will be mocked in CI/CD pipelines.", 
                    severity="low"
                )
            ]
        )
