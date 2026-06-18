import os
import httpx
from apps.api.src.bootstrap.config import settings

class HealthCheck:
    @staticmethod
    async def directus() -> bool:
        if os.getenv("DIRECTUS_MOCK_MODE", "false") == "true":
            return True
        try:
            async with httpx.AsyncClient() as client:
                url = f"{settings.DIRECTUS_URL.rstrip('/')}/server/ping"
                response = await client.get(url, timeout=3.0)
                if response.status_code == 200:
                    return True
                url_info = f"{settings.DIRECTUS_URL.rstrip('/')}/server/info"
                response_info = await client.get(url_info, timeout=3.0)
                return response_info.status_code == 200
        except Exception:
            return False

    @staticmethod
    async def ollama() -> bool:
        if os.getenv("DIRECTUS_MOCK_MODE", "false") == "true":
            return True
        try:
            async with httpx.AsyncClient() as client:
                url = settings.OLLAMA_URL.rstrip('/')
                # Check root endpoint of Ollama
                base_url = url.replace("/v1", "")
                response = await client.get(base_url, timeout=3.0)
                return response.status_code == 200 or "Ollama is running" in response.text
        except Exception:
            return False

    @staticmethod
    async def prefect() -> bool:
        if os.getenv("DIRECTUS_MOCK_MODE", "false") == "true":
            return True
        try:
            async with httpx.AsyncClient() as client:
                url = f"{settings.PREFECT_URL.rstrip('/')}/health"
                response = await client.get(url, timeout=3.0)
                return response.status_code == 200 or response.text == "OK"
        except Exception:
            return False

    @staticmethod
    async def band() -> bool:
        return await HealthCheck.directus()
