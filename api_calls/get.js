const { admin } = require('../global')

/**
 * gets products with the given filters
 * @param {Array.<Object>} filters - filters e.g.  { 'field': 'type_id', 'value': 'configurable', 'condition_type': 'eq'}
 * @returns {Array.<Object>} magento products
 */
async function getProductsWithFilters(filters) {
    const { items: products } = await admin.get('products', {
        params: {
            fields: "items[sku,custom_attributes,id,extension_attributes]",
            searchCriteria: {
                currentPage: 1,
                pageSize: 1000,
                filter_groups: [
                    {
                        filters: filters
                    }
                ]
            }
        }
    })
    return products
}

/**
 * gets all configurable products
 * @returns {Array.<Object>} configurable products
 */
async function getConfigProducts() {
    return getProductsWithFilters([{ 'field': 'type_id', 'value': 'configurable', 'condition_type': 'eq'}])
}

module.exports = {
    getConfigProducts
}