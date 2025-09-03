# Video Demo Script - EnergeX Microservice Assessment
**Target Duration: 5 minutes**
**Final Version**

---

## 1. INTRODUCTION (0:00 - 0:20)
**[Start on GitHub Repository Page]**

"Hi, I'm walking you through my solution for the EnergeX Full-Stack Assessment. I've built a complete microservice architecture with PHP Lumen, Node.js, Redis caching, MySQL, and React - all containerized with Docker and deployed to production on Render."

---

## 2. ARCHITECTURE OVERVIEW (0:20 - 0:50)
**[Scroll to Architecture Diagram in README]**

"The architecture follows microservice best practices:
- Lumen handles authentication and API endpoints with JWT tokens
- Node.js manages the Redis caching layer for performance optimization  
- MySQL stores our data with proper migrations
- React provides a modern, responsive frontend
- Everything communicates through RESTful APIs"

**[Briefly show Features section]**

"I've implemented all required features plus several bonus items including full CI/CD, comprehensive testing, and production deployment."

---

## 3. CODE STRUCTURE (0:50 - 1:30)
**[Click through folder structure in GitHub]**

"The codebase is organized into distinct services:
- `lumen-api` contains the PHP backend with JWT auth and CRUD operations
- `node-cache-service` handles intelligent caching with automatic invalidation
- `frontend` is our React TypeScript application
- Each service has its own Dockerfile for containerization"

**[Show docker-compose.yml briefly]**

"Docker Compose orchestrates all services locally with a single command."

---

## 4. CI/CD & TESTING (1:30 - 2:00)
**[Click on Actions tab in GitHub]**

"I've set up comprehensive GitHub Actions that run on every push:
- PHPUnit tests for the Lumen API
- Jest tests for the Node.js cache service  
- React component tests
- Full integration testing with all services"

**[Show green checkmarks on recent commits]**

"This ensures code quality and prevents breaking changes from reaching production."

---

## 5. LIVE DEMO - AUTHENTICATION (2:00 - 3:00)
**[Navigate to https://energex-frontend.onrender.com]**

"Here's the live application. I've styled it with a professional terminal aesthetic using a black background, bronze accents, and typewriter fonts to give it that vintage system look."

**[Click Login]**

"Users can register and authenticate. The system uses JWT tokens stored in localStorage."

**[Register a new user or login with existing]**

"Once authenticated, the JWT token is automatically included in all API requests."

---

## 6. LIVE DEMO - POSTS FUNCTIONALITY (3:00 - 4:00)
**[Navigate to Posts page after login]**

"The main feature is the posts system. Users can create, view, and manage posts."

**[Create a new post]**

"When I create a post, it's immediately stored in MySQL and cached in Redis for fast retrieval."

**[Show the post appearing in the list]**

"The caching layer significantly improves performance - subsequent requests are served from Redis with a 10-minute TTL."

**[Click on a post to view details]**

"Each post shows the author, timestamp, and full content. Only post authors can edit or delete their own posts."

---

## 7. TECHNICAL HIGHLIGHTS (4:00 - 4:40)
**[Navigate back to GitHub README, scroll to API Endpoints section]**

"The API is fully RESTful with proper status codes and error handling. All endpoints requiring authentication validate JWT tokens."

**[Scroll to Performance Optimization section]**

"Performance optimizations include:
- Redis caching on all GET requests
- Database indexing on foreign keys
- Multi-stage Docker builds for smaller images
- Production builds served through Nginx"

**[Scroll to Security Features]**

"Security is built-in with bcrypt password hashing, CORS protection, input validation, and SQL injection prevention through Eloquent ORM."

---

## 8. DEPLOYMENT & CLOSING (4:40 - 5:00)
**[Show Render dashboard if possible, or point to Production Deployment section]**

"The entire stack is deployed on Render with:
- Automatic deployments on git push
- PostgreSQL for production database
- Environment-based configuration
- Zero-downtime deployments"

**[Back to live site]**

"This solution demonstrates my ability to build scalable microservices, implement modern DevOps practices, and deliver production-ready applications. The code is clean, well-tested, and follows industry best practices."

"Thank you for reviewing my assessment. I'm excited to discuss the technical decisions and architecture choices in more detail."

---

## TIPS FOR RECORDING:
- Speak clearly and at a moderate pace
- Keep mouse movements smooth and deliberate
- Have tabs already open: GitHub repo, Live site
- Test login credentials beforehand
- Keep energy up but professional
- If you make a mistake, just continue - it's more natural