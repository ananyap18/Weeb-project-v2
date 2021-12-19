const { Router } = require("express");
const { requireAuth, checkUser } = require("../middleware/authMiddleware");
const router = Router();
const Post = require("../models/Post");
const User = require("../models/User");

router.get("/profile/:user_id", requireAuth, async (req, res) => {
  const userId = req.params["user_id"].trim();
  try {
    // get user (without password)
    const user = await User.findOne({ _id: userId }).select("-password");
    // get all the post by that user
    const posts = await Post.find({ postedBy: user._id }).populate(
      "postedBy",
      "_id email nickname"
    );
    res.status(200).json({ user, posts });
    console.log("other users's feed", user, posts);
  } catch (e) {
    res.status(500).send(e.message);
    console.log(e);
  }
});

router.patch("/follow", requireAuth, checkUser, async (req, res) => {
  try {
    const userToFollowId = req.body.followId.trim();
    const userLoggedInId = req.user._id;
    // update user to be followed
    const userToFollow = await User.findByIdAndUpdate(
      { _id: userToFollowId },
      {
        $push: { followers: userLoggedInId },
      },
      {
        new: true,
      }
    ).select("-password");

    const userLoggedIn = await User.findByIdAndUpdate(
      { _id: userLoggedInId },
      {
        $push: { following: userToFollowId },
      },
      {
        new: true,
      }
    ).select("-password");
    res.status(200).json({ userToFollow, userLoggedIn });
  } catch (e) {
    res.status(500).send(e.message);
    console.log(e);
  }
});

router.patch("/unfollow", requireAuth, checkUser, async (req, res) => {
  try {
    const userToUnfollowId = req.body.followId.trim();
    const userLoggedInId = req.user._id;
    // update user to be followed
    const userToUnfollow = await User.findByIdAndUpdate(
      { _id: userToUnfollowId },
      {
        $pull: { followers: userLoggedInId },
      },
      {
        new: true,
      }
    ).select("-password");

    const userLoggedIn = await User.findByIdAndUpdate(
      { _id: userLoggedInId },
      {
        $pull: { following: userToUnfollowId },
      },
      {
        new: true,
      }
    ).select("-password");
    res.status(200).json({ userToUnfollow, userLoggedIn });
  } catch (e) {
    res.status(500).send(e.message);
    console.log(e);
  }
});

router.put("/updateAvatar", requireAuth, checkUser, async (req, res) => {
  const avatarURL = req.body.avatarURL;
  const userLoggedInId = req.user._id;
  try {
    const user = await User.findByIdAndUpdate(
      { _id: userLoggedInId },
      {
        $set: { avatar: avatarURL },
      },
      { new: true }
    );
    res.status(200).json({ updatedUser: user });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.put("/updateBio", requireAuth, checkUser, async (req, res) => {
  const bio = req.body.bio;
  const personality = req.body.personality;
  const role = req.body.role;
  const nickname = req.body.nickname;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: { bio, nickname, personalityType: personality, role },
      },
      { new: true }
    );
    res.status(200).json({ updatedUser: user });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/search-user", requireAuth, checkUser, async (req, res) => {
  let userPattern = new RegExp("^" + req.body.query);
  try {
    const user = await User.find({ email: { $regex: userPattern } });
    res.status(200).json({ user });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
