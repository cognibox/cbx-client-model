"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _lodash = require("lodash");

var BaseAttribute =
/*#__PURE__*/
function () {
  function BaseAttribute(_ref) {
    var value = _ref.value;
    (0, _classCallCheck2["default"])(this, BaseAttribute);
    var proxy = constructorValues.call(this);
    constructorTriggers.call(proxy);
    proxy.value = value;
    proxy.setPristine();
    return proxy;
  }

  (0, _createClass2["default"])(BaseAttribute, [{
    key: "getValue",
    value: function getValue(value) {
      return value;
    }
  }, {
    key: "parse",
    value: function parse(value) {
      return value;
    }
  }, {
    key: "reset",
    value: function reset() {
      this.value = this.getOriginalValue();
      this.setPristine();
    }
  }, {
    key: "setPristine",
    value: function setPristine() {
      this.setOriginalValuePristine();
      this.isDirty = false;
      this.hasChanged = false;
    }
  }, {
    key: "setValue",
    value: function setValue(newValue, oldValue) {
      if (!(0, _lodash.isEqual)(oldValue, newValue)) {
        this.hasChanged = !(0, _lodash.isEqual)(this.getOriginalValue(), newValue);
        this.isDirty = true;
      }

      return this.parse(newValue);
    }
  }]);
  return BaseAttribute;
}();

var _default = BaseAttribute; ////////////////

exports["default"] = _default;

function constructorValues() {
  var _this = this;

  var originalValue;

  this.getOriginalValue = function () {
    return originalValue;
  };

  this.setOriginalValuePristine = function () {
    originalValue = _this.value;
  };

  var proxy = new Proxy(this, {
    get: function get(target, property) {
      return target[property];
    },
    set: function set(target, property, newValue) {
      if (property === 'value') {
        target[property] = proxy.setValue(newValue, proxy.value);
        proxy.trigger('change');
      } else {
        target[property] = newValue;
      }

      return true;
    }
  });
  return proxy;
}

function constructorTriggers() {
  var _this2 = this;

  var eventCallbacks = {};

  this.on = function (eventType, callback) {
    eventCallbacks[eventType] = eventCallbacks[eventType] || [];
    eventCallbacks[eventType].push(callback);
  };

  this.trigger = function (eventType) {
    if (!eventCallbacks[eventType]) return;
    eventCallbacks[eventType].forEach(function (callback) {
      return callback.call(_this2, _this2.value, _this2.getOriginalValue());
    });
  };
}