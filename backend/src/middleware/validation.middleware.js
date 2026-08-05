import { badRequest } from '../utils/error.js';

export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const value = req[source];
    const { error, value: validated } = schema.validate(value ?? {}, { abortEarly: false, stripUnknown: true });
    if (error) {
      const details = error.details.map((d) => d.message);
      return next(badRequest(details.join('; '), 'VALIDATION'));
    }
    req[source] = validated;
    return next();
  };
}

export function validateParams(schema) {
  return validate(schema, 'params');
}