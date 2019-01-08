const pluginus = require("../");

class ExamplePlugin extends pluginus.Plugin {
    async load() {
        await super.load();
        console.info("loading");
    }

    async unload() {
        console.info("unloading");
        await super.unload();
    }

    getCapabilities() {
        return [pluginus.Capability.new("start")];
    }
}

ExamplePlugin.register();

(function main() {
    pluginus.load();
    pluginus.unload();
})();

module.exports = {
    ExamplePlugin: ExamplePlugin
};
