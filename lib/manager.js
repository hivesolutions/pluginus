class PluginManager {
  constructor() {
    this.plugins = [];
    this.pluginsClass = {};
    this.pluginsCapability = {};
  }

  load() {
    const startPlugins = this.getPluginsByCapability("start");
    for (const plugin of startPlugins) {
      this.loadPlugin(plugin);
    }
  }

  unload() {
    for (const pluginInstance of this.plugins) {
      if (!pluginInstance.isLoaded()) {
        continue;
      }
      this.unloadPlugin(pluginInstance);
    }
  }

  registerPlugin(pluginClass) {
    const pluginInstance = new pluginClass();
    this.plugins.push(pluginInstance);
    this.pluginsClass[pluginClass] = pluginInstance;
    for (const capability of pluginInstance.getCapabilities()) {
      let plugins = this.pluginsCapability[capability.name] || [];
      plugins.push(pluginInstance);
      this.pluginsCapability[capability.name] = plugins;
    }
  }

  loadPlugin(pluginInstance) {
    pluginInstance.load();
  }

  unloadPlugin(pluginInstance) {
    pluginInstance.unload();
  }

  getPluginsByCapability(capability) {
    return this.pluginsCapability[capability] || [];
  }
}

module.exports = {
  global: new PluginManager(),
  PluginManager: PluginManager
};
