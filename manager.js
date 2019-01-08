class PluginManager {

    constructor() {
        this.plugins = [];
        this.pluginsClass = {};
        this.pluginsCapability = {};
    }

    load()  {
        const startPlugins = this.getPluginsByCapability("start");
        for (const plugin of startPlugins) {
            loadPlugin(plugin);
        }
    }

    unload()  {}

    registerPlugin(pluginClass) {
        const pluginInstance = pluginClass();
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

    getPluginsByCapability(capability) {
        return this.pluginsCapability[capability] || [];
    }
}

module.exports = {
    manager: new PluginManager(),
    PluginManager: PluginManager
};
