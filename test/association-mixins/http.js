import { expect } from 'chai';
import Model from '../../lib/model.js';
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
      static attributes() { return { id: {}, stuff: {} }; }

      static urlResource() { return associationUrlRessource; }
    };

    KlassWithAssociations = class extends Klass {
      static attributes() { return { id: {} }; }

      static associations() {
        return {
          element: { type: 'hasOne', class: AssociationKlass },
        };
      }
    };

    model = new KlassWithAssociations({ id: id });
  });

  describe('#fetch', () => {
    it('should set association model properties', async() => {
      configureHttpMock();
      await model.associations.element.fetch();
      expect(model.associations.element.value.attributes.stuff.value).to.equal(data.stuff);
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

        await model.associations.element.fetch(clientOptions);
        expect(model.associations.element.value.attributes.stuff.value).to.eq(data.stuff);
      });
    });
  });
});
