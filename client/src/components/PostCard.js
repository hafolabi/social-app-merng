import React, { useContext } from "react";
import moment from "moment";
import { FaRegComments, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";

export default function PostCard({
  post: { body, createdAt, id, username, likeCount, commentCount, likes },
}) {
  const { user } = useContext(AuthContext);

  return (
    <div className="col">
      <div className="card mb-3">
        <div className="card-body">
          <div className="d-flex justify-content-between align-item-center">
            <Link className="link" to={`/post/${id}`}>
              <h5 className="card-title">{username}</h5>
            </Link>
            <img
              style={{ width: "35px", height: "40px", objectFit: "cover" }}
              src="https://i.ibb.co/0G4RQcv/photo-1597393922738-085ea04b5a07.jpg"
              alt=""
            />
          </div>
          <Link className="link" to={`/post/${id}`}>
            <span
              style={{ color: "gray", fontSize: "12px", cursor: "pointer" }}
            >
              {moment(createdAt).fromNow()}
            </span>
          </Link>
          <p className="small">{body}</p>

          <div
            style={{ marginTop: "13px" }}
            className="d-flex align-items-center justify-content-between"
          >
            <div className="btn-group" aria-label="Basic mixed styles example">
              <LikeButton user={user} post={{ id, likes, likeCount }} />

              <button
                type="button"
                className="btn btn-outline-danger d-flex align-items-center"
              >
                <Link to={`/posts/${id}`}>
                  <FaRegComments className="icon" />
                </Link>
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
              <button
                type="button"
                className="btn btn-outline-danger d-flex align-items-center justify-content-center"
                onClick={() => console.log("Delete Post")}
                style={{ padding: "3.5px", border: "1px solid tomato" }}
              >
                <FaTrash style={{ color: "tomato" }} className="icon" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
