import React from "react";
import { Formik } from "formik";
import { useNavigate, Link } from "react-router-dom"; // Import Link from react-router-dom
import axios from "axios";

const RegistrationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full max-w-md p-8 bg-[#000000da] border border-gray-300 rounded-lg shadow-md m-10">
        <h1 className="mb-6 text-3xl text-center text-[#6096e2]">Sign up</h1>
        <Formik
          initialValues={{
            email: "",
            password: "",
            firstname: "",
            lastname: "",
            contact: "",
            confirmpassword: "",
            usertype: "",
            image: null,
          }}
          validate={(values) => {
            const errors = {};

            if (!values.firstname) {
              errors.firstname = "First Name is required";
            }
            if (!values.lastname) {
              errors.lastname = "Last Name is required";
            }
            if (!values.contact) {
              errors.contact = "Contact is required";
            }
            if (!values.email) {
              errors.email = "Email is required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = "Invalid email address";
            }
            if (!values.password) {
              errors.password = "Enter a Password";
            } else if (values.password.length < 6) {
              errors.password = "Min 6 characters";
            }
            if (!values.confirmpassword) {
              errors.confirmpassword = "Confirm Your Password";
            } else if (values.confirmpassword !== values.password) {
              errors.confirmpassword = "Password Does Not Match";
            }
            if (!values.usertype) {
              errors.usertype = "User type is required";
            }
            if (!values.image) {
              errors.image = "Image is required";
            }

            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            const formData = new FormData();
            formData.append("firstname", values.firstname);
            formData.append("lastname", values.lastname);
            formData.append("contact", values.contact);
            formData.append("email", values.email);
            formData.append("password", values.password);
            formData.append("usertype", values.usertype);
            formData.append("image", values.image);

            alert(
              JSON.stringify(
                {
                  firstname: values.firstname,
                  lastname: values.lastname,
                  contact: values.contact,
                  email: values.email,
                  password: values.password,
                  confirmpassword: values.confirmpassword,
                  usertype: values.usertype,
                  image: values.image ? values.image.name : "No image uploaded",
                },
                null,
                2
              )
            );

            axios
              .post("http://localhost:8003/api/v1/user/sign-up", formData)
              .then((response) => {
                alert(JSON.stringify(response.data, null, 2));
                setSubmitting(false);

                navigate("/login");
              })
              .catch((error) => {
                console.error("Error:", error);
                setSubmitting(false);
              });
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-bold text-[aliceblue]">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstname"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.firstname}
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                />
                {errors.firstname && touched.firstname && (
                  <p className="text-xs italic text-red-500">
                    {errors.firstname}
                  </p>
                )}

                <label className="block mt-2 mb-2 text-sm font-bold text-[aliceblue]">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastname"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.lastname}
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                />
                {errors.lastname && touched.lastname && (
                  <p className="text-xs italic text-red-500">
                    {errors.lastname}
                  </p>
                )}

                <label className="block mt-2 mb-2 text-sm font-bold text-[aliceblue]">
                  Contact
                </label>
                <input
                  type="text"
                  name="contact"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.contact}
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                />
                {errors.contact && touched.contact && (
                  <p className="text-xs italic text-red-500">
                    {errors.contact}
                  </p>
                )}

                <label className="block mt-2 mb-2 text-sm font-bold text-[aliceblue]">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                />
                {errors.email && touched.email && (
                  <p className="text-xs italic text-red-500">{errors.email}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-bold text-[aliceblue]">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                />
                {errors.password && touched.password && (
                  <p className="text-xs italic text-red-500">
                    {errors.password}
                  </p>
                )}

                <label className="block mt-2 mb-2 text-sm font-bold text-[aliceblue]">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmpassword"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.confirmpassword}
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                />
                {errors.confirmpassword && touched.confirmpassword && (
                  <p className="text-xs italic text-red-500">
                    {errors.confirmpassword}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-bold text-[aliceblue]">
                  User Type
                </label>
                <select
                  name="usertype"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.usertype}
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                >
                  <option value="" label="Select user type" />
                  <option value="team" label="Team" />
                  <option value="admin" label="Admin" />
                </select>
                {errors.usertype && touched.usertype && (
                  <p className="text-xs italic text-red-500">
                    {errors.usertype}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-bold text-[aliceblue] transition-colors duration-300 ease-in-out">
                  Upload Image
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={(event) => {
                    setFieldValue("image", event.currentTarget.files[0]);
                  }}
                  className="w-full px-3 py-2 leading-tight text-gray-300 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                />
                {errors.image && touched.image && (
                  <p className="text-xs italic text-red-500">{errors.image}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 font-bold bg-[#6096e2] text-[aliceblue] rounded hover:bg-[#5e86cd] focus:outline-none focus:shadow-outline"
              >
                Sign Up
              </button>
              {/* Added paragraph for navigation */}
              <p className="mt-4 text-sm text-center text-[aliceblue]">
                Have an account?{" "}
                <Link to="/login" className="text-[#6096e2] hover:underline">
                  Login
                </Link>
              </p>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RegistrationPage;
