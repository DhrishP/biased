module.exports = {
  name: "Biased",
  slug: "biased",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.yourdomain.biased",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.yourdomain.biased",
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  extra: {
    apiUrl: "https://biased-be.parekhdhrish-pg.workers.dev",
    eas: {
      projectId: "your-project-id",
    },
  },
  plugins: ["expo-router"],
};
