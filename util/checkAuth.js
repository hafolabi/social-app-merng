const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { AuthenticationError } = require('apollo-server')

dotenv.config()

module.exports = (context)=>{
    //context = {... headers}
    const authHeader = context.req.headers.authorization;
    if(authHeader){
        //Bearer ...
        const token  = authHeader.split('Bearer ')[1]
        if(token){
            try{
                const user = jwt.verify(token, process.env.SECRET_KEY)
                return user
            }catch(err){
                throw new AuthenticationError('Invalid/Expired Token')
            }
        }
        throw new Error('Authentication token must be Bearer[token]')
    }
    throw new Error('Authorization header must be provided')
}