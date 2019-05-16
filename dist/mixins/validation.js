"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _validation = _interopRequireDefault(require("../attribute-mixins/validation.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var ValidationMixin = function ValidationMixin(superclass) {
  return (
    /*#__PURE__*/
    function (_superclass) {
      _inherits(_class, _superclass);

      _createClass(_class, null, [{
        key: "attributeClass",
        value: function attributeClass() {
          return (
            /*#__PURE__*/
            function (_AttributeValidationM) {
              _inherits(AttributeWithValidation, _AttributeValidationM);

              function AttributeWithValidation() {
                _classCallCheck(this, AttributeWithValidation);

                return _possibleConstructorReturn(this, _getPrototypeOf(AttributeWithValidation).apply(this, arguments));
              }

              return AttributeWithValidation;
            }((0, _validation["default"])(_get(_getPrototypeOf(_class), "attributeClass", this).call(this)))
          );
        }
      }]);

      function _class() {
        var _getPrototypeOf2;

        var _this;

        _classCallCheck(this, _class);

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(_class)).call.apply(_getPrototypeOf2, [this].concat(args)));
        var isValid = true;
        var errors = {};
        Object.keys(_this.attributes).forEach(function (key) {
          var attribute = _this.attributes[key];
          attribute.on('validate', function () {
            if (attribute.isValid) {
              delete errors[key];
            } else {
              errors[key] = attribute.errors;
            }

            isValid = !Object.keys(errors).length;
          });
        });
        Object.defineProperty(_assertThisInitialized(_this), 'isValid', {
          enumerable: true,
          get: function get() {
            return isValid;
          },
          set: function set() {
            console.error('[vueModel][ValidationMixin] isValid assignation not allowed');
          }
        });
        Object.defineProperty(_assertThisInitialized(_this), 'errors', {
          enumerable: true,
          get: function get() {
            return errors;
          },
          set: function set() {
            console.error('[vueModel][ValidationMixin] errors assignation not allowed');
          }
        });
        return _this;
      }

      _createClass(_class, [{
        key: "validate",
        value: function validate() {
          var _this2 = this;

          Object.keys(this.attributes).forEach(function (key) {
            _this2.attributes[key].validate();
          });
        }
      }]);

      return _class;
    }(superclass)
  );
};

var _default = ValidationMixin;
exports["default"] = _default;