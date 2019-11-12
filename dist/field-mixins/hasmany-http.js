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

var _helper = require("../helper");

var _http2 = _interopRequireDefault(require("./http"));

var _default = function _default(superclass) {
  return (
    /*#__PURE__*/
    function (_http) {
      (0, _inherits2["default"])(_class, _http);

      function _class() {
        (0, _classCallCheck2["default"])(this, _class);
        return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(_class).apply(this, arguments));
      }

      (0, _createClass2["default"])(_class, [{
        key: "fetch",
        value: function fetch() {
          var _this = this;

          var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
              url = _ref.url,
              _ref$options = _ref.options,
              options = _ref$options === void 0 ? {} : _ref$options;

          url = url || this.url();
          return (0, _helper.sync)({
            method: 'get',
            url: url,
            options: options
          }).then(function (resp) {
            var result = (0, _helper.parseHttpListResponse)(resp, _this.ModelClass);
            _this.value = result.data;

            _this.setPristine();

            return result;
          });
        }
      }]);
      return _class;
    }((0, _http2["default"])(superclass))
  );
};

exports["default"] = _default;