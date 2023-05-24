const { getConfigProducts } = require('./api_calls/get')
const { updateProductDescription } = require('./api_calls/set')
const { writeSkusToCsv } = require('./outputCsv')

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
 * removes any table elements from the given string
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

/**
 * updates the product descriptions
 * @param {Array.<Object>} products - contains magento products with the minimum reuqirment of {sku: 'sku', description: 'description'}
 * @returns {Array.<Object>} states whether the product description has been successfully updated
 */
async function updateProductDescriptions(products) {
    const results = []
    for (const prod of products) {
        results.push({sku: prod.sku, updated: await updateProductDescription(prod.sku, prod.description)})
    }
    return results
}

async function main() {
    const products = await getConfigProducts()
    const productsWithTables = getProductsWithTables(products)
    const productSkus = productsWithTables.map(prod => ({sku: prod.sku}))
    writeSkusToCsv(productSkus)
    // const productsWithoutTables = removeTables(productsWithTables)
    // console.log(await updateProductDescriptions(productsWithoutTables))
}
main()