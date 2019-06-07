import { isEqual } from 'lodash';

class Attribute {
  constructor({ value }) {
    const proxy = constructorValues.call(this);
    constructorTriggers.call(proxy);
    proxy.constructorOptions = arguments[0];
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

export default Attribute;

////////////////

function constructorValues() {
  const proxy = new Proxy(this, {
    get: (target, property) => {
      return target[property];
    },
    set: (target, property, newValue) => {
      if (property === 'value') {
        target[property] = proxy.setValue(newValue, proxy.value);
        proxy.trigger('change');
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
  this.trigger = (eventType) => {
    if (!eventCallbacks[eventType]) return;

    eventCallbacks[eventType].forEach((callback) => callback.call(this, this.value, this.originalValue));
  };
}
