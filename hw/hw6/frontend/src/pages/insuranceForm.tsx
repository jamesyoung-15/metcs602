import React from "react";
import { useTranslation } from "react-i18next";
import { useUserStore } from "../store/UserStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const InsuranceForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [insuranceCarrier, setInsuranceCarrier] = useState<string | null>(null);
  const [policyNumber, setPolicyNumber] = useState<string | null>(null);
  const { userId } = useUserStore();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (insuranceCarrier === null || policyNumber === null) {
      alert(t("alerts.completeAllQuestions"));
      return;
    }

    const formData = new FormData(event.target as HTMLFormElement);
    const data = {
      userId: userId,
      insuranceCarrier: formData.get("insuranceCarrier"),
      policyNumber: formData.get("policyNumber"),
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/insurance-details`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      console.error("Failed to submit insurance details");
      alert(t("alerts.formSubmissionError"));
    } else {
      console.log("Insurance details submitted successfully");
      alert(t("alerts.formSubmitted"));
      navigate("/insurance-card-upload");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white max-w-md rounded-lg shadow-lg overflow-hidden p-6">
        <h1 className="text-2xl text-center font-bold text-secondary mb-4">
          {t("insuranceForm.title")}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="insuranceCarrier" className="block font-medium">
            {t("insuranceForm.carrier")}
          </label>
          <input
            id="insuranceCarrier"
            name="insuranceCarrier"
            type="text"
            className="w-full p-2 border border-secondary rounded"
            required
            onChange={(e) => setInsuranceCarrier(e.target.value)}
          />
          <label htmlFor="policyNumber" className="block font-medium">
            {t("insuranceForm.policyNumber")}
          </label>
          <input
            id="policyNumber"
            name="policyNumber"
            type="text"
            className="w-full p-2 border border-secondary rounded"
            required
            onChange={(e) => setPolicyNumber(e.target.value)}
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

export default InsuranceForm;
