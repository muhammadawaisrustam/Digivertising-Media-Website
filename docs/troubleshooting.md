# Troubleshooting

| Problem | What to do |
| --- | --- |
| `npm: command not found` or `node: command not found` | Install Node.js LTS from https://nodejs.org, then close and reopen the terminal. Check with `node -v` (needs 22.12 or newer). |
| `npm install` shows `EACCES` or permission errors | Do not use `sudo`. On Mac/Linux, install Node with the official installer or `nvm`. |
| `Port 3000 is already in use` | Another server is running. Stop it with `Ctrl + C` in its terminal, or run `npm run dev -- -p 3001` and open http://localhost:3001. |
| Build fails with a Zod error mentioning a field | A content file has a missing or too-long value. The message names the service and field. Fix it in `src/content/services/`. |
| Build fails with "Property ... is missing" in `ar.ts` | An English text key was added without its Arabic version. Add it to `src/i18n/dictionaries/ar.ts`. |
| Fonts fail to download during build | The build downloads Google Fonts once. Check your internet connection and retry. |
| The 3D globe does not animate | Expected on devices with reduced motion turned on, Data Saver, low memory, or no WebGL. The static globe is shown instead. |
| `npm run test:e2e` cannot find a browser | Run `npx playwright install chromium` once. |
| Browser tests fail immediately | Run `npm run build` first; the tests use the production build. |
