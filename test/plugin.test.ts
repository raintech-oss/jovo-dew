import { App, BaseComponent, Component, ComponentOptions, Global, InputType, Intents, Jovo, TestSuite, UnknownObject } from "@jovotech/framework";
import { DewViewEnginePlugin } from "../src";
import { ViewVariablesInjectable } from './ViewVariablesInjectable';
import { ViewVariablesClassic } from './ViewVariablesClassic';
import { NameService } from './NameService';
import en from './i18n/en-US.json';
import audiosEn from './audios-file.json';

@Global()
@Component()
class ComponentA extends BaseComponent {
    constructor(
        jovo: Jovo,
        options: ComponentOptions<UnknownObject> | undefined,
        readonly nameService: NameService
    ) {
        super(jovo, options);
    }

    @Intents('IntentA')
    async handleIntentA() {
        return this.$send(await this.$dew.getOutput('key1'));
    }

    @Intents('IntentB')
    async handleIntentB() {
        return this.$send(await this.$dew.getOutput('key2'));
    }

    @Intents('IntentC')
    async handleIntentC() {
        return this.$send(await this.$dew.getOutput('key3'));
    }

    @Intents('IntentD')
    async handleIntentD() {
        return this.$send(await this.$dew.getOutput('key4'));
    }

    @Intents('IntentE')
    async handleIntentE() {
        return this.$send(await this.$dew.getOutput('key5'));
    }

    @Intents('IntentF')
    async handleIntentF() {
        return this.$send(await this.$dew.getOutput('key6'));
    }

    @Intents('IntentG')
    async handleIntentG() {
        return this.$send(await this.$dew.getOutput('key7'));
    }

    @Intents('IntentH')
    async handleIntentH() {
        return this.$send(await this.$dew.getOutput('platform1'));
    }

    @Intents('IntentI')
    async handleIntentI() {
        return this.$send(await this.$dew.getOutput('cards.card1'));
    }

    @Intents('IntentJ')
    async handleIntentJ() {
        return this.$send(await this.$dew.getOutput('carousel.one'));
    }

    @Intents('IntentK')
    async handleIntentK() {
        return this.$send(await this.$dew.getOutput('vv1'));
    }

}


let testSuite: TestSuite;


beforeEach(async () => {

    const app = new App({
        plugins: [new DewViewEnginePlugin({
            viewVariables: ViewVariablesClassic,
            audio: {
                resources: {
                    en: audiosEn,
                },
                baseUrl: 'https://example.com',
                fallbackLocale: 'en',
                defaultExt: '.mp3',
            },

        })],
        i18n: {
            resources: {
                en,
            },
        },
        components: [ComponentA],
        providers: [{
            provide: NameService,
            useClass: NameService,
        }],
    });

    app.hook('event.DewViewEnginePlugin.getOutput', (jovo: Jovo, payload: unknown): void => {
        console.log('getOutput hook ==>', JSON.stringify(payload));
    });

    await app.initialize();

    testSuite = new TestSuite({
        app,
        data: {
            deleteAfterAll: false,
            deleteAfterEach: false,
        },
    });
});

describe('plugin', () => {
    test('should return message and reprompt', async () => {
        const { output } = await testSuite.run({
            type: InputType.Intent,
            intent: 'IntentA',
        })

        expect(output).toEqual([
            {
                message: 'message1',
                reprompt: 'reprompt1',
            },
        ]);

    });

    test('should return message and listen false', async () => {
        const { output } = await testSuite.run({
            type: InputType.Intent,
            intent: 'IntentB',
        })

        expect(output).toEqual([
            {
                message: 'message2',
                listen: false,
            },
        ]);

    });

    test('should return message and value from ViewVariables', async () => {
        const { output } = await testSuite.run({
            type: InputType.Intent,
            intent: 'IntentC',
        })

        expect(output).toEqual([
            {
                message: 'message3 - Grace',
            },
        ]);

    });

    test('should return message and value from ViewVariables using dependency injection', async () => {
        testSuite.$app.plugins!.DewViewEnginePlugin!.config.viewVariables = ViewVariablesInjectable;

        const { output } = await testSuite.run({
            type: InputType.Intent,
            intent: 'IntentD',
        })

        expect(output).toEqual([
            {
                message: 'message4 - Hopper',
            },
        ]);

    });

    test.skip('async method should return [object Promise]', async () => {
        // NOTE: async functions are NOT supported in ViewVariables due
        // to i18next missingInterpolationHandler is sync
        testSuite.$app.plugins!.DewViewEnginePlugin!.config.viewVariables = ViewVariablesInjectable;

        const { output } = await testSuite.run({
            type: InputType.Intent,
            intent: 'IntentE',
        })
        expect(output).toEqual([
            {
                // message: 'message5 - [object Promise]',
                message: 'message5 - value',
            },
        ]);
    });

    test('should return message and value from audio file', async () => {
        const { output } = await testSuite.run({
            type: InputType.Intent,
            intent: 'IntentF',
        })

        expect(output).toEqual([
            {
                message: 'message6 - <audio src="https://example.com/success.mp3" />',
            },
        ]);

    });

    test('should return message and error from missing variable', async () => {
        const { output } = await testSuite.run({
            type: InputType.Intent,
            intent: 'IntentG',
        })

        expect(output).toEqual([
            {
                message: 'message7 - [missing variable: this_var_does_not_exist]',
            },
        ]);

    });

    test('should return output for platform', async () => {
        const { output } = await testSuite.run({
            type: InputType.Intent,
            intent: 'IntentH',
        })

        expect(output).toEqual([
            {
                platforms: {
                    core: {
                        nativeResponse: {
                            custom: {
                                key: 'value1'
                            }
                        }
                    }
                },
            },
        ]);

    });

    test('should return output for card', async () => {
        const { output } = await testSuite.run({
            type: InputType.Intent,
            intent: 'IntentI',
        })

        expect(output).toEqual([
            {
                card: {
                    title: 'Card1 title',
                    content: 'Card1 content',
                    subtitle: 'sub title',
                    imageUrl: 'https://www.fillmurray.com/200/300',
                    imageAlt: 'Fill Murray',
                },
            },
        ]);

    });

    test('should return output for carousel', async () => {
        const { output } = await testSuite.run({
            type: InputType.Intent,
            intent: 'IntentJ',
        })

        expect(output).toEqual([
            {
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
            },
        ]);

    });

    test('should return message from ViewVariables', async () => {
        const { output } = await testSuite.run({
            type: InputType.Intent,
            intent: 'IntentK',
        })

        expect(output).toEqual([
            {
                card: {
                    title: 'someTitle',
                    content: 'my content',
                    subtitle: 'this card from VV',
                    imageUrl: 'https://www.fillmurray.com/200/300',
                    imageAlt: 'Fill Murray',
                },
            },
        ]);

    });

});