import { useState, useEffect } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
import SocialLoginButtons from "../../components/SocialLoginButtons";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signin",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: (res) => {
      if (res?.requires2FA) {
        localStorage.setItem("tempToken", res.tempToken);
        Router.push("/auth/2fa");
      } else {
        Router.push("/");
      }
    },
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    await doRequest();
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center py-5">
      <div className="container">
        <form onSubmit={onSubmit}>
          <h1>Sign In</h1>
          <div className="form-group">
            <label>Email Address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="form-control"
            />
          </div>
          {errors}
          <button className="btn btn-primary mt-2">Sign In</button>
        </form>
        <a
          className="btn btn-link mt-2"
          onClick={() => Router.push("/auth/signin-ml")}
        >
          SignIn Using Magic Links
        </a>
        <SocialLoginButtons />
      </div>
    </div>
  );
};
export default SignIn;
