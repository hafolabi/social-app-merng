import { gql, useMutation, useQuery } from "@apollo/client";
import moment from "moment";
import React, { useContext, useState } from "react";
import LikeButton from "../components/LikeButton";
import { FaRegComments } from "react-icons/fa";
import { AuthContext } from "../context/auth";
import DeleteButton from "../components/DeleteButton";
import { useHistory, useParams } from "react-router-dom";

export default function SinglePost() {
  const { postId } = useParams();
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState("");
  const history = useHistory();

  const { loading, data } = useQuery(FETCH_POST_QUERY, {
    variables: { postId },
  });

  const [submitComment, { error }] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment("");
    },
    variables: {
      postId,
      body: comment,
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    submitComment();
    setComment("");
  };

  const deletePostCallback = () => {
    history.push("/");
  };

  let postMarkUp;
  if (loading) {
    postMarkUp = <p>Loading post...</p>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = data.getPost;

    postMarkUp = (
      <>
        <div
          className="card mx-auto"
          style={{ width: "60%", marginTop: "20px" }}
        >
          <img
            style={{ width: "100%", height: "300px", objectFit: "cover" }}
            src="https://i.ibb.co/0G4RQcv/photo-1597393922738-085ea04b5a07.jpg"
            className="card-img-top"
            alt="..."
          />
          <div className="card-body">
            <h5 className="card-title">{username}</h5>
            <span
              style={{ color: "gray", fontSize: "12px", cursor: "pointer" }}
            >
              {moment(createdAt).fromNow()}
            </span>
            <p className="card-text">{body}</p>

            <hr />
            <div className="d-flex align-items-center justify-content-between">
              <div
                className="btn-group"
                aria-label="Basic mixed styles example"
              >
                <LikeButton user={user} post={{ id, likes, likeCount }} />

                <button
                  type="button"
                  className="btn btn-outline-danger d-flex align-items-center"
                  onClick={() => console.log("comment on post")}
                >
                  <FaRegComments className="icon" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-success"
                  style={{ padding: "0px 5px" }}
                >
                  {commentCount}
                </button>
              </div>

              {user && user.username === username && (
                <DeleteButton postId={id} callback={deletePostCallback} />
              )}
            </div>
          </div>
        </div>

        {comments.map((comment) => (
          <div
            className="card mx-auto"
            key={comment.id}
            style={{ width: "60%", marginTop: "10px", marginBottom: "40px" }}
          >
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="card-title">{comment.username}</h6>
                  <span
                    style={{
                      color: "gray",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    {moment(comment.createdAt).fromNow()}
                  </span>
                  <div className="card-text">{comment.body}</div> 
                </div>

                {user && user.username === comment.username && (
                  <DeleteButton postId={id} commentId={comment.id} />
                )}
              </div>
            </div>
          </div>
        ))}

        {user && (
          <div
            className="card mx-auto"
            style={{ width: "60%", marginTop: "10px", marginBottom: "20px" }}
          >
            <div className="card-body">
              <h4 className="card-title">Post a comment</h4>
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <input
                    type="text"
                    name="comment"
                    className="form-control"
                    placeholder="Comment..."
                    onChange={(e) => setComment(e.target.value)}
                    value={comment}
                  />
                  {error && (
                    <span className="error-msg">
                      {error.graphQLErrors[0]?.message}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={comment.trim() === ""}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }

  return postMarkUp;
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation ($postId: String!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query getPost($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;
