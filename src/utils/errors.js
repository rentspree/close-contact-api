/* eslint-disable max-classes-per-file */
import { ERROR_NAME } from "../constants/errors"

export class BaseError extends Error {
  constructor(message) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
  }
}

export class NotFoundError extends BaseError {
  constructor(message) {
    super(message)
    this.name = ERROR_NAME.NOT_FOUND_ERROR
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message) {
    super(message)
    this.name = ERROR_NAME.UNAUTHORIZED_ERROR
  }
}

export class TokenExpired extends BaseError {
  constructor(message) {
    super(message)
    this.name = ERROR_NAME.TOKEN_EXPIRED
  }
}
/* eslint-enable max-classes-per-file */
