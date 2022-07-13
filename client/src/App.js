import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { useContext } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import {setContext} from 'apollo-link-context'
import "./App.css";

import Topbar from "./components/Topbar";
import { AuthContext } from "./context/auth";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SinglePost from "./pages/SinglePost";


const httpLink = createHttpLink({
  uri: "http://localhost:5000/",
});

const authLink = setContext(()=>{
  const token = localStorage.getItem('jwtToken')
  return{
  headers: {
    Authorization: token ? `Bearer ${token}` : ''
  }
}
})

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        getPost: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        getPosts: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache
});

function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <ApolloProvider client={client}>
        <Router>
          <Topbar />
          <div className="container">

            <Route exact path="/login">
            {user ? <Home /> : <Login />}
            </Route>

            <Route  exact path="/">
                <Home />
            </Route>

            <Route exact path="/register">
               {user ? <Home /> :  <Register />}
            </Route>

              <Route exact path="/posts/:postId"> 
               <SinglePost />
            </Route>
          </div>
        </Router>
      </ApolloProvider>
    </>
  );
}

export default App;
