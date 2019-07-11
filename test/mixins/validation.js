import { expect } from 'chai';
import BaseModel from '../../lib/model.js';
import ValidationMixin from '../../lib/mixins/validation.js';

describe('Validation', () => {
  const longEnoughValidationText = 'Name is not long enough', atLeastOneValidationText = 'Need more assoc';
  let ModelWithValidation, AssociationModel;

  beforeEach(() => {
    AssociationModel = class extends BaseModel {
      static attributes() {
        return {
          id: {},
        };
      }
    };

    ModelWithValidation = class extends ValidationMixin(BaseModel) {
      static attributes() {
        return {
          name: {
            validations: {
              isLongEnough(value) {
                if (value.length > 10) return true;

                return longEnoughValidationText;
              },
            },
          },
        };
      }

      static associations() {
        return {
          assoc: {
            class: AssociationModel,
            default: [],
            type: 'hasMany',
            validations: {
              hasAtLeastOne(value) {
                if (value.length > 0) return true;

                return atLeastOneValidationText;
              },
            },
          },
        };
      }
    };
  });

  context('when a model is validated', () => {
    let model;

    context('when its attributes are valid', () => {
      context('when its associations are valid', () => {
        beforeEach(() => {
          model = new ModelWithValidation({ name: 'a very long name', assoc: [new AssociationModel()] });
          model.validate();
        });

        it('should set isValid to true', () => {
          expect(model.isValid).to.be.true;
        });

        it('should set errors to an empty object', () => {
          expect(model.errors).to.be.an('object').that.is.empty;
        });
      });

      context('when its associations are not valid', () => {
        beforeEach(() => {
          model = new ModelWithValidation({ name: 'a very long name', ass: [] });
          model.validate();
        });

        it('should set isValid to false', () => {
          expect(model.isValid).to.be.false;
        });

        it('should set errors', () => {
          expect(model.errors).to.deep.equal({ assoc: { hasAtLeastOne: atLeastOneValidationText } });
        });
      });
    });

    context('when its attributes are not valid', () => {
      context('when its associations are valid', () => {
        beforeEach(() => {
          model = new ModelWithValidation({ name: 'shortname', assoc: [new AssociationModel()] });
          model.validate();
        });

        it('should set isValid to false', () => {
          expect(model.isValid).to.be.false;
        });

        it('should set errors', () => {
          expect(model.errors).to.deep.equal({ name: { isLongEnough: longEnoughValidationText } });
        });
      });

      context('when its associations are not valid', () => {
        beforeEach(() => {
          model = new ModelWithValidation({ name: 'shortname', assoc: [] });
          model.validate();
        });

        it('should set isValid to false', () => {
          expect(model.isValid).to.be.false;
        });

        it('should set errors', () => {
          expect(model.errors).to.deep.equal({ name: { isLongEnough: longEnoughValidationText }, assoc: { hasAtLeastOne: atLeastOneValidationText } });
        });
      });
    });
  });

  context('when an attribute is validated', () => {
    let model;

    context('when model is initially valid', () => {
      beforeEach(() => {
        model = new ModelWithValidation({ name: 'a very long name' });
      });

      context('when validating attribute', () => {
        context('when validation fail', () => {
          beforeEach(() => {
            model.attributes.name.value = 'shortname';
            model.attributes.name.validate();
          });

          it('should set isValid to false', () => {
            expect(model.isValid).to.be.false;
          });

          it('should set errors', () => {
            expect(model.errors).to.deep.equal({ name: { isLongEnough: longEnoughValidationText } });
          });
        });

        context('when validation succeed', () => {
          beforeEach(() => {
            model.attributes.name.value = 'a very long name';
            model.attributes.name.validate();
          });

          it('should set isValid to true', () => {
            expect(model.isValid).to.be.true;
          });

          it('should set errors to an empty object', () => {
            expect(model.errors).to.be.an('object').that.is.empty;
          });
        });
      });
    });

    context('when model is initially not valid', () => {
      beforeEach(() => {
        model = new ModelWithValidation({ name: 'shortname' });
      });

      context('when validating attribute', () => {
        context('when validation fail', () => {
          beforeEach(() => {
            model.attributes.name.value = 'shortname';
            model.attributes.name.validate();
          });

          it('should set isValid to false', () => {
            expect(model.isValid).to.be.false;
          });

          it('should set errors', () => {
            expect(model.errors).to.deep.equal({ name: { isLongEnough: longEnoughValidationText } });
          });
        });

        context('when validation succeed', () => {
          beforeEach(() => {
            model.attributes.name.value = 'a very long name';
            model.attributes.name.validate();
          });

          it('should set isValid to true', () => {
            expect(model.isValid).to.be.true;
          });

          it('should set errors to an empty object', () => {
            expect(model.errors).to.be.an('object').that.is.empty;
          });
        });
      });
    });
  });
});
