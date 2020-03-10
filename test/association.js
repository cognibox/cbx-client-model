import chai from 'chai';
import sinonChai from 'sinon-chai';
import { BelongsTo, HasMany, HasOne } from '../lib/association.js';
import Attribute from '../lib/attribute.js';
import Model from '../lib/model.js';
import validationMixin from '../lib/mixins/validation.js';
import validationFieldMixin from '../lib/field-mixins/validation.js';

const expect = chai.expect;
chai.use(sinonChai);

describe('Association', () => {
  let CustomClass;

  beforeEach(() => {
    CustomClass = class extends Model {
      buildFields() {
        return { id: new Attribute(), name: new Attribute() };
      }
    };
  });

  describe('constructor', () => {
    context('with a value', () => {
      context('when type is belongsTo', () => {
        context('when value is an instance of the association class', () => {
          it('should set the value', () => {
            const value = new CustomClass();
            const association = new BelongsTo({ value: value, model: CustomClass });

            expect(association.value).to.equal(value);
          });

          context('when accessing value', () => {
            it('should not have changed', () => {
              const value = new CustomClass();
              const association = new BelongsTo({ value: value, model: CustomClass });

              association.value;
              expect(association.hasChanged).to.be.false;
            });
          });
        });

        context('when value is not an instance of the association class', () => {
          it('should set the value to an instance of the association class', () => {
            const value = { id: Math.random() };
            const association = new BelongsTo({ value: value, model: CustomClass });

            expect(association.value).to.be.instanceof(CustomClass);
            expect(association.value.fields.id.value).to.equal(value.id);
          });

          context('when accessing value', () => {
            it('should not have changed', () => {
              const value = { id: Math.random() };
              const association = new BelongsTo({ value: value, model: CustomClass });

              association.value;
              expect(association.hasChanged).to.be.false;
            });
          });
        });
      });

      context('when type is hasOne', () => {
        context('when value is an instance of the association class', () => {
          it('should set the value', () => {
            const value = new CustomClass();
            const association = new HasOne({ value: value, model: CustomClass });

            expect(association.value).to.equal(value);
          });
        });

        context('when value is not an instance of the association class', () => {
          it('should set the value to an instance of the association class', () => {
            const value = { id: Math.random() };
            const association = new HasOne({ value: value, model: CustomClass });

            expect(association.value).to.be.instanceof(CustomClass);
            expect(association.value.fields.id.value).to.equal(value.id);
          });
        });
      });

      context('when type is hasMany', () => {
        context('when values are instance of the association class', () => {
          it('should set the value', () => {
            const values = [Math.random(), Math.random()];
            const instances = values.map((value) => {
              return new CustomClass({ id: value });
            });
            const association = new HasMany({ value: instances, model: CustomClass });

            expect(association.value.map((v) => v.fields.id.value)).to.deep.equal(values);
          });
        });

        context('when values are not instance of the association class', () => {
          it('should set the value to an instance of the association class', () => {
            const values = [Math.random(), Math.random()];
            const association = new HasMany({ value: values, model: CustomClass });

            association.value.forEach((instance, index) => {
              expect(association.value[index]).to.be.instanceof(CustomClass);
              expect(association.value[index].value).to.equal(instance.value);
            });
          });
        });
      });
    });
  });

  describe('hasChanged', () => {
    context('for hasMany association', () => {
      let association;

      beforeEach(() => {
        const instances = [new CustomClass({ id: Math.random() }), new CustomClass({ id: Math.random() })];
        association = new HasMany({ value: instances, model: CustomClass });
      });

      context('initially', () => {
        it('should return false', () => {
          expect(association.hasChanged).to.be.false;
        });
      });

      context('when an element is already present', () => {
        let id;

        beforeEach(() => {
          id = Math.random();
          association.value.push(new CustomClass({ id, name: Math.random() }));
          association.setPristine();
        });

        it('should return false', () => {
          expect(association.hasChanged).to.be.false;
        });

        context('when removing the element', () => {
          beforeEach(() => {
            association.value.pop();
          });

          it('should return true', () => {
            expect(association.hasChanged).to.be.true;
          });

          context('when adding the element again with one with the same id but a different name', () => {
            beforeEach(() => {
              association.value.push(new CustomClass({ id, name: Math.random() }));
            });

            it('should return false', () => {
              expect(association.hasChanged).to.be.false;
            });
          });
        });
      });

      context('when adding an element', () => {
        beforeEach(() => { association.value.push(new CustomClass({ id: Math.random() })); });

        it('should return true', () => {
          expect(association.hasChanged).to.be.true;
        });

        context('when removing same element', () => {
          beforeEach(() => { association.value.splice(-1, 1); });

          it('should return false', () => {
            expect(association.hasChanged).to.be.false;
          });
        });
      });
    });
  });

  describe('model with Associations', () => {
    let ModelWithAssociations, OtherModelWithAssociations, model;

    beforeEach(() => {
      ModelWithAssociations = class extends validationMixin(Model) {
        buildFields() {
          return {
            id: new Attribute({ value: 1 }),
            noDefaultAssoc: new HasOne({ model: OtherModelWithAssociations }),
            assoc: new HasOne({ value: {}, model: OtherModelWithAssociations }),
            validatedAssoc: new (validationFieldMixin(HasOne))({
              value: {},
              model: OtherModelWithAssociations,
              validations: {
                required: (value) => {
                  if (value.fields.id.value !== 2) {
                    return 'must be 2';
                  }

                  return true;
                },
              },
            }),
            hasManyAssoc: new HasMany({ value: [], model: OtherModelWithAssociations }),
          };
        }
      };

      OtherModelWithAssociations = class extends validationMixin(Model) {
        buildFields() {
          return {
            id: new Attribute({ value: 1 }),
            assoc: new HasOne({ value: {}, model: ModelWithAssociations }),
          };
        }
      };
    });

    context('when two models reference one another', () => {
      context('on construction', () => {
        it('should not cause a stack overflow', () => {
          model = new ModelWithAssociations();
          expect(model).to.not.be.undefined;
        });
      });
    });

    context('validations', () => {
      context('when invalid', () => {
        beforeEach(() => {
          model = new ModelWithAssociations();
        });

        it('should be invalid', () => {
          expect(model.isValid).to.be.false;
        });

        context('when setting a valid value', () => {
          beforeEach(() => {
            model.fields.validatedAssoc.value.fields.id.value = 2;
          });

          it('should be valid', () => {
            expect(model.isValid).to.be.true;
          });
        });

        context('when setting the whole association and re-setting the value', () => {
          beforeEach(() => {
            model.fields.validatedAssoc.value = new OtherModelWithAssociations({ id: 1 });
            model.fields.validatedAssoc.value.fields.id.value = 2;
          });

          it('should be valid', () => {
            expect(model.isValid).to.be.true;
          });
        });
      });
    });

    context('initially', () => {
      it('should have a value property', () => {
        model = new ModelWithAssociations();

        expect('value' in model.fields.noDefaultAssoc).to.be.true;
      });
    });

    context('when setting a standard object as value', () => {
      it('should return a new instance', () => {
        const modelWithAss = new ModelWithAssociations({ assoc: { id: Math.random() } });
        const newValue = Math.random();
        modelWithAss.fields.assoc.value = { id: newValue };
        expect(modelWithAss.fields.assoc.value.fields.id.value).to.equal(newValue);
      });
    });

    context('when initalizing a new model instance with association', () => {
      it('should equal itself when calling the association value', () => {
        const modelWithAss = new ModelWithAssociations({ assoc: { id: Math.random() } });
        expect(modelWithAss.fields.assoc.value).to.equal(modelWithAss.fields.assoc.value);
      });
    });

    context('when the initial association value is null', () => {
      beforeEach(() => {
        model = new ModelWithAssociations({ assoc: null, validatedAssoc: null, hasManyAssoc: null });
      });

      it('should still load the model', () => {
        expect(model).to.not.be.undefined;
      });
    });
  });
});
