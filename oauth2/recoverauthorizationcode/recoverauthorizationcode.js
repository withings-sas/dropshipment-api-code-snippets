const axios = require('axios');
const { CLIENT_ID, CLIENT_SECRET, API_ENDPOINT } = require('../../config');
const { sign, getNonce } = require('../../signature/getnonce/getnonce');
const { parseErrors } = require('../../utils');

// Constants
const OAUTH2_GRANT_TYPE_AUTHORIZATION_CODE = 'authorization_code';
const OAUTH2_GRANT_TYPE_REFRESH_TOKEN      = 'refresh_token';

async function recoverAuthorizationCode(nonce, email) {
  const params = {
    action: 'recoverauthorizationcode',
    client_id: CLIENT_ID,
    email,
    nonce
  };
  params.signature = sign(params, CLIENT_SECRET);
  const { data } = await axios.post(API_ENDPOINT + 'v2/oauth2', params);
  parseErrors(data);
  return data.body.user.code;
}

async function main() {
  const now = Math.round((Date.now() / 1000));
  const response = await recoverAuthorizationCode(await getNonce(now), "");
  console.log(JSON.stringify(response));
}

//main();

module.exports = {
  recoverAuthorizationCode,
};