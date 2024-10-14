import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await axios.post(
        "http://localhost:8003/api/v1/user/login",
        values
      );
      const responseData = response.data;
      if (responseData.success) {
        console.log("Token:", responseData.token);

        localStorage.setItem("userData", JSON.stringify(responseData.data));
        localStorage.setItem("authToken", responseData.token);

        if (responseData.data.usertype === "team") {
          navigate("/Team");
        } else if (responseData.data.usertype === "admin") {
          navigate("/Admin");
        } else {
          navigate("/");
        }
      } else {
        setFieldError("password", "Invalid email or password");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setFieldError("password", "An error occurred while logging in");
    }
    setSubmitting(false);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md p-8 bg-[#000000da] border border-gray-300 rounded-lg shadow-md h-100">
        <h1 className=" text-3xl text-center text-[#6096e2] my-10 mb-20">
          Login
        </h1>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email("Invalid email address")
              .required("Email is required"),
            password: Yup.string()
              .min(4, "Password must be at least 4 characters")
              .required("Password is required"),
          })}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block mt-2 mb-2 text-sm font-bold text-[aliceblue]"
                >
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-xs italic text-red-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-bold text-[aliceblue] "
                >
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  className="w-full px-3 py-2 mb-20 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-xs italic text-red-500"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 font-bold bg-[#6096e2] text-[aliceblue] rounded focus:outline-none focus:shadow-outline transition ease-in-out duration-300 hover:text-black hover:bg-[#ac395a6d] mt-20"
              >
                {isSubmitting ? "Logging in..." : "Submit"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
