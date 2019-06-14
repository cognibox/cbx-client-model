"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _lodash = require("lodash");

var Attribute =
/*#__PURE__*/
function () {
  function Attribute(_ref) {
    var _this = this;

    var value = _ref.value;
    (0, _classCallCheck2["default"])(this, Attribute);
    var proxy = constructorValues.call(this);
    constructorTriggers.call(proxy);
    proxy.constructorOptions = arguments[0];
    proxy.value = value;
    proxy.setPristine();
    proxy.on('change', function () {
      proxy.computeHasChanged();

      if (_this.hasChanged) {
        _this.isDirty = true;
      }
    });
    return proxy;
  }

  (0, _createClass2["default"])(Attribute, [{
    key: "computeHasChanged",
    value: function computeHasChanged() {
      this.hasChanged = !(0, _lodash.isEqual)(this.originalValue, this.value);
    }
  }, {
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
      this.value = this.originalValue;
      this.setPristine();
    }
  }, {
    key: "setPristine",
    value: function setPristine() {
      this.originalValue = this.value;
      this.isDirty = false;
      this.hasChanged = false;
    }
  }, {
    key: "setValue",
    value: function setValue(newValue) {
      return this.parse(newValue);
    }
  }]);
  return Attribute;
}();

var _default = Attribute; ////////////////

exports["default"] = _default;

function constructorValues() {
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
      return callback.call(_this2, _this2.value, _this2.originalValue);
    });
  };
}