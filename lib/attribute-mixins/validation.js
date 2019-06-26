import { result } from 'lodash';

class Validator {
  static required(value) {
    return value !== undefined;
  }
}

const AttributeValidationMixin = (superclass) => class extends superclass {
  static validatorClass() { return Validator; }

  constructor(properties) {
    const { validations, autoValidate, model } = properties;

    super(properties);

    this.errors = {};
    this.isValid = true;
    this.model = model;
    this.validations = validations;

    if (autoValidate !== false) {
      this.on('change', () => {
        this.validate();
      });
      this.validate();
    }
  }

  validate() {
    this.errors = this.validateAllDry();

    this.isValid = !Object.keys(this.errors).length;

    this.trigger('validate');

    return this.errors;
  }

  validateOneDry(validationKey) {
    const validationValue = result(this.validations, validationKey);
    const validator = this.constructor.validatorClass();

    if (validator[validationKey]) {
      return validator[validationKey].call(this.model, this.value, validationValue);
    }

    return true;
  }

  validateAllDry() {
    const errors = {};
    const validationKeys = this.validations ? Object.keys(this.validations) : [];

    if (this.validations && validationKeys.length) {
      const required = this.validateOneDry('required');
      if (!required) {
        if (this.validations.required) errors.required = required;
      } else {
        const keysToValidate = validationKeys.filter((key) => {
          return key !== 'required';
        });

        keysToValidate.forEach((key) => {
          const validateResult = this.validateOneDry(key);
          if (validateResult !== true) {
            errors[key] = validateResult;
          }
        });
      }
    }

    return errors;
  }
};

export default AttributeValidationMixin;
