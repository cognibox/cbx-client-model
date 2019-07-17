import chai from 'chai';
import sinonChai from 'sinon-chai';
import { BelongsTo, HasMany, HasOne } from '../lib/association.js';
import Attribute from '../lib/attribute.js';
import Model from '../lib/model.js';

const expect = chai.expect;
chai.use(sinonChai);

describe('Association', () => {
  let CustomClass;

  beforeEach(() => {
    CustomClass = class extends Model {
      buildFields() {
        return { id: new Attribute() };
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
        });

        context('when value is not an instance of the association class', () => {
          it('should set the value to an instance of the association class', () => {
            const value = { id: Math.random() };
            const association = new BelongsTo({ value: value, model: CustomClass });

            expect(association.value).to.be.instanceof(CustomClass);
            expect(association.value.fields.id.value).to.equal(value.id);
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
});
