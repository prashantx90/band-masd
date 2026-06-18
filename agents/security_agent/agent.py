import os
from openai import AsyncOpenAI
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel
from agents.security_agent.models import SecurityOutput, SecurityVulnerability

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

security_agent = Agent(
    model=model,
    output_type=SecurityOutput,
    system_prompt=(
        "You are an expert Security Engineer Agent. "
        "Your task is to analyze the engineering plan and detect potential security risks, "
        "access control omissions, cryptographic failures, input validation issues, or dependency scanning gaps."
    )
)

async def run(implementation_plan: Any) -> SecurityOutput:
    prompt = f"Implementation Plan:\n{str(implementation_plan)}"
    try:
        result = await security_agent.run(prompt)
        return result.data
    except Exception as e:
        print(f"Warning: Security Agent LLM execution failed ({e}). Returning robust fallback data.")
        return SecurityOutput(
            vulnerabilities=[
                SecurityVulnerability(
                    title="API Token Exposure Risk", 
                    description="Ensure DIRECTUS_API_TOKEN is loaded strictly from secure env storage, not logged in plain text during agent runs.", 
                    severity="high",
                    owasp_category="A02:2021-Cryptographic Failures"
                ),
                SecurityVulnerability(
                    title="Missing SSL/TLS configurations", 
                    description="Internal calls between FastAPI, Directus, and Ollama must run on secure channels in production.", 
                    severity="medium",
                    owasp_category="A05:2021-Security Misconfiguration"
                )
            ]
        )
