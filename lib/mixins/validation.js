const ValidationMixin = (superclass) => class extends superclass {
  constructor(...args) {
    super(...args);

    let isValid = true;
    const errors = {};

    Object.keys(this.fields).forEach((key) => {
      const field = this.fields[key];

      field.on('validate', () => {
        if (field.isValid) {
          delete errors[key];
        } else {
          errors[key] = field.errors;
        }

        isValid = !Object.keys(errors).length;
      });
    });

    Object.defineProperty(this, 'isValid', {
      enumerable: true,
      get() { return isValid; },
      set() { console.error('[vueModel][ValidationMixin] isValid assignation not allowed'); },
    });

    Object.defineProperty(this, 'errors', {
      enumerable: true,
      get() { return errors; },
      set() { console.error('[vueModel][ValidationMixin] errors assignation not allowed'); },
    });
  }

  validate() {
    Object.keys(this.fields).forEach((key) => {
      this.fields[key].validate();
    });
  }
};

export default ValidationMixin;
