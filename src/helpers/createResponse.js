// @flow
/**
 * createResponse() - Returns an object with the statusCode and body that is to be returned back to the client.
 *
 * @param statusCode int HTTP status code
 * @param body {}
 * @returns {{statusCode: number, body: any}}
 */
const createResponse = (statusCode: number, body: any): { statusCode: number, body: any } => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(body)
  };
};

export default createResponse;
