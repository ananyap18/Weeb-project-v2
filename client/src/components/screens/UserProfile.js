import React, { useState, useEffect, useContext } from "react";
import "./Profile.css";
import Post from "../utils/Post";
import { useParams } from "react-router-dom";
import { UserContext } from "../../App";

function UserProfile() {
  const { state, dispatch } = useContext(UserContext);
  const { USER_ID } = useParams();
  const [showFollowBtn, setShowFollowBtn] = useState(state?!state.following.includes(USER_ID):true)
  const [userInfo, setUserInfo] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [numberOfPosts, setNumberOfPosts] = useState(0)

  const getUserPosts = async () => {
    try {
      const response = await fetch(`/profile/${USER_ID}`, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
      const resJSON = await response.json();
      console.log("UserProfile.js", resJSON)
      setUserPosts(resJSON.posts);
      setNumberOfPosts(resJSON.posts.length)
      setUserInfo(resJSON.user);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getUserPosts();
  }, []);

  const followUser = async () => {
    try {
      const response = await fetch("/follow", {
        method: "PATCH",
        body: JSON.stringify({ followId: USER_ID }),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
      const resJSON = await response.json();
      dispatch({
        type: "UPDATE",
        payload: {
          following: resJSON.userLoggedIn.following,
          followers: resJSON.userLoggedIn.followers,
        }
      });
      setUserInfo(resJSON.userToFollow)
      localStorage.setItem('user', JSON.stringify(resJSON.userLoggedIn))      
    } catch (e) {
      console.log(e);
    }
  };

  const unfollowUser = async () => {
    try {
      const response = await fetch("/unfollow", {
        method: "PATCH",
        body: JSON.stringify({ followId: USER_ID }),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
      const resJSON = await response.json();
      dispatch({
        type: "UPDATE",
        payload: {
          following: resJSON.userLoggedIn.following,
          followers: resJSON.userLoggedIn.followers,
        },
      });
      setUserInfo(resJSON.userToUnfollow)
      localStorage.setItem('user', JSON.stringify(resJSON.userLoggedIn))
    } catch (e) {
      console.log(e);
    }
  };

  const userPostsToRender = userPosts.map(userPost => <Post key={userPost._id} post={userPost} />)

  return (
    <>
      <div className="about">
        <div className="avatar">
          <img
            src={(userInfo.avatar === "no pic")?"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUDeQ0UC4TH-VQn1gDp7HjwAPQvHiQvYHezg&usqp=CAU": userInfo.avatar}
            alt="avatar-img"
          />
        </div>
        <div className="details">
          <h3>{(userInfo)?userInfo.nickname:"loading"}</h3>
          <p>{(userInfo)?userInfo.email:"loading"}</p>
          <div>
            <h5>{numberOfPosts} posts</h5>
            <h5>
              {userInfo.followers ? userInfo.followers.length : "0"} followers
            </h5>
            <h5>
              {userInfo.following ? userInfo.following.length : "0"} following
            </h5>
          </div>
          {showFollowBtn? <button onClick={ () => {followUser(); setShowFollowBtn(!showFollowBtn)}  }>Follow </button> : <button onClick={() =>{unfollowUser(); setShowFollowBtn(!showFollowBtn)}} > Unfollow </button> }
        </div>
      </div>
      <div className="gallery">
        <ul className="posts">
          {userPosts.length == 0? "No Post Found :(" : userPostsToRender}
        </ul>
      </div>
    </>
  );
}

export default UserProfile;
