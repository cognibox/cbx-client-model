import { isEqual } from 'lodash';

class BaseAttribute {
  constructor({ value }) {
    const proxy = constructorValues.call(this);
    constructorTriggers.call(proxy);
    proxy.value = value;
    proxy.setPristine();

    return proxy;
  }

  getValue(value) { return value; }

  parse(value) { return value; }

  reset() {
    this.value = this.getOriginalValue();
    this.setPristine();
  }

  setPristine() {
    this.setOriginalValuePristine();
    this.isDirty = false;
    this.hasChanged = false;
  }

  setValue(newValue, oldValue) {
    if (!isEqual(oldValue, newValue)) {
      this.hasChanged = !isEqual(this.getOriginalValue(), newValue);
      this.isDirty = true;
    }

    return this.parse(newValue);
  }
}

export default BaseAttribute;

////////////////

function constructorValues() {
  let originalValue;
  this.getOriginalValue = () => originalValue;
  this.setOriginalValuePristine = () => { originalValue = this.value; };

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
    }
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

    eventCallbacks[eventType].forEach((callback) => callback.call(this, this.value, this.getOriginalValue()));
  };
}
