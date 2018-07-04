import { expect } from 'chai';
import Base from '../../base.js';
import HttpMixin from '../../mixins/http.js';

describe('Http', () => {
  let urlResource, urlRoot, Klass;

  beforeEach(() => {
    urlResource = Math.random().toString();
    urlRoot = Math.random().toString();

    Klass = class extends HttpMixin(Base) {
      static urlRoot() { return urlRoot; }

      static urlResource() { return urlResource; }
    };
  });

  describe('.buildUrl', () => {
    it('should format an url using urlRoot and urlResource', () => {
      expect(Klass.buildUrl()).to.equal(`${urlRoot}/${urlResource}`);
    });
  });

  describe('#buildUrl', () => {
    describe('when id is the primary key', () => {
      let KlassWithAttributes;

      beforeEach(() => {
        KlassWithAttributes = class extends Klass {
          static attributes() { return { id: {} }; }
        };
      });

      it('should format url using urlRoot, urlResource, id', () => {
        const id = Math.random();
        const klass = new KlassWithAttributes({ id: id });

        expect(klass.buildUrl()).to.equal(`${urlRoot}/${urlResource}/${id}`);
      });
    });

    describe('when id is not the primary key', () => {
      let KlassWithAttributes;

      beforeEach(() => {
        KlassWithAttributes = class extends Klass {
          static attributes() {
            return {
              id: {},
              otherKey: { primary: true }
            };
          }
        };
      });

      it('should format url using urlRoot, urlResource, otherKey', () => {
        const otherKey = Math.random();
        const klass = new KlassWithAttributes({ id: Math.random(), otherKey: otherKey });

        expect(klass.buildUrl()).to.equal(`${urlRoot}/${urlResource}/${otherKey}`);
      });
    });
  });
});
