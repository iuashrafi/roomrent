import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import { RegisterSchema } from "../../lib/schema";
import { toast } from "sonner";

const RegisterPage = () => {
  const navigate = useNavigate();

  // Initialize formik for form management
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, formikBag) => {
      // for debugging
      // alert(JSON.stringify(values, null, 2));
      // Make POST request to register endpoint
      axios
        .post("/api/auth/register", values)
        .then((response) => {
          // console.log("User registered successfully:", response.data);
          toast.success("Account Created Successfully! Redirecting...");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    },
  });
  // Render the registration form
  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-semibold  text-center mb-4">Register</h1>
      <form
        onSubmit={formik.handleSubmit}
        className="mt-3 bg-green-30 space-y-3"
      >
        <label className="form-control w-full">
          <input
            type="text"
            placeholder="Full name"
            className="input input-bordered input-primary w-full"
            {...formik.getFieldProps("name")}
          />
          <div className="label">
            <span className="label-text-alt text-error">
              <span>
                {formik.touched.name && formik.errors.name
                  ? formik.errors.name
                  : " "}
              </span>
            </span>
          </div>
        </label>

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

        <label className="form-control w-full">
          <input
            type="password"
            placeholder="Confirm Password"
            className="input input-bordered input-primary w-full"
            {...formik.getFieldProps("confirmPassword")}
          />

          <div className="label">
            <span className="label-text-alt text-error">
              <span>
                {formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? formik.errors.confirmPassword
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
          Register
        </button>

        <div className="text-center py-2 text-gray-600">
          Already a Member ?&nbsp;
          <Link to="/login" className="underline text-gray-600">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
