class Dep {
    constructor() {
        this.subscribe = new Set();
    }
    // 收集依赖
    depend() {
        if (activeEffect) {
            this.subscribe.add(activeEffect);
        }
    }
    // 通知
    notify() {
        this.subscribe.forEach(effect => {
            effect();
        })
    }
}

const targetMap = new WeakMap();
// 收集依赖dep
function getDep(target, key) {
    // 1.根据对象（target）取出对应的Map对象
    let depsMap = targetMap.get(target);
    if(!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }

    //2. 取出具体的dep对象
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Dep();
        depsMap.set(key, dep);
    }
    return dep;
}

// vue2的数据劫持
// function reactive(row) {
//     Object.keys(row).forEach(key => {
//         const dep = new Dep();
//         let value = row[key];
//         Object.defineProperty(row, key, {
//             get: function () {
//                 // 收集依赖
//                 dep.depend();
//                 return value;
//             },
//             set: function (newValue) {
//                 if (value != newValue) {
//                     value = newValue;
//                     // 通知
//                     dep.notify();
//                 }
                
//             }
//         })
//     });
//     return row;
// }
// vue3的数据劫持
function reactive(row) {
    return new Proxy(row, {
        get(target, key) {
            const dep = getDep(target, key);
            dep.depend();
            return target[key]
        },
        set(target, key, newValue) {
            const dep = getDep(target, key);
            target[key] = newValue;
            dep.notify();
        }
    });
}


let activeEffect = null;
const watchEffect = (effect) => {
    activeEffect = effect;
    // dep.depend();
    effect();
    activeEffect = null;
}
const info = reactive({ counter: 100, name: '222' });

function doubleCounter() {
    console.log(info.counter * 2);
}

function powerCounter() {
    console.log(info.counter * info.counter);
}
function changeName() {
    console.log(info.name);
}

// const dep = new Dep();
watchEffect(doubleCounter);
watchEffect(powerCounter);
watchEffect(changeName);
info.counter++;
info.name = '222';
// dep.notify();

