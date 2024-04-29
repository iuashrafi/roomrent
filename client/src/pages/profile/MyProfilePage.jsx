import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";
import EditProfileForm from "./_components/EditProfileForm";
import EditPasswordForm from "./_components/EditPasswordForm";

const MyProfilePage = () => {
  const navigate = useNavigate();
  const { ready, user } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  if (!ready) {
    return <div>Loading...</div>;
  }

  if (!user) {
    navigate("/login");
  }

  return (
    <div className="bg-gray-50 border max-w-xl rounded-xl mx-auto p-8 shadow-sm">
      <div className="overflow-x-auto">
        {isEditing ? (
          <EditProfileForm user={user} handleEditing={setIsEditing} />
        ) : (
          <table className="table text-lg">
            <tbody>
              <tr>
                <th>Name</th>
                <td>{user.name}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{user.email}</td>
              </tr>
              <tr>
                <th>Password</th>
                <td>
                  {isEditingPassword ? (
                    <EditPasswordForm
                      handleEditingPassword={setIsEditingPassword}
                    />
                  ) : (
                    <span>*******</span>
                  )}
                  <button
                    className="btn btn-link"
                    onClick={() => {
                      setIsEditingPassword((prev) => !prev);
                    }}
                  >
                    {isEditingPassword ? "Cancel" : "Edit"}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        )}
        <div className="flex justify-center pt-8">
          <button
            className="btn btn-neutral"
            onClick={() => {
              setIsEditing(!isEditing);
            }}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;
