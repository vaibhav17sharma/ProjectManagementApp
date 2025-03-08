import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";

type ProfileCardProps = {
  initialName: string;
  initialEmail: string;
  initialImage: string;
};

const ProfileCard = ({ initialName, initialEmail, initialImage }: ProfileCardProps) => {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [image, setImage] = useState(initialImage);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Profile Update logic (name, email, image)
    alert("Profile Updated!");

    // You would send this data to the backend here
    // For example:
    // const response = await fetch('/api/update-profile', { method: 'POST', body: JSON.stringify({ name, email, image }) });

    // If password is changed
    if (newPassword && newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (newPassword && newPassword === confirmPassword) {
      // Logic for updating password (e.g., sending current and new password to API)
      alert("Password updated successfully!");
      // const response = await fetch('/api/update-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) });
    }
  };
  const updateImageChange = () => {
    setImage(image);
  };
  const handleCancel = () => {
    setName(initialName);
    setEmail(initialEmail);
    setImage(initialImage);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordForm(false);
  };

  return (
    <div className=" grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">
      {/* Left Section: Profile Image */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <Image
          src={image}
          alt="Profile Picture"
          className="rounded-full w-40 h-40 object-cover shadow-lg"
          width={160}
          height={160}
        />
        <Input className="w-[300px]" type="string" value={image} onChange={handleImageChange} />
        <Button onClick={updateImageChange}>Change Image</Button>
      </div>
      <div className="space-y-6">
        {/* User Details */}
        <div>
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className="w-full px-4 py-2 mt-2 border rounded-lg"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            className="w-full px-4 py-2 mt-2 border rounded-lg"
            placeholder="Enter your email"
          />
        </div>

        {/* Change Password Button */}
        <button
          onClick={() => setShowPasswordForm(!showPasswordForm)}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showPasswordForm ? "Cancel Password Change" : "Change Password"}
        </button>

        {/* Change Password Form (Only Show When `showPasswordForm` is true) */}
        {showPasswordForm && (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-gray-700">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-lg"
                placeholder="Enter your current password"
              />
            </div>

            <div>
              <label className="block text-gray-700">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-gray-700">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg"
                placeholder="Confirm new password"
              />
            </div>
          </div>
        )}

        {/* Save and Cancel Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleSubmit}
            className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Save Changes
          </button>
          <button
            onClick={handleCancel}
            className="py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
