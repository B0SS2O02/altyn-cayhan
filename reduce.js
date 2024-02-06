// // Compare this with pipe: fn(acc) is changed to acc.then(fn),
// // and initialValue is ensured to be a promise
// const asyncPipe =
//     (...functions) =>
//         (initialValue) => {
//             console.log(functions, initialValue)
//             return functions.reduce((acc, fn) => {
//                 // console.log(acc, '---', fn)
//                 console.log(acc.then(((fn) => console.log(fn,'+++'))))
//                 return acc.then(fn)
//             }, Promise.resolve(initialValue)
//             );

//         }

// // Building blocks to use for composition
// const p1 = async (a) => a * 5;
// const p2 = async (a) => a * 2;
// // The composed functions can also return non-promises, because the values are
// // all eventually wrapped in promises
// const f3 = (a) => a * 3;
// const p4 = async (a) => a * 4;

// asyncPipe(p1, p2, f3, p4)(10).then((res) => console.log(res)); // 1200


console.log(new Date)
