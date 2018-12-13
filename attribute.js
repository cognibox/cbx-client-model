import { isEqual } from 'lodash';

class BaseAttribute {
  constructor({ value }) {
    constructorValues.call(this, value);
    constructorTriggers.call(this);
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

function constructorValues(value) {
  let originalValue;
  this.getOriginalValue = () => originalValue;
  this.setOriginalValuePristine = () => { originalValue = value; };
  this.setPristine();

  Object.defineProperty(this, 'value', {
    enumerable: true,
    get() { return this.getValue(value); },
    set(newValue) {
      value = this.setValue(newValue, value);
      this.trigger('change');
      return value;
    }
  });
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
