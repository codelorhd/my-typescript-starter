import { ConflictException } from "@nestjs/common"

export default class DuplicateResourceException extends ConflictException {
    constructor(message: string) {
        super(message)
    }
}