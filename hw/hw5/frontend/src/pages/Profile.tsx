import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../components/LanguageSelector";

/**
 * Profile page for viewing and updating user profile.
 * @returns {JSX.Element} Profile page.
 */
export default function Profile() {
  const { user, updateUser, token } = useAuth();
  const { t, i18n } = useTranslation();
  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [mailAddress, setMailAddress] = useState(user?.mailAddress || "");
  const [file, setFile] = useState<File | null>(null);

  const handleUpdateProfile = async () => {
    const res = await fetch("http://localhost:3049/api/auth/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        defaultLanguage: i18n.language,
        phoneNumber,
        mailAddress,
      }),
    });
    if (!res.ok) {
      alert("Failed to update profile");
      return;
    }
    const data = await res.json();
    updateUser(data);
    alert("Profile updated!");
  };

  const handleChangePassword = async () => {
    const res = await fetch("http://localhost:3049/api/auth/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!res.ok) {
      alert("Failed to change password");
      return;
    }
    alert("Password changed!");
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleUploadPicture = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("picture", file);
    const res = await fetch("http://localhost:3049/api/auth/upload-picture", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!res.ok) {
      alert("Failed to upload picture");
      return;
    }
    const data = await res.json();
    updateUser(data);
    alert("Picture uploaded!");
  };

  if (!user) return null;
  console.log(user)

  return (
    <div className="max-w-[300px] mx-auto px-[5px] sm:px-4 py-4 sm:max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">{t("profile.title")}</h1>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">{t("profile.info")}</h2>
        <p className="mb-2">
          {t("profile.username")}: <span className="font-semibold">{user.username}</span>
        </p>
        <p className="mb-2">
          {t("profile.name")}: <span className="font-semibold">{user.name}</span>
        </p>
        <p className="mb-2">
          {t("profile.phoneNumber")}: <span className="font-semibold">{user.phoneNumber || "-"}</span>
        </p>
        <p className="mb-2">
          {t("profile.mailAddress")}: <span className="font-semibold">{user.mailAddress || "-"}</span>
        </p>
        <p className="mb-2">
          {t("profile.language")}: <span className="font-semibold">{user.defaultLanguage || "en"}</span>
        </p>
      </div>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">{t("profile.changeInfo")}</h2>
        {user.profilePicture && (
          <img
            src={`http://localhost:3049${user.profilePicture}`}
            alt="Profile"
            className="w-24 h-24 rounded-full mb-4 object-cover"
          />
        )}

        <div className="mb-4">
          <label className="block mb-2 font-semibold">
            {t("profile.name")}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">
            {t("profile.username")}
          </label>
          <input
            type="text"
            value={user.username}
            disabled
            className="border rounded px-3 py-2 w-full bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">
            {t("profile.phoneNumber")}
          </label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">
            {t("profile.mailAddress")}
          </label>
          <input
            type="text"
            value={mailAddress}
            onChange={(e) => setMailAddress(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">
            {t("profile.language")}
          </label>
          <LanguageSelector />
        </div>

        <button
          onClick={handleUpdateProfile}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          {t("profile.save")}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">
          {t("profile.changePassword")}
        </h2>

        <div className="mb-4">
          <label className="block mb-2">{t("profile.currentPassword")}</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">{t("profile.newPassword")}</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <button
          onClick={handleChangePassword}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          {t("profile.changePassword")}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">{t("profile.uploadPicture")}</h2>
        <div className="flex flex-col align-items-center">
          <input
            type="file"
            id="file-upload"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mb-4 rounded bg-blue-600 text-white p-2 text-center"
          />

          <button
            onClick={handleUploadPicture}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            {t("profile.uploadPicture")}
          </button>
        </div>
      </div>
    </div>
  );
}
