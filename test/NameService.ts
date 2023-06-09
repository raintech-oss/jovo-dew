import { Injectable } from "@jovotech/framework";

@Injectable()
export class NameService {
    getName() {
        return 'Hopper';
    }

    async getValue() {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return 'value'
    }
}