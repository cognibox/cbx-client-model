import { expect } from 'chai';
import Model from '../../lib/model.js';
import { hasOne } from '../../lib/field-mixins/association';
import HttpMixin from '../../lib/mixins/http.js';
import httpMock from '../helpers/http-mock.js';

describe('Http#association', () => {
  let associationUrl, Klass, KlassWithEncoder, data, httpOptions, associationUrlRessource, urlResource, urlRoot, AssociationKlass, id, KlassWithAssociations, model;

  function configureHttpMock() {
    httpMock(associationUrl, httpOptions).onGet().reply(() => {
      return [200, data];
    });
  }

  beforeEach(() => {
    urlResource = Math.random().toString();
    urlRoot = Math.random().toString();
    associationUrlRessource = Math.random().toString();
    id = Math.random();
    associationUrl = `${urlRoot}/${urlResource}/${id}/${associationUrlRessource}`;
    data = {
      stuff: Math.random(),
    };

    Klass = class extends HttpMixin(Model) {
      static urlRoot() { return urlRoot; }

      static urlResource() { return urlResource; }
    };

    AssociationKlass = class extends Klass {
      static fields() { return { id: {}, stuff: {} }; }

      static urlResource() { return associationUrlRessource; }
    };

    KlassWithAssociations = class extends Klass {
      static fields() {
        return {
          id: {},
          element: {
            mixins: [hasOne(AssociationKlass)],
          },
        };
      }
    };

    model = new KlassWithAssociations({ id: id });
  });

  describe('#fetch', () => {
    it('should set association model properties', async() => {
      configureHttpMock();
      await model.fields.element.fetch();
      expect(model.fields.element.value.fields.stuff.value).to.equal(data.stuff);
    });

    context('when given a custom encode function', () => {
      beforeEach(() => {
        KlassWithEncoder = class extends KlassWithAssociations {
          static encode(properties) {
            return { params: { stuff: `${properties.params.stuff}a` } };
          }
        };
      });

      it('should use the encode function for the payload', async() => {
        const value = Math.random();
        const clientOptions = { params: { stuff: value } };
        httpOptions = { params: { stuff: `${value}a` } };
        configureHttpMock();
        model = new KlassWithEncoder();

        await model.fields.element.fetch(clientOptions);
        expect(model.fields.element.value.fields.stuff.value).to.eq(data.stuff);
      });
    });
  });
});
