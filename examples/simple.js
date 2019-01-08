const pluginus = require("../");

class ExamplePlugin extends pluginus.Plugin {
    load() {
        super.load();
        console.info("loading");
    }

    unload() {
        console.info("unloading");
        super.unload();
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
