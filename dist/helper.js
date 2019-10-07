"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isInheritedFrom = isInheritedFrom;
exports.sync = sync;

var _axios = _interopRequireDefault(require("axios"));

function isInheritedFrom(klass, superclass) {
  return klass === superclass || klass.prototype instanceof superclass;
}

function sync(_ref) {
  var method = _ref.method,
      url = _ref.url,
      options = _ref.options;
  return _axios["default"][method](url, options);
}