import { Observable } from "./observable";

export class PluginManager extends Observable {
    constructor(capabilities) {
        super();
        this.plugins = [];
        this.pluginsName = {};
        this.pluginsClass = {};
        this.pluginsCapability = {};
        this.capabilities = capabilities || ["start"];
    }

    static new(capabilities) {
        return new this(capabilities);
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
        // casts the plugin class with the proper case and
        // then creates the instance with the current manager
        // as the context argument to it
        const PluginClass = pluginClass;
        const pluginInstance = new PluginClass(this);

        // adds the newly crated plugin instance to the list
        // of plugins currently registered in the manager
        this.plugins.push(pluginInstance);
        this.pluginsName[pluginInstance.constructor.name] = pluginInstance;
        this.pluginsName[pluginInstance.getName()] = pluginInstance;
        this.pluginsClass[pluginClass] = pluginInstance;

        // iterates over the complete set of plugin's capabilities
        // to register it for all of its capabilities
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

    async ensurePluginLoaded(pluginInstance) {
        await this.loadPlugin(pluginInstance);
    }

    async ensurePluginsLoaded(pluginInstances) {
        for (const pluginInstance of pluginInstances) {
            await this.ensurePluginLoaded(pluginInstance);
        }
    }

    async getPluginByName(name, options) {
        options = options || {};
        const load = options.load === undefined ? true : options.load;
        const pluginInstance = this.pluginsName[name];
        if (!pluginInstance) {
            return null;
        }
        if (load) {
            await this.ensurePluginLoaded(pluginInstance);
        }
        return pluginInstance;
    }

    async getPluginByCapability(name, options) {
        const pluginInstances = await this.getPluginsByCapability(name, options);
        return pluginInstances.length ? pluginInstances[0] : null;
    }

    async getPluginsByCapability(capability, options) {
        options = options || {};
        const load = options.load === undefined ? true : options.load;
        const pluginInstances = this.pluginsCapability[capability] || [];
        if (load) {
            await this.ensurePluginsLoaded(pluginInstances);
        }
        return pluginInstances;
    }
}

export const manager = new PluginManager();
export const load = function() {
    return manager.load();
};
export const unload = function() {
    return manager.unload();
};
export const reset = function() {
    return manager.unload();
};

export default manager;
