import { Jovo } from "@jovotech/framework";
import { DewViewEngine } from "../DewViewEngine";

export abstract class BaseProcessor {
    constructor(readonly plugin: DewViewEngine, readonly jovo: Jovo) {}
    
    abstract process(key: string, obj: unknown, viewPath: string, data: unknown): unknown
}