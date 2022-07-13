import React, { useContext } from "react";
import { useQuery, gql } from "@apollo/client";
import PostCard from "../components/PostCard";
import { AuthContext } from "../context/auth";
import PostForm from "../components/PostForm";

export default function Home() {
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);

  const { user } = useContext(AuthContext);
  return (
    <div className="container p-4">
      <div className="row">
        {user && (
          <div className="col">
            <PostForm />
          </div>
        )}
      </div>

      <h1 className="page-title mt-4">Recent Post</h1>
      <div className="row">
        {loading ? (
          <h1>Loading...</h1>
        ) : (
          data.getPosts &&
          data.getPosts.map((post) => (
            <div className="col-md-3" key={post.id}>
              <PostCard post={post} key={post.id} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

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
