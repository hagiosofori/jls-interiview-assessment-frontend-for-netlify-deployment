import { API_ENDPOINT, API_STATUS } from './index';

export async function list(page, pageSize) {
  try {
    const response = await fetch(`${API_ENDPOINT}/products?limit=${pageSize}&offset=${page * pageSize}`)
      .then(res => res.json())
      .then(data => ({ status: API_STATUS.SUCCESS, data }));
    return response;
  } catch (error) {
    console.log('failed to fetch products -> ', error);
    return { status: API_STATUS.FAILED, message: error.toString() };
  }
}


export async function get(id) {
  try {
    const response = await fetch(`${API_ENDPOINT}/products/${id}`)
      .then(res => res.json())
      .then(data => ({ status: API_STATUS.SUCCESS, data }));
    return response;
  } catch (e) {
    console.log('failed to fetch product details -> ', e);
    return { status: API_STATUS.FAILED, message: e.toString() };
  }
}

export default { get, list };