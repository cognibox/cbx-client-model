"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _get3 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _axios = _interopRequireDefault(require("axios"));

var _http = _interopRequireDefault(require("../association-mixins/http.js"));

var mixin = function mixin(superclass) {
  var AssociationWithHttp =
  /*#__PURE__*/
  function (_AssociationHttpMixin) {
    (0, _inherits2["default"])(AssociationWithHttp, _AssociationHttpMixin);

    function AssociationWithHttp() {
      (0, _classCallCheck2["default"])(this, AssociationWithHttp);
      return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf3["default"])(AssociationWithHttp).apply(this, arguments));
    }

    return AssociationWithHttp;
  }((0, _http["default"])(superclass.associationClass()));

  return (
    /*#__PURE__*/
    function (_superclass) {
      (0, _inherits2["default"])(_class, _superclass);
      (0, _createClass2["default"])(_class, null, [{
        key: "associationClass",
        value: function associationClass() {
          return AssociationWithHttp;
        }
      }, {
        key: "urlResource",
        value: function urlResource() {}
      }, {
        key: "urlRoot",
        value: function urlRoot() {}
      }, {
        key: "buildUrl",
        value: function buildUrl(id, baseUrl) {
          var parts = [baseUrl || this.urlRoot(), this.urlResource(), id];
          return parts.filter(function (part) {
            return part;
          }).join('/');
        }
      }, {
        key: "decode",
        value: function decode(properties) {
          return properties;
        }
      }, {
        key: "encode",
        value: function encode(properties) {
          return properties;
        }
      }, {
        key: "fetchAll",
        value: function fetchAll(options) {
          var _this2 = this;

          var url = this.buildUrl();
          return _axios["default"].get(url, this.encode(options)).then(function (resp) {
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
          var primaryKey = this.getPrimaryKey();
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
        var options = args[1];
        options = options || {};
        _this.baseUrl = options.baseUrl;
        return _this;
      }

      (0, _createClass2["default"])(_class, [{
        key: "associationArguments",
        value: function associationArguments() {
          var _get2;

          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          var associationArguments = (_get2 = (0, _get3["default"])((0, _getPrototypeOf3["default"])(_class.prototype), "associationArguments", this)).call.apply(_get2, [this].concat(args));

          associationArguments.baseUrl = this.buildUrl();
          return associationArguments;
        }
      }, {
        key: "buildUrl",
        value: function buildUrl() {
          return this.constructor.buildUrl(this.getPrimaryAttribute().value, this.baseUrl);
        }
      }, {
        key: "fetch",
        value: function fetch(options) {
          var _this3 = this;

          var url = this.buildUrl();
          return _axios["default"].get(url, this.constructor.encode(options)).then(function (resp) {
            _this3.set(_this3.constructor.decode(resp.data));

            return resp;
          });
        }
      }, {
        key: "getPrimaryAttribute",
        value: function getPrimaryAttribute() {
          return this.attributes[this.constructor.getPrimaryKey()];
        }
      }, {
        key: "isNew",
        value: function isNew() {
          var primaryValue = this.attributes[this.constructor.getPrimaryKey()].value;
          return primaryValue === undefined || primaryValue === null;
        }
      }, {
        key: "save",
        value: function save() {
          var _this4 = this;

          var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          var method;
          var modelData = {},
              attributeKeys = Object.keys(this.attributes);

          if (this.isNew()) {
            method = 'post';
            attributeKeys.forEach(function (key) {
              modelData[key] = _this4.attributes[key].value;
            });
          } else {
            method = 'patch';
            attributeKeys.forEach(function (key) {
              if (!_this4.attributes[key].hasChanged) return;
              modelData[key] = _this4.attributes[key].value;
            });
          }

          data = Object.assign(modelData, data);
          data = this.constructor.encode(data);
          var url = this.buildUrl();
          return _axios["default"][method](url, data).then(function (resp) {
            _this4.setPristine();

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