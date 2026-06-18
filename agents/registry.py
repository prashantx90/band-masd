import agents.pm_agent as pm_agent
import agents.architect_agent as architect_agent
import agents.engineer_agent as engineer_agent
import agents.qa_agent as qa_agent
import agents.security_agent as security_agent
import agents.reviewer_agent as reviewer_agent

AGENTS = {
    "pm": pm_agent,
    "architect": architect_agent,
    "engineer": engineer_agent,
    "qa": qa_agent,
    "security": security_agent,
    "reviewer": reviewer_agent
}

def load():
    print(f"[Agent Registry] Discovered and loaded {len(AGENTS)} agents: {list(AGENTS.keys())}")
    return AGENTS
