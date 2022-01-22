import React from "react";
import Modal from "react-modal";
import { useState, useContext } from "react";
import "./Post.css";
import Comment from "../utils/Comment";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";

Modal.setAppElement("#root");

function Post({ post }) {
  const { state, dispatch } = useContext(UserContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const {state,dispatch} = useContext(UserContext)

  const getComments = async () => {
    try {
      // make request to backend to get comments
      const response = await fetch(`/allComments/${post._id}`, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
      const responseJSON = await response.json();
      
      setComments(responseJSON);
    } catch (e) {
      console.log(e);
    }
  };

  const commentChangeHandler = (e) => {
    setNewComment(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // request to backend
    try {
      const response = await fetch(`/addComment/${post._id}`, {
        method: "POST",
        body: JSON.stringify({
          body: newComment,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newCommentId = await response.json();
      console.log(newCommentId.commentId);
    } catch (err) {
      console.log(err);
    }
    setNewComment("");
  };

  return (
    <li className="post">
      <img
        src="https://c.tenor.com/3j56ITrFib0AAAAC/gif-anime-purple.gif"
        alt="smoothie recipe icon"
      />

      <h3>{post.title}</h3>
      <p>{post.body}</p>
      <p
        onClick={() => {
          setModalIsOpen(true);
          getComments(post._id);
        }}
        className="modal-btn"
      >
        Comments
      </p>
      {/* redirect to '/profile' if user clicks on his own nickname` */}
      <Link
        to={
          post.postedBy._id === state._id
            ? "/profile"
            : `/profile/${post.postedBy._id}`
        }
      >
        <h6>{post.postedBy.nickname}</h6>
      </Link>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        style={{
          content: {
            display: "grid",
            gridTemplateColumns: "1fr minmax(150px, 25%)",
          },
        }}
      >
        <div className="post-img">
          <img src={`${post.photoLink}`} alt="post-img" />
        </div>
        <div className="post-details">
          <div className="title">
            <h4>{post.title}</h4>
            <p onClick={() => setModalIsOpen(false)} className="modal-btn">
              Close
            </p>
          </div>

          <p>{post.body}</p>

          <hr />
          <div className = "card-content">
            <i className = "Material-icons" style={{color:"red"}}>favorite</i>
            {item.likes.includes(state._id)
            ?  
              <i className="material-icons"
              onClick={()=>{unlikePost(item._id)}}
              >thumb_down</i>
            :
              <i className = "material-icons"
              onClick={()=>{likePost(item._id)}}
              >thumb_up</i>
            }
            <i className = "material-icons"
            onClick={()=>{likePost(item._id)}}
            >thumb_up</i>
            <i className="material-icons"
            onClick={()=>{unlikePost(item._id)}}
            >thumb_down</i>
            <h6>{Item.likes.length} likes </h6>
          </div>

          <div className="comments">
            {comments.map((comment) => (
              <Comment commentInfo={comment} />
            ))}
          </div>
          <form onSubmit={submitHandler} className="comment-form">
            <input
              type="text"
              placeholder="add comment"
              className="comment-input"
              onChange={commentChangeHandler}
              value={newComment}
            />
            <button className="comment-add-btn">add</button>
          </form>
        </div>
      </Modal>
    </li>
  );
}

export default Post;
