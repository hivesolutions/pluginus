const observable = require("./observable");

class PluginManager extends observable.Observable {
    constructor(capabilities) {
        super();
        this.plugins = [];
        this.pluginsClass = {};
        this.pluginsCapability = {};
        this.capabilities = capabilities || ["start"];
    }

    async load() {
        for (const capability of this.capabilities) {
            const startPlugins = this.getPluginsByCapability(capability);
            for (const plugin of startPlugins) {
                await this.loadPlugin(plugin);
            }
        }
    }

    async unload() {
        for (const pluginInstance of this.plugins) {
            if (!pluginInstance.isLoaded()) {
                continue;
            }
            await this.unloadPlugin(pluginInstance);
        }
    }

    registerPlugin(pluginClass) {
        const PluginClass = pluginClass;
        const pluginInstance = new PluginClass();
        this.plugins.push(pluginInstance);
        this.pluginsClass[pluginClass] = pluginInstance;
        for (const capability of pluginInstance.getCapabilities()) {
            let plugins = this.pluginsCapability[capability.name] || [];
            plugins.push(pluginInstance);
            this.pluginsCapability[capability.name] = plugins;
        }
    }

    async loadPlugin(pluginInstance) {
        await pluginInstance.load();
    }

    async unloadPlugin(pluginInstance) {
        await pluginInstance.unload();
    }

    async ensurePluginsLoaded(pluginInstances) {
        for (const pluginInstance of pluginInstances) {
            await this.loadPlugin(pluginInstance);
        }
    }

    async getPluginsByCapability(capability) {
        const pluginInstances = this.pluginsCapability[capability] || [];
        await this.ensurePluginsLoaded(pluginInstances);
        return pluginInstances;
    }
}

const globalManager = new PluginManager();

module.exports = {
    PluginManager: PluginManager,
    global: globalManager,
    load: function() {
        return globalManager.load();
    },
    unload: function() {
        return globalManager.unload();
    }
};
