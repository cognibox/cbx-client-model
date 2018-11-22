import { result } from 'lodash';

const ValidationMixin = (superclass) => class extends superclass {
  constructor({ value, validations }) {
    super({ value: value });

    buildValidation.call(this, validations);

    this.validate();
  }

  setValue(...args) {
    const newValue = args[0];
    super.setValue(...args);
    this.validate();

    return newValue;
  }

  validate() {
    const errors = {};

    if (this.validations && Object.keys(this.validations).length) {
      if (this.value === undefined) {
        if (result(this.validations, 'required')) errors.required = true;
      } else {

      }
    }

    this._setErrors(errors);
    return this.isValid;
  }
};

export default ValidationMixin;

////////////////

function buildValidation(validations) {
  Object.defineProperty(this, 'validations', {
    enumerable: true,
    get() { return validations; },
    set() { console.error('[vueModel][ValidationMixin] validations assignation not allowed'); }
  });

  let isValid = true;
  let errors = {};

  this._setErrors = (newErrors) => {
    errors = newErrors;
    isValid = !Object.keys(errors).length;
  };

  Object.defineProperty(this, 'isValid', {
    enumerable: true,
    get() { return isValid; },
    set() { console.error('[vueModel][ValidationMixin] isValid assignation not allowed'); }
  });

  Object.defineProperty(this, 'errors', {
    enumerable: true,
    get() { return errors; },
    set() { console.error('[vueModel][ValidationMixin] errors assignation not allowed'); }
  });
}
