const manager = require("./manager");
const observable = require("./observable");

class Plugin extends observable.Observable {
    constructor() {
        super();
        this.loaded = false;
    }

    static register(owner) {
        owner = owner || manager.global;
        if (!owner) {
            return;
        }
        owner.registerPlugin(this);
    }

    static unregister(owner) {
        owner = owner || manager.global;
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
