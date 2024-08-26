class Provider2 {
    constructor(name = 'Provider 2', failureRate = 0.7) {
        this.name = name;
        this.failureRate = failureRate;
    }

    async send(to, subject, body) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() < this.failureRate) {
                    reject(new Error(`${this.name} failed`));
                } else {
                    resolve('Email sent successfully');
                }
            }, 100);
        });
    }
}

module.exports = Provider2;