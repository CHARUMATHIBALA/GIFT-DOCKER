# Docker Setup for Gift Shop MERN Application

## Quick Start

### Development Mode
```bash
# Copy environment file
cp .env.example .env

# Start all services in development mode
docker compose -f docker-compose.dev.yml up --build

# Or run in background
docker compose -f docker-compose.dev.yml up -d --build
```

### Production Mode
```bash
# Copy environment file
cp .env.example .env

# Start all services in production mode
docker compose up --build --detach

# Or run in background
docker compose up -d --build
```

## Services

- **Frontend**: http://localhost:5173 (React + Vite)
- **Backend**: http://localhost:5000 (Node.js + Express)
- **MongoDB**: localhost:27017

## Environment Variables

Copy `.env.example` to `.env` and update as needed:

```bash
# Database
MONGODB_URI=mongodb://admin:password123@localhost:27017/giftshop?authSource=admin

# Backend
NODE_ENV=development
PORT=5000
JWT_SECRET=your_jwt_secret_key_here

# Frontend
VITE_API_URL=http://localhost:5000
```

## Docker Compose Files

- `docker-compose.yml` - Production setup with built frontend
- `docker-compose.dev.yml` - Development setup with hot reload

## Volumes

- `mongo_data` - Persistent MongoDB data storage
- Frontend and backend source code mounted for development

## Networks

All services communicate via `giftshop-network` bridge network.

## Stopping Services

```bash
# Stop all services
docker compose down

# Stop and remove volumes
docker compose down -v
```

## Viewing Logs

```bash
# View all logs
docker compose logs

# View specific service logs
docker compose logs frontend
docker compose logs backend
docker compose logs mongo
```

## Development Workflow

1. Make changes to your code
2. Changes are automatically reflected in running containers
3. Frontend hot-reloads via Vite
4. Backend restarts automatically with nodemon

## Production Deployment

1. Update environment variables in `.env`
2. Run `docker compose up --build --detach`
3. Application will be served from optimized production build
