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
            await this.getPluginsByCapability(capability);
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
        const pluginInstance = new PluginClass(this);
        this.plugins.push(pluginInstance);
        this.pluginsClass[pluginClass] = pluginInstance;
        for (const capability of pluginInstance.getCapabilities()) {
            let plugins = this.pluginsCapability[capability.name] || [];
            plugins.push(pluginInstance);
            this.pluginsCapability[capability.name] = plugins;
        }
    }

    async loadPlugin(pluginInstance) {
        if (pluginInstance.isLoaded()) {
            return;
        }
        await pluginInstance.load();
    }

    async unloadPlugin(pluginInstance) {
        if (!pluginInstance.isLoaded()) {
            return;
        }
        await pluginInstance.unload();
    }

    async ensurePluginsLoaded(pluginInstances) {
        for (const pluginInstance of pluginInstances) {
            await this.loadPlugin(pluginInstance);
        }
    }

    async getPluginByCapability(name) {
        const pluginInstances = this.getPluginsByCapability(name);
        return pluginInstances.length ? pluginInstances[0] : null;
    }

    async getPluginsByCapability(capability) {
        const pluginInstances = this.pluginsCapability[capability] || [];
        await this.ensurePluginsLoaded(pluginInstances);
        return pluginInstances;
    }
}

const manager = new PluginManager();

module.exports = {
    PluginManager: PluginManager,
    manager: manager,
    load: function() {
        return manager.load();
    },
    unload: function() {
        return manager.unload();
    }
};
