import { manager } from "./manager";
import { Observable } from "./observable";
import { normalizeName } from "./util";

export class Plugin extends Observable {
    constructor(owner) {
        super();
        this.name = normalizeName(this.constructor.name);
        this.version = "0.0.0";
        this.owner = owner;
        this.loaded = false;
    }

    static new() {
        return new this();
    }

    static register(owner) {
        owner = owner || manager;
        if (!owner) {
            return;
        }
        owner.registerPlugin(this);
    }

    static unregister(owner) {
        owner = owner || manager;
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

    getName() {
        return this.name;
    }

    getVersion() {
        return this.version;
    }

    getCapabilities() {
        return [];
    }

    isLoaded() {
        return this.loaded;
    }
}

export default Plugin;
