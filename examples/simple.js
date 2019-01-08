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

(async function main() {
    await pluginus.load();
    await pluginus.unload();
})();

module.exports = {
    ExamplePlugin: ExamplePlugin
};
