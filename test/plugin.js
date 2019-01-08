const assert = require("assert");
const pluginus = require("../");

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
    });
});
