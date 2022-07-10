import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { FaRegThumbsUp } from "react-icons/fa";

export default function LikeButton({ post: { id, likeCount, likes }, user }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && likes?.find((like) => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION,{
    variables: {postId: id}
  })

  const likeButton = user ? (
    liked ? (
        <button
        type="button"
        className="btn btn-success d-flex align-items-center"
        onClick={likePost}
      >
        <FaRegThumbsUp className="icon" />
      </button>
    ) : (
        <button
        type="button"
        className="btn btn-outline-danger d-flex align-items-center"
        onClick={likePost}
      >
        <FaRegThumbsUp className="icon" />
      </button>
    )
  ) : (
    <button
        type="button"
        className="btn btn-outline-danger d-flex align-items-center"
      >
      <Link className="link" to='/login'>
        <FaRegThumbsUp className="icon" />
        </Link>
      </button>
  )

  return (
    <>
      {likeButton}
      <button
        type="button"
        className="btn btn-outline-success"
        style={{ padding: "0px 5px" }}
      >
        {likeCount}
      </button>
    </>
  );
}

const LIKE_POST_MUTATION = gql`
    mutation likePost($postId: ID!){
        likePost(postId: $postId){
            id
            likes{
                id
                username
            }
            likeCount
        }
    }
`
