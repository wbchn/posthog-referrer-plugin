import {
    CacheExtension,
    GeoIPExtension,
    PluginEvent,
    PluginMeta,
    StorageExtension,
    UtilsExtension,
} from '@posthog/plugin-scaffold'
import { processEvent } from '../plugin'

describe('useragent-plugin', () => {
    test('should not process event when disabled', async () => {
        const event = { properties: {} }
        const processedEvent = await processEvent(event as any, {
            cache: {} as CacheExtension,
            storage: {} as StorageExtension,
            global: {
                enabledPlugin: true,
                eventsToTrack: new Set('$pageview'.split(',')),
            },
            config: { enable: 'true', eventsToTrack: '$pageview', },
            attachments: {},
            metrics: {},
        })
        expect(Object.keys(processedEvent.properties)).toStrictEqual(Object.keys(event.properties))
    })

    test('should not process event when $referrer is missing', async () => {
        const event = {
            properties: {
                $lib: 'posthog-node',
            },
        } as unknown as PluginEvent

        const processedEvent = await processEvent(event, {
            cache: {} as CacheExtension,
            storage: {} as StorageExtension,
            global: {
                enabledPlugin: true,
                eventsToTrack: new Set('$pageview'.split(',')),
            },
            config: { enable: 'true', eventsToTrack: '$pageview', },
            attachments: {},
            metrics: {},
        })
        expect(Object.keys(processedEvent.properties)).toStrictEqual(['$lib'])
    })

    test('should not process event when $referrer is empty', async () => {
        const event = {
            properties: {
                $referrer: '',
                $lib: 'posthog-node',
            },
        } as unknown as PluginEvent

        const processedEvent = await processEvent(event, {
            cache: {} as CacheExtension,
            storage: {} as StorageExtension,
            global: {
                enabledPlugin: true,
                eventsToTrack: new Set('$pageview'.split(',')),
            },
            config: { enable: 'true', eventsToTrack: '$pageview', },
            attachments: {},
            metrics: {},
        })
        expect(Object.keys(processedEvent.properties)).toStrictEqual(['$referrer', '$lib'])
    })

    test('should not process event when event is not track', async () => {
        const event = {
            event: '$pageleave',
            properties: {
                $referrer:
                    'http://www.google.com/search?q=gateway+oracle+cards+denise+linn&hl=en&client=safari',
                $lib: 'posthog-node',
            },
        } as unknown as PluginEvent

        const processedEvent = await processEvent(event, {
            cache: {} as CacheExtension,
            storage: {} as StorageExtension,
            global: {
                enabledPlugin: true,
                eventsToTrack: new Set('$pageview'.split(',')),
            },
            config: { enable: 'true', eventsToTrack: '$pageview', },
            attachments: {},
            metrics: {},
        })
        expect(Object.keys(processedEvent.properties)).toStrictEqual(['$referrer', '$lib'])
    })

    test('should add referrer details when $referrer property exists', async () => {
        const event = {
            event: '$pageview',
            properties: {
                $referrer:
                    'http://www.google.com/search?q=gateway+oracle+cards+denise+linn&hl=en&client=safari',
                $lib: 'posthog-node',
            },
        } as unknown as PluginEvent

        const processedEvent = await processEvent(event, {
            cache: {} as CacheExtension,
            storage: {} as StorageExtension,
            global: {
                enabledPlugin: true,
                eventsToTrack: new Set('$pageview'.split(',')),
            },
            config: { enable: 'true', eventsToTrack: '$pageview', },
            attachments: {},
            metrics: {},
        })
        expect(Object.keys(processedEvent.properties)).toEqual(
            expect.arrayContaining(["$referrer", "$lib", "$set_once", "referrer"])
        )
        expect(processedEvent.properties.referrer).toStrictEqual(
            expect.objectContaining({
                referer_type: 'search',
                referer_name: 'www.google.com',
                referer_keyword: 'gateway oracle cards denise linn',
            })
        )
        expect(processedEvent.properties.$set_once).toStrictEqual(
            expect.objectContaining({
                initial_referer_type: 'search',
                initial_referer_name: 'www.google.com',
                initial_referer_keyword: 'gateway oracle cards denise linn',
            })
        )
    })

    test('should add referrer details when $referrer is internal', async () => {
        const event = {
            event: '$pageview',
            properties: {
                $current_url: 'http://www.funpinpin.top/products/abc',
                $referrer:
                    'http://www.funpinpin.top/search?q=gateway+oracle+cards+denise+linn&hl=en&client=safari',
                $lib: 'posthog-node',
            },
        } as unknown as PluginEvent

        const processedEvent = await processEvent(event, {
            cache: {} as CacheExtension,
            storage: {} as StorageExtension,
            global: {
                enabledPlugin: true,
                eventsToTrack: new Set('$pageview'.split(',')),
            },
            config: { enable: 'true', eventsToTrack: '$pageview', },
            attachments: {},
            metrics: {},
        })
        expect(Object.keys(processedEvent.properties)).toEqual(
            expect.arrayContaining(["$referrer", "$lib", "$set_once", "referrer"])
        )
        expect(processedEvent.properties.referrer).toStrictEqual(
            expect.objectContaining({
                referer_type: 'internal',
                referer_name: 'www.funpinpin.top',
                referer_keyword: null,
            })
        )
    })


    test('should add referrer details when set custom events', async () => {
        const eventsToTrack = '$pageview,$pageleave,add_cart'
        const event = {
            event: 'add_cart',
            properties: {
                $current_url: 'http://www.funpinpin.top/products/abc',
                $referrer:
                    'http://www.funpinpin.top/search?q=gateway+oracle+cards+denise+linn&hl=en&client=safari',
                $lib: 'posthog-node',
            },
        } as unknown as PluginEvent

        const processedEvent = await processEvent(event, {
            cache: {} as CacheExtension,
            storage: {} as StorageExtension,
            global: {
                enabledPlugin: true,
                eventsToTrack: new Set(eventsToTrack.split(',')),
            },
            config: { enable: 'true', eventsToTrack: eventsToTrack, },
            attachments: {},
            metrics: {},
        })
        expect(Object.keys(processedEvent.properties)).toEqual(
            expect.arrayContaining(["$referrer", "$lib", "$set_once", "referrer"])
        )
    })
})
