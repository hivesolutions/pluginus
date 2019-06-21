const assert = require("assert");
const pluginus = require("..");

describe("#normalizeName()", function() {
    it("should normalize names in a proper fashion", async () => {
        assert.strictEqual(pluginus.normalizeName("Plugin"), "plugin");
        assert.strictEqual(pluginus.normalizeName("HivePlugin"), "hive");
        assert.strictEqual(pluginus.normalizeName("HiveLargePlugin"), "hive-large");
        assert.strictEqual(pluginus.normalizeName("HIVELargePlugin"), "h-i-v-e-large");
    });
});
