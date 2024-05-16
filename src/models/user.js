const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, unique: true, lowercase: true },
    password: { type: String },
    phoneNumber: { type: String, required: true, minlength: 10, trim: true, unique: true },
    userName: { type: String, lowercase: true, unique: true },
    dateofBirth: { type: String },
    location: { type: String },
    avatar: { type: Buffer },
    favRead: { type: String },
    tokens: [{ token: { type: String } }]
}, {
    timestamps: true
});

userSchema.statics.findByCredentials = async (identifier, password) => {
    const user = await User.findOne({ email: identifier });
    if (!user) throw new Error('Unable to find User');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid Password');
    return user;
};

userSchema.statics.getuserGenre = async (userId) => {
    const user = await User.findById(userId);
    return user.favRead;
};

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject;
};

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'Wissenmonk');
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
