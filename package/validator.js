function isInValidEmail(userObject) {
    return !userObject.email.includes("@")
}

function isEmptyPayload(userObject) {
    return Object.keys(userObject).length === 0
}


module.exports = {
    isInValidEmail,
    isEmptyPayload
}