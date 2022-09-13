import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
export default function Login() {
  let goto = useDispatch();
  let logIn = async (obj) => {
    try {
      let resp = await fetch("http://localhost:8000/auth/login", {
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
    <div className="login-main">
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
                  type="text"
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
        <p>
          Already has an Account <Link to={"/signup"}>signup here</Link>
        </p>
      </div>
    </div>
  );
}
