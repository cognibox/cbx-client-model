import { expect } from 'chai';
import { Model } from '../lib/main.js';
import Attribute from '../lib/attribute.js';

describe('Main', () => {
  describe('#constructor', () => {
    describe('with default values', () => {
      const defaultName = 'jean';
      let CustomModel;

      beforeEach(() => {
        CustomModel = class extends Model {
          buildFields() { return { name: new Attribute({ value: defaultName }) }; }
        };
      });

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
