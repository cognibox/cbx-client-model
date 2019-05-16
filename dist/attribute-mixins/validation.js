"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = require("lodash");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Validator =
/*#__PURE__*/
function () {
  function Validator() {
    _classCallCheck(this, Validator);
  }

  _createClass(Validator, null, [{
    key: "required",
    value: function required(value) {
      return value !== undefined;
    }
  }]);

  return Validator;
}();

var AttributeValidationMixin = function AttributeValidationMixin(superclass) {
  return (
    /*#__PURE__*/
    function (_superclass) {
      _inherits(_class, _superclass);

      _createClass(_class, null, [{
        key: "validatorClass",
        value: function validatorClass() {
          return Validator;
        }
      }]);

      function _class(_ref) {
        var _this;

        var value = _ref.value,
            validations = _ref.validations,
            autoValidate = _ref.autoValidate;

        _classCallCheck(this, _class);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this, {
          value: value
        }));
        buildValidation.call(_assertThisInitialized(_this), validations);

        if (autoValidate !== false) {
          _this.on('change', function () {
            _this.validate();
          });

          _this.validate();
        }

        return _this;
      }

      _createClass(_class, [{
        key: "ValidateOneDry",
        value: function ValidateOneDry(validationKey) {
          var validationValue = (0, _lodash.result)(this.validations, validationKey);
          var validator = this.constructor.validatorClass();

          if (validator[validationKey]) {
            return validator[validationKey](this.value, validationValue);
          }

          return true;
        }
      }, {
        key: "validateAllDry",
        value: function validateAllDry() {
          var _this2 = this;

          var errors = {};
          var validationKeys = this.validations ? Object.keys(this.validations) : [];

          if (this.validations && validationKeys.length) {
            var required = this.ValidateOneDry('required');

            if (!required) {
              if (this.validations.required) errors.required = required;
            } else {
              var keysToValidate = validationKeys.filter(function (key) {
                return key !== 'required';
              });
              keysToValidate.forEach(function (key) {
                var validateResult = _this2.ValidateOneDry(key);

                if (validateResult !== true) {
                  errors[key] = validateResult;
                }
              });
            }
          }

          return errors;
        }
      }]);

      return _class;
    }(superclass)
  );
};

var _default = AttributeValidationMixin; ////////////////

exports["default"] = _default;

function buildValidation(validations) {
  var _this3 = this;

  Object.defineProperty(this, 'validations', {
    enumerable: true,
    get: function get() {
      return validations;
    },
    set: function set() {
      console.error('[vueModel][AttributeValidationMixin] validations assignation not allowed');
    }
  });
  var isValid = true;
  var errors = {};

  this.validate = function () {
    errors = _this3.validateAllDry();
    isValid = !Object.keys(errors).length;

    _this3.trigger('validate');

    return errors;
  };

  Object.defineProperty(this, 'isValid', {
    enumerable: true,
    get: function get() {
      return isValid;
    },
    set: function set() {
      console.error('[vueModel][AttributeValidationMixin] isValid assignation not allowed');
    }
  });
  Object.defineProperty(this, 'errors', {
    enumerable: true,
    get: function get() {
      return errors;
    },
    set: function set() {
      console.error('[vueModel][AttributeValidationMixin] errors assignation not allowed');
    }
  });
}