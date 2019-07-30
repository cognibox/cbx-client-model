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

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _axios = _interopRequireDefault(require("axios"));

var _attribute = _interopRequireDefault(require("../attribute.js"));

var _helper = require("../helper.js");

var attributeMixin = function attributeMixin(superclass) {
  return (
    /*#__PURE__*/
    function (_superclass) {
      (0, _inherits2["default"])(_class, _superclass);

      function _class() {
        (0, _classCallCheck2["default"])(this, _class);
        return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(_class).apply(this, arguments));
      }

      (0, _createClass2["default"])(_class, [{
        key: "httpParse",
        value: function httpParse() {
          return this.value;
        }
      }]);
      return _class;
    }(superclass)
  );
};

var associationMixin = function associationMixin(superclass) {
  return (
    /*#__PURE__*/
    function (_superclass2) {
      (0, _inherits2["default"])(_class2, _superclass2);

      function _class2() {
        (0, _classCallCheck2["default"])(this, _class2);
        return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(_class2).apply(this, arguments));
      }

      (0, _createClass2["default"])(_class2, [{
        key: "fetch",
        value: function fetch() {
          var _this = this;

          var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
              url = _ref.url,
              _ref$options = _ref.options,
              options = _ref$options === void 0 ? {} : _ref$options;

          url = url || this.url();
          var encodedOptions = this.ModelClass.encodeSyncOptions(options);
          return _axios["default"].get(url, encodedOptions).then(function (resp) {
            _this.value = resp.data;

            _this.setPristine();

            return resp;
          });
        }
      }, {
        key: "httpParse",
        value: function httpParse() {
          if (Array.isArray(this.value)) {
            return this.value.map(function (assocInstance) {
              return assocInstance.httpParse();
            });
          }

          return this.value && this.value.httpParse();
        }
      }, {
        key: "instantiate",
        value: function instantiate(properties) {
          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          return (0, _construct2["default"])(this.ModelClass, [properties].concat(args));
        }
      }, {
        key: "url",
        value: function url() {
          return "".concat(this.baseUrl, "/").concat(this.ModelClass.urlResource());
        }
      }]);
      return _class2;
    }(superclass)
  );
};

var _default = function _default(superclass) {
  return (0, _helper.isInheritedFrom)(superclass, _attribute["default"]) ? attributeMixin(superclass) : associationMixin(superclass);
};

exports["default"] = _default;