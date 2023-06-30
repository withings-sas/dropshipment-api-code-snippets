// Functions
const axios  = require('axios');
const crypto = require('crypto');

const { CLIENT_ID, CLIENT_SECRET, API_ENDPOINT } = require('../../config');
const { parseErrors } = require('../../utils');

function sign(params, client_secret) {
  const params_to_sign = {
    action: params.action,
    client_id: params.client_id
  }
  if (params.timestamp) {
    params_to_sign.timestamp = params.timestamp;
  }
  if (params.nonce) {
    params_to_sign.nonce = params.nonce;
  }
  const sorted_values = Object.values(params_to_sign).join(',');
  const hmac = crypto.createHmac('sha256', client_secret);
  hmac.update(sorted_values);
  return hmac.digest("hex");
}

async function getNonce(timestamp) {
  const params = {
    action: 'getnonce',
    client_id: CLIENT_ID,
    timestamp //timestamp should be in unix form
  };
  params.signature = sign(params, CLIENT_SECRET);
  const { data } = await axios.post(API_ENDPOINT + 'v2/signature', params);
  parseErrors(data);
  return data.body.nonce;
}

async function main() {
  const now = Math.round((Date.now() / 1000) + 21); // Add any number between 21 ~ 61 to avoid error "Timestamp too old"
  const nonce = await getNonce(now);
  console.log(nonce);
}

module.exports = {
  sign,
  parseErrors,
  getNonce,
  CLIENT_ID,
  CLIENT_SECRET
}
