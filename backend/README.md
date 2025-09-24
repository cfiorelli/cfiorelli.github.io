FastAPI proxy for Semantic Scholar (example)
===========================================

This directory contains a minimal example of a proxy service you can run to forward requests to the Semantic Scholar API without exposing your API key to the browser.

Requirements
- Python 3.10+
- pip install fastapi uvicorn httpx python-dotenv

Example (main.py)
------------------
```py
from fastapi import FastAPI, HTTPException
import httpx
import os

app = FastAPI()
API_KEY = os.environ.get('SEMANTIC_SCHOLAR_KEY')
BASE = 'https://api.semanticscholar.org/graph/v1'

@app.get('/api/s2/paper/{paper_id}')
async def get_paper(paper_id: str, fields: str = 'title,abstract,authors,year'):
    if not API_KEY:
        raise HTTPException(status_code=500, detail='API key not configured')
    url = f"{BASE}/paper/{paper_id}?fields={fields}"
    async with httpx.AsyncClient() as client:
        r = await client.get(url, headers={'x-api-key': API_KEY}, timeout=20.0)
    if r.status_code != 200:
        raise HTTPException(status_code=r.status_code, detail=r.text)
    return r.json()

```

Run locally
-----------
SEMANTIC_SCHOLAR_KEY=your_key_here uvicorn main:app --reload

Security notes
- Use rate-limiting and caching in production (e.g., FastAPI dependencies, Redis cache).
- Never check API keys into the repository. Use environment variables or secrets manager.
