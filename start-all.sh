#!/bin/bash

# ==============================================================================
# CodeBand AI Platform - Ubuntu Startup Script
# ==============================================================================
# This script orchestrates the startup of all CodeBand AI services:
# 1. Prefect Server (running in-memory SQLite database)
# 2. Directus Headless CMS (optional, falls back to offline mock mode)
# 3. FastAPI REST API Backend
# 4. Vite React Frontend
#
# Usage:
#   chmod +x start-all.sh
#   ./start-all.sh
# ==============================================================================

# Exit immediately if a command exits with a non-zero status
set -e

# Set text colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================================================${NC}"
echo -e "${GREEN}             Starting CodeBand AI Platform on Ubuntu/Linux            ${NC}"
echo -e "${BLUE}======================================================================${NC}"

# Exit cleanup handler to stop all background processes
cleanup() {
    echo -e "\n${YELLOW}[Clean Up] Stopping all background processes...${NC}"
    # Stop background jobs started by this shell
    local pids=$(jobs -p)
    if [ -n "$pids" ]; then
        kill $pids 2>/dev/null || true
        wait $pids 2>/dev/null || true
    fi
    echo -e "${GREEN}[Clean Up] All processes stopped. Goodbye!${NC}"
}
trap cleanup EXIT INT TERM

# ------------------------------------------------------------------------------
# 1. Prerequisite Verification
# ------------------------------------------------------------------------------
echo -e "\n${BLUE}[1/7] Verifying system dependencies...${NC}"

# Check for Python 3
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}[Error] python3 is not installed. Please install Python 3.10+ before running this script.${NC}"
    exit 1
fi
echo -e " - Python 3: Found ($(python3 --version | awk '{print $2}'))"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}[Error] node is not installed. Please install Node.js (v18+) before running this script.${NC}"
    exit 1
fi
echo -e " - Node.js: Found ($(node --version))"

# Check for npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}[Error] npm is not installed. Please install npm before running this script.${NC}"
    exit 1
fi
echo -e " - npm: Found ($(npm --version))"

# Check if Ollama is installed (warning if not)
if ! command -v ollama &> /dev/null; then
    echo -e "${YELLOW}[Warning] ollama is not found in PATH. Make sure it is installed and running if you want to use local LLM models.${NC}"
else
    echo -e " - Ollama: Found ($(ollama --version | awk '{print $NF}'))"
fi

# ------------------------------------------------------------------------------
# 2. Virtual Environment & Python Package Setup
# ------------------------------------------------------------------------------
echo -e "\n${BLUE}[2/7] Preparing Python Virtual Environment...${NC}"

if [ ! -d ".venv" ]; then
    echo -e " - Virtual environment (.venv) not found. Creating it..."
    python3 -m venv .venv
fi

echo -e " - Activating virtual environment..."
source .venv/bin/activate

echo -e " - Verifying/Installing Python dependencies (requirements.txt)..."
pip install --upgrade pip
pip install -r requirements.txt

# ------------------------------------------------------------------------------
# 3. Environment Configuration
# ------------------------------------------------------------------------------
echo -e "\n${BLUE}[3/7] Loading environment variables...${NC}"

if [ ! -f ".env" ]; then
    echo -e " - .env file not found. Creating default configuration..."
    cat <<EOT > .env
# Directus Database Settings
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
DIRECTUS_API_TOKEN=your-directus-token-here

# Ollama / LLM Settings
LLM_BASE_URL=http://localhost:11434/v1
LLM_MODEL=qwen3:8b

# Prefect Server Settings
PREFECT_API_URL=http://127.0.0.1:4200/api
EOT
    echo -e " - Created default .env file in root directory."
fi

# Export all variables from .env
export $(grep -v '^#' .env | xargs)

# ------------------------------------------------------------------------------
# 4. Port Conflict Checks
# ------------------------------------------------------------------------------
echo -e "\n${BLUE}[4/7] Checking for port conflicts...${NC}"

check_port() {
    local port=$1
    local name=$2
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${RED}[Error] Port $port (used by $name) is already in use.${NC}"
        echo -e "        Please free this port or stop any existing service running on it."
        exit 1
    fi
}

check_port 8000 "FastAPI Backend"
check_port 4200 "Prefect API Server"
check_port 5173 "Vite Frontend"

# Only check Directus port if not in mock mode
if [ "${DIRECTUS_MOCK_MODE,,}" != "true" ]; then
    check_port 8055 "Directus API"
fi

echo -e " - No port conflicts detected."

# ------------------------------------------------------------------------------
# 5. Launch Prefect Server (SQLite In-Memory)
# ------------------------------------------------------------------------------
echo -e "\n${BLUE}[5/7] Starting Prefect Server...${NC}"

# Force Prefect to use in-memory SQLite database to prevent SQLite concurrency write locks
export PREFECT_API_DATABASE_CONNECTION_URL="sqlite+aiosqlite:///:memory:"

# Start Prefect and redirect log output to file
prefect server start > prefect.log 2>&1 &
echo -e " - Prefect Server launched (PID: $!). Logging to prefect.log"

# Wait for Prefect API to become responsive
echo -n " - Waiting for Prefect API to boot"
for i in {1..30}; do
    if curl -s http://127.0.0.1:4200/api/health &>/dev/null; then
        echo -e " ${GREEN}[Ready]${NC}"
        break
    fi
    echo -n "."
    sleep 1
    if [ $i -eq 30 ]; then
        echo -e " ${YELLOW}[Warning] Prefect did not respond in time. Continuing anyway...${NC}"
    fi
done

# ------------------------------------------------------------------------------
# 6. Launch Directus Database (Mock Mode vs Postgres Backend)
# ------------------------------------------------------------------------------
echo -e "\n${BLUE}[6/7] Managing Directus Service...${NC}"

if [ "${DIRECTUS_MOCK_MODE,,}" = "true" ]; then
    echo -e " - ${YELLOW}DIRECTUS_MOCK_MODE=true is active.${NC}"
    echo -e " - Skipping Directus local daemon startup. API will operate using in-memory mock storage."
else
    echo -e " - Running in database-connected mode."
    if [ -d "apps/directus" ]; then
        echo -e " - Booting local Directus service..."
        cd apps/directus
        if [ ! -d "node_modules" ]; then
            echo -e " - Installing Directus dependencies..."
            npm install
        fi
        npm run start > directus.log 2>&1 &
        echo -e " - Directus Service launched (PID: $!). Logging to apps/directus/directus.log"
        
        echo -n " - Waiting for Directus API to respond"
        for i in {1..40}; do
            if curl -s http://localhost:8055/server/ping &>/dev/null; then
                echo -e " ${GREEN}[Ready]${NC}"
                break
            fi
            echo -n "."
            sleep 1.5
            if [ $i -eq 40 ]; then
                echo -e "\n${RED}[Error] Directus failed to start. Check apps/directus/directus.log for details.${NC}"
                exit 1
            fi
        done
        cd ../..
    else
        echo -e " - ${YELLOW}apps/directus directory not found. Skipping local startup. Make sure remote Directus is reachable.${NC}"
    fi
fi

# Run the Platform Bootstrapper to seed databases/load agents
echo -e " - Running platform bootstrapper seeder..."
python apps/api/src/bootstrap/launcher.py

# ------------------------------------------------------------------------------
# 7. Launch Services (FastAPI API & Vite Frontend)
# ------------------------------------------------------------------------------
echo -e "\n${BLUE}[7/7] Launching FastAPI Backend & React Frontend...${NC}"

# FastAPI
uvicorn apps.api.src.main:app --reload --port 8000 > backend.log 2>&1 &
echo -e " - FastAPI API Backend started (PID: $!). Logging to backend.log"

# Frontend Vite Dev Server
if [ -d "apps/web" ]; then
    echo -e " - Starting frontend dev server..."
    cd apps/web
    if [ ! -d "node_modules" ]; then
        echo -e " - Installing frontend dependencies..."
        npm install
    fi
    npm run dev &
    echo -e " - Vite Development server started (PID: $!)"
    cd ../..
else
    echo -e " - ${RED}[Error] apps/web directory not found. Frontend cannot be started.${NC}"
    exit 1
fi

echo -e "\n${BLUE}======================================================================${NC}"
echo -e "${GREEN}      CodeBand AI Services successfully started on Ubuntu!           ${NC}"
echo -e "${BLUE}======================================================================${NC}"
echo -e " - Frontend Web:    ${GREEN}http://localhost:5173${NC}"
echo -e " - Backend REST API: ${GREEN}http://localhost:8000${NC}"
echo -e " - Prefect Server:   ${GREEN}http://localhost:4200${NC}"
if [ "${DIRECTUS_MOCK_MODE,,}" != "true" ]; then
echo -e " - Directus Admin:   ${GREEN}http://localhost:8055${NC}"
fi
echo -e "\nLogs:"
echo -e " - Prefect Server:   tail -f prefect.log"
echo -e " - API Backend:      tail -f backend.log"
if [ "${DIRECTUS_MOCK_MODE,,}" != "true" ]; then
echo -e " - Directus Daemon:  tail -f apps/directus/directus.log"
fi
echo -e "\n${YELLOW}Press [Ctrl+C] at any time to cleanly stop all services.${NC}"
echo -e "${BLUE}======================================================================${NC}"

# Keep script running and block until interrupted (Ctrl+C is caught by trap)
while true; do
    sleep 1
done
