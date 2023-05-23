const Magento2Api = require('magento2-api-wrapper')
const https = require('https')
const keys = require('./keys')

/** @var Magento2Api admin */
const admin = new Magento2Api({
    api: {
        url: 'https://localhost',
        consumerKey: keys.consumerKey,
        consumerSecret: keys.consumerSecret,
        accessToken: keys.accessToken,
        tokenSecret: keys.tokenSecret
    },
    axios: {
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        }),
    }
})

/**
 * gets all configurable products
 * @returns {Array.<Object>}
 */
async function getConfigurableProducts() {
    const { items: configProducts } = await admin.get('products', {
        params: {
            fields: "items[sku,custom_attributes,id]",
            searchCriteria: {
                currentPage: 1,
                pageSize: 100,
                filter_groups: [
                    {
                        filters: [
                            { 'field': 'type_id', 'value': 'configurable', 'condition_type': 'eq'}
                        ]
                    }
                ]
            }
        }
    })
    return configProducts
}
