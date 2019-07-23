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
      set() { console.error('[CbxClientModel][ValidationMixin] isValid assignation not allowed'); },
    });

    Object.defineProperty(this, 'errors', {
      enumerable: true,
      get() { return errors; },
      set() { console.error('[CbxClientModel][ValidationMixin] errors assignation not allowed'); },
    });

    const [properties] = args;
    triggerInitialValidation({
      fields: this.fields,
      properties,
    });
  }

  validate() {
    Object.keys(this.fields).forEach((key) => {
      this.fields[key].validate();
    });
  }
};

////////////////

function triggerInitialValidation({ fields, properties = {} }) {
  const fieldKeys = Object.keys(fields);

  fieldKeys.forEach((key) => {
    const field = fields[key];

    if (!field.autoValidate) return;

    if (key in properties) {
      field.trigger('validate');
    } else {
      field.validate();
    }
  });
}

export default ValidationMixin;
