import { Jovo } from '@jovotech/framework';

export type ViewVariablesConstructor<
VIEWVARIABLES extends BaseViewVariables = any,
ARGS extends unknown[] = any[],
> = new (jovo: Jovo, ...args: ARGS) => VIEWVARIABLES;

export abstract class BaseViewVariables {
  constructor(readonly jovo: Jovo) {
  }
}
