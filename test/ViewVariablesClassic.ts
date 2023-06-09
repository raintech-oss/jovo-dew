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

    card1(): OutputTemplate {
        return {
          card: {
            title: this.jovo.$t('cards.card1.title'),
            content: this.jovo.$t('cards.card1.content'),
            subtitle: 'sub title',
            imageUrl: 'https://www.fillmurray.com/200/300',
            imageAlt: 'Fill Murray',
          },
        };
      }
    
      carousel1(): OutputTemplate {
        return {
          carousel: {
            title: 'My Title',
            items: [
              {
                title: 'Element 1',
                imageUrl: 'https://www.fillmurray.com/100/100',
                content: 'To my right, you will see element 2.',
              },
              {
                title: 'Element 2',
                imageUrl: 'https://www.fillmurray.com/g/100/100',
                content: 'Hi there!',
              },
            ],
          },
        };
      }    
}