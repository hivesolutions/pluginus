const capability = require("./capability");
const manager = require("./manager");
const observable = require("./observable");
const plugin = require("./plugin");

Object.assign(module.exports, capability);
Object.assign(module.exports, manager);
Object.assign(module.exports, observable);
Object.assign(module.exports, plugin);
