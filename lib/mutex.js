export class Mutex {
    constructor() {
        this.acquired = false;
        this.callbacks = [];
        this.promises = [];
    }

    async acquire() {
        if (this.acquired) {
            const promise = new Promise((resolve, reject) => {
                this.callbacks.push([resolve, reject]);
            });
            this.promises.push(promise);
            await promise;
        } else {
            this.acquired = true;
        }
    }

    async release() {
        if (this.promises.length === 0) {
            this.acquired = false;
            return;
        }
        setTimeout(() => {
            console.info(this.promises);
            console.info(this.callbacks);
            const resolve = this.callbacks.shift()[0];
            this.promises.shift();
            resolve();
        }, 100);
    }
}
