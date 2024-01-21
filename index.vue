<script setup>
// let currentEffect = null

// class YoutubeChannel {
//     subscribers
//     _value

//     constructor(value) {
//         this.subscribers = new Set()
//         this._value = value
//     }

//     get value() {
//         this.subscribe()
//         return this._value
//     }

//     subscribe() {
//         if (currentEffect) {
//             this.subscribers.add(currentEffect)
//         }
//     }

//     set value(value) {
//         this._value = value
//         this.notify()
//     }

//     notify() {
//         this.subscribers.forEach(subscriber => subscriber())
//     }
// }

// function watchEffect(effect) {
//     currentEffect = effect
//     effect()
//     currentEffect = null
// }

// function ref(value) {
//     return new YoutubeChannel(value)
// }

// const channel = ref('Hello World')

// watchEffect(() => {
//     console.log(channel.value)
// })

// channel.value = 'Hello World 2'

let currentEffect = null;

class ComputedRef {
  constructor(effect) {
    this.effect = effect;
    this._value = this.compute();
    this.subscribers = new Set();
  }

  compute() {
    currentEffect = () => this.update();
    const value = this.effect();
    currentEffect = null;
    return value;
  }

  update() {
    const oldValue = this._value;
    this._value = this.compute();
    if (oldValue !== this._value) {
      this.notify();
    }
  }

  notify() {
    this.subscribers.forEach((subscriber) => subscriber());
  }

  subscribe() {
    if (currentEffect) {
      this.subscribers.add(currentEffect);
    }
  }

  get value() {
    this.subscribe();
    return this._value;
  }
}

function computed(effect) {
  return new ComputedRef(effect);
}

const state = { count: 1 };

const double = computed(() => state.count * 2);

console.log(double.value); 

state.count++;
double.update();

console.log(double.value); 
</script>