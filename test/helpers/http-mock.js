import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

const httpMock = new AxiosMockAdapter(axios);

export default () => {
  httpMock.reset();
  return httpMock;
};
