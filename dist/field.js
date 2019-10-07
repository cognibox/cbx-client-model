"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _isEqual = _interopRequireDefault(require("lodash/isEqual"));

var Field =
/*#__PURE__*/
function () {
  (0, _createClass2["default"])(Field, [{
    key: "beforeConstructor",
    value: function beforeConstructor() {}
  }]);

  function Field() {
    var _this = this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        value = _ref.value;

    (0, _classCallCheck2["default"])(this, Field);
    this.beforeConstructor.apply(this, arguments);
    var proxy = constructorValues.call(this);
    constructorTriggers.call(proxy);
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

  (0, _createClass2["default"])(Field, [{
    key: "computeHasChanged",
    value: function computeHasChanged() {
      this.hasChanged = !(0, _isEqual["default"])(this.originalValue, this.value);
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
  return Field;
}(); ////////////////


exports["default"] = Field;

function constructorValues() {
  var _this2 = this;

  var proxy = new Proxy(this, {
    get: function get(target, property) {
      return target[property];
    },
    set: function set(target, property, newValue) {
      if (property === 'value') {
        if (proxy.value !== newValue) {
          var oldValue = proxy.value;
          target[property] = proxy.setValue(newValue, proxy.value);
          proxy.trigger('change', {
            oldValue: oldValue,
            value: _this2.value,
            originalValue: _this2.originalValue
          });
        }
      } else {
        target[property] = newValue;
      }

      return true;
    }
  });
  return proxy;
}

function constructorTriggers() {
  var _this3 = this;

  var eventCallbacks = {};

  this.on = function (eventType, callback) {
    eventCallbacks[eventType] = eventCallbacks[eventType] || [];
    eventCallbacks[eventType].push(callback);
  };

  this.trigger = function (eventType) {
    for (var _len = arguments.length, options = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      options[_key - 1] = arguments[_key];
    }

    if (!eventCallbacks[eventType]) return;
    eventCallbacks[eventType].forEach(function (callback) {
      return callback.call.apply(callback, [_this3].concat(options));
    });
  };
}