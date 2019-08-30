"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _field = _interopRequireDefault(require("./field"));

var Model =
/*#__PURE__*/
function () {
  (0, _createClass2["default"])(Model, null, [{
    key: "fieldClass",
    value: function fieldClass() {
      return _field["default"];
    }
  }, {
    key: "primaryKey",
    value: function primaryKey() {
      return 'id';
    }
  }]);

  function Model() {
    var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2["default"])(this, Model);
    this.fields = this.buildFields();
    this.set(properties);
    this.setPristine();
    buildChanges.call(this);
  }

  (0, _createClass2["default"])(Model, [{
    key: "buildFields",
    value: function buildFields() {
      return {};
    }
  }, {
    key: "calculateChanges",
    value: function calculateChanges(fieldKeys) {
      var _this = this;

      fieldKeys = fieldKeys || Object.keys(this.fields);
      fieldKeys.forEach(function (fieldKey) {
        var field = _this.fields[fieldKey];

        if (field.hasChanged) {
          _this.isDirty = true;
          _this.changes[fieldKey] = {
            newValue: field.value,
            oldValue: field.originalValue
          };
        } else {
          delete _this.changes[fieldKey];
        }

        _this.hasChanged = _this.computeHasChanged();
      });
    }
  }, {
    key: "computeHasChanged",
    value: function computeHasChanged() {
      return Object.keys(this.changes).length > 0;
    }
  }, {
    key: "mapOnFields",
    value: function mapOnFields(callback) {
      var _this2 = this;

      return Object.keys(this.fields).map(function (key) {
        return callback.call(_this2, _this2.fields[key], key);
      });
    }
  }, {
    key: "parse",
    value: function parse() {
      var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return properties;
    }
  }, {
    key: "primaryField",
    value: function primaryField() {
      return this.fields[this.constructor.primaryKey()];
    }
  }, {
    key: "set",
    value: function set() {
      var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      properties = this.parse(properties);
      this.mapOnFields(function (field, key) {
        if (properties[key] === undefined) return;
        field.value = properties[key];
      });
    }
  }, {
    key: "setChanges",
    value: function setChanges(value) {
      this.changes = value;
      this.hasChanged = this.computeHasChanged();
    }
  }, {
    key: "setPristine",
    value: function setPristine() {
      this.mapOnFields(function (value) {
        if (value.isDirty) value.setPristine();
      });
      this.setChanges({});
    }
  }]);
  return Model;
}();

var _default = Model; ////////////////

exports["default"] = _default;

function buildChanges() {
  var _this3 = this;

  var fields = this.fields;
  this.hasChanged = false;
  this.changes = {};
  Object.keys(fields).forEach(function (key) {
    var field = fields[key];
    field.on('change', function () {
      _this3.calculateChanges([key]);
    });
  });
}