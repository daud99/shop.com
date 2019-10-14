const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        /*
        Here, we are trying to get the token from incoming request and store it.
        We are looking into the headers of incoming request that is of name "authorization" in our case and then storing it.
         .verify method will be used to verify the token
        */
        const token = req.headers.authorization;
        jwt.verify(token, "secret_should_be_longer");
        next();
    } catch (error) {
        res.status(200).json({ message: "Auth Failed!" });
    }
};
