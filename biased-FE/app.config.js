module.exports = {
  name: "Biased",
  slug: "biased",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  userInterfaceStyle: "automatic",
  scheme: "biased",
  splash: {
    image: "./assets/images/splash-icon.png",
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
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.yourdomain.biased",
    versionCode: 1,
    permissions: [],
  },
  web: {
    favicon: "./assets/images/favicon.png",
  },
  extra: {
    apiUrl: "https://biased-be.parekhdhrish-pg.workers.dev",
    eas: {
      projectId: "f147e255-26a7-46ce-b164-7e1340b0d6c9",
    },
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
};
