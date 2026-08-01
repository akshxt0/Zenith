#!/bin/bash

# Start Tailwind in the background
npx @tailwindcss/cli \
  -i app/static/css/input.css \
  -o app/static/css/tailwind.css \
  --watch &

# Start FastAPI
uvicorn app.main:app --reload