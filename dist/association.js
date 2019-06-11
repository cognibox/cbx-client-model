"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _construct2 = _interopRequireDefault(require("@babel/runtime/helpers/construct"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _attribute = _interopRequireDefault(require("./attribute"));

var _lodash = require("lodash");

var Association =
/*#__PURE__*/
function (_Attribute) {
  (0, _inherits2["default"])(Association, _Attribute);

  function Association() {
    (0, _classCallCheck2["default"])(this, Association);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Association).apply(this, arguments));
  }

  (0, _createClass2["default"])(Association, [{
    key: "computeHasChanged",
    value: function computeHasChanged() {
      (0, _get2["default"])((0, _getPrototypeOf2["default"])(Association.prototype), "computeHasChanged", this).call(this);
      this.hasChanged = this.hasChanged || !!(0, _lodash.xor)(this.originalPrimaryKeys, this.getPrimaryKeys()).length;
    }
  }, {
    key: "getPrimaryKeys",
    value: function getPrimaryKeys() {
      if (!this.value || this.constructorOptions.type !== 'hasMany') return;
      var primaryKey = this.modelClass().getPrimaryKey();
      return this.value.map(function (instance) {
        return instance.attributes[primaryKey].value;
      });
    }
  }, {
    key: "instantiate",
    value: function instantiate() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (0, _construct2["default"])(this.modelClass(), args);
    }
  }, {
    key: "modelClass",
    value: function modelClass() {
      this._modelClass = this._modelClass || this.loadClass(this.constructorOptions["class"]);
      return this._modelClass;
    }
  }, {
    key: "parse",
    value: function parse(properties) {
      if (this.constructorOptions.type === 'hasOne') {
        return this.parseHasOne(properties);
      } else if (this.constructorOptions.type === 'hasMany') {
        return this.parseHasMany(properties);
      } else if (this.constructorOptions.type === 'belongsTo') {
        return this.parseBelongsTo(properties);
      }

      return properties;
    }
  }, {
    key: "parseSingle",
    value: function parseSingle(properties) {
      if (properties instanceof this.modelClass()) {
        return properties;
      }

      return this.instantiate(properties);
    }
  }, {
    key: "parseHasOne",
    value: function parseHasOne(properties) {
      return this.parseSingle(properties);
    }
  }, {
    key: "parseHasMany",
    value: function parseHasMany(properties) {
      var _this = this;

      if (!Array.isArray(properties)) return;
      var parsedProperties = [];
      properties.forEach(function (property) {
        parsedProperties.push(_this.parseSingle(property));
      });
      var proxy = new Proxy(parsedProperties, {
        get: function get(target, property) {
          return target[property];
        },
        set: function set(target, property, newValue) {
          target[property] = newValue;

          if (property === 'length') {
            _this.trigger('change');
          }

          return true;
        }
      });
      return proxy;
    }
  }, {
    key: "parseBelongsTo",
    value: function parseBelongsTo(properties) {
      return this.parseSingle(properties);
    }
  }, {
    key: "loadClass",
    value: function loadClass(classToLoad) {
      return classToLoad;
    }
  }, {
    key: "setPristine",
    value: function setPristine() {
      (0, _get2["default"])((0, _getPrototypeOf2["default"])(Association.prototype), "setPristine", this).call(this);
      this.originalPrimaryKeys = this.getPrimaryKeys();
    }
  }]);
  return Association;
}(_attribute["default"]);

var _default = Association;
exports["default"] = _default;