const assert = require("assert");
const pluginus = require("..");

describe("Plugin", function() {
    describe("#new()", function() {
        it("should create a new Plugin instance", async () => {
            const plugin = pluginus.Plugin.new();
            assert.strictEqual(plugin instanceof pluginus.Plugin, true);
            assert.strictEqual(plugin.name, "Plugin");
            assert.strictEqual(plugin.version, "0.0.0");
            assert.strictEqual(plugin.owner, undefined);
            assert.strictEqual(plugin.getName(), "Plugin");
            assert.strictEqual(plugin.getVersion(), "0.0.0");
        });

        it("should register itself on the global manager instance", async () => {
            pluginus.Plugin.register();
            assert.strictEqual(pluginus.manager.plugins["Plugin"] !== null, true);
        });

        it("should register itself to the provided manager instance", async () => {
            const manager = new pluginus.PluginManager();
            pluginus.Plugin.register(manager);
            assert.strictEqual(manager.plugins["Plugin"] !== null, true);
        });
    });
});
