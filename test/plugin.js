const assert = require("assert");
const pluginus = require("..");

beforeEach(async function() {
    pluginus.reset();
});

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
            assert.strictEqual(pluginus.manager.plugins.length, 0);
            assert.strictEqual(Object.keys(pluginus.manager.pluginsName).length, 0);

            pluginus.Plugin.register();
            assert.strictEqual(pluginus.manager.plugins.length, 1);
            assert.strictEqual(pluginus.manager.plugins[0].name, "Plugin");
            assert.strictEqual(pluginus.manager.pluginsName.Plugin.name, "Plugin");
        });

        it("should register itself to the provided manager instance", async () => {
            const manager = new pluginus.PluginManager();
            assert.strictEqual(manager.plugins.length, 0);
            assert.strictEqual(Object.keys(manager.pluginsName).length, 0);

            pluginus.Plugin.register(manager);
            assert.strictEqual(manager.plugins.length, 1);
            assert.strictEqual(manager.plugins[0].name, "Plugin");
            assert.strictEqual(manager.pluginsName.Plugin.name, "Plugin");
        });
    });
});
