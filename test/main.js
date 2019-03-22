import { expect } from 'chai';
import Model from '../main.js';

describe('Model', () => {
  describe('#constructor', () => {
    describe('with default values', () => {
      const defaultName = 'jean';
      class CustomModel extends Model {
        static attributes() { return { name: { default: defaultName } }; }
      }

      describe('with values in parameters', () => {
        it('should take passed values', () => {
          const customName = 'marc';
          const customModel = new CustomModel({ name: 'marc' });
          expect(customModel.attributes.name.value).to.equal(customName);
        });
      });

      describe('without values in parameters', () => {
        it('should take default values', () => {
          const customModel = new CustomModel();
          expect(customModel.attributes.name.value).to.equal(defaultName);
        });
      });
    });
  });
});
