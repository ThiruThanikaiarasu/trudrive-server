const { init } = require('@paralleldrive/cuid2')

const createUrlIdForDirectory = (tenantId) => {
    const urlId = init({
        random: Math.random,
        length: 16,
        fingerprint: tenantId
    })

    return urlId()
}

module.exports = {
    createUrlIdForDirectory
}