import { useContext } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { UserContext } from "../../UserContext";
const AuthLayout = () => {
  const navigate = useNavigate();
  // Destructure the user object from UserContext
  const { user } = useContext(UserContext);

  // Redirect to home page if user is authenticated
  if (user) {
    navigate("/");
  }
  // Render the layout with outlet for nested routes
  return (
    <div className="p-8 bg-red-20 pt-12 rounded-2xl lg:max-w-lg mx-auto border shadow-md">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
