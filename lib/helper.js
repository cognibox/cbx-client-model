import axios from 'axios';

export function isInheritedFrom(klass, superclass) {
  return klass === superclass || klass.prototype instanceof superclass;
}

export function sync({ method, url, options }) {
  return axios[method](url, options);
}
