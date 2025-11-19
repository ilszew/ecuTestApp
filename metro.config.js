const path = require('path');
const fs = require('fs');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

// Helper function to escape regex special characters
const escape = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Try to find the euc-ble-connector package
let root = null;
let modules = [];

try {
  // First, try the local development path
  const localPath = path.resolve(__dirname, '..', 'euc-ble-connector', 'package.json');
  if (fs.existsSync(localPath)) {
    root = path.resolve(__dirname, '..', 'euc-ble-connector');
    const pak = require(localPath);
    modules = Object.keys({
      ...pak.peerDependencies,
    });
  } else {
    // Try to find it in node_modules (if installed via npm)
    const nodeModulesPath = path.resolve(__dirname, 'node_modules', 'euc-ble-connector', 'package.json');
    if (fs.existsSync(nodeModulesPath)) {
      root = path.resolve(__dirname, 'node_modules', 'euc-ble-connector');
      const pak = require(nodeModulesPath);
      modules = Object.keys({
        ...pak.peerDependencies,
      });
    }
  }
} catch (error) {
  console.warn('Warning: Could not find euc-ble-connector package. Metro will use default configuration.');
  console.warn('Error:', error.message);
}

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

// Only add watchFolders and resolver config if we found the local package
if (root && fs.existsSync(root)) {
  config.watchFolders = [root];
  
  config.resolver = {
    blacklistRE: new RegExp(
      `^${escape(path.join(root, 'node_modules'))}\\/.*$`
    ),
    extraNodeModules: modules.reduce((acc, name) => {
      acc[name] = path.join(__dirname, 'node_modules', name);
      return acc;
    }, {}),
  };
}

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

