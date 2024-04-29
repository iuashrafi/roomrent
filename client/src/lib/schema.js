import * as Yup from "yup";

export const RegisterSchema = Yup.object({
  name: Yup.string()
    .min(3, "Must be atleast 3 characters")
    .required("Required"),
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(6, "Must be atleast 6 characters")
    .required("Required"),
  confirmPassword: Yup.string()
    .required("Retype your password.")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

export const LoginSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(6, "Must be atleast 6 characters")
    .required("Required"),
});

export const EditProfileSchema = Yup.object({
  name: Yup.string()
    .min(3, "Must be atleast 3 characters")
    .required("Required"),
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(6, "Must be atleast 6 characters")
    .required("Required"),
});

export const EditPasswordSchema = Yup.object({
  oldPassword: Yup.string()
    .min(6, "Must be atleast 6 characters")
    .required("Required"),
  newPassword: Yup.string()
    .min(6, "Must be atleast 6 characters")
    .required("Required"),
  confirmPassword: Yup.string()
    .required("Retype your password.")
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
});
