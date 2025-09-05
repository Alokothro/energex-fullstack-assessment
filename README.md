# EnergeX Fullstack Assessment

A comprehensive microservice architecture with Lumen (PHP), Node.js (TypeScript), Redis caching, MySQL database, and React.js frontend.
Video showcasing my solution: https://www.loom.com/share/54c535511dfa4b819f35b7c04058028c?sid=6dfee5d4-50b5-44c6-be1e-5a04aa27ea1e

## 🎥 Video Demo

**Watch my solution walkthrough:** [https://www.loom.com/share/54c535511dfa4b819f35b7c04058028c?sid=6dfee5d4-50b5-44c6-be1e-5a04aa27ea1e](https://www.loom.com/share/54c535511dfa4b819f35b7c04058028c?sid=6dfee5d4-50b5-44c6-be1e-5a04aa27ea1e)

## Architecture Overview

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   React.js  │────▶│  Lumen API   │────▶│    MySQL    │
│   Frontend  │     │   (PHP/JWT)  │     │   Database  │
└─────────────┘     └──────────────┘     └─────────────┘
       │                    │
       │                    ▼
       │            ┌──────────────┐
       └───────────▶│     Redis    │
                    │     Cache    │
                    └──────────────┘
                            ▲
                            │
                    ┌──────────────┐
                    │   Node.js    │
                    │ Cache Service│
                    └──────────────┘
```

## Features

### Backend (Lumen - PHP)
- ✅ RESTful API with JWT authentication
- ✅ User registration and login
- ✅ CRUD operations for posts
- ✅ Redis caching integration
- ✅ MySQL database with migrations
- ✅ PHPUnit tests

### Caching Layer (Node.js - TypeScript)
- ✅ Redis cache management
- ✅ Automatic cache invalidation
- ✅ Database fallback when cache misses
- ✅ Performance optimization
- ✅ Jest tests

### Frontend (React.js)
- ✅ User authentication UI
- ✅ Post creation and viewing
- ✅ Responsive design
- ✅ Real-time updates
- ✅ TypeScript support

### DevOps
- ✅ Docker containerization
- ✅ Docker Compose orchestration
- ✅ GitHub Actions CI/CD
- ✅ Automated testing
- ✅ Render.com deployment support
- ✅ PostgreSQL and MySQL support

## Quick Start

### Prerequisites
- Node.js 18+ (for frontend)
- Docker and Docker Compose (only for local backend development)
- PHP 8.2+ and Composer (only for local backend development)

### Quick Start - Frontend Only (Easiest)

1. Clone the repository:
```bash
git clone https://github.com/Alokothro/energex-fullstack-assessment.git
cd energex-fullstack-assessment/frontend
```

2. Install dependencies and start:
```bash
npm install
npm start
```

3. Access the application at http://localhost:3000
   - The frontend automatically connects to the live deployed backend
   - No Docker or backend setup required!

### Running Full Stack with Docker (Advanced)

1. Clone the repository:
```bash
git clone https://github.com/Alokothro/energex-fullstack-assessment.git
cd energex-fullstack-assessment
```

2. Copy environment files:
```bash
cp lumen-api/.env.example lumen-api/.env
cp node-cache-service/.env.example node-cache-service/.env
```

3. Start all services:
```bash
docker-compose up -d
```

4. Run database migrations:
```bash
docker-compose exec lumen-api php artisan migrate
```

5. Access the applications:
- Frontend: http://localhost:3000

**Note**: The frontend connects to the live deployed APIs by default. To use local backend services:
- Lumen API: http://localhost:8000 (requires Docker running)
- Node Cache Service: http://localhost:3001 (requires Docker running)
- Update `frontend/.env.local` to point to local URLs

## Production Deployment (Render.com)

### Live Application
- Frontend: https://energex-frontend.onrender.com
- Backend: https://energex-assessment.onrender.com
- API: https://energex-api.onrender.com/api
- Cache Service: https://energex-cache.onrender.com

### Deploying to Render

1. **Create PostgreSQL Database** in Render Dashboard
   - Name: `energex-db`
   - Plan: Free tier

2. **Deploy Lumen API** (Web Service)
   - Root Directory: `./lumen-api`
   - Runtime: Docker
   - Environment Variables:
     ```
     APP_ENV=production
     DB_CONNECTION=pgsql
     DATABASE_URL=(from PostgreSQL)
     JWT_SECRET=(generate secure key)
     JWT_ALGO=HS256
     CACHE_DRIVER=array
     ```

3. **Deploy Node Cache Service** (Web Service)
   - Root Directory: `./node-cache-service`
   - Runtime: Docker
   - Environment Variables:
     ```
     NODE_ENV=production
     PORT=3001
     DB_CONNECTION=pgsql
     DATABASE_URL=(from PostgreSQL)
     ```

4. **Deploy React Frontend** (Static Site)
   - Root Directory: `./frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`
   - Environment Variables:
     ```
     REACT_APP_API_URL=https://energex-api.onrender.com/api
     ```

5. **Run Migrations** in API service Shell:
   ```bash
   php artisan migrate --force
   ```

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Authenticate user and get JWT token |
| GET | `/api/me` | Get current user info (requires auth) |
| POST | `/api/logout` | Logout user (requires auth) |
| POST | `/api/refresh` | Refresh JWT token (requires auth) |

### Posts Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get all posts (cached) |
| GET | `/api/posts/{id}` | Get single post (cached) |
| POST | `/api/posts` | Create new post (requires auth) |
| PUT | `/api/posts/{id}` | Update post (requires auth) |
| DELETE | `/api/posts/{id}` | Delete post (requires auth) |

### Cache Service Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cache/posts` | Get cached posts |
| GET | `/cache/posts/{id}` | Get cached single post |
| DELETE | `/cache/flush` | Clear all cache |

## Testing

### Run Lumen Tests
```bash
docker-compose exec lumen-api vendor/bin/phpunit
```

### Run Node.js Tests
```bash
docker-compose exec node-cache npm test
```

### Run Frontend Tests
```bash
docker-compose exec frontend npm test
```

### Run All Tests (CI/CD)
```bash
# Tests run automatically on push via GitHub Actions
```

## Development

### Local Development Setup

#### Lumen API
```bash
cd lumen-api
composer install
cp .env.example .env
php artisan migrate
php -S localhost:8000 -t public
```

#### Node.js Cache Service
```bash
cd node-cache-service
npm install
npm run dev
```

#### React Frontend
```bash
cd frontend
npm install
npm start
```

## Environment Variables

### Lumen API (.env)
```env
APP_NAME=Lumen
APP_ENV=local
APP_DEBUG=true

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=microservice_db
DB_USERNAME=app_user
DB_PASSWORD=app_password

CACHE_DRIVER=redis
REDIS_HOST=redis
REDIS_PORT=6379

JWT_SECRET=your-secret-key-here
JWT_TTL=60
```

### Node.js Service (.env)
```env
PORT=3001
REDIS_HOST=redis
REDIS_PORT=6379

MYSQL_HOST=mysql
MYSQL_PORT=3306
MYSQL_DATABASE=microservice_db
MYSQL_USER=app_user
MYSQL_PASSWORD=app_password

CACHE_TTL=600
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Posts Table
```sql
CREATE TABLE posts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Performance Optimization

- **Redis Caching**: All GET requests are cached with 10-minute TTL
- **Database Indexing**: Foreign keys and unique constraints are indexed
- **Docker Optimization**: Multi-stage builds reduce image size
- **Frontend Optimization**: Production builds are served via Nginx

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt hashing for passwords
- **CORS Protection**: Configured CORS middleware
- **Input Validation**: Request validation on all endpoints
- **SQL Injection Prevention**: Prepared statements and Eloquent ORM

## CI/CD Pipeline

GitHub Actions workflow includes:
1. **Lumen Tests**: PHPUnit tests with MySQL and Redis
2. **Node.js Tests**: Jest tests with coverage
3. **Frontend Tests**: React testing library
4. **Docker Build**: Validates Docker images
5. **Integration Tests**: Full stack testing

## Troubleshooting

### Common Issues

1. **Port Already in Use**
```bash
# Change ports in docker-compose.yml or stop conflicting services
docker-compose down
sudo lsof -i :3000  # Check what's using the port
```

2. **Database Connection Failed**
```bash
# Ensure MySQL container is running
docker-compose ps
docker-compose logs mysql
```

3. **Redis Connection Failed**
```bash
# Check Redis container
docker-compose logs redis
docker-compose restart redis
```

4. **Permission Issues**
```bash
# Fix storage permissions for Lumen
docker-compose exec lumen-api chmod -R 777 storage
```

## Bonus Features Implemented

- ✅ Docker containerization
- ✅ CI/CD with GitHub Actions
- ✅ Comprehensive testing (PHPUnit, Jest)
- ✅ TypeScript for type safety
- ✅ Redis caching with TTL
- ✅ JWT refresh tokens
- ✅ CORS configuration
- ✅ Production deployment on Render.com
- ✅ PostgreSQL and MySQL database support
- ✅ Automated deployments on push
- ✅ Environment-based configuration

## License

This project is created for assessment purposes.

## Author

Created as part of the EnergeX AI Full-Stack Developer Technical Assessment.
