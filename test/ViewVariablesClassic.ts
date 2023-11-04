import { Jovo, OutputTemplate } from "@jovotech/framework";
import { BaseViewVariables } from "../src";

export class ViewVariablesClassic extends BaseViewVariables {
  constructor(jovo: Jovo) {
    super(jovo);
  }

  name() {
    return "Grace";
  }

  platform1(): OutputTemplate {
    return {
      platforms: {
        core: {
          nativeResponse: {
            custom: {
              key: 'value1',
            },
          },
        },
      },
    };
  }

  myVV1(): OutputTemplate {
    return {
      card: {
        title: this.jovo.$t('someTitle'),
        content: 'my content',
        subtitle: 'this card from VV',
        imageUrl: 'https://www.fillmurray.com/200/300',
        imageAlt: 'Fill Murray',
      },
    };
  }
}