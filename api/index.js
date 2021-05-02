import ProductLocationApi from './productLocations';
import * as ProductApi from './products';


export const API_ENDPOINT = process.env.API_ENDPOINT;

export const API_STATUS = {
  SUCCESS: 'success',
  FAILED: 'failed',
};

export default {
  ProductLocationApi,
  ProductApi,
};