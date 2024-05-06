const mongoose = require('mongoose')
// const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    name : {
        type : String,
    },
    email: {
        type: String,
        
        lowercase : true,
        
    },
    password : {
        type : String,
        
    },
    phoneNumber : {
        type : String,
        required : [true,'Phone number is required'],
        minlength : 10,
        trim:true,
        validate(value) {
            if(!validator.isMobilePhone(value)) throw new Error('Please enter valid phone number')
        }
    
      },
    userName : {
        type : String,
        lowercase: true,
        
    } ,
    dateofBirth : {
        type : String,
        
    },
    location : {
        type : String,
    },
    avatar : {
        type : Buffer
    },
    tokens:[{
        token :{
            type :String,
            required : true
        }
    }] 
},
{
    timestamp : true
})

userSchema.statics.findByCredentials = async(identifier,password) =>{
    const user = await User.findOne({ $or : [ { email: identifier },
      { phoneNumber: identifier }]})
    if(!user) throw new Error('Unable to find User')
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch) throw new Error ('Invalid Passwod')
    return user
  
  }
  


userSchema.methods.toJSON = function () { 
    const user = this
    const userObject = user.toObject()
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject
}
userSchema.methods.generateAuthToken =  async function(){
    const user = this ;
    const token = jwt.sign({_id : user._id.toString()},'Wissenmonk' )
    user.tokens= user.tokens.concat({ token })
    await user.save()
    return token 
}

userSchema.pre('save' , async function(next){
    const user = this 
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

const User = mongoose.model('User', userSchema)
module.exports = User