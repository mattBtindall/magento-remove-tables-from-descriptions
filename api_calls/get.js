const { admin } = require('../global')

/**
 * gets all configurable products
 * @returns {Array.<Object>}
 */
async function getConfigurableProducts() {
    const { items: configProducts } = await admin.get('products', {
        params: {
            fields: "items[sku,custom_attributes,id]",
            searchCriteria: {
                // currentPage: 1,
                // pageSize: 200,
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

module.exports = {
    getConfigurableProducts
}