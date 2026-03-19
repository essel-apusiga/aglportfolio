# Backend Deployment Guide

This guide explains how to deploy the AGL Portfolio backend server to production environments.

## Prerequisites

- Node.js 18+ (LTS recommended)
- MongoDB Atlas account or MongoDB instance
- Hosting platform (Vercel, Heroku, AWS, DigitalOcean, etc.)
- Git and npm/yarn

## Build Process

The backend uses TypeScript and compiles to JavaScript before running:

```bash
npm run build    # Compiles TypeScript to ./dist
npm run start    # Runs compiled JavaScript
npm run dev      # Development with hot reload (uses tsx)
```

## Environment Variables

Create environment variables for your production environment. The backend requires:

### Required Variables

- **MONGODB_URI** - MongoDB connection string
  - Format: `mongodb+srv://username:password@cluster.mongodb.net` (SRV)
  - Or: `mongodb://host1,host2/database` (standard)
  - Must be URL-encoded for special characters in password

- **PORT** (optional) - Server port, defaults to 5000
  - Platform may override this (e.g., Vercel uses PORT from environment)

- **NODE_ENV** (optional) - Set to `production` for production deployments
  - Controls timeout behaviors and error stack traces

- **MONGODB_DB_NAME** (optional) - Database name, defaults to `aglportfolio`

### Example Configuration

For **MongoDB Atlas**:
```
MONGODB_URI=mongodb+srv://user:password@cluster0.xyz.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=aglportfolio
NODE_ENV=production
```

For **Local MongoDB**:
```
MONGODB_URI=mongodb://localhost:27017/aglportfolio
NODE_ENV=production
```

## MongoDB Connection Details

The backend uses MongoDB native driver with production-optimized settings:

- **Production timeouts**: 10s (serverSelection), 15s (connect), 45s (socket)
- **Development timeouts**: 5s (serverSelection, connect, socket)
- **Retries**: Enabled with `retryWrites: true`
- **Write concern**: Majority (w: 'majority')

### MongoDB Atlas Setup

1. Create a cluster at https://cloud.mongodb.com
2. Create a database user with username/password
3. Add IP whitelist: If your server has a static IP, add it. For serverless (Vercel, Functions), use `0.0.0.0/0`
4. Generate connection string and set as `MONGODB_URI`

**Important**: MongoDB Atlas may reject SRV DNS lookups if network access is improperly configured. If you see `querySrv ECONNREFUSED`, check:
- Cluster is running
- IP whitelist includes your server's IP
- Network access is enabled for your region

Alternative: Use a standard MongoDB URI without SRV (`mongodb://...`) if SRV DNS fails.

## Graceful Shutdown

The server handles graceful shutdown for clean deployment restarts:

- Listens for `SIGTERM` and `SIGINT` signals
- Closes HTTP server, stops accepting new requests
- Waits up to 30 seconds for existing connections to close
- Forces exit after timeout

Most production platforms send `SIGTERM` before restarting (Vercel, Heroku, etc.).

## Health Check Endpoint

The server provides a health check endpoint for monitoring:

```
GET /api/health
```

**Response (Success)**:
```json
{
  "status": "ok",
  "message": "Server is running",
  "cmsStoreStatus": "ready",
  "cmsStoreError": null
}
```

**Response (DB Unavailable)**:
```json
{
  "status": "degraded",
  "message": "Server is running, but CMS data store is unavailable",
  "cmsStoreStatus": "unavailable",
  "cmsStoreError": "Connection timeout"
}
```

Use this endpoint in your deployment platform's health check settings.

## Deployment to Vercel (Recommended for Full-Stack)

If deploying the entire project to Vercel (which is likely for your setup):

1. The root `vercel.json` already handles frontend build
2. Create a serverless function or separate backend project

**For a separate Vercel Backend Project**:

1. Create `vercel.json` in the `server/` directory:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "functions": {
    "src/index.ts": {
      "runtime": "nodejs18.x"
    }
  }
}
```

2. Push to GitHub, connect to Vercel
3. Set environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `NODE_ENV=production`
   - `MONGODB_DB_NAME`

4. Vercel will:
   - Install dependencies
   - Run `npm run build`
   - Deploy compiled files

**Note**: Vercel has request timeout limits (10-60 seconds depending on plan). Long-running operations may timeout.

## Deployment to Heroku

1. Create a Procfile in `server/`:
```
web: npm run start
```

2. Add package.json build script (already present):
```json
"build": "tsc"
```

3. Push to Heroku:
```bash
git push heroku main
```

4. Set environment variables:
```bash
heroku config:set MONGODB_URI="your-connection-string"
heroku config:set NODE_ENV=production
```

## Deployment to AWS (EC2)

1. SSH into your EC2 instance
2. Clone your repository
3. Install Node.js and npm
4. Install MongoDB (or use MongoDB Atlas)
5. Navigate to `server/` directory
6. Install dependencies: `npm install`
7. Build: `npm run build`
8. Set environment variables in systemd service or `.env`
9. Start with PM2 or systemd:

**Using PM2**:
```bash
npm install -g pm2
pm2 start "npm start" --name=aglportfolio-server
pm2 save
```

**Using systemd** (create `/etc/systemd/system/aglportfolio.service`):
```ini
[Unit]
Description=AGL Portfolio Server
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/businessportfolio/server
ExecStart=/usr/bin/node dist/index.js
Restart=on-failure
RestartSec=5s
Environment="MONGODB_URI=your-connection-string"
Environment="NODE_ENV=production"

[Install]
WantedBy=multi-user.target
```

Start: `sudo systemctl start aglportfolio`

## Monitoring & Logging

The server logs to stdout:

- Request logging with timestamps: `[2026-03-18T10:30:45.123Z] GET /api/health`
- Error logging with stack traces (development only)
- Startup messages: database connection status

**Production Setup**:
- Use centralized logging (Datadog, New Relic, CloudWatch, ELK)
- Set up alerts for error rates and response times
- Monitor health check endpoint
- Track database connection failures

## Rollback & Versioning

- Use git tags for releases: `git tag v1.0.0`
- Keep previous build artifacts
- Test deployments in staging first
- Use blue-green deployments for zero downtime

## Security Considerations

1. **CORS**: Currently allows all origins. For production, restrict:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL, // e.g., 'https://yourdomain.com'
  credentials: true
}));
```

2. **MongoDB Credentials**: Never commit `.env` files or connection strings
3. **Rate Limiting**: Consider adding rate limiting middleware for production
4. **HTTPS**: Always use HTTPS in production (handled by platform)
5. **API Keys**: If needed, implement authentication/API key validation

## Database Backup Strategy

For MongoDB Atlas:
- Automated backups are included with paid plans
- Configure backup frequency and retention
- Test restore procedures regularly

For self-hosted MongoDB:
- Implement automated backup scripts
- Use `mongodump` for backups
- Store backups off-server

## Performance Optimization

1. **Database Indexes**: Ensure MongoDB indexes are created:
```javascript
db.site_state.createIndex({ key: 1 }, { unique: true })
```

2. **Connection Pooling**: MongoDB driver handles this automatically
3. **Caching**: Consider caching published config in Redis for high traffic
4. **Compression**: Enable gzip compression:
```typescript
import compression from 'compression';
app.use(compression());
```

## Troubleshooting Deployment

### Server won't start
- Check Node.js version: `node --version` (needs 18+)
- Check package-lock.json is in git
- Verify build output: `npm run build` locally
- Check logs for error messages

### Database connection fails
- Verify MONGODB_URI is correct
- Check MongoDB cluster is running
- Verify IP whitelist includes server IP
- Try standard MongoDB URI if SRV DNS fails
- Test locally with same connection string

### Health check returns degraded
- Connection failures are normal during startup (retries continue)
- If persistent, check MongoDB connectivity
- Server remains operational but CMS endpoints return 503

### Slow requests or timeouts
- Check database query performance
- Add MongoDB indexes
- Consider database optimization
- Check network latency to database

## Scaling Considerations

For high traffic:
- Load balancing across multiple instances
- Use MongoDB connection pooling
- Implement Redis caching for published config
- Consider CDN for static frontend assets
- Database sharding if data grows large

## Next Steps

1. Get MongoDB Atlas credentials
2. Test locally with production connection string
3. Build the frontend with the correct backend URL
4. Set up monitoring and alerts
5. Plan rollback procedures
6. Document your deployment process
