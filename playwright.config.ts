import {defineConfig} from '@playwright/test'
export default defineConfig({testDir:'tests/cloudflare',testMatch:'*.spec.ts',workers:1,timeout:360000,use:{actionTimeout:15000,navigationTimeout:30000,baseURL:'https://localhost:8788',ignoreHTTPSErrors:true,launchOptions:{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,args:['--no-sandbox']}}})
