import asyncio
from packages.shared_types import Agent, Project, Workflow, Message
from apps.api.src.bootstrap.services import services

async def agents_exist() -> bool:
    try:
        agents = await services.directus.get_agents()
        return len(agents) > 0
    except Exception:
        return False

async def seed_agents():
    print("[Seeder] Seeding default agents into Directus...")
    default_agents = [
        Agent(name="Product Manager Agent", code="pm", sort_order=1, description="Analyzes user requests and defines functional requirements."),
        Agent(name="Solutions Architect Agent", code="architect", sort_order=2, description="Designs system architecture based on requirements."),
        Agent(name="Software Engineer Agent", code="engineer", sort_order=3, description="Generates detailed implementation plans and backlog items."),
        Agent(name="QA & Testing Agent", code="qa", sort_order=4, description="Reviews implementation plan and defines test coverage strategy."),
        Agent(name="Security Engineer Agent", code="security", sort_order=5, description="Identifies potential security gaps, threats, and mitigations."),
        Agent(name="Reviewer Agent", code="reviewer", sort_order=6, description="Performs final QA/Security reviews and issues project approval.")
    ]
    for agent in default_agents:
        try:
            existing = await services.directus.get_agent_by_code(agent.code)
            if not existing:
                payload = agent.model_dump(exclude_none=True)
                await services.directus._request("POST", "/items/agents", json_data=payload)
        except Exception as e:
            print(f"[Seeding Error] Failed to seed agent {agent.code}: {e}")

async def seed_demo_project() -> Project:
    print("[Seeder] Seeding demo project...")
    project = Project(
        name="Demo Cloud Native E-Commerce App",
        description="A microservices-based e-commerce platform with catalog, ordering, and payment services.",
        business_requirements="Support high throughput, 99.9% availability, and PCI-DSS compliance.",
        target_users="Online retail customers and back-office administrators.",
        technology_preferences="Python, FastAPI, React, PostgreSQL, Docker",
        status="draft",
        approval_status="pending"
    )
    saved = await services.directus.create_project(project)
    return saved

async def seed_demo_workflow(project_id: str) -> Workflow:
    print("[Seeder] Seeding demo workflow...")
    workflow = Workflow(
        project_id=project_id,
        status="pending"
    )
    saved = await services.directus.create_workflow(workflow)
    return saved

async def seed_demo_messages(workflow_id: str):
    print("[Seeder] Seeding demo messages...")
    messages = [
        Message(workflow_id=workflow_id, event_type="info", title="Workflow Initialized", content="System bootstrap complete. Starting agent communication graph."),
        Message(workflow_id=workflow_id, event_type="agent_start", title="PM Agent Activated", content="Product Manager Agent analyzing e-commerce business requirements."),
    ]
    for msg in messages:
        await services.directus.create_message(msg)
