import Validation from 'folktale/validation';
const Address4 = require('ip-address').Address4;

/**
 * defaultWorkspaceValidator() - Returns a Success type if a valid global default workspace CIDR address was provided.
 *                               Else, it returns a Failure type.
 *
 *
 * @param workspace string - An IPv4 address string (ex. '100.64.0.0./10')
 * @returns {Validation}
 */
export default function defaultWorkspaceValidator(workspace: string): Validation {
  return ((new Address4(workspace)).isValid()) ? Validation.Success() : Validation.Failure([`${workspace} is not a valid CIDR Address.`]);
};
