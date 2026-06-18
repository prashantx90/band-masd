import os
import sys
import asyncio

# Ensure project root is in sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../..")))

# Load dotenv before anything else
from dotenv import load_dotenv
load_dotenv()

from apps.api.src.bootstrap.startup import StartupManager

async def main():
    startup = StartupManager()
    await startup.initialize()

if __name__ == "__main__":
    asyncio.run(main())
