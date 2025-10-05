import LanguageSelector from "./LanguageSelector";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 text-sm sm:text-base">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <p>TicketMeister</p>
        {/* add language selector to footer for option outside of setting in user profile */}
        <LanguageSelector />
      </div>
    </footer>
  );
}