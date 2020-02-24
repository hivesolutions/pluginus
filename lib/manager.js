import { Observable } from "./observable";

import * as spec from "../package.json";

export class PluginManager extends Observable {
    constructor(capabilities) {
        super();
        this.version = spec.version;
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
            await this.getPluginsByCapability(capability, { persist: false });
        }
        await this.restoreState();
    }

    async unload() {
        for (const pluginInstance of this.plugins) {
            if (!pluginInstance.isLoaded()) {
                continue;
            }
            await this.unloadPlugin(pluginInstance, false);
        }
    }

    registerPlugin(pluginClass) {
        // casts the plugin class with the proper case and
        // then creates the instance with the current manager
        // as the context argument to it
        const PluginClass = pluginClass;
        const pluginInstance = new PluginClass(this);

        // runs a simple "patch" operation for the plugin instances
        // that for some reason did not set the "mandatory" owner
        // field in the newly created instance
        if (pluginInstance.owner === undefined) pluginInstance.owner = this;

        // adds the newly crated plugin instance to the list
        // of plugins currently registered in the manager
        this.plugins.push(pluginInstance);
        this.pluginsName[pluginInstance.constructor.name] = pluginInstance;
        this.pluginsName[pluginInstance.getName()] = pluginInstance;
        this.pluginsClass[pluginClass] = pluginInstance;

        // iterates over the complete set of plugin's capabilities
        // to register it for all of its capabilities
        for (const capability of pluginInstance.getCapabilities()) {
            const plugins = this.pluginsCapability[capability.name] || [];
            plugins.push(pluginInstance);
            this.pluginsCapability[capability.name] = plugins;
        }
    }

    async loadPlugin(pluginInstance, persist = true) {
        if (pluginInstance.isLoaded()) {
            return;
        }

        pluginInstance.ensureOwner();

        await pluginInstance.triggerAll("before-load");
        await pluginInstance.load();
        await pluginInstance.triggerAll("loaded");
        await pluginInstance.triggerAll("after-load");

        if (persist) this.addState(pluginInstance.getName());
    }

    async unloadPlugin(pluginInstance, persist = true) {
        if (!pluginInstance.isLoaded()) {
            return;
        }

        pluginInstance.ensureOwner();

        await pluginInstance.triggerAll("before-unload");
        await pluginInstance.unload();
        await pluginInstance.triggerAll("unloaded");
        await pluginInstance.triggerAll("after-unload");

        this.persistState();

        if (persist) this.removeState(pluginInstance.getName());
    }

    async ensurePluginLoaded(pluginInstance, persist = true) {
        await this.loadPlugin(pluginInstance, persist);
    }

    async ensurePluginsLoaded(pluginInstances, persist = true) {
        for (const pluginInstance of pluginInstances) {
            await this.ensurePluginLoaded(pluginInstance, persist);
        }
    }

    async getPluginByName(name, options) {
        options = options || {};
        const load = options.load === undefined ? true : options.load;
        const persist = options.persist === undefined ? true : options.persist;
        const pluginInstance = this.pluginsName[name];
        if (!pluginInstance) {
            return null;
        }
        if (load) {
            await this.ensurePluginLoaded(pluginInstance, persist);
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
        const persist = options.persist === undefined ? true : options.persist;
        const pluginInstances = this.pluginsCapability[capability] || [];
        if (load) {
            await this.ensurePluginsLoaded(pluginInstances, persist);
        }
        return pluginInstances;
    }

    async bindLoadedByCapability(capability, callback) {
        const plugins = await this.getPluginsByCapability(capability, { load: false });
        for (const plugin of plugins) {
            if (!plugin.isLoaded()) continue;
            await callback(plugin);
        }
        this.bind(`capability:${capability}:loaded`, callback);
    }

    async unbindLoadedByCapability(capability, callback) {
        this.unbind(`capability:${capability}:loaded`, callback);
    }

    async bindUnloadedByCapability(capability, callback) {
        const plugins = await this.getPluginsByCapability(capability, { load: false });
        for (const plugin of plugins) {
            if (plugin.isLoaded()) continue;
            await callback(plugin);
        }
        this.bind(`capability:${capability}:unloaded`, callback);
    }

    async unbindUnloadedByCapability(capability, callback) {
        this.unbind(`capability:${capability}:unloaded`, callback);
    }

    async addState(name) {
        if (typeof localStorage === "undefined") return;
        const loadedNames = await this.getState();
        if (loadedNames.includes(name)) return;
        loadedNames.push(name);
        localStorage.setItem("pluginus:loaded", JSON.stringify(loadedNames));
    }

    async removeState(name) {
        if (typeof localStorage === "undefined") return;
        let loadedNames = await this.getState();
        if (!loadedNames.includes(name)) return;
        loadedNames = loadedNames.splice(loadedNames.indexOf(name));
        localStorage.setItem("pluginus:loaded", JSON.stringify(loadedNames));
    }

    async persistState() {
        if (typeof localStorage === "undefined") return;
        const loadedNames = this.getLoadedPlugins().map(p => p.getName());
        localStorage.setItem("pluginus:loaded", JSON.stringify(loadedNames));
    }

    async restoreState() {
        if (typeof localStorage === "undefined") return;
        const loadedNames = await this.getState();
        for (const loadedName of loadedNames) {
            await this.getPluginByName(loadedName);
        }
    }

    async getState() {
        if (typeof localStorage === "undefined") return [];
        const loadedNamesS = localStorage.getItem("pluginus:loaded");
        if (!loadedNamesS) return [];
        return JSON.parse(loadedNamesS);
    }

    getLoadedPlugins() {
        return this.plugins.filter(p => p.isLoaded());
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
