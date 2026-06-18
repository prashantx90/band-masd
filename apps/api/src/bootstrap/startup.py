import os
import sys
import asyncio
from apps.api.src.bootstrap.healthcheck import HealthCheck
from apps.api.src.bootstrap.seeder import agents_exist, seed_agents, seed_demo_project, seed_demo_workflow, seed_demo_messages
from apps.api.src.bootstrap.services import services
import agents.registry as agent_registry
import workflows.registry as workflow_registry

class StartupManager:
    async def initialize(self):
        print("==================================================")
        print("CodeBand AI Platform - Starting Up Bootstrapper")
        print("==================================================")

        # 1. Health Checks
        print("\n[1/4] Running health checks on external dependencies...")
        
        directus_ok = await HealthCheck.directus()
        ollama_ok = await HealthCheck.ollama()
        prefect_ok = await HealthCheck.prefect()
        band_ok = await HealthCheck.band()

        print(f" - Directus: {'HEALTHY' if directus_ok else 'UNREACHABLE'}")
        print(f" - Ollama:   {'HEALTHY' if ollama_ok else 'UNREACHABLE'}")
        print(f" - Prefect:  {'HEALTHY' if prefect_ok else 'UNREACHABLE'}")
        print(f" - Band:     {'HEALTHY' if band_ok else 'UNREACHABLE'}")

        if not directus_ok or not ollama_ok or not prefect_ok or not band_ok:
            if os.getenv("DIRECTUS_MOCK_MODE", "false") != "true":
                print("\n[!] Warning: One or more dependencies are unreachable.")
                print("To run in offline simulation/mock mode, set DIRECTUS_MOCK_MODE=true in your environment.")
            else:
                print("\n[!] Running in MOCK PERSISTENCE mode. Overriding connection checks.")

        # 2. Initialize Registries
        print("\n[2/4] Initializing registries...")
        agent_registry.load()
        workflow_registry.load()

        # 3. Seed Data
        print("\n[3/4] Checking and seeding database...")
        if not await agents_exist():
            await seed_agents()
        else:
            print(" - Agents already exist. Skipping agent seeding.")

        # Seed demo project if none exists
        try:
            projects = await services.directus.get_projects()
            if len(projects) == 0:
                demo_proj = await seed_demo_project()
                demo_wf = await seed_demo_workflow(demo_proj.id)
                await seed_demo_messages(demo_wf.id)
                print(f" - Seeded demo project: {demo_proj.name} (ID: {demo_proj.id})")
            else:
                print(f" - Found {len(projects)} existing projects. Skipping demo seeding.")
        except Exception as e:
            print(f" - Skipping demo project seeding due to: {e}")

        # 4. Ready
        print("\n[4/4] Startup lifecycle complete. CodeBand AI Platform is READY.")
        print("==================================================")
