import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
export default function Signup() {
  let goto = useDispatch();
  let signup = async (obj) => {
    try {
      let resp = await fetch("http://localhost:8000/auth/signup", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });

      if (resp.status === 200) {
        console.log(resp.json());
        goto("/");
      } else {
        let err = await resp.text();
        alert(err);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="signup-main">
      <div>
        <Formik
          initialValues={{
            email: "",
            password: "",
            name: "",
            confirmPassword: "",
          }}
          validationSchema={Yup.object({
            name: Yup.string()
              .min(4, "Must be 4 characters long or more")
              .required("Required"),
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            password: Yup.string()
              .min(4, "Must be 4 characters long or more")
              .required("Required"),
            confirmPassword: Yup.string().oneOf(
              [Yup.ref("password")],
              "Your password do not match"
            ),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            signup(values);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div>
                <label htmlFor="name">Username</label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  placeholder="username"
                ></Field>
                <ErrorMessage name="name" className="err"></ErrorMessage>
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <Field
                  type="email"
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
              <div>
                <label htmlFor="ConfirmPassword">Confirm Password</label>
                <Field
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="ConfirmPassword"
                ></Field>
                <ErrorMessage
                  name="confirmPassword"
                  className="err"
                ></ErrorMessage>
              </div>

              <button type="submit">Signup</button>
            </Form>
          )}
        </Formik>
        <p>
          Already has an Account <Link to={"/"}>Login here</Link>
        </p>
      </div>
    </div>
  );
}
