const manager = require("./manager");

class Plugin {

    constructor() {
        this.loaded = false;
    }

    static register(owner) {
        owner = owner || manager.global;
        owner.registerPlugin(this);
    }

    static unregister(owner) {
        owner = owner || manager.global;
        owner.unregisterPlugin(this);
    }

    load() {
        this.loaded = true;
    }

    unload() {
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
