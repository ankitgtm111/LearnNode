//Program 1

console.log(1);

setTimeout(() => console.log(2));

Promise.resolve().then(() => console.log(3));

Promise.resolve().then(() => setTimeout(() => console.log(4)));

Promise.resolve().then(() => console.log(5));

setTimeout(() => console.log(6));

console.log(7);

// 1 is logged immediately as it is synchronous, then setTimeout puts 2 in the macrotasks queue, and Promise resolve puts 3 in the Microtasks queue, then for 4 it first gets put in the microtasks queue and when it is resolved then it will be moved to macrotask queue. After that 5 again is in the microtask queue then 6 in macrotask and 7 is synchronous so it gets logged. Now all the synchronous tasks have ended so it starts the microtasks, 3 is first, then 4 is sent to the macro queue, then 5 is logged, then marcotask queue starts, 6 is logged then the last addition to the queue, the number 4 is logged.

//Program 2

console.log("begins");

setTimeout(() => {
  console.log("setTimeout 1");
  Promise.resolve().then(() => {
    console.log("promise 1");
  });
}, 0);

new Promise(function (resolve, reject) {
  console.log("promise 2");
  setTimeout(function () {
    console.log("setTimeout 2");
    resolve("resolve 1");
  }, 0);
}).then((res) => {
  console.log("dot then 1");
  setTimeout(() => {
    console.log(res);
  }, 0);
});

// ‘begins’ is logged immediately as it is synchronous. Then the settimeout function’s output gets put in macro tasks. Then new Promise() immediately logs ‘promise 2’, and again the settimeout function gets put in the macro tasks, the .then() won't work yet because the promise hasn’t been resolved since it got put in the macro tasks, now the macro tasks run as synchronous have finished. So the “settimeout 1” gets logged, and the .then() creates a micro task, micro tasks are prioritized so it runs and logs ‘promise 1’, then back to macro tasks, ‘settimeout 2’ is logged, then as soon as it resolves then a micro task is created which is prioritized again and logs ‘dot then 1’, and in the end the last macro task logs ‘resolve 1’.
