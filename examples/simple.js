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
        return [{
            name: "start"
        }];
    }
}

ExamplePlugin.register();

function main() {
    pluginus.global.load();
    pluginus.global.unload();
}

main();

module.exports = {
    ExamplePlugin: ExamplePlugin
};
