# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Troubleshooting Random Page Refreshes

### Issue: Random Page Refreshes in Development

**Status:** ✅ **FIXED** - HMR (Hot Module Replacement) has been disabled to prevent random refreshes.

**Solution Applied:**
- HMR is disabled via `FAST_REFRESH=false` in the `npm start` script (see `package.json`)
- This prevents Hot Module Replacement from causing page refreshes during development

**Important Notes:**
- ⚠️ **Production is NOT affected** - HMR only exists in development mode. Production builds are static and won't have this issue.
- 🔄 **Manual refresh required** - Since HMR is disabled, you'll need to manually refresh the browser after making code changes (no hot reloading).
- 📝 **To re-enable HMR** (if needed in the future): Remove `FAST_REFRESH=false` from the start script in `package.json` or create a `.env` file with `FAST_REFRESH=true`.

### Alternative: Using .env File

If you prefer to toggle HMR on/off without modifying `package.json`:

1. Create a `.env` file in the `web` directory
2. Add: `FAST_REFRESH=false` (to disable) or `FAST_REFRESH=true` (to enable)
3. Restart your development server

### Debugging Refresh Issues

The app includes a refresh debugger that automatically logs events. Check the browser console for:
- `🔥 HMR` events - indicates Hot Module Replacement activity
- `⚠️ BEFORE_UNLOAD` - page is about to refresh
- `❌ ERROR_BOUNDARY` - React errors caught
- `🧭 HISTORY_PUSH_STATE` / `HISTORY_REPLACE_STATE` - navigation events
- `🔐 AUTH_REDIRECT` - authentication redirects

You can also run `window.refreshDebugger.printSummary()` in the browser console to see all logged events.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
# CV_Cloud-WEB
