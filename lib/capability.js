class Capability {
    constructor(name, properties) {
        this.name = name;
        this.properties = properties || {};
    }

    static new(name, properties) {
        return new this(name, properties);
    }
}

module.exports = {
    Capability: Capability
};
