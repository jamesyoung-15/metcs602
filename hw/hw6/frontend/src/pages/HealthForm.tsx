import React from "react";
import { useTranslation } from "react-i18next";
import { useUserStore } from "../store/UserStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const HealthForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [grayHair, setGrayHair] = useState<boolean | null>(null);
  const [boneFracture, setBoneFracture] = useState<boolean | null>(null);
  const [tripping, setTripping] = useState<boolean | null>(null);
  const { userId } = useUserStore();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (grayHair === null || boneFracture === null || tripping === null) {
      alert(t("alerts.completeAllQuestions"));
      return;
    }

    const formData = new FormData(event.target as HTMLFormElement);
    const data = {
      userId: userId,
      grayHairBeforeChildren: formData.get("grayHair") === "yes",
      brokenBoneAfter16: formData.get("boneFracture") === "yes",
      tripsOverSmallStones: formData.get("tripping") === "yes",
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/health-questions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      console.error("Failed to submit health questions");
      alert(t("alerts.formSubmissionError"));
    } else {
      console.log("Health questions submitted successfully");
      alert(t("alerts.formSubmitted"));
      navigate("/insurance-details");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white max-w-md rounded-lg shadow-lg overflow-hidden p-6">
        <h1 className="text-2xl text-center font-bold text-secondary mb-4">
          {t("intakeForm.title")}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="grayHair" className="block font-medium">
            {t("healthForm.questions.0")}
          </label>
          <select
            id="grayHair"
            name="grayHair"
            className="w-full p-2 border border-secondary rounded"
            required
            onChange={(e) => setGrayHair(e.target.value === "yes")}
          >
            <option value="">{t("healthForm.selectOption")}</option>
            <option value="yes">{t("healthForm.yes")}</option>
            <option value="no">{t("healthForm.no")}</option>
          </select>
          <label htmlFor="boneFracture" className="block font-medium">
            {t("healthForm.questions.1")}
          </label>
          <select
            id="boneFracture"
            name="boneFracture"
            className="w-full p-2 border border-secondary rounded"
            required
            onChange={(e) => setBoneFracture(e.target.value === "yes")}
          >
            <option value="">{t("healthForm.selectOption")}</option>
            <option value="yes">{t("healthForm.yes")}</option>
            <option value="no">{t("healthForm.no")}</option>
          </select>
          <label htmlFor="tripping" className="block font-medium">
            {t("healthForm.questions.2")}
          </label>
          <select
            id="tripping"
            name="tripping"
            className="w-full p-2 border border-secondary rounded"
            required
            onChange={(e) => setTripping(e.target.value === "yes")}
          >
            <option value="">{t("healthForm.selectOption")}</option>
            <option value="yes">{t("healthForm.yes")}</option>
            <option value="no">{t("healthForm.no")}</option>
          </select>

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

export default HealthForm;
