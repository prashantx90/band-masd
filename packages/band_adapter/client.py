from typing import Callable, Dict, List, Any, Optional
import datetime
from packages.shared_types import Message
from packages.directus_client import DirectusClient

class BandClient:
    async def publish(
        self, 
        workflow_id: str, 
        event_type: str, 
        title: str, 
        content: str, 
        from_agent_id: Optional[str] = None, 
        to_agent_id: Optional[str] = None, 
        severity: str = "info"
    ) -> Message:
        raise NotImplementedError

    def subscribe(self, event_name: str, callback: Callable):
        raise NotImplementedError

class DirectusBandClient(BandClient):
    def __init__(self, directus_client: DirectusClient):
        self.directus = directus_client
        self.subscribers: Dict[str, List[Callable]] = {}

    async def publish(
        self, 
        workflow_id: str, 
        event_type: str, 
        title: str, 
        content: str, 
        from_agent_id: Optional[str] = None, 
        to_agent_id: Optional[str] = None, 
        severity: str = "info"
    ) -> Message:
        msg = Message(
            workflow_id=workflow_id,
            from_agent_id=from_agent_id,
            to_agent_id=to_agent_id,
            event_type=event_type,
            title=title,
            content=content,
            severity=severity,
            created_at=datetime.datetime.utcnow().isoformat()
        )
        saved_msg = await self.directus.create_message(msg)
        
        # Trigger callbacks
        callbacks = self.subscribers.get(event_type, [])
        for cb in callbacks:
            try:
                # support both sync and async callbacks
                import inspect
                if inspect.iscoroutinefunction(cb):
                    await cb(saved_msg)
                else:
                    cb(saved_msg)
            except Exception as e:
                print(f"Error in subscriber callback for {event_type}: {e}")
                
        return saved_msg

    def subscribe(self, event_name: str, callback: Callable):
        if event_name not in self.subscribers:
            self.subscribers[event_name] = []
        self.subscribers[event_name].append(callback)
