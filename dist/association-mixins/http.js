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

var mixin = function mixin(superclass) {
  return (
    /*#__PURE__*/
    function (_superclass) {
      (0, _inherits2["default"])(_class, _superclass);

      function _class() {
        (0, _classCallCheck2["default"])(this, _class);
        return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(_class).apply(this, arguments));
      }

      (0, _createClass2["default"])(_class, [{
        key: "fetch",
        value: function fetch(options) {
          var _this = this;

          return _axios["default"].get(this.url(), this.modelClass().encode(options)).then(function (resp) {
            _this.value = resp.data;
            return resp;
          });
        }
      }, {
        key: "instantiate",
        value: function instantiate(properties) {
          var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          options.baseUrl = this.constructorOptions.baseUrl;

          for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            args[_key - 2] = arguments[_key];
          }

          return (0, _construct2["default"])(this.modelClass(), [properties, options].concat(args));
        }
      }, {
        key: "url",
        value: function url() {
          return "".concat(this.constructorOptions.baseUrl, "/").concat(this.modelClass().urlResource());
        }
      }]);
      return _class;
    }(superclass)
  );
};

var _default = mixin;
exports["default"] = _default;