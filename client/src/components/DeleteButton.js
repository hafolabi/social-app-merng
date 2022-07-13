import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { FaTrash, FaTimes } from "react-icons/fa";

export default function DeleteButton({ postId, commentId, callback }) {
  const [click, setClick] = useState(false)
  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION

  const [deletePostOrComment] = useMutation(mutation, {
    update(proxy) {
      //TODO: remove post from cache

      // if(!commentId){
      //   const {getPosts} = proxy.readQuery({query: FETCH_POSTS_QUERY})
      //     proxy.writeQuery({
      //         query: FETCH_POSTS_QUERY,
      //         data: { getPosts: [...getPosts, getPosts.filter(p=> p.id !== postId)] },
      //       });
      // }

      if (callback) callback();
    },
    variables: { postId, commentId },
    refetchQueries: [{ query: FETCH_POSTS_QUERY }],
  });
  
  return (
    <>
      {!click && (
      <button
        type="button"
        className="btn btn-outline-danger d-flex align-items-center justify-content-center"
        onClick={()=>setClick(true)}
        style={{ padding: "3.5px", border: "1px solid tomato" }}
      >
        <FaTrash style={{ color: "tomato" }} className="icon" />
      </button>
    )}
      

      {click && (
        <button
        type="button"
        className="btn btn-outline-danger d-flex align-items-center justify-content-center"
        onClick={deletePostOrComment}
        style={{ padding: "3.5px", border: "1px solid tomato" }}
      >
        <FaTimes style={{ color: "tomato" }} className="icon" />
      </button>
      )}
      
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) { 
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
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

