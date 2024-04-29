import axios from "axios";
import { useFormik } from "formik";
import { EditProfileSchema } from "../../../lib/schema";
import { toast } from "sonner";
const EditProfileForm = ({ user, handleEditing }) => {
  const formik = useFormik({
    initialValues: {
      email: user?.email || "",
      name: user?.name || "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: EditProfileSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));

      axios
        .put("/api/profile/update", values)
        .then((response) => {
          // for debugging
          // console.log("User profile updated!", response.data);
          handleEditing(false);
          toast.success("Profile Updated successfully! Reloading...");
          window.location.reload();
        })
        .catch((error) => {
          // for debugging
          // console.error("Error during updation:", error.response.data);
          toast.error(error.response.data.message);
        });
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <table className="table text-lg">
          <tbody>
            <tr>
              <th>Name</th>
              <td>
                <label className="form-control w-full  max-w-xs">
                  <input
                    type="text"
                    placeholder="Full name"
                    className="input input-bordered w-full max-w-xs"
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
              </td>
            </tr>
            <tr>
              <th>Email</th>
              <td>
                <label className="form-control w-full  max-w-xs">
                  <input
                    type="text"
                    placeholder="Email address"
                    className="input input-bordered w-full  max-w-xs"
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
              </td>
            </tr>
            <tr>
              <th>Password</th>
              <td>
                <label className="form-control w-full  max-w-xs">
                  <input
                    type="password"
                    placeholder="type your password"
                    className="input input-bordered w-full  max-w-xs"
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
              </td>
            </tr>
            <tr>
              <th></th>
              <td>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default EditProfileForm;
