from workflows.graphs import software_delivery_graph

WORKFLOWS = {
    "software_delivery": software_delivery_graph
}

def load():
    print(f"[Workflow Registry] Discovered and loaded {len(WORKFLOWS)} workflows: {list(WORKFLOWS.keys())}")
    return WORKFLOWS
