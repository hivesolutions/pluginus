const assert = require("assert");
const pluginus = require("../");

describe("Plugin", function() {
    describe("#new()", function() {
        it("should create a new Plugin instance", async () => {
            const plugin = pluginus.Plugin.new();
            assert.strictEqual(plugin instanceof pluginus.Plugin, true);
        });
    });
});
