from packages.directus_client import DirectusClient
from packages.band_adapter import DirectusBandClient
from apps.api.src.bootstrap.config import settings

class ServiceRegistry:
    def __init__(self):
        self._directus = None
        self._band = None

    @property
    def directus(self) -> DirectusClient:
        if self._directus is None:
            self._directus = DirectusClient(
                url=settings.DIRECTUS_URL,
                token=settings.DIRECTUS_TOKEN
            )
        return self._directus

    @property
    def band(self) -> DirectusBandClient:
        if self._band is None:
            self._band = DirectusBandClient(self.directus)
        return self._band

    @property
    def ollama(self) -> str:
        return settings.OLLAMA_URL

    @property
    def prefect(self) -> str:
        return settings.PREFECT_URL

services = ServiceRegistry()
