const axios = require('axios');

const { CLIENT_ID, CLIENT_SECRET, API_ENDPOINT, REDIRECT_URI } = require('../../config');
const { sign, getNonce } = require('../../signature/getnonce/getnonce');
const { parseErrors } = require('../../utils');

// Constants
const OAUTH2_GRANT_TYPE_AUTHORIZATION_CODE = 'authorization_code';
const OAUTH2_GRANT_TYPE_REFRESH_TOKEN      = 'refresh_token';

async function requestTokenWithClientSecret(authorization_code) {
  const params = {
    action: 'requesttoken',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    code: authorization_code,
    grant_type: OAUTH2_GRANT_TYPE_AUTHORIZATION_CODE
  };
  const { data } = await axios.post(API_ENDPOINT + 'v2/oauth2', params);
  parseErrors(data);
  const { userid, access_token, refresh_token, scope, expires_in, csrf_token, token_type } = data.body;
  return { userid, access_token, refresh_token, scope, expires_in, csrf_token, token_type };
}

async function requestTokenWithSignature(nonce, authorization_code) {
  const params = {
    action: 'requesttoken',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    code: authorization_code,
    grant_type: OAUTH2_GRANT_TYPE_AUTHORIZATION_CODE,
    nonce
  };
  params.signature = sign(params, CLIENT_SECRET);
  const { data } = await axios.post(API_ENDPOINT + 'v2/oauth2', params);
  parseErrors(data);
  const { userid, access_token, refresh_token, scope, expires_in, csrf_token, token_type } = data.body;
  return { userid, access_token, refresh_token, scope, expires_in, csrf_token, token_type };
}

async function refreshTokenWithClientSecret(old_refresh_token) {
  const params = {
    action: 'requesttoken',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    refresh_token: old_refresh_token,
    grant_type: OAUTH2_GRANT_TYPE_REFRESH_TOKEN
  };
  const { data } = await axios.post(API_ENDPOINT + 'v2/oauth2', params);
  parseErrors(data);
  let { userid, access_token, refresh_token, scope, expires_in, csrf_token, token_type } = data.body;
  return { userid, access_token, refresh_token, scope, expires_in, csrf_token, token_type };
}

async function refreshTokenWithSignature(nonce, old_refresh_token) {
  const params = {
    action: 'requesttoken',
    client_id: CLIENT_ID,
    refresh_token: old_refresh_token,
    grant_type: OAUTH2_GRANT_TYPE_REFRESH_TOKEN,
    nonce
  };
  params.signature = sign(params, CLIENT_SECRET);
  const { data } = await axios.post(API_ENDPOINT + 'v2/oauth2', params);
  parseErrors(data);
  const { userid, access_token, refresh_token, scope, expires_in, csrf_token, token_type } = data.body;
  return { userid, access_token, refresh_token, scope, expires_in, csrf_token, token_type };
}

async function main_get_access_signature(code) {
  const now = Math.round((Date.now() / 1000));
  const response = await requestTokenWithSignature(await getNonce(now), code);
  console.log(JSON.stringify(response));
}

async function main_get_access_secret(code) {
  const response = await requestTokenWithClientSecret(code);
  console.log(JSON.stringify(response));
}

async function main_refresh_access_signature(old_refresh_token) {
  const now = Math.round((Date.now() / 1000));
  const response = await refreshTokenWithSignature(await getNonce(now),old_refresh_token);
  console.log(JSON.stringify(response));
}

async function main_refresh_access_secret(old_refresh_token) {
  const response = await refreshTokenWithClientSecret(old_refresh_token);
  console.log(JSON.stringify(response));
}

//main_get_access_signature();
//main_get_access_secret();
//main_refresh_access_signature();
//main_refresh_access_secret();

module.exports = {
  requestTokenWithSignature,
  requestTokenWithClientSecret,
  refreshTokenWithSignature,
  refreshTokenWithClientSecret
};