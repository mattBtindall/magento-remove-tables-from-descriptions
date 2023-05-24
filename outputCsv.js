const createCsvWriter = require('csv-writer').createObjectCsvWriter

/**
 * writes product skus to csv file
 * @param {Array.<Object>} data - expects an array of objects with a sku e.g. {sku: 'sku'}
 */
function writeSkusToCsv(data) {
    const csvWriter = createCsvWriter({
        path: 'configurable-products-with-tables.csv',
        header: [
            { id: 'sku', title: 'Sku' }
        ]
    })

    csvWriter
        .writeRecords(data)
        .then(() => console.log('Data successfully written to CSV file'))
        .catch((error) => console.error('Error writing to CSV file:', error));
}

module.exports = {
    writeSkusToCsv
}