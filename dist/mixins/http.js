"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _axios = _interopRequireDefault(require("axios"));

var _association = require("../association.js");

var mixin = function mixin(superclass) {
  return (
    /*#__PURE__*/
    function (_superclass) {
      (0, _inherits2["default"])(_class, _superclass);
      (0, _createClass2["default"])(_class, null, [{
        key: "urlResource",
        value: function urlResource() {}
      }, {
        key: "urlRoot",
        value: function urlRoot() {}
      }, {
        key: "buildUrl",
        value: function buildUrl(id) {
          var parts = [this.urlRoot(), this.urlResource(), id];
          return parts.filter(function (part) {
            return part;
          }).join('/');
        }
      }, {
        key: "decode",
        value: function decode() {
          var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          return properties;
        }
      }, {
        key: "encode",
        value: function encode() {
          var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          return properties;
        }
      }, {
        key: "encodeSyncOptions",
        value: function encodeSyncOptions(config) {
          var clonedConfig = (0, _objectSpread2["default"])({}, config);
          clonedConfig.params = this.encode(clonedConfig.params);
          return clonedConfig;
        }
      }, {
        key: "fetchAll",
        value: function fetchAll() {
          var _this2 = this;

          var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
              url = _ref.url,
              _ref$options = _ref.options,
              options = _ref$options === void 0 ? {} : _ref$options;

          url = url || this.buildUrl();
          var encodedOptions = this.encodeSyncOptions(options);
          return _axios["default"].get(url, encodedOptions).then(function (resp) {
            var result = {
              raw: resp.data
            };
            var data = Array.isArray(resp.data) ? resp.data : resp.data.data;
            result.data = data.map(function (item) {
              return new _this2(_this2.decode(item));
            });
            return result;
          });
        }
      }, {
        key: "fetchOne",
        value: function fetchOne(id, options) {
          var Model = this;
          var primaryKey = this.primaryKey();
          var model = new Model((0, _defineProperty2["default"])({}, primaryKey, id));
          return model.fetch(options).then(function () {
            return model;
          });
        }
      }]);

      function _class() {
        var _getPrototypeOf2;

        var _this;

        (0, _classCallCheck2["default"])(this, _class);

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(_class)).call.apply(_getPrototypeOf2, [this].concat(args)));
        Object.keys(_this.fields).forEach(function (fieldKey) {
          var field = _this.fields[fieldKey];
          if (!(field instanceof _association.Association)) return;
          field.baseUrl = _this.buildUrl();
        });
        return _this;
      }

      (0, _createClass2["default"])(_class, [{
        key: "buildUrl",
        value: function buildUrl() {
          return this.constructor.buildUrl(this.primaryField().value);
        }
      }, {
        key: "fetch",
        value: function fetch() {
          var _this3 = this;

          var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
              url = _ref3.url,
              _ref3$options = _ref3.options,
              options = _ref3$options === void 0 ? {} : _ref3$options;

          url = url || this.buildUrl();
          var encodedOptions = this.constructor.encodeSyncOptions(options);
          return _axios["default"].get(url, encodedOptions).then(function (resp) {
            _this3.set(_this3.constructor.decode(resp.data));

            return resp;
          });
        }
      }, {
        key: "isNew",
        value: function isNew() {
          var primaryValue = this.fields[this.constructor.primaryKey()].value;
          return primaryValue === undefined || primaryValue === null;
        }
      }, {
        key: "httpParse",
        value: function httpParse() {
          var _this4 = this;

          var values = {};
          var fieldValues = Object.keys(this.fields);

          if (!this.isNew()) {
            fieldValues = fieldValues.filter(function (key) {
              return _this4.fields[key].hasChanged;
            });
          }

          fieldValues.forEach(function (key) {
            values[key] = _this4.fields[key].httpParse();
          });
          return values;
        }
      }, {
        key: "save",
        value: function save() {
          var _this5 = this;

          var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          var modelData = this.httpParse();
          var method = this.isNew() ? 'post' : 'patch';
          data = Object.assign(modelData, data);
          data = this.constructor.encode(data);
          var url = this.buildUrl();
          return _axios["default"][method](url, data).then(function (resp) {
            _this5.setPristine();

            return resp;
          });
        }
      }]);
      return _class;
    }(superclass)
  );
};

var _default = mixin;
exports["default"] = _default;