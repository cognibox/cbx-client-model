import axios from 'axios';
import chai from 'chai';
import Model from '../../model.js';
import HttpMixin from '../../mixins/http.js';
import AxiosMockAdapter from 'axios-mock-adapter';
import chaiAsPromised from 'chai-as-promised';

const httpMock = new AxiosMockAdapter(axios);
const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Http', () => {
  let urlResource, urlRoot, Klass;

  beforeEach(() => {
    urlResource = Math.random().toString();
    urlRoot = Math.random().toString();

    Klass = class extends HttpMixin(Model) {
      static urlRoot() { return urlRoot; }

      static urlResource() { return urlResource; }
    };
  });

  describe('.buildUrl', () => {
    it('should format an url using urlRoot and urlResource', () => {
      expect(Klass.buildUrl()).to.equal(`${urlRoot}/${urlResource}`);
    });
  });

  describe('.fetchOne', () => {
    let KlassWithAttributes, id, url, data;

    beforeEach(() => {
      id = Math.random();
      url = `${urlRoot}/${urlResource}/${id}`;
      data = {
        stuff: Math.random()
      };

      KlassWithAttributes = class extends Klass {
        static attributes() { return { id: {}, stuff: {} }; }
      };

      httpMock.onGet(url).reply(200, data);
    });

    it('should return a new instance', async() => {
      const model = await KlassWithAttributes.fetchOne(id);
      expect(model).to.be.instanceof(KlassWithAttributes);
    });

    it('should set model properties', async() => {
      const model = await KlassWithAttributes.fetchOne(id);
      expect(model.attributes.stuff.value).to.equal(data.stuff);
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

  describe('#fetch', () => {
    let model, KlassWithAttributes, id, url, data;

    beforeEach(() => {
      id = Math.random();
      url = `${urlRoot}/${urlResource}/${id}`;
      data = {
        stuff: Math.random()
      };

      KlassWithAttributes = class extends Klass {
        static attributes() { return { id: {}, stuff: {} }; }
      };

      model = new KlassWithAttributes({ id: id });

      httpMock.onGet(url).reply(200, data);
    });

    it('should set model properties', async() => {
      await model.fetch();
      expect(model.attributes.stuff.value).to.equal(data.stuff);
    });
  });
});
