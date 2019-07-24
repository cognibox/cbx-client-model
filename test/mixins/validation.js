import { expect } from 'chai';
import { Model, Attribute, Association } from '../../lib/main.js';

describe('Validation', () => {
  const longEnoughValidationText = 'Name is not long enough', atLeastOneValidationText = 'Need more assoc';
  let ModelWithValidation, AssociationModel;

  beforeEach(() => {
    AssociationModel = class extends Model {
      buildFields() {
        return {
          id: new Attribute(),
        };
      }
    };
  });

  describe('#constructor', () => {
    it('should validate all properties once', () => {
      const validatedCount = {
        fieldA: 0,
        fieldB: 0,
      };

      ModelWithValidation = class extends Model {
        buildFields() {
          return {
            fieldA: new Attribute({
              validations: {
                custom() {
                  validatedCount.fieldA++;
                },
              },
            }),
            fieldB: new Attribute({
              validations: {
                custom() {
                  validatedCount.fieldB++;
                },
              },
            }),
          };
        }
      };

      new ModelWithValidation({ fieldA: Math.random() }); // eslint-disable-line no-new
      expect(validatedCount.fieldA).to.equal(1);
      expect(validatedCount.fieldB).to.equal(1);
    });
  });

  describe('#validate', () => {
    beforeEach(() => {
      ModelWithValidation = createModelWithValidation();
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
  });

  describe('attribute.validate', () => {
    beforeEach(() => {
      ModelWithValidation = createModelWithValidation({ assocAutoValidate: false });
    });

    context('when an attribute is validated', () => {
      let model;

      context('when model is initially valid', () => {
        beforeEach(() => {
          ModelWithValidation = createModelWithValidation({ assocAutoValidate: false });
          model = new ModelWithValidation({ name: 'a very long name' });
        });

        context('when validating attribute', () => {
          context('when validation fail', () => {
            beforeEach(() => {
              model.fields.name.value = 'shortname';
              model.fields.name.validate();
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
              model.fields.name.value = 'a very long name';
              model.fields.name.validate();
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
              model.fields.name.value = 'shortname';
              model.fields.name.validate();
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
              model.fields.name.value = 'a very long name';
              model.fields.name.validate();
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

  function createModelWithValidation({ nameAutoValidate = true, assocAutoValidate = true } = {}) {
    return class extends Model {
      buildFields() {
        return {
          id: new Attribute(),

          name: new Attribute({
            autoValidate: nameAutoValidate,
            validations: {
              isLongEnough(value) {
                if (value && value.length > 10) return true;

                return longEnoughValidationText;
              },
            },
          }),

          assoc: new Association({
            autoValidate: assocAutoValidate,
            class: AssociationModel,
            value: [],
            validations: {
              hasAtLeastOne(value) {
                if (value && value.length > 0) return true;

                return atLeastOneValidationText;
              },
            },
          }),
        };
      }
    };
  }
});
