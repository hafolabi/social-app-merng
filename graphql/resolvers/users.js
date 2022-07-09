const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { UserInputError } = require('apollo-server')
const { validateRegisterInput, validateLoginInput } = require('../../util/validators')

dotenv.config()

function generateToken(params){
   return jwt.sign({
        id: params._id,
        email: params.email,
        username: params.username
    }, 
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

module.exports = {
    Mutation:{
        async login(_, { username, password }){
            const { errors, valid } = validateLoginInput(username, password)

            if(!valid){
                throw new UserInputError('Error', { errors }) 
            }

            const user = await User.findOne({username}).collation(
                { locale: "en", 
                 strength: 2 })

            if(!user){
                errors.usernot = 'User not found'
                throw new UserInputError('User not found', { errors })
            }
            
            const match =  await bcrypt.compare(password, user.password);
            if(!match){
                errors.passnot = 'Wrong credentials'
                throw new UserInputError('Wrong credentials', { errors })
            }

            const token = generateToken(user)

            return{
                ...user._doc,
                id: user._id,
                token
            }
        },

       async  register(_, { registerInput:{username, email, password, confirmPassword} }){
            // TODO: Validate the user data
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword)
            if(!valid){
                throw new UserInputError('Errors', { errors })
            }
            //TODO: Make sure user doesnot already exist
                const userUsername = await User.findOne({username})
                if(userUsername) {
                    throw new UserInputError('Username is taken', {
                        errors:{
                            username: 'This username is taken'
                        }
                    })
                }

                const userEmail = await User.findOne({email})
                if(userEmail) {
                    throw new UserInputError('Email is taken', {
                        errors:{
                            email: 'This email is taken'
                        }
                    })
                }
            //TODO: Hash the password before we store in our database and create auth token
            password = await bcrypt.hash(password, 12)

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            })

            const res = await newUser.save()

            const token = generateToken(res)

            return{
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
}