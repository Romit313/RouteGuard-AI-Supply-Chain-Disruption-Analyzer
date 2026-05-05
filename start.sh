#!/bin/bash
echo "🛳️  Starting RouteGuard AI..."
echo ""

# Start Ollama
echo "→ Starting Ollama..."
OLLAMA_ORIGINS=* ollama serve &
OLLAMA_PID=$!
sleep 2

# Start backend
echo "→ Starting FastAPI backend..."
cd backend
pip install -r requirements.txt -q
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..
sleep 2

# Start frontend
echo "→ Starting React frontend..."
cd frontend
npm install --silent
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ RouteGuard AI is running!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo "   API docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services."

# Wait and cleanup
trap "kill $OLLAMA_PID $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
