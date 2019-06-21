const assert = require("assert");
const pluginus = require("..");

describe("#normalizeName()", function() {
    it("should normalize names in a proper fashion", async () => {
        assert.strictEqual(pluginus.normalizeName("Plugin"), "plugin");
        assert.strictEqual(pluginus.normalizeName("HivePlugin"), "hive");
        assert.strictEqual(pluginus.normalizeName("HiveLargePlugin"), "hive-large");
    });
});
