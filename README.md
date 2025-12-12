# SmartCloset (Mobile)

This is the Expo (React Native + TypeScript) frontend for the SmartCloset mobile app.

## Requirements
- Node (recommended >= 20.19.4 to avoid engine warnings)
- npm
- For Android development: Android Studio / emulator or physical device
- For iOS development: macOS + Xcode or use the Expo Go app

## Quick start (PowerShell)
```powershell
cd C:\Users\ndugl\Downloads\smartcloset\mobile
npm start
# then choose to run on web, Android emulator/device, or iOS (macOS only)
# or run directly:
npm run web
npm run android
```

## Notes
- You may see `Unsupported engine` warnings if your Node version is slightly older than expected by some React Native dependencies. The app should still work but upgrading Node (or using `nvm-windows`) is recommended.
- To test on a phone, install the Expo Go app and scan the QR code shown by `npm start`.

Happy coding — tell me what feature to add next (navigation, auth, wardrobe list, photo upload, etc.).
