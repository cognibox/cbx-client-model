import { isEqual } from 'lodash';

class BaseAttribute {
  constructor({ parent, value }) {
    this._parent = parent;

    const stuff = constructorValues.call(this, value);
    constructorTriggers.call(stuff);
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
      this._parent.isDirty = true;
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
        this.trigger();
      } else {
        target[property] = newValue;
      }

      return true;
    }
  });

  return stuff;
}

function constructorTriggers() {
  const onChangeCallbacks = [];
  this.onChange = (callback) => onChangeCallbacks.push(callback);
  this.trigger = () => {
    onChangeCallbacks.forEach((callback) => {
      callback.call(this, this.value, this.getOriginalValue());
    });
  };
}
