import chai from 'chai';
import sinonChai from 'sinon-chai';
import Association from '../lib/association.js';

const expect = chai.expect;
chai.use(sinonChai);

describe('Association', () => {
  describe('constructor', () => {
    const CustomClass = class {
      constructor(value) {
        this.value = value;
      }
    };

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
            const value = {};
            const association = new Association({ value: value, type: type, class: CustomClass });

            expect(association.value).to.be.instanceof(CustomClass);
            expect(association.value.value).to.equal(value);
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
            const value = {};
            const association = new Association({ value: value, type: type, class: CustomClass });

            expect(association.value).to.be.instanceof(CustomClass);
            expect(association.value.value).to.equal(value);
          });
        });
      });

      context('when type is hasMany', () => {
        beforeEach(() => { type = 'hasMany'; });

        context('when values are instance of the association class', () => {
          it('should set the value', () => {
            const values = [Math.random(), Math.random()];
            const instances = values.map((value) => {
              return new CustomClass(value);
            });
            const association = new Association({ value: instances, type: type, class: CustomClass });

            expect(association.value.map((v) => v.value)).to.deep.equal(values);
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
});
