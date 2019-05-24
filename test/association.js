import chai from 'chai';
import sinonChai from 'sinon-chai';
import Association from '../lib/association.js';
import Model from '../lib/model.js';

const expect = chai.expect;
chai.use(sinonChai);

describe('Association', () => {
  const CustomClass = class extends Model {
    static attributes() {
      return { id: {} };
    }
  };

  describe('constructor', () => {
    context('with a value', () => {
      let type;

      context('when type is belongsTo', () => {
        beforeEach(() => { type = 'belongsTo'; });

        context('when value is an instance of the association class', () => {
          it('should set the value', () => {
            const value = new CustomClass();
            const association = new Association({ value: value, type: type, class: CustomClass });

            expect(association.value).to.equal(value);
          });
        });

        context('when value is not an instance of the association class', () => {
          it('should set the value to an instance of the association class', () => {
            const value = { id: Math.random() };
            const association = new Association({ value: value, type: type, class: CustomClass });

            expect(association.value).to.be.instanceof(CustomClass);
            expect(association.value.attributes.id.value).to.equal(value.id);
          });
        });
      });

      context('when type is hasOne', () => {
        beforeEach(() => { type = 'hasOne'; });

        context('when value is an instance of the association class', () => {
          it('should set the value', () => {
            const value = new CustomClass();
            const association = new Association({ value: value, type: type, class: CustomClass });

            expect(association.value).to.equal(value);
          });
        });

        context('when value is not an instance of the association class', () => {
          it('should set the value to an instance of the association class', () => {
            const value = { id: Math.random() };
            const association = new Association({ value: value, type: type, class: CustomClass });

            expect(association.value).to.be.instanceof(CustomClass);
            expect(association.value.attributes.id.value).to.equal(value.id);
          });
        });
      });

      context('when type is hasMany', () => {
        beforeEach(() => { type = 'hasMany'; });

        context('when values are instance of the association class', () => {
          it('should set the value', () => {
            const values = [Math.random(), Math.random()];
            const instances = values.map((value) => {
              return new CustomClass({ id: value });
            });
            const association = new Association({ value: instances, type: type, class: CustomClass });

            expect(association.value.map((v) => v.attributes.id.value)).to.deep.equal(values);
          });
        });

        context('when values are not instance of the association class', () => {
          it('should set the value to an instance of the association class', () => {
            const values = [Math.random(), Math.random()];
            const association = new Association({ value: values, type: type, class: CustomClass });

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
        type = 'hasMany';
        const instances = [new CustomClass({ id: Math.random() }), new CustomClass({ id: Math.random() })];
        association = new Association({ value: instances, type: type, class: CustomClass });
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
