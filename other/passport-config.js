const LocalStrat = require("passport-local").Strategy
const UserModel = require("../models/user")
function initialize(passport){
    const authUser = async(name,password,done) => {
        const user = await UserModel.findOne({ name }).lean()
        if(!user||user == null) return done(null,false,{error:"Wrong Password/Email"})
        if(password === user.password){
            console.log(`Email: ${user.name} Logged back in`)
            return done(null,user)
        }
        else return done(null,false,{error:"Wrong Password/Email"})
    }
    passport.use(new LocalStrat({usernameField:"email"},authUser))
    passport.serializeUser((user,done) => {done(null,user._id)})
    passport.deserializeUser(async(id,done) => {await done(null,await UserModel.findOne({_id:id}))})
}
module.exports = initialize