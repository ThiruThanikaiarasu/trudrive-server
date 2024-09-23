const authenticateUser = async (request, response) => {
    response.status(200).send({ message: "Authenticate User"})
}

module.exports = {
    authenticateUser
}