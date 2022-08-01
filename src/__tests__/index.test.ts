import {
    CacheExtension,
    GeoIPExtension,
    PluginEvent,
    PluginMeta,
    StorageExtension,
    UtilsExtension,
} from '@posthog/plugin-scaffold'
import { setupPlugin, processEvent } from '..'

const referersAttachment = {
    content_type: 'yaml',
    file_name: 'referers.yml',
    contents: `
search:
  Google:
    parameters:
      - q
      - query # For www.cnn.com (powered by Google)
      - Keywords # For gooofullsearch.com (powered by Google)
    domains:
      - www.google.com
      - www.google.ac
      - www.google.ad
      - www.google.com.af
      - www.google.com.ag
      - www.google.com.ai
      - www.google.am
      - www.google.it.ao
      - www.google.com.ar
      - www.google.as
      - www.google.at
      - www.google.com.au
      - www.google.az
      - www.google.ba
      - www.google.com.bd
      - www.google.be
      - www.google.bf
      - www.google.bg
      - www.google.com.bh
      - www.google.bi
      - www.google.bj
      - www.google.com.bn
      - www.google.com.bo
      - www.google.com.br
      - www.google.bs
      - www.google.co.bw
      - www.google.com.by
      - www.google.by
      - www.google.com.bz
      - www.google.ca
      - www.google.com.kh
      - www.google.cc
      - www.google.cd
      - www.google.cf
      - www.google.cat
      - www.google.cg
      - www.google.ch
      - www.google.ci
      - www.google.co.ck
      - www.google.cl
      - www.google.cm
      - www.google.cn
      - www.google.com.co
      - www.google.co.cr
      - www.google.com.cu
      - www.google.cv
      - www.google.com.cy
      - www.google.cz
      - www.google.de
      - www.google.dj
      - www.google.dk
      - www.google.dm
      - www.google.com.do
      - www.google.dz
      - www.google.com.ec
      - www.google.ee
      - www.google.com.eg
      - www.google.es
      - www.google.com.et
      - www.google.fi
      - www.google.com.fj
      - www.google.fm
      - www.google.fr
      - www.google.ga
      - www.google.gd
      - www.google.ge
      - www.google.gf
      - www.google.gg
      - www.google.com.gh
      - www.google.com.gi
      - www.google.gl
      - www.google.gm
      - www.google.gp
      - www.google.gr
      - www.google.com.gt
      - www.google.gy
      - www.google.com.hk
      - www.google.hn
      - www.google.hr
      - www.google.ht
      - www.google.hu
      - www.google.co.id
      - www.google.iq
      - www.google.ie
      - www.google.co.il
      - www.google.im
      - www.google.co.in
      - www.google.io
      - www.google.is
      - www.google.it
      - www.google.je
      - www.google.com.jm
      - www.google.jo
      - www.google.co.jp
      - www.google.co.ke
      - www.google.ki
      - www.google.kg
      - www.google.co.kr
      - www.google.com.kw
      - www.google.kz
      - www.google.la
      - www.google.com.lb
      - www.google.com.lc
      - www.google.li
      - www.google.lk
      - www.google.co.ls
      - www.google.lt
      - www.google.lu
      - www.google.lv
      - www.google.com.ly
      - www.google.co.ma
      - www.google.md
      - www.google.me
      - www.google.mg
      - www.google.mk
      - www.google.ml
      - www.google.mn
      - www.google.ms
      - www.google.com.mt
      - www.google.mu
      - www.google.mv
      - www.google.mw
      - www.google.com.mx
      - www.google.com.my
      - www.google.co.mz
      - www.google.com.na
      - www.google.ne
      - www.google.com.nf
      - www.google.com.ng
      - www.google.com.ni
      - www.google.nl
      - www.google.no
      - www.google.com.np
      - www.google.nr
      - www.google.nu
      - www.google.co.nz
      - www.google.com.om
      - www.google.com.pa
      - www.google.com.pe
      - www.google.com.ph
      - www.google.com.pk
      - www.google.pl
      - www.google.pn
      - www.google.com.pr
      - www.google.ps
      - www.google.pt
      - www.google.com.py
      - www.google.com.qa
      - www.google.ro
      - www.google.rs
      - www.google.ru
      - www.google.rw
      - www.google.com.sa
      - www.google.com.sb
      - www.google.sc
      - www.google.se
      - www.google.com.sg
      - www.google.sh
      - www.google.si
      - www.google.sk
      - www.google.com.sl
      - www.google.sn
      - www.google.sm
      - www.google.so
      - www.google.st
      - www.google.com.sv
      - www.google.td
      - www.google.tg
      - www.google.co.th
      - www.google.com.tj
      - www.google.tk
      - www.google.tl
      - www.google.tm
      - www.google.to
      - www.google.com.tn
      - www.google.tn
      - www.google.com.tr
      - www.google.tt
      - www.google.com.tw
      - www.google.co.tz
      - www.google.com.ua
      - www.google.co.ug
      - www.google.ae
      - www.google.co.uk
      - www.google.us
      - www.google.com.uy
      - www.google.co.uz
      - www.google.com.vc
      - www.google.co.ve
      - www.google.vg
      - www.google.co.vi
      - www.google.com.vn
      - www.google.vu
      - www.google.ws
      - www.google.co.za
      - www.google.co.zm
      - www.google.co.zw
      - google.com
      - google.ac
      - google.ad
      - google.com.af
      - google.com.ag
      - google.com.ai
      - google.am
      - google.it.ao
      - google.com.ar
      - google.as
      - google.at
      - google.com.au
      - google.az
      - google.ba
      - google.com.bd
      - google.be
      - google.bf
      - google.bg
      - google.com.bh
      - google.bi
      - google.bj
      - google.com.bn
      - google.com.bo
      - google.com.br
      - google.bs
      - google.co.bw
      - google.com.by
      - google.by
      - google.com.bz
      - google.ca
      - google.com.kh
      - google.cc
      - google.cd
      - google.cf
      - google.cat
      - google.cg
      - google.ch
      - google.ci
      - google.co.ck
      - google.cl
      - google.cm
      - google.cn
      - google.com.co
      - google.co.cr
      - google.com.cu
      - google.cv
      - google.com.cy
      - google.cz
      - google.de
      - google.dj
      - google.dk
      - google.dm
      - google.com.do
      - google.dz
      - google.com.ec
      - google.ee
      - google.com.eg
      - google.es
      - google.com.et
      - google.fi
      - google.com.fj
      - google.fm
      - google.fr
      - google.ga
      - google.gd
      - google.ge
      - google.gf
      - google.gg
      - google.com.gh
      - google.com.gi
      - google.gl
      - google.gm
      - google.gp
      - google.gr
      - google.com.gt
      - google.gy
      - google.com.hk
      - google.hn
      - google.hr
      - google.ht
      - google.hu
      - google.co.id
      - google.iq
      - google.ie
      - google.co.il
      - google.im
      - google.co.in
      - google.io
      - google.is
      - google.it
      - google.je
      - google.com.jm
      - google.jo
      - google.co.jp
      - google.co.ke
      - google.ki
      - google.kg
      - google.co.kr
      - google.com.kw
      - google.kz
      - google.la
      - google.com.lb
      - google.com.lc
      - google.li
      - google.lk
      - google.co.ls
      - google.lt
      - google.lu
      - google.lv
      - google.com.ly
      - google.co.ma
      - google.md
      - google.me
      - google.mg
      - google.mk
      - google.ml
      - google.mn
      - google.ms
      - google.com.mt
      - google.mu
      - google.mv
      - google.mw
      - google.com.mx
      - google.com.my
      - google.co.mz
      - google.com.na
      - google.ne
      - google.com.nf
      - google.com.ng
      - google.com.ni
      - google.nl
      - google.no
      - google.com.np
      - google.nr
      - google.nu
      - google.co.nz
      - google.com.om
      - google.com.pa
      - google.com.pe
      - google.com.ph
      - google.com.pk
      - google.pl
      - google.pn
      - google.com.pr
      - google.ps
      - google.pt
      - google.com.py
      - google.com.qa
      - google.ro
      - google.rs
      - google.ru
      - google.rw
      - google.com.sa
      - google.com.sb
      - google.sc
      - google.se
      - google.com.sg
      - google.sh
      - google.si
      - google.sk
      - google.com.sl
      - google.sn
      - google.sm
      - google.so
      - google.st
      - google.com.sv
      - google.td
      - google.tg
      - google.co.th
      - google.com.tj
      - google.tk
      - google.tl
      - google.tm
      - google.to
      - google.com.tn
      - google.com.tr
      - google.tt
      - google.com.tw
      - google.co.tz
      - google.com.ua
      - google.co.ug
      - google.ae
      - google.co.uk
      - google.us
      - google.com.uy
      - google.co.uz
      - google.com.vc
      - google.co.ve
      - google.vg
      - google.co.vi
      - google.com.vn
      - google.vu
      - google.ws
      - google.co.za
      - google.co.zm
      - google.co.zw
      - google.tn
      # powered by Google
      - search.avg.com
      - isearch.avg.com
      - www.cnn.com
      - darkoogle.com
      - search.darkoogle.com
      - search.foxtab.com
      - www.gooofullsearch.com
      - search.hiyo.com
      - search.incredimail.com
      - search1.incredimail.com
      - search2.incredimail.com
      - search3.incredimail.com
      - search4.incredimail.com
      - search.incredibar.com
      - search.sweetim.com
      - www.fastweb.it
      - search.juno.com
      - find.tdc.dk
      - searchresults.verizon.com
      - search.walla.co.il
      - search.alot.com
      # Google Earch
      - www.googleearth.de
      - www.googleearth.fr
      # Google Cache
      - webcache.googleusercontent.com
      # Google SSL
      - encrypted.google.com
      # Syndicated search
      - googlesyndicatedsearch.com

`,
              }

describe('useragent-plugin', () => {
    // test('should not process event when disabled', async () => {
    //     const event = { properties: {} }
    //     const processedEvent = await processEvent(event as any, {
    //         cache: {} as CacheExtension,
    //         storage: {} as StorageExtension,
    //         global: {
    //             enabledPlugin: true,
    //             eventsToTrack: new Set('$pageview'.split(',')),
    //             refererDB: null,
    //         },
    //         config: { enable: 'true', eventsToTrack: '$pageview', },
    //         attachments: {
    //             refererParserYaml: referersAttachment
    //         },
    //         metrics: {},
    //     })
    //     expect(Object.keys(processedEvent.properties)).toStrictEqual(Object.keys(event.properties))
    // })

    // test('should not process event when $referrer is missing', async () => {
    //     const event = {
    //         properties: {
    //             $lib: 'posthog-node',
    //         },
    //     } as unknown as PluginEvent

    //     const processedEvent = await processEvent(event, {
    //         cache: {} as CacheExtension,
    //         storage: {} as StorageExtension,
    //         global: {
    //             enabledPlugin: true,
    //             eventsToTrack: new Set('$pageview'.split(',')),
    //             refererDB: null,
    //         },
    //         config: { enable: 'true', eventsToTrack: '$pageview', },
    //         attachments: {
    //             refererParserYaml: referersAttachment
    //         },
    //         metrics: {},
    //     })
    //     expect(Object.keys(processedEvent.properties)).toStrictEqual(['$lib'])
    // })

    // test('should not process event when $referrer is empty', async () => {
    //     const event = {
    //         properties: {
    //             $referrer: '',
    //             $lib: 'posthog-node',
    //         },
    //     } as unknown as PluginEvent

    //     const processedEvent = await processEvent(event, {
    //         cache: {} as CacheExtension,
    //         storage: {} as StorageExtension,
    //         global: {
    //             enabledPlugin: true,
    //             eventsToTrack: new Set('$pageview'.split(',')),
    //             refererDB: null,
    //         },
    //         config: { enable: 'true', eventsToTrack: '$pageview', },
    //         attachments: {
    //             refererParserYaml: referersAttachment
    //         },
    //         metrics: {},
    //     })
    //     expect(Object.keys(processedEvent.properties)).toStrictEqual(['$referrer', '$lib'])
    // })

    // test('should not process event when event is not track', async () => {
    //     const event = {
    //         event: '$pageleave',
    //         properties: {
    //             $referrer:
    //                 'http://www.google.com/search?q=gateway+oracle+cards+denise+linn&hl=en&client=safari',
    //             $lib: 'posthog-node',
    //         },
    //     } as unknown as PluginEvent

    //     const processedEvent = await processEvent(event, {
    //         cache: {} as CacheExtension,
    //         storage: {} as StorageExtension,
    //         global: {
    //             enabledPlugin: true,
    //             eventsToTrack: new Set('$pageview'.split(',')),
    //             refererDB: null,
    //         },
    //         config: { enable: 'true', eventsToTrack: '$pageview', },
    //         attachments: {
    //             refererParserYaml: referersAttachment
    //         },
    //         metrics: {},
    //     })
    //     expect(Object.keys(processedEvent.properties)).toStrictEqual(['$referrer', '$lib'])
    // })

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
                refererDB: null,
            },
            config: { enable: 'true', eventsToTrack: '$pageview', },
            attachments: {
                refererParserYaml: referersAttachment
            },
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

    // test('should add referrer details when $referrer is internal', async () => {
    //     const event = {
    //         event: '$pageview',
    //         properties: {
    //             $current_url: 'http://www.funpinpin.top/products/abc',
    //             $referrer:
    //                 'http://www.funpinpin.top/search?q=gateway+oracle+cards+denise+linn&hl=en&client=safari',
    //             $lib: 'posthog-node',
    //         },
    //     } as unknown as PluginEvent

    //     const processedEvent = await processEvent(event, {
    //         cache: {} as CacheExtension,
    //         storage: {} as StorageExtension,
    //         global: {
    //             enabledPlugin: true,
    //             eventsToTrack: new Set('$pageview'.split(',')),
    //             refererDB: null,
    //         },
    //         config: { enable: 'true', eventsToTrack: '$pageview', },
    //         attachments: {
    //             refererParserYaml: referersAttachment
    //         },
    //         metrics: {},
    //     })
    //     expect(Object.keys(processedEvent.properties)).toEqual(
    //         expect.arrayContaining(["$referrer", "$lib", "$set_once", "referrer"])
    //     )
    //     expect(processedEvent.properties.referrer).toStrictEqual(
    //         expect.objectContaining({
    //             referer_type: 'internal',
    //             referer_name: 'www.funpinpin.top',
    //             referer_keyword: null,
    //         })
    //     )
    // })


    // test('should add referrer details when set custom events', async () => {
    //     const eventsToTrack = '$pageview,$pageleave,add_cart'
    //     const event = {
    //         event: 'add_cart',
    //         properties: {
    //             $current_url: 'http://www.funpinpin.top/products/abc',
    //             $referrer:
    //                 'http://www.funpinpin.top/search?q=gateway+oracle+cards+denise+linn&hl=en&client=safari',
    //             $lib: 'posthog-node',
    //         },
    //     } as unknown as PluginEvent

    //     const processedEvent = await processEvent(event, {
    //         cache: {} as CacheExtension,
    //         storage: {} as StorageExtension,
    //         global: {
    //             enabledPlugin: true,
    //             eventsToTrack: new Set(eventsToTrack.split(',')),
    //             refererDB: null,
    //         },
    //         config: { enable: 'true', eventsToTrack: eventsToTrack, },
    //         attachments: {
    //             refererParserYaml: referersAttachment
    //         },
    //         metrics: {},
    //     })
    //     expect(Object.keys(processedEvent.properties)).toEqual(
    //         expect.arrayContaining(["$referrer", "$lib", "$set_once", "referrer"])
    //     )
    // })
})
