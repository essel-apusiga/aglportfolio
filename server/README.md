# Backend Server - Deployment Ready

This backend server is now configured and ready for production deployment.

## Quick Start (Development)

```bash
npm install
npm run dev
```

The server will run on `http://localhost:5000` and look for MongoDB connection string in `.env`.

## Build & Run (Production)

```bash
npm install
npm run build
npm start
```

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions for:
- Vercel (recommended for full-stack)
- Heroku
- AWS EC2
- DigitalOcean
- Any Node.js hosting

## Environment Setup

1. Copy `.env.example` to `.env` (development only)
2. Add your MongoDB Atlas connection string to `MONGODB_URI`
3. For production, set environment variables in your hosting platform

Example for development (`server/.env`):
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

## Key Features

✅ **Graceful Shutdown** - Properly handles SIGTERM/SIGINT signals  
✅ **Error Handling** - Global error handler and 404 responses  
✅ **Request Logging** - All requests logged with timestamps  
✅ **Health Checks** - `/api/health` endpoint for monitoring  
✅ **Database Resilience** - Returns 503 when DB unavailable instead of crashing  
✅ **Production Timeouts** - Optimized connection timeouts for production  
✅ **CORS Enabled** - Cross-origin requests allowed (configure for production)  

## API Endpoints

### Public Endpoints
- `GET /api/site-config` - Get published website config
- `GET /api/site-config/sections` - Get all published sections
- `GET /api/site-config/section/:sectionName` - Get specific published section

### CMS Endpoints (Admin)
- `GET /api/cms/config` - Get draft config
- `PUT /api/cms/config` - Update entire draft config
- `PATCH /api/cms/section/:sectionName` - Update specific section
- `PATCH /api/cms/nav-links` - Update navigation links
- `PATCH /api/cms/section-order` - Update section order
- `POST /api/cms/publish` - Publish draft to production
- `POST /api/cms/reset-draft` - Reset draft to published
- `POST /api/cms/reset-all` - Reset all config to defaults

### Health & Status
- `GET /api/health` - Server and database health status

## Technology Stack

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with native driver
- **Port**: 5000 (configurable)
- **Node Version**: 18+ LTS

## Development Commands

```bash
npm run dev      # Watch mode with hot reload
npm run build    # Compile TypeScript
npm start        # Run compiled files
```

## Troubleshooting

See the [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting-deployment) section for common issues and solutions.

## Next Steps

1. ✅ Backend code is production-ready
2. 🔄 Configure MongoDB Atlas connection string
3. 🚀 Deploy to your hosting platform using instructions in [DEPLOYMENT.md](./DEPLOYMENT.md)
4. 📊 Set up monitoring and error tracking
5. 🔐 Restrict CORS origin in production (see DEPLOYMENT.md)
