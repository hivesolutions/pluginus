import { manager } from "./manager";
import { Observable } from "./observable";
import { normalizeName } from "./util";

export class Plugin extends Observable {
    constructor(owner) {
        super();
        this.name = normalizeName(this.constructor.name);
        this.version = "0.0.0";
        this.description = null;
        this.owner = owner;
        this.loaded = false;
        this.meta = {};
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
        this.ensureOwner();
        this.loaded = true;
    }

    async unload() {
        this.ensureOwner();
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

    getDescription() {
        return this.description;
    }

    getCapabilities() {
        return [];
    }

    async triggerAll(event, ...args) {
        let promise;
        const promises = [];

        // makes sure that there's an owner assigned to the current instance
        // otherwise issues would arise further on
        this.ensureOwner();

        // triggers the base plugin context events both under the plugins instance
        // and the surrounding plugin manager (as expected)
        promise = this.trigger(`plugin:${this.getName()}:${event}`, ...args);
        promises.push(promise);
        promise = this.owner.trigger(`plugin:${this.getName()}:${event}`, this, ...args);
        promises.push(promise);

        // iterates over the complete set of capabilities of the current
        // plugin to trigger capability context events both under the current
        // instance observable and the owner's observable
        for (const capability of this.getCapabilities()) {
            promise = this.trigger(`capability:${capability.getName()}:${event}`, ...args);
            promises.push(promise);
            promise = this.owner.trigger(
                `capability:${capability.getName()}:${event}`,
                this,
                ...args
            );
            promises.push(promise);
        }

        // waits for the complete set of promises to be fulfilled so that all
        // the async callbacks are executed (parallel execution)
        await Promise.all(promises);
    }

    ensureOwner() {
        if (!this.isOrphan()) return;
        throw new Error(`Plugin instance '${this.getName()}' is orphan of manager`);
    }

    isLoaded() {
        return this.loaded;
    }

    isOrphan() {
        return this.owner === undefined || this.owner === null;
    }
}

export default Plugin;
