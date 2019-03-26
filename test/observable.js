const assert = require("assert");
const pluginus = require("..");

describe("Observable", function() {
    describe("#bind()", function() {
        it("should bind to an event", async () => {
            const observable = new pluginus.Observable();
            const promise = new Promise(function(resolve, reject) {
                observable.bind("event", function(value) {
                    resolve(value);
                });
            });
            observable.trigger("event", "hello");
            const result = await promise;
            assert.strictEqual(result, "hello");
        });
    });
});
