import { Routes, Route } from "react-router-dom";
import "./App.css";
import Welcome from "./pages/Welcome";
import Intake from "./pages/Intake";
import AppointmentSelector from "./pages/AppointmentScheduler";
import HealthForm from "./pages/HealthForm";
import InsuranceForm from "./pages/insuranceForm";
import InsuranceCardUpload from "./pages/insuranceCardUpload";
import TermsOfService from "./pages/TermsOfService";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/intake" element={<Intake />} />
      <Route path="/appointments" element={<AppointmentSelector />} />
      <Route path="/health-questions" element={<HealthForm />} />
      <Route path="/insurance-details" element={<InsuranceForm />} />
      <Route path="/insurance-card-upload" element={<InsuranceCardUpload />} />
      <Route path="/terms-and-conditions" element={<TermsOfService />} />
    </Routes>
  );
}

export default App;
