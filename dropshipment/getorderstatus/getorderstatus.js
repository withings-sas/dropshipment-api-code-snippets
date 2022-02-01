const axios  = require('axios');
const { CLIENT_ID, CLIENT_SECRET, API_ENDPOINT } = require('../../config');
const { sign }        = require('../../signature/getnonce/getnonce');
const { parseErrors } = require('../../utils');


async function getOrderStatusByOrderIds(nonce, order_ids) {
  const params = {
    action: 'getorderstatus',
    client_id: CLIENT_ID,
    order_ids: JSON.stringify(order_ids),
    nonce
  };
  params.signature = sign(params, CLIENT_SECRET);
  const { data } = await axios.post(API_ENDPOINT + 'v2/dropshipment', params);
  parseErrors(data);
  return data.body.orders;
}

async function getOrderStatusByCustomerRefIds(nonce, customer_ref_ids) {
  const params = {
    action: 'getorderstatus',
    client_id: CLIENT_ID,
    customer_ref_ids: JSON.stringify(customer_ref_ids),
    nonce
  };
  params.signature = sign(params, CLIENT_SECRET);
  const { data } = await axios.post(API_ENDPOINT + 'v2/dropshipment', params);
  parseErrors(data);
  return data.body.orders;
}


async function main() {
  const now = Math.round(Date.now() / 1000);
  const first_nonce       = await getNonce(now);
  const second_nonce      = await getNonce(now);
  const orders_by_orderid = await getOrderStatusByOrderIds(first_nonce, ["D0109635", "D0109687"])
  const orders_by_ref_ids = await getOrderStatusByCustomerRefIds(second_nonce, ["ref4", "ref5"])
  console.log(JSON.stringify(orders_by_orderid));
  console.log(JSON.stringify(orders_by_ref_ids));
}

//main();

module.exports = {
  getOrderStatusByCustomerRefIds,
  getOrderStatusByOrderIds,
}