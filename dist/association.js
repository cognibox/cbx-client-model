"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HasOne = exports.HasMany = exports.BelongsTo = exports.Association = void 0;

var _get4 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _construct2 = _interopRequireDefault(require("@babel/runtime/helpers/construct"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _xor = _interopRequireDefault(require("lodash/xor"));

var _field = _interopRequireDefault(require("./field.js"));

function parseSingle() {
  var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (properties instanceof this.ModelClass) {
    return properties;
  }

  return this.instantiate(properties);
}

var Association =
/*#__PURE__*/
function (_Field) {
  (0, _inherits2["default"])(Association, _Field);

  function Association() {
    (0, _classCallCheck2["default"])(this, Association);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf3["default"])(Association).apply(this, arguments));
  }

  (0, _createClass2["default"])(Association, [{
    key: "beforeConstructor",
    value: function beforeConstructor() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          model = _ref.model;

      this.ModelClass = this.ModelClass || this.loadClass(model);
    }
  }, {
    key: "instantiate",
    value: function instantiate() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (0, _construct2["default"])(this.ModelClass, args);
    }
  }, {
    key: "loadClass",
    value: function loadClass(classToLoad) {
      return classToLoad;
    }
  }]);
  return Association;
}(_field["default"]);

exports.Association = Association;

var SingleAssociation =
/*#__PURE__*/
function (_Association) {
  (0, _inherits2["default"])(SingleAssociation, _Association);

  function SingleAssociation() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2["default"])(this, SingleAssociation);

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var proxy = _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(SingleAssociation)).call.apply(_getPrototypeOf2, [this].concat(args)));

    var valueBeenSet = false;
    var processedValue;
    proxy = new Proxy(proxy, {
      get: function get(target, property) {
        var value = target[property];

        if (property === 'value' && !(value instanceof _this.ModelClass)) {
          if (processedValue === undefined) {
            processedValue = _this.instantiate(value);
            processedValue.on('change', function () {
              _this.trigger('change', {
                newValue: processedValue
              });
            });
          }

          return processedValue;
        }

        return value;
      },
      set: function set(target, property, newValue) {
        if (property === 'value') {
          if (!valueBeenSet) {
            valueBeenSet = true;

            if (newValue) {
              proxy.setPristine();
            }
          }

          if (newValue instanceof _this.ModelClass) {
            newValue.on('change', function () {
              _this.trigger('change', {
                newValue: newValue
              });
            });
          } else {
            processedValue = undefined;
          }
        }

        target[property] = newValue;
        return true;
      }
    });
    return (0, _possibleConstructorReturn2["default"])(_this, proxy);
  }

  (0, _createClass2["default"])(SingleAssociation, [{
    key: "value",
    value: function value() {
      return {};
    }
  }, {
    key: "computeHasChanged",
    value: function computeHasChanged() {
      var primaryKey = this.ModelClass.primaryKey();

      if (this.originalValue.fields && this.value.fields) {
        this.hasChanged = this.originalValue.fields[primaryKey].value !== this.value.fields[primaryKey].value;
      }
    }
  }, {
    key: "parse",
    value: function parse() {
      var _get2;

      var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      properties = (_get2 = (0, _get4["default"])((0, _getPrototypeOf3["default"])(SingleAssociation.prototype), "parse", this)).call.apply(_get2, [this, properties].concat(args)) || {};
      return properties;
    }
  }]);
  return SingleAssociation;
}(Association);

var BelongsTo =
/*#__PURE__*/
function (_SingleAssociation) {
  (0, _inherits2["default"])(BelongsTo, _SingleAssociation);

  function BelongsTo() {
    (0, _classCallCheck2["default"])(this, BelongsTo);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf3["default"])(BelongsTo).apply(this, arguments));
  }

  return BelongsTo;
}(SingleAssociation);

exports.BelongsTo = BelongsTo;

var HasOne =
/*#__PURE__*/
function (_SingleAssociation2) {
  (0, _inherits2["default"])(HasOne, _SingleAssociation2);

  function HasOne() {
    (0, _classCallCheck2["default"])(this, HasOne);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf3["default"])(HasOne).apply(this, arguments));
  }

  return HasOne;
}(SingleAssociation);

exports.HasOne = HasOne;

var HasMany =
/*#__PURE__*/
function (_Association2) {
  (0, _inherits2["default"])(HasMany, _Association2);

  function HasMany() {
    (0, _classCallCheck2["default"])(this, HasMany);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf3["default"])(HasMany).apply(this, arguments));
  }

  (0, _createClass2["default"])(HasMany, [{
    key: "computeHasChanged",
    value: function computeHasChanged() {
      this.hasChanged = !!(0, _xor["default"])(this.originalPrimaryKeys, this.primaryKeys()).length;
    }
  }, {
    key: "primaryKeys",
    value: function primaryKeys() {
      if (!this.value) return [];
      var primaryKey = this.ModelClass.primaryKey();
      return this.value.map(function (instance) {
        return instance.fields[primaryKey].value;
      });
    }
  }, {
    key: "parse",
    value: function parse() {
      var _get3,
          _this2 = this;

      var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }

      properties = (_get3 = (0, _get4["default"])((0, _getPrototypeOf3["default"])(HasMany.prototype), "parse", this)).call.apply(_get3, [this, properties].concat(args)) || [];
      if (!Array.isArray(properties)) throw TypeError('[CbxClientModel][Association] type hasMany must be arrays');
      var parsedProperties = [];
      properties.forEach(function (property) {
        parsedProperties.push(parseSingle.call(_this2, property));
      });
      var proxy = new Proxy(parsedProperties, {
        get: function get(target, property) {
          return target[property];
        },
        set: function set(target, property, newValue) {
          target[property] = newValue;

          if (property === 'length') {
            _this2.trigger('change');
          }

          return true;
        }
      });
      return proxy;
    }
  }, {
    key: "setPristine",
    value: function setPristine() {
      (0, _get4["default"])((0, _getPrototypeOf3["default"])(HasMany.prototype), "setPristine", this).call(this);
      this.originalPrimaryKeys = this.primaryKeys();
    }
  }]);
  return HasMany;
}(Association);

exports.HasMany = HasMany;