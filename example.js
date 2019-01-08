const plugin = require("./plugin");

class ExamplePlugin extends plugin.Plugin {

    load() {
        super.load();
        console.info("loading");
    }

    unload() {
        console.info("unloading");
        super.unload();
    }

    getCapabilities() {
        return [{
            name: "start"
        }];
    }
}

function main() {
    manager = require("./manager");
    ExamplePlugin.register();
    manager.global.load();
    manager.global.unload();
}

main();

module.exports = {
    ExamplePlugin: ExamplePlugin
};
