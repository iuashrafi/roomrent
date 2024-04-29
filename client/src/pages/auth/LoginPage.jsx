import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import { LoginSchema } from "../../lib/schema";
import { UserContext } from "../../UserContext";
import { toast } from "sonner";

const LoginPage = () => {
  const navigate = useNavigate();
  // Destructuring setUser from UserContext
  const { setUser } = useContext(UserContext);
  // Initializing formik for form management
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (values, formikBag) => {
      // for debugging
      // alert(JSON.stringify(values, null, 2));
      // Making POST request to login endpoint
      axios
        .post("/api/auth/login", values)
        .then((response) => {
          // for debugging
          // console.log("User registered successfully:", response.data);
          // Displaying error toast and resetting form submission state
          toast.success("Logged in Successfully! Redirecting...");
          setUser(response.data);
          setTimeout(() => {
            navigate("/");
          }, 1000);
        })
        .catch((error) => {
          // for debugging
          // console.error("Error during login: ", error.response.data.message);
          toast.error(error.response.data.message);
          formikBag.setSubmitting(false);
        });
    },
  });

  // Rendering login form
  return (
    <div className="bg-blue-30 flex flex-col">
      <h1 className="text-3xl font-semibold text-center mb-4">Login</h1>
      <form
        className="mt-3 bg-green-30 space-y-3"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <label className="form-control w-full">
          <input
            type="text"
            placeholder="Email address"
            className="input input-bordered input-primary w-full"
            {...formik.getFieldProps("email")}
          />
          <div className="label">
            <span className="label-text-alt text-error">
              <span>
                {formik.touched.email && formik.errors.email
                  ? formik.errors.email
                  : " "}
              </span>
            </span>
          </div>
        </label>

        <label className="form-control w-full">
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered input-primary w-full"
            {...formik.getFieldProps("password")}
          />

          <div className="label">
            <span className="label-text-alt text-error">
              <span>
                {formik.touched.password && formik.errors.password
                  ? formik.errors.password
                  : " "}
              </span>
            </span>
          </div>
        </label>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="my-3 btn btn-primary w-full"
        >
          Login
        </button>

        <div className="text-center py-2 text-gray-600">
          Don't have an account yet ?{" "}
          <Link to="/register" className="underline text-gray-600">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
