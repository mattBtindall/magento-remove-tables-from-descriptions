const { admin } = require('../global')

/**
 * updates the desciption of the specified product
 * @param {String} sku - product sku
 * @param {String} description - product description containing HTML elements
 * @returns {Boolean} whether product has updated
 */
async function updateProductDescription(sku, description) {
    let updated = false
    const config = {
        "storeCode": "all"
    },
    data = {
        "product": {
            "sku": sku,
            "custom_attributes": [
                {"attribute_code": "description", "value": description}
            ]
        }
    }
    try {
        updated = !! await admin.put(`products/${encodeURIComponent(sku)}`, data, config)
    } catch(e) {
        console.log(e.response.data)
    }

    return updated
}

module.exports = {
    updateProductDescription
}