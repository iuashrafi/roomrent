import axios from "axios";
import { useFormik } from "formik";
import { EditPasswordSchema } from "../../../lib/schema";

const EditPasswordForm = ({ handleEditingPassword }) => {
  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: EditPasswordSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
      axios
        .put("/api/profile/update-password", values)
        .then((response) => {
          console.log("User password updated!", response.data);
          handleEditingPassword(false);
        })
        .catch((error) => {
          console.error("Error during updating password:", error.response.data);
        });
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <label className="form-control w-full  max-w-xs">
        <input
          type="password"
          placeholder="Old Password"
          className="input input-bordered w-full max-w-xs"
          {...formik.getFieldProps("oldPassword")}
        />
        <div className="label">
          <span className="label-text-alt text-error">
            <span>
              {formik.touched.oldPassword && formik.errors.oldPassword
                ? formik.errors.oldPassword
                : " "}
            </span>
          </span>
        </div>
      </label>

      <label className="form-control w-full  max-w-xs">
        <input
          type="password"
          placeholder="New password"
          className="input input-bordered w-full max-w-xs"
          {...formik.getFieldProps("newPassword")}
        />
        <div className="label">
          <span className="label-text-alt text-error">
            <span>
              {formik.touched.newPassword && formik.errors.newPassword
                ? formik.errors.newPassword
                : " "}
            </span>
          </span>
        </div>
      </label>
      <label className="form-control w-full  max-w-xs">
        <input
          type="password"
          placeholder="Confirm new password"
          className="input input-bordered w-full max-w-xs"
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

      <button type="submit" className="btn btn-primary">
        Save Password
      </button>
    </form>
  );
};

export default EditPasswordForm;
