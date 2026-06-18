# Starting the CodeBand AI Application & Troubleshooting Guide

This guide provides instructions on how to start the CodeBand AI platform and troubleshoot common bootstrapping, configuration, and dependency issues.

---

## Quick Start Guide

To start the platform, follow these steps in order:

### 1. Set Up Environment

Ensure you have activated your virtual environment and installed the dependencies:

```powershell
# Activate Virtual Environment (Windows)
.venv\Scripts\activate

# Install Dependencies
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create or update your `.env` file in the root directory:

```env
# Directus Database Settings
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
DIRECTUS_API_TOKEN=your-directus-token-here

# Ollama / LLM Settings
LLM_BASE_URL=http://localhost:11434/v1
LLM_MODEL=qwen3:8b

# Prefect Server Settings
PREFECT_API_URL=http://127.0.0.1:4200/api
```

### 3. Start the Local Prefect Server (with SQLite in-memory setting)

To prevent SQLite concurrency locks during test execution:

```powershell
# Set in-memory database and start server
$env:PREFECT_API_DATABASE_CONNECTION_URL="sqlite+aiosqlite:///:memory:"
.venv\Scripts\prefect server start
```

### 4. Run the Platform Bootstrapper

Run the bootstrapping manager to run health checks, load registries, and seed default agents/demo data:

```powershell
# Enable mock mode if Directus or Ollama is offline
$env:DIRECTUS_MOCK_MODE="true"

# Run bootstrapper launcher
.venv\Scripts\python apps/api/src/bootstrap/launcher.py
```

### 5. Launch the REST API Service

Start the FastAPI server:

```powershell
.venv\Scripts\uvicorn apps.api.src.main:app --reload --port 8000
```

---

## Environment Variable Reference

| Variable Name              | Description                                | Default / Example           |
| -------------------------- | ------------------------------------------ | --------------------------- |
| `NEXT_PUBLIC_DIRECTUS_URL` | Endpoint of the Directus service           | `http://localhost:8055`     |
| `DIRECTUS_API_TOKEN`       | Auth token for API read/write access       | `sCre-Yzhu...`              |
| `LLM_BASE_URL`             | Ollama or remote LLM OpenAI-compatible URL | `http://localhost:11434/v1` |
| `LLM_MODEL`                | Ollama model name                          | `qwen3:8b`                  |
| `PREFECT_API_URL`          | Local Prefect server REST API endpoint     | `http://127.0.0.1:4200/api` |
| `DIRECTUS_MOCK_MODE`       | Enable offline mock data fallback checks   | `true` or `false`           |

---

## Common Bootstrap Issues & Solutions

### 1. Prefect Router AttributeError (`AttributeError: 'PrefectRouter' object has no attribute 'routes'`)

- **Cause**: An incompatible newer version of `fastapi` has changed internal router data structures, breaking Prefect's API initialization.
- **Solution**: Downgrade FastAPI to a compatible stable version:
  ```powershell
  .venv\Scripts\pip install fastapi==0.111.0
  ```

### 2. Prefect Database Concurrency Locks (`database is locked`)

- **Cause**: Multi-threaded workflows write concurrently to the default local SQLite database file, causing locking.
- **Solution**: Force Prefect to run using an in-memory database configuration:
  ```powershell
  $env:PREFECT_API_DATABASE_CONNECTION_URL="sqlite+aiosqlite:///:memory:"
  .venv\Scripts\prefect server start
  ```

### 3. Directus / Database Connection Failures

- **Cause**: Remote or local Directus service is down or unreachable.
- **Solution**: For local testing or offline demo validation, enable the built-in mock persistence system:
  ```powershell
  $env:DIRECTUS_MOCK_MODE="true"
  ```
  This skips connection tests and serves valid in-memory fallback structures.

### 4. PydanticAI Agent Model Init / Keyword Arguments Failures

- **Cause**: Passing custom `client` directly to `OpenAIModel` constructor causes `TypeError` in recent PydanticAI versions.
- **Solution**: Wrap the custom `AsyncOpenAI` instance with the `OpenAIProvider` class:

  ```python
  from pydantic_ai.providers.openai import OpenAIProvider

  provider = OpenAIProvider(openai_client=client)
  model = OpenAIModel("qwen3:8b", provider=provider)
  ```

### 5. PydanticAI Constructor `result_type` Error

- **Cause**: The parameter `result_type` has been deprecated and replaced.
- **Solution**: Rename the argument to `output_type` in the `Agent` instantiation:
  ```python
  agent = Agent(model, output_type=ExpectedSchemaClass)
  ```

### 6. Directus 401 Unauthorized (`Client error '401 Unauthorized'`)

- **Cause**: The `DIRECTUS_API_TOKEN` environment variable in your `.env` is invalid, expired, or the associated user role lacks read-write permissions to access Directus collections (such as `agents`, `projects`, etc.).
- **Solution**:
  1. Go to your Directus admin console, select your User Profile (or create a dedicated Service Account), and generate a **Static Token**.
  2. Update the `DIRECTUS_API_TOKEN` field in your `.env` file with the new token.
  3. Ensure the token's user role has appropriate collection permissions (Admin roles have this automatically).

### 7. Local Directus api token

\_o7vygrNZyRb_rkRLzgSVdadCHgP3iZ2
