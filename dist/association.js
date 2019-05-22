"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _attribute = _interopRequireDefault(require("./attribute"));

var Association =
/*#__PURE__*/
function (_Attribute) {
  (0, _inherits2["default"])(Association, _Attribute);

  function Association() {
    (0, _classCallCheck2["default"])(this, Association);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Association).apply(this, arguments));
  }

  (0, _createClass2["default"])(Association, [{
    key: "instantiate",
    value: function instantiate(value) {
      return new (this.modelClass())(value);
    }
  }, {
    key: "modelClass",
    value: function modelClass() {
      this._modelClass = this._modelClass || this.loadClass(this.constructorOptions["class"]);
      return this._modelClass;
    }
  }, {
    key: "parse",
    value: function parse(value) {
      if (this.constructorOptions.type === 'hasOne') {
        return this.parseHasOne(value);
      } else if (this.constructorOptions.type === 'hasMany') {
        return this.parseHasMany(value);
      } else if (this.constructorOptions.type === 'belongsTo') {
        return this.parseBelongsTo(value);
      }

      return value;
    }
  }, {
    key: "parseSingle",
    value: function parseSingle(value) {
      if (value instanceof this.modelClass()) {
        return value;
      }

      return this.instantiate(value);
    }
  }, {
    key: "parseHasOne",
    value: function parseHasOne(value) {
      return this.parseSingle(value);
    }
  }, {
    key: "parseHasMany",
    value: function parseHasMany(value) {
      return value;
    }
  }, {
    key: "parseBelongsTo",
    value: function parseBelongsTo(value) {
      return this.parseSingle(value);
    }
  }, {
    key: "loadClass",
    value: function loadClass(classToLoad) {
      return classToLoad;
    }
  }]);
  return Association;
}(_attribute["default"]);

var _default = Association;
exports["default"] = _default;