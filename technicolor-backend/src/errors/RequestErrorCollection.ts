export class RequestError extends Error {

    http_code : number;
    code: string;
    timestamp: Date;
    message: string;
    error_message: string;

    //Reference: https://javascript.info/custom-errors
    constructor(message: string, httpCode: number, code: string, timestamp: Date = new Date()) {
        super(message);
        this.http_code = httpCode;
        this.code = code;
        this.timestamp = timestamp;
        this.message = message
        this.error_message = message
    }

}

export class EntityNotFoundError extends RequestError {

    constructor(entityName: string, entityReference?: string | number, timestamp: Date = new Date()) {
        let message : string = `${entityName.toUpperCase()} not found.`
        if(entityReference) {
            message = `${entityName.toUpperCase()} with reference/id [${entityReference}] not found.`
        }
        super(message, 404, `${entityName.toUpperCase()}_NOT_FOUND`, timestamp)
    }

}

//For oopsies that we cannot handle such as database query errors, etc
export class InternalServerError extends RequestError {

    detail: string[];

    constructor(err: Error) {
        super("Internal Server Error", 500, "INTERNAL_SERVER_ERROR")
        let processedErr = JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)))
        if(processedErr.stack) {
            processedErr.stack = processedErr.stack.split("\n")
        }
        this.detail = processedErr
    }
}

//For oopsies that we expect may happen, but we caught, such as undefined value on checking where it is not possible to be undefined unless we made a mistake/bug.
export class HandledInternalServerError extends RequestError {
    constructor(message: string, code: string = "INTERNAL_SERVER_ERROR") {
        super(message, 500, code);
    }
}

export class BadRequestError extends RequestError {
    constructor(message: string, code: string = "BAD_REQUEST") {
        super(message, 400, code);
    }
}

export class UnauthorizedError extends RequestError {
    constructor(message: string, code: string = "UNAUTHORIZED") {
        super(message, 401, code);
    }
}