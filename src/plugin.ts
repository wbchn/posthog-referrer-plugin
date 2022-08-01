import { CacheExtension, PluginEvent, PluginMeta, PluginAttachment, Properties, StorageExtension } from '@posthog/plugin-scaffold'
const Referer = require('referer-parser')


interface ReferrerPluginInput {
    config: {
        enable: string,
        eventsToTrack: string
    }
    global: {
        enabledPlugin: boolean,
        eventsToTrack?: Set<string>
    }
    attachments: {
        refererParserYaml?: PluginAttachment,
        refererParserJson?: PluginAttachment
    }
    cache: CacheExtension
    storage: StorageExtension
    metrics: {}
}

/**
 * Setup of the plugin
 * @param param0 the meta data of the plugin
 */
 export function setupPlugin({ config, global }: ReferrerPluginInput) {
    global.eventsToTrack = new Set(config.eventsToTrack.split(','))
}


/**
 * Process the event
 * same as: matomo /plugins/Referrers/Columns/Base.php
 *             'referer_type'    => $this->typeReferrerAnalyzed,
            'referer_name'    => $this->nameReferrerAnalyzed,
            'referer_keyword' => $this->keywordReferrerAnalyzed,
* - referer_type
*        - direct            -- absence of referrer URL OR referrer URL has the same host
*        - site                -- based on the referrer URL
*        - search_engine        -- based on the referrer URL
*        - campaign            -- based on campaign URL parameter
*
* - referer_name
*         - ()
*         - piwik.net            -- site host name
*         - google.fr            -- search engine host name
*         - adwords-search    -- campaign name
*
* - referer_keyword
*         - ()
*         - ()
*         - my keyword
*         - my paid keyword
*         - ()
*         - ()
*
 */
 export async function processEvent(event: PluginEvent, { global }: ReferrerPluginInput) {
    const referrer_url = event?.properties?.$referrer

    if (global.eventsToTrack.has(event.event) && referrer_url) {
        const current_url = event?.properties?.$current_url
        const referrer = new Referer(referrer_url, current_url)
        const initalReferrerObj: Properties = {
            initial_referer_type: referrer.medium, // search or social
            initial_referer_name: referrer.uri.hostname,
            initial_referer_keyword: referrer.search_term,
        }
        const referrerObj: Properties = {
            referer_type: referrer.medium, // search or social
            referer_name: referrer.uri.hostname,
            referer_keyword: referrer.search_term,
        }

        if (!event.properties.$set_once) event.properties.$set_once = {}

        event.properties.$set_once = {...event.properties.$set_once, ...initalReferrerObj}
        event.properties.referrer = referrerObj
    }

    return event
}
