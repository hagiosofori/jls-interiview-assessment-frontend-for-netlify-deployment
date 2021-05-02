import { API_ENDPOINT, API_STATUS } from './index';


export async function update({ quantity, id }) {
  try {
    const response = await fetch(`${API_ENDPOINT}/product-locations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => res.json());
    console.log('productLocations-update :: data -> ', response)

    const data = response;
    return { status: API_STATUS.SUCCESS, data };
  } catch (error) {
    console.log('error updating product location -> ', error);
    throw { status: API_STATUS.FAILED, message: error.toString() };
  }
}

export default {
  update,
}