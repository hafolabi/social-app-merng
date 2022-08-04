import React, { useContext, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useHistory } from 'react-router-dom'
import { AuthContext } from "../context/auth";

export default function Register() {
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const context = useContext(AuthContext)
  const history = useHistory()

  const handleChange = (e) => {
    e.preventDefault();
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    // update(proxy, result) {
    //   history.push('/')
    // },
    update(proxy, {data: {register: userData}}) {
      context.login(userData)
      history.push('/')
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addUser();
  };

  return (
    <div className="form-container">
      <div className="row">
        <h1 className="page-title">Register</h1>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            name="username"
            className="form-control"
            placeholder="Username"
            onChange={handleChange}
            value={values.username}
          />
          <span className="error-msg">{errors?.username}</span>
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email"
            value={values.email}
            onChange={handleChange}
          />
          <span className="error-msg">{errors?.email}</span>
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Password"
            value={values.password}
            onChange={handleChange}
          />
          <span className="error-msg">{errors?.password}</span>
        </div>

        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            className="form-control"
            placeholder="Confirm Password"
            value={values.confirmPassword}
            onChange={handleChange}
          />
          <span className="error-msg">{errors?.confirmPassword}</span>
        </div>

        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>

      {/* {Object.keys(errors).length > 0 && (
        <div className="error-box">
          <ul className="list-group">
          {Object.values(errors).map((value)=>(
            <li className="list-group-item error-msg" key={value}>{value}</li>  
          ))}
          </ul>
        </div>
      )} */}
    </div>
  );
}

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;
