const axios   = require('axios');
const { CLIENT_ID, CLIENT_SECRET, API_ENDPOINT } = require('../../config');
const { sign }        = require('../../signature/getnonce/getnonce');
const { parseErrors } = require('../../utils');

// Constants
const MEASURE_TYPE_HEIGHT = 4;
const MEASURE_TYPE_WEIGHT = 1;
const UNIT_HEIGHT_M  = 6;
const UNIT_HEIGHT_IN = 7;
const UNIT_WEIGHT_KG = 1;
const UNIT_WEIGHT_LB = 2;
const UNIT_WEIGHT_STLB = 14;
const UNIT_DISTANCE_KM = 6;
const UNIT_DISTANCE_YD = 8;
const UNIT_TEMPERATURE_C = 11;
const UNIT_TEMPERATURE_F = 13;
const TESTMODE_SHIPPED  = 1;
const TESTMODE_TRASHED  = 2;
const TESTMODE_FAILED   = 3;
const TESTMODE_BACKHOLD = 4;

async function createUserOrder(nonce, order, user, testmode) {
  const params = {
    action: 'createuserorder',
    client_id: CLIENT_ID,
    nonce,
    order: JSON.stringify([order]), // order should always be passed a JSON array of Order objects
    email: user.email,
    shortname: user.shortname,
    gender: user.gender,
    birthdate: user.birthdate,
    measures: JSON.stringify(user.measures),
    external_id: user.external_id,
    mailingpref: user.mailingpref,
    unit_pref: JSON.stringify(user.unit_pref),
    preflang: user.preflang,
    timezone: user.timezone,
  };
  if (user.firstname) {
    params.firstname = user.firstname;
  }
  if (user.lastname) {
    params.lastname = user.lastname;
  }
  if (user.phonenumber) {
    params.phonenumber = user.phonenumber
  }
  if (user.goals) {
    params.goals = user.goals;
  }
  if (user.recovery_code) {
    params.recovery_code = user.recovery_code;
  }
  if (testmode !== null) {
    params.testmode = testmode;
  }
  params.signature = sign(params, CLIENT_SECRET);
  const { data } = await axios.post(API_ENDPOINT + 'v2/dropshipment', params);
  parseErrors(data);
  return data;
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
  const measures  = [
    { value: 190, unit: -2, type: MEASURE_TYPE_HEIGHT }, //1m90
    { value: 90, unit: 0, type:  MEASURE_TYPE_WEIGHT} //90kg
  ];
  const order     = {
    customer_ref_id: 'customer-ref-id', //the id of this order on your side
    address,
    products,
    force_address: true,
  };
  const unit_pref = { weight: UNIT_WEIGHT_KG, height: UNIT_HEIGHT_M, distance: UNIT_DISTANCE_KM, temperature: UNIT_TEMPERATURE_C };
  const mandatory_params_user = {
    mailingpref: 0,
    birthdate: 848166152,
    measures, // measurements should always be passed in kg/m
    gender: 0,
    preflang: 'en_US',
    unit_pref,
    email: 'john.doe@example.com',
    timezone: 'America/New_York',
    shortname: 'HNI',
    external_id: 'my-external-id' //id of this user on your side
  }
  const optional_params_user  = {
    firstname: 'John', //if not set, will take the same value as shortname
    lastname: 'Doe', //if not set, will take the same value as shortname
    phonenumber: '+551155256325', //Phone number in E.164 format.
    recovery_code: 'abcde12345',
    goals: null
  }
  const user = {...mandatory_params_user, ...optional_params_user};
  const now = Math.round((Date.now() / 1000));
  createUserOrder(await getNonce(now), order, user, TESTMODE_FAILED);
}

//main();

module.exports = {
  createUserOrder
}