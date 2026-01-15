# client-backend

Express.js backend for client application with PostgreSQL database and JWT authentication.

## Tech Stack

- **Runtime:** Node.js (v20+)
- **Framework:** Express.js (v4.18.2)
- **Database:** PostgreSQL with Drizzle ORM (v0.45.1)
- **ORM:** Drizzle ORM with @neondatabase/serverless
- **Authentication:** JWT (jsonwebtoken v9.0.3) with bcryptjs (v3.0.3)
- **Containerization:** Docker & Docker Compose
- **Validation:** validator (v13.15.26)

## Prerequisites

- Node.js (v20+)
- Docker and Docker Compose
- PostgreSQL database (optional - Docker provides it)


## Installation

### Option 1: Docker (Recommended)

```bash
# Copy docker-compose template
cp docker-compose.example.yml docker-compose.yml

# Start containers (development mode with hot reload)
npm run docker:up

# View logs
npm run docker:logs

# Stop containers
npm run docker:down
```

### Option 2: Local Development

```bash
# Install dependencies
npm install

# Copy docker-compose template (if using Docker for database)
cp docker-compose.example.yml docker-compose.yml

# Start PostgreSQL via Docker
docker compose up -d db

# Create .env file with your local PostgreSQL credentials
cat > .env << EOF
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/client_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=3000
NODE_ENV=development
EOF

# Start development server with hot reload
npm run dev
```

## Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration (Docker)
DATABASE_URL=postgres://postgres:postgres@db:5432/client_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Docker Commands

```bash
# Start all services
npm run docker:up

# Start with fresh rebuild
npm run docker:rebuild

# View all logs
npm run docker:logs

# View app logs only
npm run docker:logs:app

# View database logs only
npm run docker:logs:db

# Restart services
npm run docker:restart

# Stop all services
npm run docker:stop

# Stop and remove volumes (data loss!)
npm run docker:down -v
```

## Database Commands

```bash
# Run migrations
npm run db:migrate

# Generate new migration
npm run db:generate

# Push schema changes
npm run db:push

# Open Drizzle Studio
npm run db:studio
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with hot reload |
| `npm run format` | Format code with Prettier |
| `npm run docker:up` | Start Docker containers |
| `npm run docker:down` | Stop Docker containers |
| `npm run docker:logs` | View container logs |
| `npm run docker:rebuild` | Rebuild and start containers |
| `npm run db:migrate` | Run database migrations |
| `npm run db:generate` | Generate new migration |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Drizzle Studio |

## API Endpoints



| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| POST | `/api/auth/request` | Request Otp |
| POST | `/api/otp/verify` | Validate Otp |
