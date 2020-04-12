export const camelToUnderscore = function(value, separator = "_") {
    if (!value) return value;
    return value
        .replace(/\.?([A-Z])/g, (x, y) => separator + y.toLowerCase())
        .replace(RegExp("^" + separator), "");
};

export const normalizeName = function(name) {
    const underscore = camelToUnderscore(name, "-");
    return underscore.replace(/-plugin$/, "");
};

export default {
    camelToUnderscore,
    normalizeName
};
