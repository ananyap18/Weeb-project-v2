const User = require("../models/User");
const jwt = require("jsonwebtoken");
const mailHandler = require("../utils/email")

// handle errors
const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  // password-reset error
  if (err.message === "email not registered") {
    errors.resetError = "Please enter registered email";
  }

  // incorrect email
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  // incorrect password
  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = "That email is already registered";
    return errors;
  }

  // validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const maxAge = 3 * 60 * 60 * 24;
const createToken = (id) => {
  return jwt.sign({ id }, "ananya sh secret", {
    expiresIn: maxAge,
  });
};

const createTokenForResetPwd = (id) => {
  return jwt.sign({ id }, "secret for reset password", {
    expiresIn: "15m",
  });
};

// controller actions
module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.signup_post = async (req, res) => {
  const { email, password, nickname } = req.body;

  try {
    const user = await User.create({ email, password, nickname });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports.forgetPassword_get = (req, res) => {
  res.render("forgetPassword");
};

module.exports.forgetPassword_post = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findUser(email);
    //create jwt & email one-time link
    const token = createTokenForResetPwd(user._id);
    //send one-time-valid link
    mailHandler(user.email,user._id,token)
    console.log(
      `email -> http://localhost:8000/reset-password/${user.email}/${user.id}/${token}`
    );
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.resetPassword_get = (req, res) => {
  console.log(req.params)
  const { id } = req.params
  // create token form userID param
  const token = createTokenForResetPwd(id);
  // verify token
  jwt.verify(token, "secret for reset password", (err, decodedToken) => {
    if (err) {
      console.log(err);
      // res.redirect("/");
    } else {
      console.log(decodedToken, "token matches1");
      res.status(200).json({token: token})
    }
  });
};

module.exports.resetPassword_post = (req, res) => {
  const { email, id } = req.params;
  const { password1, password2 } = req.body;
  // here we recieve equal password & confirm password
  // get user by Id

  try {
    User.findOne({ email }, function (err, user) {
      if (err) {
        console.log(err.message);
        res.status(404).send("error occured");
      } else {
        if (!user) {
          console.log('no user found')
          res.status(404).send({
            errors: {
              invalid_user: "user doesn't exist",
            },
          });
        } else {
          // user found
          console.log("found user", user);
          // create token form userID param
          const token = createTokenForResetPwd(id);
          // verify token
          jwt.verify(
            token,
            "secret for reset password",
            async (err, decodedToken) => {
              if (err) {
                console.log(err);
                res.redirect("/");
              } else {
                // token matches
                console.log(decodedToken, "token matches2");
                try {
                  if(password1 === password2){
                // update password
                try{
                  const userToBeUpdate = await User.findOne({email})
                  //update password
                  userToBeUpdate.password = password1
                  //save password
                  await userToBeUpdate.save()
                  res.status(200).json({msg: 'password updated'})
                }catch(e){
                  console.log(e)
                }
                  }
                } catch (err) { console.log('error',err) }

              }
            }
          );
        }
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(400);
  }
};




