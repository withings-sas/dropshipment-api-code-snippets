const crypto  = require('crypto');
const axios   = require('axios');
const { CLIENT_ID, CLIENT_SECRET, API_ENDPOINT } = require('../../config');
const { sign }        = require('../../signature/getnonce/getnonce');
const { parseErrors } = require('../../utils');


async function updateOrder(nonce, orderid, order) {
  const params = {
    action: 'update',
    client_id: CLIENT_ID,
    order_id: orderid,
    order: JSON.stringify([order]),
    nonce,
  };
  params.signature = sign(params, CLIENT_SECRET);
  const { data } = await axios.post(API_ENDPOINT + 'v2/dropshipment', params);
  parseErrors(data);
  return data.body.orders;
}

async function main(orderid) {

  const address   = {
    name: 'John Doe',
    company_name: 'Company',
    email: 'john.doe@example.com',
    telephone: '+551155256325',
    address1: '767 5th Ave',
    address2: 'Apt 101',
    city: 'Issy-les-Moulineaux',
    zip: '10153',
    state: 'NY',
    country: 'FR'
  };
  const products  = [
    {
      ean: '3700546707100',
      quantity: 1
    }
  ];
  const order     = {
    customer_ref_id: 'customer-ref-id-5', //the id of this order on your side
    address,
    products,
    force_address: true,
  };
  const now = Math.round((Date.now() / 1000));
  const response = await updateOrder(await getNonce(now), orderid, order);
  console.log(JSON.stringify(response));
}

//main("D0109229");

module.exports = {
  updateOrder
}