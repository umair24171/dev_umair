import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir: './scripts/browser', timeout: 60000, use: { baseURL: process.env.SMOKE_URL || 'http://127.0.0.1:3100', headless: true }, reporter: 'list' });
