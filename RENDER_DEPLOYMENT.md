# Deploying to Render

## Prerequisites
- Render account (sign up at https://render.com)
- GitHub repository connected to Render

## Deployment Steps

### 1. Push Latest Changes
```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### 2. Deploy to Render

#### Option A: Using render.yaml (Blueprint) - Recommended
1. Go to https://dashboard.render.com/blueprints
2. Click "New Blueprint Instance"
3. Connect your GitHub repository
4. Select your repository: `Alokothro/energex-fullstack-assessment`
5. Click "Apply"
6. Render will automatically create all services from render.yaml

#### Option B: Manual Service Creation
If the blueprint doesn't work, create services manually:

##### 1. Create PostgreSQL Database
- New > PostgreSQL
- Name: `energex-db`
- Region: Oregon (US West)
- Plan: Free
- Click "Create Database"

##### 2. Create Redis Instance
- New > Redis
- Name: `energex-redis`
- Region: Oregon (US West)
- Plan: Free
- Click "Create Redis"

##### 3. Deploy Lumen API
- New > Web Service
- Connect GitHub repo
- Name: `energex-api`
- Root Directory: `lumen-api`
- Environment: Docker
- Build Command: (leave default)
- Start Command: (leave default)
- Add environment variables:
  ```
  APP_ENV=production
  APP_DEBUG=false
  DB_CONNECTION=pgsql
  JWT_SECRET=(click Generate)
  JWT_ALGO=HS256
  CACHE_DRIVER=redis
  ```
- Connect to PostgreSQL database
- Connect to Redis instance
- Click "Create Web Service"

##### 4. Deploy Node Cache Service
- New > Web Service
- Name: `energex-cache`
- Root Directory: `node-cache-service`
- Environment: Docker
- Add environment variables:
  ```
  NODE_ENV=production
  PORT=3001
  DB_CONNECTION=pgsql
  ```
- Connect to PostgreSQL and Redis
- Click "Create Web Service"

##### 5. Deploy React Frontend
- New > Static Site
- Name: `energex-frontend`
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `build`
- Add environment variables:
  ```
  REACT_APP_API_URL=https://energex-api.onrender.com
  REACT_APP_CACHE_URL=https://energex-cache.onrender.com
  ```
- Click "Create Static Site"

### 3. Run Database Migrations
Once the API service is deployed:

1. Go to your API service dashboard in Render
2. Click "Shell" tab
3. Run:
```bash
php artisan migrate --force
```

### 4. Update Frontend API URLs
After all services are deployed, update the frontend environment variables with the actual URLs:
- Go to Frontend service > Environment
- Update `REACT_APP_API_URL` with your API URL
- Update `REACT_APP_CACHE_URL` with your cache service URL
- Redeploy the frontend

## Service URLs
After deployment, your services will be available at:
- Frontend: `https://energex-frontend.onrender.com`
- API: `https://energex-api.onrender.com`
- Cache: `https://energex-cache.onrender.com`

## Important Notes

### Free Tier Limitations
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- Limited to 750 hours/month across all services
- PostgreSQL free tier: 256MB storage
- Redis free tier: 25MB memory

### Production Considerations
For a production app, you should:
1. Use paid instances to avoid spin-downs
2. Set up custom domain
3. Configure SSL certificates
4. Add monitoring (Sentry, LogRocket)
5. Set up backups for PostgreSQL
6. Use environment-specific secrets

## Troubleshooting

### Database Connection Issues
- Render uses PostgreSQL, not MySQL
- Make sure `DB_CONNECTION=pgsql` is set
- Database URL format: `postgresql://user:password@host:port/database`

### CORS Errors
- Verify CORS middleware is enabled
- Check that frontend URLs are correct
- Ensure API allows requests from frontend domain

### Build Failures
- Check build logs in Render dashboard
- Ensure all dependencies are in package.json/composer.json
- Verify Dockerfile paths are correct

### Redis Connection Issues
- Check Redis URL format
- Ensure Redis instance is in same region
- Verify connection string in environment variables

## Support
- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
- GitHub Issues: https://github.com/Alokothro/energex-fullstack-assessment/issues