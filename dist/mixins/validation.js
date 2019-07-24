"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var ValidationMixin = function ValidationMixin(superclass) {
  return (
    /*#__PURE__*/
    function (_superclass) {
      (0, _inherits2["default"])(_class, _superclass);

      function _class() {
        var _getPrototypeOf2;

        var _this;

        (0, _classCallCheck2["default"])(this, _class);

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(_class)).call.apply(_getPrototypeOf2, [this].concat(args)));
        var isValid = true;
        var errors = {};
        Object.keys(_this.fields).forEach(function (key) {
          var field = _this.fields[key];
          field.on('validate', function () {
            if (field.isValid) {
              delete errors[key];
            } else {
              errors[key] = field.errors;
            }

            isValid = !Object.keys(errors).length;
          });
        });
        Object.defineProperty((0, _assertThisInitialized2["default"])(_this), 'isValid', {
          enumerable: true,
          get: function get() {
            return isValid;
          },
          set: function set() {
            console.error('[CbxClientModel][ValidationMixin] isValid assignation not allowed');
          }
        });
        Object.defineProperty((0, _assertThisInitialized2["default"])(_this), 'errors', {
          enumerable: true,
          get: function get() {
            return errors;
          },
          set: function set() {
            console.error('[CbxClientModel][ValidationMixin] errors assignation not allowed');
          }
        });
        var properties = args[0];
        triggerInitialValidation({
          fields: _this.fields,
          properties: properties
        });
        return _this;
      }

      (0, _createClass2["default"])(_class, [{
        key: "validate",
        value: function validate() {
          var _this2 = this;

          Object.keys(this.fields).forEach(function (key) {
            _this2.fields[key].validate();
          });
        }
      }]);
      return _class;
    }(superclass)
  );
}; ////////////////


function triggerInitialValidation(_ref) {
  var fields = _ref.fields,
      _ref$properties = _ref.properties,
      properties = _ref$properties === void 0 ? {} : _ref$properties;
  var fieldKeys = Object.keys(fields);
  fieldKeys.forEach(function (key) {
    var field = fields[key];
    if (!field.autoValidate) return;

    if (key in properties) {
      field.trigger('validate');
    } else {
      field.validate();
    }
  });
}

var _default = ValidationMixin;
exports["default"] = _default;