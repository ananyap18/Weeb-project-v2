const mongoose = require("mongoose")
const { isEmail } = require("validator")
const bcrypt = require('bcrypt')
const { ObjectId } = mongoose.Schema.Types 

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
  followers:[{
    type: ObjectId,
    ref: "user"
  }],
  following: [{
    type: ObjectId,
    ref: "user"
  }],
  avatar: {
    type: String,
    default: "no pic"
  },
  bio: {
    type: String,
    default: "no bio"
  },
  nickname: {
    type: String,
    default: "no nickname"
  },
  personalityType: {
    type: String,
    default: "no personality"
  },
  role: {
    type: String,
    default: "no role"
  }
});

userSchema.pre('save', async function(next){
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt) 
  console.log('presave', this)
  next()
})

userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    console.log(password)
    console.log(user.password)
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};

userSchema.statics.findUser = async function(email) {
  const user = await this.findOne({ email })
  if(user){
    return user
  }
  throw Error('email not registered')
}

const User = mongoose.model("user", userSchema);

module.exports = User;
