import chai from 'chai';
import sinonChai from 'sinon-chai';
import Field from '../lib/field';
import { belongsTo, hasMany, hasOne } from '../lib/field-mixins/association.js';
import Model from '../lib/model.js';

const expect = chai.expect;
chai.use(sinonChai);

describe('Association', () => {
  const CustomClass = class extends Model {
    static fields() {
      return {
        id: {},
      };
    }
  };

  describe('constructor', () => {
    context('with a value', () => {
      let type;

      context('when type is belongsTo', () => {
        beforeEach(() => { type = belongsTo; });

        context('when value is an instance of the association class', () => {
          it('should set the value', () => {
            const value = new CustomClass();
            const association = new Field({
              value: value,
              mixins: [type(CustomClass)],
            });

            expect(association.value).to.equal(value);
          });
        });

        context('when value is not an instance of the association class', () => {
          it('should set the value to an instance of the association class', () => {
            const value = { id: Math.random() };
            const AssociationClass = type(CustomClass)(Field);
            const association = new AssociationClass({
              value: value,
              mixins: [type(CustomClass)],
            });

            expect(association.value).to.be.instanceof(CustomClass);
            expect(association.value.fields.id.value).to.equal(value.id);
          });
        });
      });

      context('when type is hasOne', () => {
        beforeEach(() => { type = hasOne; });

        context('when value is an instance of the association class', () => {
          it('should set the value', () => {
            const value = new CustomClass();
            const AssociationClass = type(CustomClass)(Field);
            const association = new AssociationClass({
              value: value,
              mixins: [type(CustomClass)],
            });

            expect(association.value).to.equal(value);
          });
        });

        context('when value is not an instance of the association class', () => {
          it('should set the value to an instance of the association class', () => {
            const value = { id: Math.random() };
            const AssociationClass = type(CustomClass)(Field);
            const association = new AssociationClass({
              value: value,
              mixins: [type(CustomClass)],
            });

            expect(association.value).to.be.instanceof(CustomClass);
            expect(association.value.fields.id.value).to.equal(value.id);
          });
        });
      });

      context('when type is hasMany', () => {
        beforeEach(() => { type = hasMany; });

        context('when values are instance of the association class', () => {
          it('should set the value', () => {
            const values = [Math.random(), Math.random()];
            const instances = values.map((value) => new CustomClass({ id: value }));
            const AssociationClass = type(CustomClass)(Field);
            const association = new AssociationClass({
              value: instances,
              mixins: [type(CustomClass)],
            });

            expect(association.value.map((v) => v.fields.id.value)).to.deep.equal(values);
          });
        });

        context('when values are not instance of the association class', () => {
          it('should set the value to an instance of the association class', () => {
            const values = [{ id: Math.random() }, { id: Math.random() }];
            const AssociationClass = type(CustomClass)(Field);
            const association = new AssociationClass({
              value: values,
              mixins: [type(CustomClass)],
            });

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
    let type;

    context('for hasMany association', () => {
      let association;

      beforeEach(() => {
        type = hasMany;
        const instances = [new CustomClass({ id: Math.random() }), new CustomClass({ id: Math.random() })];
        const AssociationClass = type(CustomClass)(Field);
        association = new AssociationClass({
          value: instances,
          mixins: [type(CustomClass)],
        });
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
