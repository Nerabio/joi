export class ApiErrorException extends Error {
    constructor(msg: string, status: number) {
        super(msg);
        this.name = 'ApiErrorException';
    }
}