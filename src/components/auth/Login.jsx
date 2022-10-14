import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../../slices/userSlice";
import GoogleLogin from "react-google-login";
import { gapi } from "gapi-script";
export default function Login() {
  let goto = useNavigate();
  let dispatch = useDispatch();
  let logIn = async (obj) => {
    console.log(obj);
    try {
      let resp = await fetch("https://quizzo-ms.herokuapp.com/auth/login", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });

      if (resp.status === 200) {
        let data = await resp.json();
        console.log(data);

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        dispatch(addUser(data.userInfo));
        goto("/main");
      } else {
        let err = await resp.text();
        alert(err);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const clientId = '619944836365-qaofe6um359206nfp8ipju8m1mi7au31.apps.googleusercontent.com';

  useEffect(() => {
     const initClient = () => {
           gapi.client.init({
           clientId: clientId,
           scope: ''
         });
      };
      gapi.load('client:auth2', initClient);
  });


  return (
    <div className="login-main">
      <img src="../pattern.jpg" alt="" className="pattern" />
      <div>
        <h1 className="branding">Quizzo</h1>
        <div>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={Yup.object({
              email: Yup.string()
                .email("Invalid email address")
                .required("Required"),
              password: Yup.string()
                .min(4, "Must be 4 characters long or more")
                .required("Required"),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              logIn(values);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div>
                  <label htmlFor="email">Email</label>
                  <Field
                    type="text"
                    id="email"
                    name="email"
                    placeholder="user@mail.com"
                  ></Field>
                  <ErrorMessage name="email" className="err"></ErrorMessage>
                </div>
                <div>
                  <label htmlFor="password">password</label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    placeholder="******"
                  ></Field>
                  <ErrorMessage name="password" className="err"></ErrorMessage>
                </div>

                <button type="submit">logIn</button>
              </Form>
            )}
          </Formik>

          <GoogleLogin
            clientId={
              "619944836365-qaofe6um359206nfp8ipju8m1mi7au31.apps.googleusercontent.com"
            }
            buttonText="Log in with Google"
            onSuccess={logIn}
            onFailure={logIn}
            cookiePolicy={"single_host_origin"}
            className="google-login"
          />
          <p>
            Don't have an Account <Link to={"/signup"}>signup here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
