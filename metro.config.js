const path = require('path');
const fs = require('fs');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

// Helper function to escape regex special characters
const escape = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Try to find the euc-ble-connector package
let localRoot = null;
let nodeModulesRoot = null;
let modules = [];
const watchFolders = [];

try {
  // First, try the local development path (actual source)
  const localPath = path.resolve(__dirname, '..', 'euc-ble-connector', 'package.json');
  if (fs.existsSync(localPath)) {
    localRoot = path.resolve(__dirname, '..', 'euc-ble-connector');
    watchFolders.push(localRoot);
    const pak = require(localPath);
    modules = Object.keys({
      ...pak.peerDependencies,
    });
  }
  
  // Also check node_modules (might be a symlink from file: dependency)
  const nodeModulesPath = path.resolve(__dirname, 'node_modules', 'euc-ble-connector', 'package.json');
  if (fs.existsSync(nodeModulesPath)) {
    nodeModulesRoot = path.resolve(__dirname, 'node_modules', 'euc-ble-connector');
    
    // If we don't have a local root, use node_modules and try to resolve the real path
    if (!localRoot) {
      try {
        // Check if it's a symlink and resolve to the actual path
        const realPath = fs.realpathSync(nodeModulesRoot);
        if (realPath !== nodeModulesRoot && fs.existsSync(path.join(realPath, 'package.json'))) {
          localRoot = realPath;
          watchFolders.push(localRoot);
        } else {
          watchFolders.push(nodeModulesRoot);
        }
      } catch {
        watchFolders.push(nodeModulesRoot);
      }
      
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

// Add watchFolders and resolver config if we found the package
if (watchFolders.length > 0) {
  config.watchFolders = watchFolders;
  
  const root = localRoot || nodeModulesRoot;
  if (root) {
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
}

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

