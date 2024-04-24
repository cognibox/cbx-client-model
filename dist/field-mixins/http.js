"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _construct2 = _interopRequireDefault(require("@babel/runtime/helpers/construct"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _helper = require("../helper");

var _result = _interopRequireDefault(require("lodash/result"));

var _default = function _default(superclass) {
  return (
    /*#__PURE__*/
    function (_superclass) {
      (0, _inherits2["default"])(_class, _superclass);

      function _class(_ref) {
        var _this;

        var url = _ref.url;
        (0, _classCallCheck2["default"])(this, _class);
        _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(_class).apply(this, arguments));
        _this.overrideUrl = url;
        return _this;
      }

      (0, _createClass2["default"])(_class, [{
        key: "sync",
        value: function sync(_ref2) {
          var method = _ref2.method,
              url = _ref2.url,
              options = _ref2.options;
          return (0, _helper.sync)({
            method: method,
            url: url,
            options: options
          });
        }
      }, {
        key: "fetch",
        value: function fetch() {
          var _this2 = this;

          var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
              url = _ref3.url,
              _ref3$options = _ref3.options,
              options = _ref3$options === void 0 ? {} : _ref3$options;

          url = url || this.url();
          return (0, _helper.sync)({
            method: 'get',
            url: url,
            options: options
          }).then(function (resp) {
            _this2.value = resp.data;

            _this2.setPristine();

            return resp;
          });
        }
      }, {
        key: "httpParse",
        value: function httpParse(key) {
          var value;

          if (Array.isArray(this.value)) {
            value = this.value.map(function (assocInstance) {
              return assocInstance.httpParse();
            });
          } else {
            value = this.value && this.value.httpParse();
          }

          return (0, _defineProperty2["default"])({}, key, value);
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
          return (0, _result["default"])(this, 'overrideUrl') || "".concat(this.baseUrl, "/").concat(this.ModelClass.urlResource());
        }
      }]);
      return _class;
    }(superclass)
  );
};

exports["default"] = _default;