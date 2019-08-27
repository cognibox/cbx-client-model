import isEqual from 'lodash/isEqual';

export default class Field {
  beforeConstructor() {}

  constructor({ value } = {}) {
    this.beforeConstructor(...arguments);

    const proxy = constructorValues.call(this);
    constructorTriggers.call(proxy);
    proxy.value = value;
    proxy.setPristine();
    proxy.on('change', () => {
      proxy.computeHasChanged();
      if (this.hasChanged) {
        this.isDirty = true;
      }
    });

    return proxy;
  }

  computeHasChanged() {
    this.hasChanged = !isEqual(this.originalValue, this.value);
  }

  getValue(value) { return value; }

  parse(value) { return value; }

  reset() {
    this.value = this.originalValue;
    this.setPristine();
  }

  setPristine() {
    this.originalValue = this.value;
    this.isDirty = false;
    this.hasChanged = false;
  }

  setValue(newValue) {
    return this.parse(newValue);
  }
}

////////////////

function constructorValues() {
  const proxy = new Proxy(this, {
    get: (target, property) => target[property],
    set: (target, property, newValue) => {
      if (property === 'value') {
        if (proxy.value !== newValue) {
          const oldValue = proxy.value;
          target[property] = proxy.setValue(newValue, proxy.value);
          proxy.trigger('change', { oldValue, value: this.value, originalValue: this.originalValue });
        }
      } else {
        target[property] = newValue;
      }

      return true;
    },
  });

  return proxy;
}

function constructorTriggers() {
  const eventCallbacks = {};

  this.on = (eventType, callback) => {
    eventCallbacks[eventType] = eventCallbacks[eventType] || [];
    eventCallbacks[eventType].push(callback);
  };
  this.trigger = (eventType, ...options) => {
    if (!eventCallbacks[eventType]) return;

    eventCallbacks[eventType].forEach((callback) => callback.call(this, ...options));
  };
}
