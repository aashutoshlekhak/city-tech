import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "./Login.css";

const loginInitialValues = { username: "", password: "" };

const loginValidationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .required("Password is required")
    .min(5, "Password must be at least 8 characters"),
});

export const Login = () => {
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    // Extracting username and password from form values
    const { username, password } = values;

    // API endpoint
    const url = "https://jp-dev.cityremit.global/web-api/config/v1/auths/login";

    // Static parameter ip_address
    const ip_address = "182.93.95.159";

    // Request body
    const requestBody = {
      login_id: username,
      login_password: password,
      ip_address: ip_address,
    };

    try {
      // Making POST request to the API
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      // Parsing response JSON
      const responseData = await response.json();

      // Checking if request was successful
      if (response.ok) {
        console.log(responseData.data[0].jwt_token);
        localStorage.setItem("jwtToken", responseData.data[0].jwt_token);
        localStorage.setItem("username", responseData.data[0].full_name);
        // localStorage.setItem(
        //   "session_expire_time",
        //   responseData.data[0].token_key_expires_on
        // );

        // just for session expiration testing purpose
        const currentTime = new Date();
        const expireTime = new Date(currentTime.getTime() + 5000); // 5 seconds in milliseconds
        localStorage.setItem("session_expire_time", expireTime.toISOString());

        toast.success("Successfully logged in!");
        navigate("/dashboard"); // Use navigate function to navigate to dashboard
      } else {
        throw new Error(responseData.message);
      }
    } catch (error) {
      const errorMessage = error.message;
      toast.error(errorMessage);
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="container">
      <Formik
        initialValues={loginInitialValues}
        onSubmit={onSubmit}
        validationSchema={loginValidationSchema}
      >
        {({ handleChange, handleBlur, handleSubmit }) => (
          <form className="login-form">
            <p className="heading">Sign In</p>

            <div className="form-group">
              <label htmlFor="username">Email</label>
              <input
                type="string"
                placeholder="Username"
                id="username"
                autoComplete="current-email"
                name="username"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                component="div"
                name="username"
                className="error-message"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Password"
                id="password"
                autoComplete="current-password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                component="div"
                name="password"
                className="error-message"
              />
            </div>

            <button type="submit" onClick={handleSubmit}>
              Login
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
};
