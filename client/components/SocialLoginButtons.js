import React from "react";
import GithubIcon from "../icons/GithubIcon";
import GoogleIcon from "../icons/GoogleIcon";

const SocialLoginButtons = () => {
  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow-lg border-0 rounded-3">
          <div className="card-body p-5">
            <h2 className="card-title text-center mb-4">Welcome Back</h2>
            <p className="text-center text-muted mb-4">
              Sign in to continue to your account
            </p>
            <button
              onClick={() =>
                (window.location.href =
                  "https://ticketing.dev/api/users/github")
              }
              className="btn btn-dark w-100 mb-3 d-flex align-items-center justify-content-center"
              style={{ height: "50px" }}
            >
              <GithubIcon
                className="me-2"
                width="20"
                height="20"
                color="white"
              />
              Continue with GitHub
            </button>

            <button
              onClick={() =>
                (window.location.href =
                  "https://ticketing.dev/api/users/google")
              }
              className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
              style={{ height: "50px" }}
            >
              <GoogleIcon
                className="me-2"
                width="20"
                height="20"
                color="white"
              />
              Continue with Google
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-muted">
              By continuing, you agree to our Terms of Service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialLoginButtons;
