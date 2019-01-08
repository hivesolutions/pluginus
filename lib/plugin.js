const manager = require("./manager");
const observable = require("./observable");

class Plugin extends observable.Observable {
    constructor(owner) {
        super();
        this.owner = owner;
        this.loaded = false;
    }

    static new(name, properties) {
        return new this();
    }

    static register(owner) {
        owner = owner || manager.manager;
        if (!owner) {
            return;
        }
        owner.registerPlugin(this);
    }

    static unregister(owner) {
        owner = owner || manager.manager;
        if (!owner) {
            return;
        }
        owner.unregisterPlugin(this);
    }

    async load() {
        this.loaded = true;
    }

    async unload() {
        this.loaded = false;
    }

    async getPluginByCapability(name) {
        return this.owner.getPluginByCapability(name);
    }

    async getPluginsByCapability(name) {
        return this.owner.getPluginsByCapability(name);
    }

    getCapabilities() {
        return [];
    }

    isLoaded() {
        return this.loaded;
    }
}

module.exports = {
    Plugin: Plugin
};
