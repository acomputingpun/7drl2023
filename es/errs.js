export class CustomException extends Error {
    constructor(msg) {
        super()
        this.message = msg
    }
}

export class Panic extends CustomException {
    constructor(msg) {
        super(`PANIC: ${msg}`)
        console.trace()
    }
}

export class ToBeOverridden extends Panic {
    constructor(msg) {
        super(`Call to unimplemented to-be-overridden function!`)
    }
}