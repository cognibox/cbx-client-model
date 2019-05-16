"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var mixin = function mixin(superclass) {
  return (
    /*#__PURE__*/
    function (_superclass) {
      _inherits(_class, _superclass);

      function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, _getPrototypeOf(_class).apply(this, arguments));
      }

      _createClass(_class, [{
        key: "buildUrl",
        value: function buildUrl() {
          return this.constructor.buildUrl(this.getPrimaryAttribute().value);
        }
      }, {
        key: "fetch",
        value: function fetch() {
          var _this = this;

          var url = this.buildUrl();
          return _axios["default"].get(url).then(function (resp) {
            _this.set(resp.data);

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
          var _this2 = this;

          var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          var method;
          var modelData = {},
              attributeKeys = Object.keys(this.attributes);

          if (this.isNew()) {
            method = 'post';
            attributeKeys.forEach(function (key) {
              modelData[key] = _this2.attributes[key].value;
            });
          } else {
            method = 'patch';
            attributeKeys.forEach(function (key) {
              if (!_this2.attributes[key].hasChanged) return;
              modelData[key] = _this2.attributes[key].value;
            });
          }

          data = Object.assign(modelData, data);
          var url = this.buildUrl();
          return _axios["default"][method](url, data).then(function (resp) {
            _this2.setPristine();

            return resp;
          });
        }
      }], [{
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
        key: "fetchAll",
        value: function fetchAll() {
          var _this3 = this;

          var url = this.buildUrl();
          return _axios["default"].get(url).then(function (resp) {
            var result = Array.isArray(resp.data) ? {
              data: resp.data
            } : resp.data;
            result.models = result.data.map(function (item) {
              return new _this3(item);
            });
            return result;
          });
        }
      }, {
        key: "fetchOne",
        value: function fetchOne(id) {
          var Model = this;
          var primaryKey = this.getPrimaryKey();
          var model = new Model(_defineProperty({}, primaryKey, id));
          return model.fetch().then(function () {
            return model;
          });
        }
      }, {
        key: "findPrimaryKey",
        value: function findPrimaryKey() {
          var attributes = this.attributes();
          return Object.keys(attributes).find(function (key) {
            return attributes[key].primary;
          });
        }
      }, {
        key: "getPrimaryKey",
        value: function getPrimaryKey() {
          this._primaryKey = this._primaryKey || this.findPrimaryKey() || 'id';
          return this._primaryKey;
        }
      }]);

      return _class;
    }(superclass)
  );
};

var _default = mixin;
exports["default"] = _default;