import React, { useEffect, useState } from "react";
import "./login.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import emailjs from "@emailjs/browser";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Logo from "../../component/logo/Logo";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [authMethod, setAuthMethod] = useState("email");
  const [showLogo, setShowLogo] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [Code, setCode] = useState("");
  const [codeErrorMessage, setCodeErrorMessage] = useState("");
  const [SendedEmail, setSendedEmail] = useState("");
  const [isSentEmail, setIsSentEmail] = useState(false);
  const [verificationCode, setVerificationCode] = useState(
    Math.random().toString(12)
  );

  const navigate = useNavigate();

  async function handleLogin(email, password, authMethod) {
    const data = new FormData();
    data.append("email", email);
    data.append("password", password ? password : null);
    data.append("authMethod", authMethod);
    try {
      const response = await axios.post(
        "http://34.244.172.132/api/guest/login",
        data
      );
      const userdata = await response.data;
      if (userdata.status === "success") {
        localStorage.setItem("user", JSON.stringify(userdata.data));
        setShowLogo(true);

        setTimeout(() => {
          setShowLogo(false);
          navigate("/v1");
        }, 3000);
      } else {
        SignInWithGoogle();
      }
    } catch (error) {
      setError(true);
      setEmailErrorMessage("password or email are not valid");
      if (error.message === "Unauthorized") {
        setEmailErrorMessage("password or email are not valid");
      }
      if (password === "") {
        setPasswordErrorMessage("password is requierd");
      }
      if (error.response.data.errors?.email) {
        setEmailErrorMessage(error.response.data.errors.email);
      }
      if (error.response.data.errors?.password) {
        setPasswordErrorMessage(error.response.data.errors.password);
      }
    }
  }

  const SignInWithGoogle = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    signInWithPopup(auth, provider)
      .then((result) => {
        setEmail(result.user.email);
        setPassword(null);
        setAuthMethod("google");
        handleLogin(result.user.email, null, "google");
      })
      .catch((error) => {
        console.error("Error signing in with Google:", error.message);
      });
  };
  function handlesForgotPasswordEmail() {
    const serviceId = "service_bbebyel";
    const TemplateId = "template_mpciypf";
    const userId = "cfZj5HPcXQwhUS1HI";
    const templateParams = {
      code: verificationCode,
      reply_to: SendedEmail,
    };
    emailjs.send(serviceId, TemplateId, templateParams, userId).then(
      (response) => {
        setIsSentEmail(true);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  async function handleNewPassword() {
    if (Code === verificationCode) {
      const data = new FormData();
      data.append("email", SendedEmail);
      data.append("password", newPassword);
      try {
        const response = await axios.post(
          "http://34.244.172.132/api/guest/reset_password",
          data
        );
        const userdata = await response.data;
        if (userdata.status === "success") {
          setIsForgotPassword(false);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      setCodeErrorMessage("Wrong Code");
    }
  }
  useEffect(() => {
    setTimeout(() => {
      setShowLogo(false);
    }, 2000);
  }, []);
  
  return (
    <>
      <div>
        {showLogo ? (
          <Logo />
        ) : (
          <div className="login-page">
            <div className="first-side">
              <div className="login-side">
                <div className="top-login">
                  <img
                    src="http://34.244.172.132/uploads/assets/logo.svg"
                    alt="logo"
                    srcSet=""
                    className="logo-login"
                  />
                  <div className="project-name">
                    <span className="project">Project</span>
                    <span className="hub">Hub</span>
                  </div>
                </div>
                {isForgotPassword ? (
                  <div>
                    <label htmlFor="email" className="email-label">
                      Email
                    </label>
                    <div>
                      <input
                        type="email"
                        name="setSendedEmail"
                        id="email"
                        placeholder="mail@website.com"
                        onChange={(e) => {
                          setSendedEmail(e.target.value);
                        }}
                      />
                      <div
                        className="reset-btn"
                        onClick={handlesForgotPasswordEmail}>
                        Send Code
                      </div>
                    </div>
                    {isSentEmail && (
                      <>
                        <label htmlFor="email" className="email-label">
                          Verification Code
                        </label>
                        <div>
                          <input
                            type="email"
                            name="code"
                            id="email"
                            placeholder="Enter verification code"
                            onChange={(e) => {
                              setCode(e.target.value);
                            }}
                          />
                          {error && (
                            <div className="error">{codeErrorMessage}</div>
                          )}
                        </div>
                        <label htmlFor="password" className="password-label">
                          New Password
                        </label>
                        <div>
                          <input
                            type="password"
                            name="newpassword"
                            id="password"
                            placeholder="Min. 8 character"
                            onChange={(e) => {
                              setNewPassword(e.target.value);
                            }}
                          />
                          {error && (
                            <div className="error">{passwordErrorMessage}</div>
                          )}
                        </div>
                        <div
                          className="reset-btn"
                          onClick={() => {
                            handleNewPassword();
                          }}>
                          Reset Passsword
                        </div>
                      </>
                    )}
                    <svg
                      width="30px"
                      height="30px"
                      viewBox="0 0 1024 1024"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => {
                        setIsForgotPassword(false);
                        setCode("");
                        setIsSentEmail(false);
                      }}
                      style={{ cursor: "pointer" }}>
                      <path
                        fill="#000000"
                        d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                      />
                      <path
                        fill="#000000"
                        d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                      />
                    </svg>
                  </div>
                ) : (
                  <>
                    <div className="login-title">Login</div>
                    <div className="login-description">
                      Collaborate with your team in professional way
                    </div>
                    <div className="google" onClick={SignInWithGoogle}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        viewBox="0 0 24 24"
                        width="24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                        <path d="M1 1h22v22H1z" fill="none" />
                      </svg>
                      <div>Sign in with Google</div>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="471"
                      viewBox="0 0 471 2"
                      fill="none">
                      <path d="M0 1H155" stroke="black" />
                      <path d="M310 1H471" stroke="black" />
                    </svg>
                    <label htmlFor="email" className="email-label">
                      Email
                    </label>
                    <div>
                      <input
                        type="email"
                        name="emial"
                        id="email"
                        placeholder="mail@website.com"
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                      />
                      {error && (
                        <div className="error">{emailErrorMessage}</div>
                      )}
                    </div>

                    <label htmlFor="password" className="password-label">
                      Password
                    </label>
                    <div>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Min. 8 character"
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      />
                      {error && (
                        <div className="error">{passwordErrorMessage}</div>
                      )}
                    </div>
                    <div className="bottom">
                      <div
                        className="forget-pass"
                        onClick={() => {
                          setIsForgotPassword(true);
                        }}>
                        forgot password ?
                      </div>
                    </div>
                    <div
                      className="login-btn"
                      onClick={() => {
                        handleLogin(email, password, authMethod);
                      }}>
                      login
                    </div>
                    <div className="to-register">
                      New to ProjectHub?
                      <Link to={"/register"} className="to-sign-up">
                        Create account
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="display-side">
              <svg
                width="360"
                height="320"
                viewBox="0 0 360 320"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="top-svg">
                <path
                  className="rectangle rectangle1"
                  d="M72 300C72 311.046 63.0457 320 52 320H0L0 0H72L72 300Z"
                  fill="#3521B5"
                  fillOpacity="0.6"
                />
                <path
                  className="rectangle rectangle2"
                  d="M144 227C144 238.046 135.046 247 124 247H72L72 0H144L144 227Z"
                  fill="#3521B5"
                  fillOpacity="0.6"
                />
                <path
                  className="rectangle rectangle3"
                  d="M216 154C216 165.046 207.046 174 196 174H144V0H216L216 154Z"
                  fill="#3521B5"
                  fillOpacity="0.6"
                />
                <path
                  className="rectangle rectangle4"
                  d="M288 81C288 92.0457 279.046 101 268 101L216 101V0L288 0V81Z"
                  fill="#3521B5"
                  fillOpacity="0.6"
                />
                <path
                  className="rectangle rectangle5"
                  d="M360 8C360 19.0457 351.046 28 340 28L288 28V0L360 0V8Z"
                  fill="#3521B5"
                  fillOpacity="0.6"
                />
              </svg>
              <img
                src="http://34.244.172.132/uploads/assets/login-display.svg"
                alt="sss"
                className="mid-svg"
                style={{ zIndex: "1" }}
              />
              <div class="line-container">
                <svg
                  width="364"
                  height="140"
                  viewBox="0 0 364 140"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    position: "absolute",
                    right: "340px",
                    top: "181px",
                  }}>
                  <line
                    class="animated-line"
                    x1="1.47246"
                    y1="138.386"
                    x2="363.472"
                    y2="2.38623"
                    stroke="white"
                    stroke-opacity="0.5"
                    stroke-width="3"
                  />
                </svg>
                <svg
                  width="34"
                  height="259"
                  viewBox="0 0 34 259"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    position: "absolute",
                    right: "670px",
                    top: "318px",
                  }}>
                  <line
                    class="animated-line"
                    x1="32.5108"
                    y1="257.97"
                    x2="1.51079"
                    y2="0.97004"
                    stroke="white"
                    stroke-opacity="0.5"
                    stroke-width="3"
                  />
                </svg>
                <svg
                  width="82"
                  height="50"
                  viewBox="0 0 82 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    position: "absolute",
                    right: "270px",
                    top: "415px",
                  }}>
                  <line
                    class="animated-line"
                    x1="0.759824"
                    y1="1.49709"
                    x2="80.7598"
                    y2="48.4971"
                    stroke="white"
                    stroke-opacity="0.5"
                    stroke-width="3"
                  />
                </svg>
                <svg
                  width="25"
                  height="141"
                  viewBox="0 0 25 141"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    position: "absolute",
                    right: "260px",
                    top: "488px",
                  }}>
                  <line
                    class="animated-line"
                    x1="23.4816"
                    y1="1.0249"
                    x2="1.48156"
                    y2="140.025"
                    stroke="white"
                    stroke-opacity="0.5"
                    stroke-width="3"
                  />
                </svg>
                <svg
                  width="89"
                  height="95"
                  viewBox="0 0 89 95"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    position: "absolute",
                    right: "267px",
                    top: "550px",
                  }}>
                  <line
                    class="animated-line"
                    x1="1.09579"
                    y1="1.76608"
                    x2="87.0958"
                    y2="93.7661"
                    stroke="white"
                    stroke-opacity="0.5"
                    stroke-width="3"
                  />
                </svg>
                <svg
                  width="381"
                  height="65"
                  viewBox="0 0 381 65"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    position: "absolute",
                    right: "265px",
                    top: "580px",
                  }}>
                  <line
                    class="animated-line"
                    x1="0.237746"
                    y1="2.30937"
                    x2="380.238"
                    y2="63.3094"
                    stroke="white"
                    stroke-opacity="0.5"
                    stroke-width="3"
                  />
                </svg>
              </div>
              <svg
                width="360"
                height="320"
                viewBox="0 0 360 320"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="bottom-svg">
                <path
                  className="rectangle rectangle1"
                  d="M288 20C288 8.95431 296.954 0 308 0H360V320H288V20Z"
                  fill="#3521B5"
                  fillOpacity="0.6"
                />
                <path
                  className="rectangle rectangle2"
                  d="M216 93C216 81.9543 224.954 73 236 73H288V320H216V93Z"
                  fill="#3521B5"
                  fillOpacity="0.6"
                />
                <path
                  className="rectangle rectangle3"
                  d="M144 166C144 154.954 152.954 146 164 146H216V320H144V166Z"
                  fill="#3521B5"
                  fillOpacity="0.6"
                />
                <path
                  className="rectangle rectangle4"
                  d="M72 239C72 227.954 80.9543 219 92 219H144V320H72V239Z"
                  fill="#3521B5"
                  fillOpacity="0.6"
                />
                <path
                  className="rectangle rectangle5"
                  d="M0 312C0 300.954 8.95431 292 20 292H72V320H0V312Z"
                  fill="#3521B5"
                  fillOpacity="0.6"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Login;
