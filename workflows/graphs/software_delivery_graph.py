from langgraph.graph import StateGraph, START, END
from workflows.state.workflow_state import WorkflowState
from workflows.nodes import (
    pm_node,
    architect_node,
    engineer_node,
    qa_node,
    security_node,
    reviewer_node,
)

# Initialize the StateGraph with the WorkflowState TypedDict schema
builder = StateGraph(WorkflowState)

# Add all nodes
builder.add_node("pm", pm_node)
builder.add_node("architect", architect_node)
builder.add_node("engineer", engineer_node)
builder.add_node("qa", qa_node)
builder.add_node("security", security_node)
builder.add_node("reviewer", reviewer_node)

# Define workflow routing edges
builder.add_edge(START, "pm")
builder.add_edge("pm", "architect")

# Fork: Architect branches to Engineer, QA, and Security in parallel
builder.add_edge("architect", "engineer")
builder.add_edge("architect", "qa")
builder.add_edge("architect", "security")

# Join: Engineer, QA, and Security must complete before the Reviewer starts
builder.add_edge("engineer", "reviewer")
builder.add_edge("qa", "reviewer")
builder.add_edge("security", "reviewer")

# End the execution after reviewer node
builder.add_edge("reviewer", END)

# Compile the graph
software_delivery_graph = builder.compile()
