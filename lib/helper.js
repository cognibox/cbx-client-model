export function isInheritedFrom(klass, superclass) {
  return klass === superclass || klass.prototype instanceof superclass;
}
