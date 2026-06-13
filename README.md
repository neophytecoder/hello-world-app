# Salsa Dance Reference

A salsa dance reference website. Users can search for salsa figures, view a detail page with an embedded YouTube video and a breakdown of component figures. An admin UI allows adding, editing, and deleting figures.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, TypeScript, Material UI v9, React Router v7 |
| Backend | Python / Flask, flask-cors |
| Data | `backend/figures.json` — flat JSON file, no database |
| Containerization | Docker + docker-compose |
| Orchestration | Kubernetes (minikube for local) |

## Ports

| Service | Dev | Docker | Kubernetes |
|---------|-----|--------|------------|
| Frontend | 5173 | 8080 | dynamic (`minikube service frontend`) |
| Backend | 5001 | 5001 | ClusterIP internal only |

## Running locally (dev)

```bash
# Backend
cd backend && venv/bin/python app.py

# Frontend (separate terminal)
cd frontend && npm run dev
```

- Frontend: http://127.0.0.1:5173
- Backend: http://localhost:5001

## Running with Docker

```bash
docker compose up --build
```

- Frontend: http://localhost:8080
- Backend: http://localhost:5001

Docker Desktop must be running first. Install via `brew install --cask docker`.

## Running with Kubernetes (minikube)

```bash
# First-time setup
brew install minikube
minikube start --driver=docker

# Build images inside minikube's Docker daemon
eval $(minikube docker-env)
docker build -t salsa-backend:latest ./backend
docker build -t salsa-frontend:latest ./frontend

# Deploy
kubectl apply -f k8s/

# Open frontend (keep terminal open)
minikube service frontend
```

The nginx proxy in the frontend container forwards `/api/` to `http://backend:5001` via the backend ClusterIP Service.

> **Note:** `figures.json` is baked into the image — writes via the admin UI are lost on pod restart. Use a PersistentVolume or external store for durable data in Kubernetes.

## Key URLs

| Page | Path |
|------|------|
| Search | `/` |
| Figure detail | `/figures/:slug` |
| Admin | `/admin` |

## Project structure

```
backend/
  app.py           — Flask API (CRUD routes for figures)
  figures.json     — data store (6 seed figures)
  Dockerfile

frontend/
  src/
    api.ts               — typed fetch helpers
    App.tsx              — route declarations
    pages/
      SearchPage.tsx     — search bar + card grid
      FigurePage.tsx     — video + breakdown chips
      AdminPage.tsx      — add / edit / delete table
    components/
      FigureForm.tsx     — create/edit dialog form
      YouTubeEmbed.tsx   — 16:9 iframe wrapper
  nginx.conf       — proxies /api/ to backend in Docker and Kubernetes
  Dockerfile

k8s/
  backend.yml      — Deployment + ClusterIP Service (port 5001)
  frontend.yml     — Deployment + LoadBalancer Service (port 80)

docker-compose.yml
```

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/figures?q=` | List / search figures |
| GET | `/api/figures/<slug>` | Figure detail with resolved components |
| POST | `/api/figures` | Create figure |
| PUT | `/api/figures/<slug>` | Update figure |
| DELETE | `/api/figures/<slug>` | Delete figure |
