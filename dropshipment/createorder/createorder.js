const axios   = require('axios');
const { CLIENT_ID, CLIENT_SECRET, API_ENDPOINT } = require('../../config');
const { sign }        = require('../../signature/getnonce/getnonce');
const { parseErrors } = require('../../utils');

// Constants
const TESTMODE_SHIPPED  = 1;
const TESTMODE_TRASHED  = 2;
const TESTMODE_FAILED   = 3;
const TESTMODE_BACKHOLD = 4;

async function createOrder(nonce, order, testmode) {
  const params = {
    action: 'createorder',
    client_id: CLIENT_ID,
    nonce,
    testmode,
    order: JSON.stringify([order]) // order should always be passed a JSON array of Order objects
  };
  params.signature = sign(params, CLIENT_SECRET);
  const { data } = await axios.post(API_ENDPOINT + 'v2/dropshipment', params);
  parseErrors(data);
  return data.body.orders;
}

async function main() {
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
  const response = await createOrder(await getNonce(now), order, TESTMODE_FAILED);
  console.log(JSON.stringify(response));
}

//main();




module.exports = {
  createOrder
}