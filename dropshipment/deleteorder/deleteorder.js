const axios   = require('axios');
const { CLIENT_ID, CLIENT_SECRET, API_ENDPOINT } = require('../../config');
const { sign, getNonce }        = require('../../signature/getnonce/getnonce');
const { parseErrors } = require('../../utils');


async function deleteOrder(nonce, orderid) {
  const params = {
    action: 'delete',
    client_id: CLIENT_ID,
    order_id: orderid,
    nonce,
  };
  params.signature = sign(params, CLIENT_SECRET);
  const { data } = await axios.post(API_ENDPOINT + 'v2/dropshipment', params);
  parseErrors(data);
  return true;
}

async function main(orderid) {
  const now = Math.round((Date.now() / 1000));
  const response = await deleteOrder(await getNonce(now), orderid);
  console.log(JSON.stringify(response));
}


//main("ORDERID");

module.exports = {
  deleteOrder
}