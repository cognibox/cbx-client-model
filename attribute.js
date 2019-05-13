import { isEqual } from 'lodash';

class BaseAttribute {
  constructor({ value }) {
    const stuff = constructorValues.call(this, value);
    constructorTriggers.call(this);
    if (value) stuff.value = value;
    stuff.setPristine();

    return stuff;
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

  const stuff = new Proxy(this, {
    get: (target, property) => {
      return target[property];
    },
    set: (target, property, newValue) => {
      if (property === 'value') {
        target[property] = this.setValue(newValue, this.value);
        this.trigger('change');
      } else {
        target[property] = newValue;
      }

      return true;
    }
  });

  return stuff;
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
