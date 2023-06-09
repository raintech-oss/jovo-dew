import { Injectable, Jovo } from "@jovotech/framework";
import { BaseViewVariables } from "../src";
import { NameService } from "./NameService";

@Injectable()
export class ViewVariablesInjectable extends BaseViewVariables {
    constructor(
        jovo: Jovo,
        readonly nameService: NameService
    ) {
        super(jovo);
    }

    name() {
        return "Grace";
    }

    lastName() {
        return this.nameService.getName();
    }

    async myValue() {
        // NOTE: async functions are NOT supported in ViewVariables due 
        // to i18next missingInterpolationHandler is sync
        return await this.nameService.getValue();
    }

}