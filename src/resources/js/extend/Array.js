Array.prototype.find = function (callback, thisArg) {
    if (typeof thisArg !== 'undefined') {
        // eslint-disable-line gxrules/no-typeof
        callback = callback.bind(thisArg);
    }
    for (var i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
            return this[i];
        }
    }
};