function parseErrors(response) {
  if (typeof (response) !== 'object' || !("status" in response)) {
    throw `Withings API answered with unexcepted error : [${JSON.stringify(response)}]`;
  }
  if (response.status !== 0) {
    if ("error" in response) {
      throw `Withings API answered with status : [${response.status}] - Error: ${response.error}`;
    }
    throw `Withings API answered with status : [${response.status}] - Response: [${JSON.stringify(response)}]`;
  }
}

module.exports = {
  parseErrors
}