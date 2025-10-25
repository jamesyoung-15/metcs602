import React from "react";
import { useTranslation } from "react-i18next";
import { useUserStore } from "../store/UserStore";
import { useNavigate } from "react-router-dom";

const Intake: React.FC = () => {
  const { t } = useTranslation();
  const { setUser } = useUserStore();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const data = {
      firstName: formData.get("firstName"),
      middleName: formData.get("middleName"),
      lastName: formData.get("lastName"),
      mobile: formData.get("mobileNumber"),
      email: formData.get("email"),
      address: formData.get("address"),
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/intake`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      console.error("Failed to submit form");
      alert("There was an error submitting the form. Please try again.");
    } else {
      console.log("Form submitted successfully");
      alert("Form submitted successfully!");
      const data = await response.json();
      setUser(data.userId, data.user.firstName);
      navigate("/health-questions");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white max-w-md rounded-lg shadow-lg overflow-hidden p-6">
        <h1 className="text-2xl text-center font-bold text-secondary mb-4">
          {t("intakeForm.title")}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="firstName"
            placeholder={t("intakeForm.firstName")}
            className="w-full p-2 border border-secondary rounded"
            required
          />
          <input
            name="middleName"
            placeholder={t("intakeForm.middleName")}
            className="w-full p-2 border border-secondary rounded"
          />
          <input
            name="lastName"
            placeholder={t("intakeForm.lastName")}
            className="w-full p-2 border border-secondary rounded"
            required
          />
          <input
            name="mobileNumber"
            placeholder={t("intakeForm.mobileNumber")}
            className="w-full p-2 border border-secondary rounded"
            required
          />
          <input
            name="email"
            placeholder={t("intakeForm.email")}
            className="w-full p-2 border border-secondary rounded"
            required
          />
          <input
            name="address"
            placeholder={t("intakeForm.address")}
            className="w-full p-2 border border-secondary rounded"
            required
          />
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded w-full hover:bg-orange-600"
          >
            {t("submit")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Intake;
