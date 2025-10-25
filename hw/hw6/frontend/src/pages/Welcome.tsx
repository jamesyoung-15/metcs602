import { PiUserCircleThin } from "react-icons/pi";
import { CiGlobe } from "react-icons/ci";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../store/languageStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const { t, i18n } = useTranslation();
  const { language, setLanguage } = useLanguageStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const languages = [
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
  ];

  const currentLanguageLabel =
    languages.find((lang) => lang.code === language)?.label || "Language";

  const handleCheckIn = () => {
    navigate("/intake");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white max-w-md rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-secondary text-white text-center p-6 flex flex-col items-center">
          <div className="mx-auto flex justify-center items-center">
            <PiUserCircleThin className="text-white" size={96} />
          </div>
          <h1 className="text-xl font-semibold">{t("welcome")}</h1>
          {/* language selector */}
          <div className="relative">
            <button
              className="mt-2 bg-[#1f333a] text-sm px-3 py-1 rounded-full"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="flex items-center gap-1">
                <span className="flex items-center gap-1">
                  <CiGlobe className="inline-block" size={16} />
                </span>
                <span>{currentLanguageLabel}</span>
              </div>
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 bg-secondary w-24 border border-gray-300 rounded shadow-lg">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      handleLanguageChange(lang.code);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-center text-sm px-4 py-2 hover:bg-orange-300 ${
                      language === lang.code ? "bg-orange-500 text-white" : ""
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="py-6 px-8 text-center text-secondary">
          <h2 className="text-lg font-bold mb-6">{t("welcomeMessage.0")}</h2>

          {/* Task List */}
          <ul className="text-left space-y-4 ml-6 mb-6">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
              <p className="text-sm text-gray-600">{t("welcomeMessage.1")}</p>
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-gray-300 rounded-full mr-3"></div>
              <p className="text-sm text-gray-600">{t("welcomeMessage.2")}</p>
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-gray-300 rounded-full mr-3"></div>
              <p className="text-sm text-gray-600">{t("welcomeMessage.3")}</p>
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-gray-300 rounded-full mr-3"></div>
              <p className="text-sm text-gray-600">{t("welcomeMessage.4")}</p>
            </li>
          </ul>

          {/* Check-In Button */}
          <button
            className="bg-primary text-white w-full py-3 rounded-lg text-lg font-medium hover:bg-orange-600"
            onClick={handleCheckIn}
          >
            {t("checkIn")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
