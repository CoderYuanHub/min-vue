class Dep {
    constructor() {
        this.subscribe = new Set();
    }

    depend() {
        if (activeEffect) {
            this.subscribe.add(activeEffect);
        }
    }

    notify() {
        this.subscribe.forEach(effect => {
            effect();
        })
    }
}

let activeEffect = null;
const watchEffect = (effect) => {
    activeEffect = effect;
    dep.depend();
    effect();
    activeEffect = null;
}
const info = { counter: 100 };

function doubleCounter() {
    console.log(info.counter * 2);
}

function powerCounter() {
    console.log(info.counter * info.counter);
}

const dep = new Dep();
watchEffect(doubleCounter);
watchEffect(powerCounter);
info.counter++;
dep.notify();

