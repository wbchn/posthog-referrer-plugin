import { CacheExtension, PluginEvent, PluginMeta, PluginAttachment, Properties, StorageExtension } from '@posthog/plugin-scaffold'

import * as querystring from 'query-string'
import * as yaml from 'js-yaml'
import * as url from "url"

interface ReferrerPluginInput {
    config: {
        enable: string,
        eventsToTrack: string
    }
    global: {
        enabledPlugin: boolean,
        eventsToTrack?: Set<string>,
        refererDB?: Record<string, any>
    }
    attachments: {
        refererParserYaml?: PluginAttachment,
        refererParserJson?: PluginAttachment
    }
    cache: CacheExtension
    storage: StorageExtension
    metrics: {}
}


function loadReferers(source) {
    var referers_dict = {}

    for (var medium in source) {
        var conf_list = source[medium]

        for (var referer_name in conf_list) {
            var config = conf_list[referer_name]
            var params = null

            if (config.parameters) {
                params = config.parameters.map(function (p) { return p.toLowerCase() })
            }
            config.domains.forEach(function (domain) {
                referers_dict[domain] = {
                    'name': referer_name,
                    'medium': medium
                }
                if (params) {
                    referers_dict[domain]['params'] = params
                }
            })
        }
    }
    return referers_dict
}

function Referer(referer_url, current_url, referers) {
    this.known = false
    this.referer = null
    this.medium = 'unknown'
    this.search_parameter = null
    this.search_term = null
    this.referers = referers

    var ref_uri = url.parse(referer_url)
    var ref_host = ref_uri.hostname
    this.known = Boolean(~['http:', 'https:'].indexOf(ref_uri.protocol))
    this.uri = ref_uri

    if (!this.known) return

    if (current_url) {
        var curr_uri = url.parse(current_url)
        var curr_host = curr_uri.hostname

        if (curr_host == ref_host) {
            this.medium = 'internal'
            return
        }
    }

    var referer = this._lookup_referer(ref_host, ref_uri.pathname, true)
    if (!referer) {
        referer = this._lookup_referer(ref_host, ref_uri.pathname, false)
        if (!referer) {
            this.medium = 'unknown'
            return
        }
    }

    this.referer = referer['name']
    this.medium = referer['medium']

    if (referer['medium'] == 'search') {
        if (!referer['params']) return

        var pqs = querystring.parse(ref_uri.query)

        for (var param in pqs) {
            var val = pqs[param]

            if (referer['params'].indexOf(param.toLowerCase()) !== -1) {
                this.search_parameter = param
                this.search_term = val
            }
        }
    }
}

Referer.prototype._lookup_referer = function (ref_host, ref_path, include_path) {
    // console.log(ref_host, ref_path, include_path)
    var referer = null

    if (include_path)
        referer = this.referers[ref_host + ref_path]
    else
        referer = this.referers[ref_host]
    
    if (!referer) {
        if (include_path) {
            var path_parts = ref_path.split('/')
            if (path_parts.length > 1) {
                try {
                    referer = this.referers[ref_host + '/' + path_parts[1]]
                } catch (e) {

                }
            }
        }
    }

    if (!referer) {
        try {
            var idx = ref_host.indexOf('.')
            if (idx === -1) return null

            var slicedHost = ref_host.slice(idx + 1)
            return this._lookup_referer(
                slicedHost,
                ref_path, include_path
            )
        } catch (e) {
            return null
        }
    } else return referer
};

/**
 * Setup of the plugin
 * @param param0 the meta data of the plugin
 */
export function setupPlugin({ config, global, attachments }: ReferrerPluginInput) {
    const eventsToTrack = config.eventsToTrack || '$pageview'
    global.eventsToTrack = new Set(eventsToTrack.split(','))
    global.refererDB = loadReferers(yaml.load(attachments.refererParserYaml.contents))
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

    if (global.eventsToTrack.has(event.event) && referrer_url && global.refererDB) {
        const current_url = event?.properties?.$current_url
        const referrer = new Referer(referrer_url, current_url, global.refererDB)
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

        event.properties.$set_once = { ...event.properties.$set_once, ...initalReferrerObj }
        event.properties.referrer = referrerObj
    }

    return event
}
