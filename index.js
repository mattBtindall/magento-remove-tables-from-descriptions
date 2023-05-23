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

/**
 * returns the products that contain tables in there description
 * @param {Array.<Object>} configProducts - containing product information, must have the minimum {id, sku, custom_attribute: [{attribute_code, value}, {...}]}
 * @returns {Array.<Object>} products that contain a table in there description, the objects have been mutated {id: x, sku, 'some string', description: 'html in here'}
 */
function getProductsWithTables(configProducts) {
    return configProducts.reduce((accumulator, currentValue) => {
        for (const attr of currentValue.custom_attributes) {
            if (attr.attribute_code === 'description' && attr.value.includes('<table')) {
                accumulator.push({
                    id: currentValue.id,
                    sku: currentValue.sku,
                    description: attr.value
                })
                return accumulator
            }
        }
        return accumulator
    }, [])
}
