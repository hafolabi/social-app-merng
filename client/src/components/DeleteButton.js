import React from "react";
import { gql, useMutation } from "@apollo/client";
import { FaTrash } from "react-icons/fa";

export default function DeleteButton({ postId, callback }) {
  const [deletePost] = useMutation(DELETE_POST_MUTATION, {
    update(proxy) {
      //TODO: remove post from cache
      
    // const {getPosts} = proxy.readQuery({query: FETCH_POSTS_QUERY})
    //     proxy.writeQuery({
    //         query: FETCH_POSTS_QUERY,
    //         data: { getPosts: [...getPosts, getPosts.filter(p=> p.id !== postId)] },
    //       });
      if(callback) callback()
    },
    variables: { postId },
    refetchQueries: [{query: FETCH_POSTS_QUERY}]
  });
  
  console.log(postId)
  return (
    <>
      <button
        type="button"
        className="btn btn-outline-danger d-flex align-items-center justify-content-center"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        style={{ padding: "3.5px", border: "1px solid tomato" }}
      >
        <FaTrash style={{ color: "tomato" }} className="icon" />
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete this post
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={deletePost}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
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

