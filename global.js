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

module.exports = {
    admin
}
