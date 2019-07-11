import { expect } from 'chai';
import Model from '../lib/main.js';

describe('Model', () => {
  describe('#constructor', () => {
    describe('with default values', () => {
      const defaultName = 'jean';

      class CustomModel extends Model {
        static fields() { return { name: { default: defaultName } }; }
      }

      describe('with values in parameters', () => {
        it('should take passed values', () => {
          const customName = 'marc';
          const customModel = new CustomModel({ name: 'marc' });

          expect(customModel.fields.name.value).to.equal(customName);
        });
      });

      describe('without values in parameters', () => {
        it('should take default values', () => {
          const customModel = new CustomModel();

          expect(customModel.fields.name.value).to.equal(defaultName);
        });
      });
    });
  });
});
