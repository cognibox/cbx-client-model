import { expect } from 'chai';
import Model from '../lib/model.js';

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

  describe('#hasChanged', () => {
    context('initially', () => {
      context('when field is initialized with a value', () => {
        it('should be false', () => {
          const defaultValue = Math.random();
          class CustomModel extends Model {
            static fields() { return { element: { default: defaultValue } }; }
          }

          const customInstance = new CustomModel({ element: defaultValue + 1 });

          expect(customInstance.hasChanged).to.be.false;
        });
      });

      context('when field is not initialized with a value', () => {
        context('when field has a default value', () => {
          it('should be false', () => {
            const defaultValue = Math.random();
            class CustomModel extends Model {
              static fields() { return { element: { default: defaultValue } }; }
            }

            const customInstance = new CustomModel();

            expect(customInstance.hasChanged).to.be.false;
          });
        });

        context('when field does not have a default value', () => {
          it('should be false', () => {
            class CustomModel extends Model {
              static fields() { return { element: {} }; }
            }

            const customInstance = new CustomModel();

            expect(customInstance.hasChanged).to.be.false;
          });
        });
      });
    });

    context('when changed', () => {
      it('should return true', () => {
        const defaultValue = Math.random();
        class CustomModel extends Model {
          static fields() { return { element: { default: defaultValue } }; }
        }

        const customInstance = new CustomModel();

        customInstance.fields.element.value = defaultValue + 1;

        expect(customInstance.hasChanged).to.be.true;
      });
    });

    context('model having multiple fields', () => {
      let customInstance;
      const firstFieldValue = Math.random();
      const secondFieldValue = Math.random();
      class CustomModel extends Model {
        static fields() {
          return { firstField: { default: firstFieldValue }, secondField: { default: secondFieldValue } };
        }
      }

      beforeEach(() => { customInstance = new CustomModel(); });

      context('when some fields have changed', () => {
        beforeEach(() => { customInstance.fields.firstField.value = firstFieldValue + 1; });

        it('should be true', () => { expect(customInstance.hasChanged).to.be.true; });

        context('when those fields return to their original value', () => {
          beforeEach(() => { customInstance.fields.firstField.value = firstFieldValue; });

          it('should be false', () => { expect(customInstance.hasChanged).to.be.false; });
        });
      });
    });
  });

  describe('#changes', () => {
    context('initially', () => {
      context('when field is initialized with a value', () => {
        it('should be empty', () => {
          const defaultValue = Math.random();
          class CustomModel extends Model {
            static fields() { return { element: { default: defaultValue } }; }
          }

          const customInstance = new CustomModel({ element: defaultValue + 1 });

          expect(customInstance.changes).to.deep.equal({});
        });
      });

      context('when field is not initialized with a value', () => {
        context('when field has a default value', () => {
          it('should be empty', () => {
            const defaultValue = Math.random();
            class CustomModel extends Model {
              static fields() { return { element: { default: defaultValue } }; }
            }

            const customInstance = new CustomModel();

            expect(customInstance.changes).to.deep.equal({});
          });
        });

        context('when field does not have a default value', () => {
          it('should be empty', () => {
            class CustomModel extends Model {
              static fields() { return { element: {} }; }
            }

            const customInstance = new CustomModel();

            expect(customInstance.changes).to.deep.equal({});
          });
        });
      });
    });

    context('model having multiple fields', () => {
      let customInstance;
      const firstFieldValue = Math.random();
      const secondFieldValue = Math.random();
      class CustomModel extends Model {
        static fields() {
          return { firstField: { default: firstFieldValue }, secondField: { default: secondFieldValue } };
        }
      }

      beforeEach(() => { customInstance = new CustomModel(); });

      context('when some fields have changed', () => {
        const newValue = firstFieldValue + 1;

        beforeEach(() => { customInstance.fields.firstField.value = newValue; });

        it('should list the field with his new and old value', () => {
          expect(customInstance.changes).to.deep.equal({
            firstField: {
              newValue: newValue,
              oldValue: firstFieldValue,
            },
          });
        });

        context('when those fields return to their original value', () => {
          beforeEach(() => { customInstance.fields.firstField.value = firstFieldValue; });

          it('should be empty', () => { expect(customInstance.changes).to.deep.equal({}); });
        });
      });
    });
  });

  describe('#set', () => {
    context('when fields is not defined', () => {
      class CustomModel extends Model {
        static fields() { return { name: {} }; }
      }

      it('should not compute it', () => {
        const model = new CustomModel();
        model.set({ something: Math.random() });
        expect(model.fields.something).to.be.undefined;
      });
    });

    context('having an field parser defined', () => {
      class CustomModel extends Model {
        static fields() { return { name: {} }; }

        parse(properties) {
          if (properties && properties.toParse) {
            properties.name = properties.toParse;
          }

          return super.parse(properties);
        }
      }

      it('should compute it', () => {
        const toParseValue = Math.random();
        const model = new CustomModel();

        model.set({ something: Math.random(), toParse: toParseValue });

        expect(model.fields.name.value).to.equal(toParseValue);
      });
    });
  });

  describe('#setPristine', () => {
    let model;

    beforeEach(() => {
      class CustomModel extends Model {
        static fields() { return { name: {} }; }
      }

      model = new CustomModel({ name: Math.random });
      model.fields.name.value += 5;

      model.setPristine();
    });

    it('should set every fields pristine', () => {
      expect(model.fields.name.hasChanged).to.be.false;
    });

    it('should set changes to an empty object', () => {
      expect(model.changes).to.deep.equal({});
    });

    it('should set hasChanged to false', () => {
      expect(model.hasChanged).to.be.false;
    });
  });

  context('when passing mixins', () => {
    it('should apply the mixins to the class', () => {
      const foo = (superClass) => class extends superClass {
        foo() {
          this.foo2 = 'foo';
          return this.foo;
        }
      };

      const bar = (superClass) => class extends superClass {
        bar() {
          this.bar2 = 'bar';
          return this.bar2;
        }
      };

      class CustomModel extends Model {
        static fields() {
          return {
            name: {
              mixins: [foo, bar],
            },
          };
        }
      }

      const model = new CustomModel();

      expect(model.fields.name.foo()).to.equal('foo');
      expect(model.fields.name.bar()).to.equal('bar');
    });

    it('should bind this to the field', () => {
      const foo = (superClass) => class extends superClass {
        foo() {
          return this.value;
        }
      };

      class CustomModel extends Model {
        static fields() {
          return {
            name: {
              mixins: [foo],
            },
          };
        }
      }

      const model = new CustomModel({ name: 'foo' });

      expect(model.fields.name.foo()).to.equal('foo');
    });
  });

  context('when overriding fieldClass', () => {
    class CustomField extends Model.fieldClass() {}
    class CustomModel extends Model {
      static fieldClass() { return CustomField; }

      static fields() { return { name: {} }; }
    }

    describe('when initializing', () => {
      it('should initialize fields using the new class', () => {
        const customModel = new CustomModel();
        expect(customModel.fields.name).to.be.an.instanceof(CustomField);
      });
    });
  });
});
