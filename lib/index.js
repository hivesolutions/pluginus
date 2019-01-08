const capability = require("./capability");
const manager = require("./manager");
const plugin = require("./plugin");

Object.assign(module.exports, capability);
Object.assign(module.exports, manager);
Object.assign(module.exports, plugin);
