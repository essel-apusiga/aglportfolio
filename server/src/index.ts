import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { isContactEmailConfigured, sendContactEmail, validateContactMessage } from './contactEmail';
import { listContactMessages, saveContactMessage } from './contactMessages';
import { listReviews, saveReview, validateReview } from './reviews';
import {
  getDraftSiteConfig,
  getSiteConfig,
  getSiteStateMeta,
  loadSiteConfig,
  persistSiteConfig,
  publishDraftSiteConfig,
  resetAllSiteConfig,
  resetDraftSiteConfig,
  type SectionKey,
  type SiteConfig,
} from './siteConfig';

const app = express();
const PORT = process.env.PORT || 5000;

// Request logging middleware for monitoring
app.use((req, _res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

const editableSections = ['header', 'hero', 'about', 'products', 'team', 'location', 'footer'] as const;
type EditableSection = (typeof editableSections)[number];
const readableSectionAliases = {
  header: 'header',
  home: 'hero',
  hero: 'hero',
  about: 'about',
  products: 'products',
  team: 'team',
  contact: 'location',
  location: 'location',
  footer: 'footer',
  order: 'sectionOrder',
  'section-order': 'sectionOrder',
} as const;
type ReadableSectionAlias = keyof typeof readableSectionAliases;
type ReadableSection = (typeof readableSectionAliases)[ReadableSectionAlias];

let cmsStoreStatus: 'ready' | 'unavailable' = 'unavailable';
let cmsStoreError: string | null = null;

app.use(cors());
app.use(express.json());

async function ensureCmsStoreReady() {
  try {
    await loadSiteConfig();
    cmsStoreStatus = 'ready';
    cmsStoreError = null;
    return true;
  } catch (error) {
    cmsStoreStatus = 'unavailable';
    cmsStoreError = error instanceof Error ? error.message : 'Unknown CMS data store error.';
    return false;
  }
}

app.use('/api', async (req, res, next) => {
  if (
    req.path === '/health' ||
    req.path === '/contact' ||
    req.path.startsWith('/reviews')
  ) {
    next();
    return;
  }

  const isReady = await ensureCmsStoreReady();
  if (!isReady) {
    res.status(503).json({
      error: 'CMS data store is unavailable.',
      details: cmsStoreError,
    });
    return;
  }

  next();
});

function isSiteConfig(value: unknown): value is SiteConfig {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<SiteConfig>;
  return Boolean(candidate.header && candidate.hero && candidate.products && candidate.team && candidate.location && candidate.footer);
}

function isSectionOrder(value: unknown): value is SectionKey[] {
  const allowed: SectionKey[] = ['home', 'about', 'products', 'team', 'contact'];

  if (!Array.isArray(value) || value.length !== allowed.length) {
    return false;
  }

  if (!value.every((item): item is SectionKey => typeof item === 'string' && allowed.includes(item as SectionKey))) {
    return false;
  }

  return new Set(value).size === allowed.length;
}

function isEditableSection(value: string): value is EditableSection {
  return editableSections.includes(value as EditableSection);
}

function resolveReadableSection(value: string): ReadableSection | null {
  const lowered = value.toLowerCase() as ReadableSectionAlias;
  return readableSectionAliases[lowered] ?? null;
}

function getSectionData(config: SiteConfig, section: ReadableSection) {
  if (section === 'sectionOrder') {
    return config.sectionOrder;
  }

  return config[section];
}

function sectionsPayload(config: SiteConfig) {
  return {
    header: config.header,
    home: config.hero,
    hero: config.hero,
    about: config.about,
    products: config.products,
    team: config.team,
    contact: config.location,
    location: config.location,
    footer: config.footer,
    sectionOrder: config.sectionOrder,
  };
}

function resolveEditableSection(value: string): EditableSection | null {
  const resolved = resolveReadableSection(value);
  if (!resolved || resolved === 'sectionOrder') {
    return null;
  }

  return isEditableSection(resolved) ? resolved : null;
}

async function saveDraftConfig(nextConfig: SiteConfig, res: express.Response) {
  try {
    const saved = await persistSiteConfig(nextConfig);
    res.json({
      config: saved,
      meta: getSiteStateMeta(),
    });
  } catch {
    res.status(500).json({ error: 'Failed to persist draft config.' });
  }
}

// Public website endpoint (published content).
app.get('/api/site-config', (_req, res) => {
  res.json(getSiteConfig());
});

app.post('/api/contact', async (req, res) => {
  if (!validateContactMessage(req.body)) {
    res.status(400).json({ error: 'Invalid contact message payload.' });
    return;
  }

  let emailSent = false;

  try {
    if (isContactEmailConfigured()) {
      await sendContactEmail(req.body);
      emailSent = true;
    }
  } catch (error) {
    console.error('Failed to send contact email (message still saved).', error);
  }

  try {
    await saveContactMessage(req.body, emailSent);
  } catch (error) {
    console.error('Failed to save contact message to database.', error);
    res.status(500).json({ error: 'Failed to save your message. Please try again.' });
    return;
  }

  res.status(202).json({ success: true, message: "Your message has been received. We'll get back to you soon!" });
});

// Public: GET customer reviews (paginated)
app.get('/api/reviews', async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const skip = Math.max(Number(req.query.skip) || 0, 0);
  try {
    const result = await listReviews(limit, skip);
    res.json(result);
  } catch (error) {
    console.error('Failed to fetch reviews.', error);
    res.status(500).json({ error: 'Failed to fetch reviews.' });
  }
});

// Public: POST a new customer review
app.post('/api/reviews', async (req, res) => {
  if (!validateReview(req.body)) {
    res.status(400).json({
      error: 'Invalid review. Rating (1–5) is required. Name and comment are optional (max 120 / 2000 chars).',
    });
    return;
  }
  try {
    const saved = await saveReview(req.body);
    res.status(201).json({ success: true, review: saved });
  } catch (error) {
    console.error('Failed to save review.', error);
    res.status(500).json({ error: 'Failed to save your review. Please try again.' });
  }
});

app.get('/api/site-config/sections', (_req, res) => {
  const config = getSiteConfig();
  res.json({
    sections: sectionsPayload(config),
    meta: getSiteStateMeta(),
  });
});

app.get('/api/site-config/section-order', (_req, res) => {
  const config = getSiteConfig();
  res.json({
    sectionOrder: config.sectionOrder,
    meta: getSiteStateMeta(),
  });
});

app.get('/api/site-config/section/:sectionName', (req, res) => {
  const resolved = resolveReadableSection(req.params.sectionName);
  if (!resolved) {
    res.status(404).json({ error: 'Unknown section.' });
    return;
  }

  const config = getSiteConfig();
  res.json({
    sectionName: req.params.sectionName,
    resolvedSection: resolved,
    data: getSectionData(config, resolved),
    meta: getSiteStateMeta(),
  });
});

// CMS endpoints for editing draft content and previewing changes.
app.get('/api/cms/config', (_req, res) => {
  res.json({
    config: getDraftSiteConfig(),
    meta: getSiteStateMeta(),
  });
});

// CMS: list submitted contact messages (admin)
app.get('/api/cms/contacts', async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  const skip = Math.max(Number(req.query.skip) || 0, 0);
  try {
    const result = await listContactMessages(limit, skip);
    res.json(result);
  } catch (error) {
    console.error('Failed to list contact messages.', error);
    res.status(500).json({ error: 'Failed to fetch contact messages.' });
  }
});

app.get('/api/cms/state', (_req, res) => {
  res.json({
    draft: getDraftSiteConfig(),
    published: getSiteConfig(),
    meta: getSiteStateMeta(),
  });
});

app.get('/api/cms/sections', (_req, res) => {
  const config = getDraftSiteConfig();
  res.json({
    sections: sectionsPayload(config),
    meta: getSiteStateMeta(),
  });
});

app.get('/api/cms/section-order', (_req, res) => {
  const config = getDraftSiteConfig();
  res.json({
    sectionOrder: config.sectionOrder,
    meta: getSiteStateMeta(),
  });
});

app.get('/api/cms/section/:sectionName', (req, res) => {
  const resolved = resolveReadableSection(req.params.sectionName);
  if (!resolved) {
    res.status(404).json({ error: 'Unknown section.' });
    return;
  }

  const config = getDraftSiteConfig();
  res.json({
    sectionName: req.params.sectionName,
    resolvedSection: resolved,
    data: getSectionData(config, resolved),
    meta: getSiteStateMeta(),
  });
});

app.get('/api/cms/preview', (_req, res) => {
  res.json({
    config: getDraftSiteConfig(),
    meta: getSiteStateMeta(),
  });
});

app.put('/api/cms/config', async (req, res) => {
  if (!isSiteConfig(req.body)) {
    res.status(400).json({ error: 'Invalid site config payload.' });
    return;
  }

  await saveDraftConfig(req.body, res);
});

app.patch('/api/cms/nav-links', async (req, res) => {
  const { navLinks } = req.body as { navLinks?: SiteConfig['header']['navLinks'] };

  if (!Array.isArray(navLinks)) {
    res.status(400).json({ error: 'Invalid nav links payload.' });
    return;
  }

  const current = getDraftSiteConfig();
  await saveDraftConfig(
    {
      ...current,
      header: {
        ...current.header,
        navLinks,
      },
    },
    res,
  );
});

app.patch('/api/cms/section-order', async (req, res) => {
  const { sectionOrder } = req.body as { sectionOrder?: SectionKey[] };

  if (!isSectionOrder(sectionOrder)) {
    res.status(400).json({ error: 'Invalid section order payload.' });
    return;
  }

  const current = getDraftSiteConfig();
  await saveDraftConfig(
    {
      ...current,
      sectionOrder,
    },
    res,
  );
});

app.patch('/api/cms/section/:sectionName', async (req, res) => {
  const resolvedSection = resolveEditableSection(req.params.sectionName);
  if (!resolvedSection) {
    res.status(404).json({ error: 'Unknown section.' });
    return;
  }

  const sectionPayload = req.body as SiteConfig[EditableSection];
  if (!sectionPayload || typeof sectionPayload !== 'object') {
    res.status(400).json({ error: 'Invalid section payload.' });
    return;
  }

  const current = getDraftSiteConfig();
  const nextConfig: SiteConfig = {
    ...current,
    [resolvedSection]: sectionPayload,
  };

  await saveDraftConfig(nextConfig, res);
});

app.post('/api/cms/publish', async (_req, res) => {
  try {
    const published = await publishDraftSiteConfig();
    res.json({
      config: published,
      meta: getSiteStateMeta(),
    });
  } catch {
    res.status(500).json({ error: 'Failed to publish draft config.' });
  }
});

app.post('/api/cms/reset-draft', async (_req, res) => {
  try {
    const resetDraft = await resetDraftSiteConfig();
    res.json({
      config: resetDraft,
      meta: getSiteStateMeta(),
    });
  } catch {
    res.status(500).json({ error: 'Failed to reset draft config.' });
  }
});

app.post('/api/cms/reset-all', async (_req, res) => {
  try {
    const resetConfig = await resetAllSiteConfig();
    res.json({
      config: resetConfig,
      meta: getSiteStateMeta(),
    });
  } catch {
    res.status(500).json({ error: 'Failed to reset all site config.' });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: cmsStoreStatus === 'ready' ? 'ok' : 'degraded',
    message: cmsStoreStatus === 'ready' ? 'Server is running' : 'Server is running, but CMS data store is unavailable',
    cmsStoreStatus,
    cmsStoreError,
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  void ensureCmsStoreReady().then((isReady) => {
    if (!isReady) {
      console.error('Failed to initialize CMS data store.', cmsStoreError);
    } else {
      console.log('CMS data store initialized successfully');
    }
  });
});

// 404 handler for unmatched routes
app.use((_req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist.',
  });
});

// Global error handler middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error('[Error]', {
    status,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Graceful shutdown handling for production
const gracefulShutdown = async () => {
  console.log('Shutdown signal received, closing server gracefully...');

  server.close(async () => {
    console.log('HTTP server closed');
    // Close MongoDB connection if it was established
    try {
      const { MongoClient } = await import('mongodb');
      // Connection cleanup is handled by the driver
    } catch {
      // Connection not established
    }
    process.exit(0);
  });

  // Force exit after 30 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
