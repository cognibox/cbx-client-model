"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isInheritedFrom = isInheritedFrom;

function isInheritedFrom(klass, superclass) {
  return klass === superclass || klass.prototype instanceof superclass;
}