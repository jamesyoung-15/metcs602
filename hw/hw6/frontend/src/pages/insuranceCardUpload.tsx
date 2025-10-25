import React from "react";
import { useTranslation } from "react-i18next";
import { useUserStore } from "../store/UserStore";
import { useNavigate } from "react-router-dom";
import Compressor from "compressorjs";

const InsuranceCardUpload: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userId } = useUserStore();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const file = formData.get("insuranceCard") as File;

    if (!file) {
      alert(t("alerts.completeAllQuestions"));
      return;
    }

    // Compress the image before uploading
    new Compressor(file, {
      quality: 0.6,
      success: async (compressedFile) => {
        const uploadData = new FormData();
        uploadData.append("userId", userId!);
        uploadData.append("insuranceCard", compressedFile, compressedFile.name);

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/upload-card`,
          {
            method: "POST",
            body: uploadData,
          },
        );

        if (!response.ok) {
          console.error("Failed to upload insurance card");
          alert(t("alerts.formSubmissionError"));
        } else {
          console.log("Insurance card uploaded successfully");
          alert(t("alerts.formSubmitted"));
          navigate("/appointments");
        }
      },
      error: (err) => {
        console.error("Image compression error:", err);
        alert(t("alerts.formSubmissionError"));
        navigate("/appointments");
      },
    });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white max-w-md rounded-lg shadow-lg overflow-hidden p-6">
        <h1 className="text-2xl text-center font-bold text-secondary mb-4">
          {t("uploadCard.title")}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="insuranceCard" className="block font-medium">
            {t("uploadCard.instruction")}
          </label>
          <input
            id="insuranceCard"
            name="insuranceCard"
            type="file"
            accept="image/*,application/pdf"
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

export default InsuranceCardUpload;
