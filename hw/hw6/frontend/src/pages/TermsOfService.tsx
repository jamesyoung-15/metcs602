import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/UserStore";
import { useState } from "react";

const TermsOfService: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, userId } = useUserStore();
  const [agreed, setAgreed] = useState(false);
  const { t } = useTranslation();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreed) {
        alert(t("termsOfService.mustAgree"));
        return;
    }

    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/terms-of-service`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    tosAgreed: true,
                    userId: userId
                }),
            },
        );
        if (!response.ok) {
            throw new Error("Failed to agree to terms of service");
        }
        const data = await response.json();
        console.log("Terms of Service agreed:", data);
        alert(t("termsOfService.thankYou"));
        setUser("", ""); // remove user info from store
        navigate("/");
    } catch (error) {
        console.error("Error agreeing to terms of service:", error);
        alert(t("termsOfService.error"));
        return;
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white max-w-md rounded-lg shadow-lg overflow-hidden p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {t("termsOfService.title")}
        </h1>
        <div className="mb-8 overflow-y-auto max-h-64">
          {t("termsOfService.content")}
        </div>
        <form action="/submit-terms">
          <label htmlFor="agree" className="text-sm">
            <input type="checkbox" required onChange={(e) => setAgreed(e.target.checked)} /> {t("termsOfService.agree")}
          </label>
          <button
            type="submit"
            className={`bg-primary text-white px-4 py-2 rounded w-full hover:bg-orange-600 mt-4 ${!agreed ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={onSubmit}
            disabled={!agreed}
          >
            {t("submit")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TermsOfService;
