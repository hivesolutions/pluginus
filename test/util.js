const assert = require("assert");
const pluginus = require("..");

describe("#camelToUnderscore()", function() {
    it("should be able to convert simple values", () => {
        let result;

        result = pluginus.camelToUnderscore(null);
        assert.strictEqual(result, null);

        result = pluginus.camelToUnderscore("");
        assert.strictEqual(typeof result, "string");
        assert.strictEqual(result, "");

        result = pluginus.camelToUnderscore("HelloWorld");
        assert.strictEqual(typeof result, "string");
        assert.strictEqual(result, "hello_world");
    });
});

describe("#normalizeName()", function() {
    it("should normalize names in a proper fashion", async () => {
        assert.strictEqual(pluginus.normalizeName("Plugin"), "plugin");
        assert.strictEqual(pluginus.normalizeName("HivePlugin"), "hive");
        assert.strictEqual(pluginus.normalizeName("HiveLargePlugin"), "hive-large");
        assert.strictEqual(pluginus.normalizeName("HIVELargePlugin"), "h-i-v-e-large");
    });
});
