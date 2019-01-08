const manager = require("./manager");

class Capability {
    constructor(name, properties) {
        this.name = name;
        this.properties = properties || {};
    }

    static new(name, properties) {
        return new Capability(name, properties);
    }
}

module.exports = {
    Capability: Capability
};
