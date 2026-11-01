/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // Use the maintained compiler API with pinned TypeScript 5.9. The CLI path
  // intermittently returned incomplete --showConfig output in this environment.
  experimental: { useTypeScriptCli: false },
};
export default nextConfig;
