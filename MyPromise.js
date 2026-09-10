class MyPromise {
  constructor(executor) {
    this.state = "PENDING";
    this.value = undefined;
    this.reason = undefined;

    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state !== "PENDING") {
        return;
      }

      this.state = "FULFILLED";
      this.value = value;

      this.onFulfilledCallbacks.forEach((callback) => {
        setTimeout(() => callback(value), 0);
      });
    };

    const reject = (reason) => {
      if (this.state !== "PENDING") {
        return;
      }

      this.state = "REJECTED";
      this.reason = reason;

      this.onRejectedCallbacks.forEach((callback) => {
        setTimeout(() => callback(reason), 0);
      });
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    if (this.state === "FULFILLED") {
      setTimeout(() => {
        onFulfilled(this.value);
      }, 0);
    }

    if (this.state === "REJECTED") {
      setTimeout(() => {
        onRejected(this.reason);
      }, 0);
    }

    if (this.state === "PENDING") {
      this.onFulfilledCallbacks.push(onFulfilled);
      this.onRejectedCallbacks.push(onRejected);
    }
  }
}

module.exports = MyPromise;

const testPromise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("Custom promise resolved successfully");
  }, 1000);
});

console.log("Before custom promise");

testPromise.then(
  (value) => {
    console.log(value);
  },
  (error) => {
    console.error(error);
  },
);

console.log("After custom promise");
