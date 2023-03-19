import { HttpException } from './http.exception';

export class BrandNotFoundException extends HttpException {
    constructor(id: number) {
        super(404, `Brand with ${id} not found`);
    }
}
