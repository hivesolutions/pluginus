const plugin = require("./plugin")

class ExamplePlugin extends plugin.Plugin {

    load() {
        super.load();
        console.info("loading");
    }
}

module.exports = {
    ExamplePlugin: ExamplePlugin
};
