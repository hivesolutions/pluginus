export class Observable {
    constructor() {
        this.callbacks = {};
    }

    bind(event, callback) {
        const callbacks = this.callbacks[event] || [];
        callbacks.push(callback);
        this.callbacks[event] = callbacks;
        return callback;
    }

    unbind(event, callback) {
        const callbacks = this.callbacks[event] || [];
        if (!callback) {
            delete this.callbacks[event];
            return;
        }

        const index = callbacks.indexOf(callback);
        if (index === -1) {
            return;
        }
        callbacks.splice(index, 1);
        this.callbacks[event] = callbacks;
    }

    trigger(event, ...args) {
        const callbacks = this.callbacks[event] || [];
        const results = [];
        for (const callback of callbacks) {
            const result = callback.apply(this, args);
            if (result !== undefined && result !== null) {
                results.push(result);
            }
        }
        return Promise.all(results);
    }
}

export default Observable;
