import os
import sys
import httpx
import asyncio

# Ensure project root is in sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from dotenv import load_dotenv
load_dotenv()

async def main():
    url = os.getenv("NEXT_PUBLIC_DIRECTUS_URL", "http://localhost:8055")
    token = os.getenv("DIRECTUS_API_TOKEN", "")

    print("==================================================")
    print("Directus Connection Diagnostics")
    print("==================================================")
    print(f"Directus URL: '{url}'")
    print(f"Directus Token (raw): '{token}'")
    print(f"Token length: {len(token)}")
    
    if token.startswith("\\"):
        print("\n[!] WARNING: Your token starts with a backslash ('\\'). This is likely a markdown escaping error and will cause 401 Unauthorized!")
        print("    Please remove the backslash from your .env file so the token starts with '_' directly.")

    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    async with httpx.AsyncClient() as client:
        try:
            target_url = f"{url.rstrip('/')}/users/me"
            print(f"\nSending GET to {target_url}...")
            res = await client.get(target_url, headers=headers)
            print(f"Response Status Code: {res.status_code}")
            
            if res.status_code == 200:
                data = res.json().get("data", {})
                email = data.get("email", "No email found")
                role = data.get("role", "No role found")
                first_name = data.get("first_name", "")
                last_name = data.get("last_name", "")
                print(f"\nSUCCESS! Authenticated as: {first_name} {last_name} ({email}), Role ID: {role}")
            elif res.status_code == 401:
                print("\nERROR: 401 Unauthorized. The token is invalid, expired, or incorrect.")
            else:
                print(f"\nERROR: Received code {res.status_code}: {res.text}")
        except Exception as e:
            print(f"\nConnection Error: {e}")
    print("==================================================")

if __name__ == "__main__":
    asyncio.run(main())
