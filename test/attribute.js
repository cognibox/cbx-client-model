import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Attribute from '../lib/attribute.js';

const expect = chai.expect;
chai.use(sinonChai);

describe('Attribute', () => {
  describe('constructor', () => {
    let model;
    const originalValue = Math.random();

    beforeEach(() => {
      model = new Attribute({ value: originalValue });
    });

    it('should set hasChanged to false', () => { expect(model.hasChanged).to.be.false; });

    it('should set isDirty to false', () => { expect(model.isDirty).to.be.false; });
  });

  describe('reset', () => {
    let model;
    const originalValue = Math.random();

    beforeEach(() => {
      model = new Attribute({ value: originalValue });
      model.value = originalValue + 1;
      model.reset();
    });

    it('should set value to originalValue', () => { expect(model.value).to.equal(originalValue); });
    it('should set hasChanged to false', () => { expect(model.hasChanged).to.be.false; });
    it('should set isDirty to false', () => { expect(model.isDirty).to.be.false; });
  });

  describe('set', () => {
    let model, spyTrigger, spyParse;
    const originalValue = Math.random();

    beforeEach(() => {
      model = new Attribute({ value: originalValue });
      spyTrigger = sinon.spy(model, 'trigger');
      spyParse = sinon.spy(model, 'parse');
    });

    describe('when new value is different from old value', () => {
      let newValue;

      beforeEach(() => {
        newValue = originalValue + 1;
        model.value = newValue;
      });

      it('should trigger the parse', () => { expect(spyParse).to.have.been.called; });
      it('should trigger the change event', () => { expect(spyTrigger).to.have.been.calledWith('change'); });
      it('should store the new value', () => { expect(model.value).to.equal(newValue); });
      it('should set hasChanged to true', () => { expect(model.hasChanged).to.be.true; });
      it('should set isDirty to true', () => { expect(model.isDirty).to.be.true; });

      describe('when value is set back to the original value', () => {
        beforeEach(() => { model.value = originalValue; });

        it('should set hasChanged to false', () => { expect(model.hasChanged).to.be.false; });
        it('should keep isDirty to true', () => { expect(model.isDirty).to.be.true; });
      });
    });

    describe('when new value is not different from old value', () => {
      beforeEach(() => { model.value = originalValue; });

      it('should not trigger the parse', () => { expect(spyParse).to.not.have.been.called; });
      it('should not trigger the change event', () => { expect(spyTrigger).to.not.have.been.calledWith('change'); });
      it('should keep hasChanged to false', () => { expect(model.hasChanged).to.be.false; });
      it('should keep isDirty to false', () => { expect(model.isDirty).to.be.false; });
    });

    describe('when listening for changes', () => {
      it('should call listener', () => {
        const callback = sinon.stub();
        model.on('change', callback);

        model.value = originalValue + 1;

        expect(callback).to.have.been.calledWith({ value: model.value, originalValue, oldValue: originalValue });
      });
    });
  });

  describe('setPristine', () => {
    let model, originalValue, newValue;

    beforeEach(() => {
      originalValue = Math.random();
      model = new Attribute({ value: originalValue });
      newValue = originalValue + 5;
      model.value = newValue;
    });

    it('should set isDirty to false', () => {
      model.setPristine();
      expect(model.isDirty).to.be.false;
    });

    it('should set hasChanged to false', () => {
      model.setPristine();
      expect(model.hasChanged).to.be.false;
    });

    it('should set originalValue to newValue', () => {
      model.setPristine();
      expect(model.originalValue).to.equal(newValue);
    });
  });
});
