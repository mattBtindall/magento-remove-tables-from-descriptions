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
                pageSize: 100,
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

/**
 * gets a product by id
 * @param {Number} id - magento product id
 * @returns {Object} magento product
 */
async function getProductById(id) {
    const product = await getProductsWithFilters([{
        'field': 'entity_id', 'value': id, 'condition_type': 'eq'
    }])
    return product[0]
}

/**
 * gets products by there ids
 * @param {Array.<Number>} ids - magento product ids
 * @returns {Array.<Object>} magento products
 */
async function getProductsByIds(ids) {
    const products = []
    for (const id of ids) {
        products.push(await getProductById(id))
    }
    return products
}

/**
 * gets the child products of configurable products
 * @param {Array.<Object>} configProducts - the configurable products
 * @returns {Array.<Object>} child products
 */
async function getConfigProductChildren(configProducts) {
    const configProductIds = configProducts.map(prod => prod.id)
    const childProductIds = []
    for (const prod of configProducts) {
        for (const id of prod.extension_attributes.configurable_product_links) {
            if (configProductIds.includes(id) || childProductIds.includes(id)) {
                continue
            }

            childProductIds.push(id)
        }
    }

    return getProductsByIds(childProductIds)
}

/**
 * gets configurable products along with there children
 * @returns {Array.<Object>} magento products
 */
async function getConfigAndChildProducts() {
    const configProducts = await getConfigProducts()
    const childProducts = await getConfigProductChildren(configProducts)
    return configProducts.concat(childProducts)
}

module.exports = {
    getConfigAndChildProducts
}