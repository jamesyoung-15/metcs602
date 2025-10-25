import React, { useState } from "react";
import dayjs from "dayjs";
import { PiSunHorizonLight, PiSun } from "react-icons/pi";
import { HiOutlineMoon } from "react-icons/hi2";
import { useUserStore } from "../store/UserStore";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type TimeSlot = string;

const AppointmentSelector: React.FC = () => {
  const { t } = useTranslation();
  const { userId } = useUserStore();
  const [selectedDate, setSelectedDate] = useState(dayjs().startOf("day")); // Today's date
  const timeSlots = [
    "8:00 am",
    "8:20 am",
    "8:40 am",
    "9:00 am",
    "9:20 am",
    "9:40 am",
    "10:00 am",
    "10:20 am",
    "10:40 am",
    "11:00 am",
    "11:20 am",
    "11:40 am",
    "12:00 pm",
    "12:20 pm",
    "12:40 pm",
    "1:00 pm",
    "1:20 pm",
    "1:40 pm",
    "2:00 pm",
    "2:20 pm",
    "2:40 pm",
    "3:00 pm",
    "3:20 pm",
    "3:40 pm",
    "4:00 pm",
    "4:20 pm",
    "4:40 pm",
    "5:00 pm",
  ];
  const [selectedAppointment, setSelectedAppointment] = useState<{
    date: dayjs.Dayjs;
    timeSlot: TimeSlot;
  } | null>(null);
  const navigate = useNavigate();

  // Generate the next 7 days
  const generateWeekDays = (generateFrom: string | null): string[] => {
    if (generateFrom === null) {
      return Array.from({ length: 7 }, (_, i) =>
        dayjs().add(i, "day").format("ddd, D MMM"),
      );
    } else {
      return Array.from({ length: 7 }, (_, i) =>
        dayjs(generateFrom).add(i, "day").format("ddd, D MMM"),
      );
    }
  };

  // Handle date selection
  const handleDateSelect = (index: number) => {
    setSelectedDate(dayjs().add(index, "day"));
    console.log(
      `Selected date: ${dayjs().add(index, "day").format("YYYY-MM-DD")}`,
    );
  };

  const handleSelectTimeSlot = (slot: TimeSlot) => {
    const newAppointment = { date: selectedDate, timeSlot: slot };
    setSelectedAppointment(newAppointment);
    console.log(selectedAppointment, newAppointment);
  };

  // check if a slot is selected
  const isSlotSelected = (slot: TimeSlot): boolean => {
    return (
      selectedAppointment?.timeSlot === slot &&
      selectedAppointment?.date.isSame(selectedDate, "day")
    );
  };

  const handleSubmit = async () => {
    if (!selectedAppointment) {
      alert("Please select a date and time slot before submitting.");
      return;
    }
    // Convert "12:20 pm" to 24-hour format and combine with date
    const timeIn24Hour = dayjs(
      `2000-01-01 ${selectedAppointment.timeSlot}`,
      "YYYY-MM-DD h:mm a",
    ).format("HH:mm:ss");
    const appointmentDateTime = dayjs(
      `${selectedAppointment.date.format("YYYY-MM-DD")} ${timeIn24Hour}`,
    );

    // Send as ISO string - MongoDB will convert to Date
    const appointmentData = {
      userId: userId, // Get from auth context or state
      appointmentDate: appointmentDateTime.toISOString(),
      appointmentTime: selectedAppointment.timeSlot, // Keep original format for display
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/schedule-appointment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(appointmentData),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to schedule appointment");
      }
      const result = await response.json();
      console.log("Appointment scheduled successfully:", result);
      alert("Appointment scheduled successfully!");
      navigate("/terms-and-conditions");
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      alert("Error scheduling appointment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start p-4">
      <div className="w-full max-w-lg shadow-lg rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-[#13a5da]">
              {t("scheduleAppointment.title")}
            </h2>
            <button className="bg-orange-500 text-orange-500 bg-white px-3 py-1 rounded-full border border-orange-500 hover:bg-orange-100">
              {t("scheduleAppointment.viewCalendar")}
            </button>
          </div>
          <div className="text-sm text-gray-500 flex gap-4">
            <span>
              <b>{t("scheduleAppointment.days")}</b>:{" "}
              {t("scheduleAppointment.avalDays")}
            </span>
            <span>
              <b>{t("scheduleAppointment.hours")}</b>:{" "}
              {t("scheduleAppointment.morning")} -{" "}
              {t("scheduleAppointment.evening")}
            </span>
          </div>
          <button className="text-orange-500 text-sm mt-2">
            {t("scheduleAppointment.changeSearch")}
          </button>
        </div>

        {/* Weekday Selector */}
        <div className="flex overflow-x-auto border-b border-gray-300">
          {generateWeekDays(null).map((day, index) => (
            <button
              key={index}
              onClick={() => handleDateSelect(index)}
              className={`flex flex-col items-center flex-grow px-2 py-3 text-gray-600 ${
                selectedDate.isSame(dayjs().add(index, "day"), "day")
                  ? "border-b-2 border-orange-500"
                  : ""
              }`}
            >
              <span
                className={`${selectedDate.isSame(dayjs().add(index, "day"), "day") ? "font-semibold" : ""}`}
              >
                {day.split(",")[0]}
              </span>
              <span className="text-xs">{day.split(",")[1]}</span>
            </button>
          ))}
        </div>

        {/* Time Slots */}
        <div className="p-4">
          {/* Morning Section */}
          <div className="mb-6">
            <div className="flex items-center gap-1">
              <PiSunHorizonLight size={24} className="mb-2" />
              <h3 className="text-gray-700 font-semibold mb-2">Morning</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot, index) =>
                index < 12 ? (
                  <button
                    key={index}
                    className={`border shadow-lg text-sm py-2 rounded ${
                      isSlotSelected(slot)
                        ? "bg-orange-500 text-white border-orange-500"
                        : "border-gray-400 text-gray-600 hover:bg-orange-100"
                    }`}
                    onClick={() => handleSelectTimeSlot(slot)}
                  >
                    <div className="flex flex-col items-center">
                      <span>{slot}</span>
                      <span>Dr. Koo</span>
                    </div>
                  </button>
                ) : null,
              )}
            </div>
          </div>

          {/* Afternoon Section */}
          <div className="mb-6">
            <div className="flex items-center gap-1">
              <PiSun size={24} className="mb-2" />
              <h3 className="text-gray-700 font-semibold mb-2">Afternoon</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot, index) =>
                index >= 12 && index < 25 ? (
                  <button
                    key={index}
                    className={`border shadow-lg text-sm py-2 rounded ${
                      isSlotSelected(slot)
                        ? "bg-orange-500 text-white border-orange-500"
                        : "border-gray-400 text-gray-600 hover:bg-orange-100"
                    }`}
                    onClick={() => handleSelectTimeSlot(slot)}
                  >
                    <div className="flex flex-col items-center">
                      <span>{slot}</span>
                      <span>Dr. Koo</span>
                    </div>
                  </button>
                ) : null,
              )}
            </div>
          </div>
          {/* Evening Section */}
          <div className="mb-6">
            <div className="flex items-center gap-1">
              <HiOutlineMoon size={24} className="mb-2" />
              <h3 className="text-gray-700 font-semibold mb-2">Evening</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot, index) =>
                index >= 25 ? (
                  <button
                    key={index}
                    className={`border shadow-lg text-sm py-2 rounded ${
                      isSlotSelected(slot)
                        ? "bg-orange-500 text-white border-orange-500"
                        : "border-gray-400 text-gray-600 hover:bg-orange-100"
                    }`}
                    onClick={() => handleSelectTimeSlot(slot)}
                  >
                    <div className="flex flex-col items-center">
                      <span>{slot}</span>
                      <span>Dr. Koo</span>
                    </div>
                  </button>
                ) : null,
              )}
            </div>
          </div>
          {/* Submit Button */}
          <div className="flex justify-center mt-12">
            <button
              className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              onClick={handleSubmit}
            >
              {t("scheduleAppointment.confirmAppointment")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentSelector;
