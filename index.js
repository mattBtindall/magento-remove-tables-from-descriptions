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
    return configProducts.reduce((products, currentProduct) => {
        for (const attr of currentProduct.custom_attributes) {
            if (attr.attribute_code === 'description' && attr.value.includes('<table')) {
                console.log(`${currentProduct.sku} contains a table`)
                products.push({
                    id: currentProduct.id,
                    sku: currentProduct.sku,
                    description: attr.value
                })
                return products
            }
        }
        return products
    }, [])
}

/**
 * removes any table elemenets from the given string
 * @param {String} description - string contaning html elements
 * @returns {String} with the html element removed
 */
function removeTable(description) {
    const pattern = new RegExp('<table[^>]*>[\\s\\S]*?</table>', 'gi');
    return description.replace(pattern, '');
}

/**
 * removes tables from the given products
 * @param {Array.<Object>} products - products with the minimum requirments {id: x, sku, 'some string', description: 'html in here'}
 * @returns {Array.<Object>} products with the above properties
 */
function removeTables(products) {
    return products.map(prod => ({
        id: prod.id,
        sku: prod.sku,
        description: removeTable(prod.description)
    }))
}
