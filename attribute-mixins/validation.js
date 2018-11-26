import { result } from 'lodash';

class Validator {
  static required(value) {
    return value !== undefined;
  }
}

const ValidationMixin = (superclass) => class extends superclass {
  static validatorClass() { return Validator; }

  constructor({ value, validations, autoValidate }) {
    super({ value: value });

    buildValidation.call(this, validations);

    if (autoValidate) {
      this.on('change', () => this.validate());
    }

    this.validate();
  }

  setValue(...args) {
    const newValue = super.setValue(...args);
    this.validate();

    return newValue;
  }

  ValidateOneDry(validationKey) {
    const validationValue = result(this.validations, validationKey);
    const validator = this.constructor.validatorClass();

    if (validator[validationKey]) {
      return validator[validationKey](this.value, validationValue);
    }

    return true;
  }

  validateAllDry() {
    const errors = {};
    const validationKeys = this.validations ? Object.keys(this.validations) : [];

    if (this.validations && validationKeys.length) {
      const required = this.ValidateOneDry('required');
      if (!required) {
        if (this.validations.required) errors.required = required;
      } else {
        const keysToValidate = validationKeys.filter((key) => {
          return key !== 'required';
        });

        keysToValidate.forEach((key) => {
          const validateResult = this.ValidateOneDry(key);
          if (validateResult !== true) {
            errors[key] = validateResult;
          }
        });
      }
    }

    return errors;
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

  this.validate = () => {
    errors = this.validateAllDry();

    isValid = !Object.keys(errors).length;

    this.trigger('validate');

    return errors;
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
