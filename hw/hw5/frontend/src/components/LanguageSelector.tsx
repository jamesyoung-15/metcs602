import { useTranslation } from 'react-i18next';

/**
 * Language selector dropdown component.
 * @returns {JSX.Element} Language selector dropdown component
 */
export default function LanguageSelector() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'it', name: 'Italiano' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' }
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <select 
      value={i18n.language} 
      onChange={(e) => changeLanguage(e.target.value)}
      className="border rounded px-3 py-2"
    >
      {languages.map(lang => (
        <option key={lang.code} value={lang.code}>{lang.name}</option>
      ))}
    </select>
  );
}