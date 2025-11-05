import React from "react";
import { Link } from "react-router-dom";
import QuizTitle from "./QuizTitle";
import BottomNavbar from "./BottomNavbar";
import { getLabel } from "../utils/langUtils";

export default function CategoryCertificationsPage({
  categoryColor = "blue",
  quizRoute = "/quiz-mixed",
  certifications = [],
  quizTitle,
  quizSubtitle,
}) {
  return (
    <div
  className={`min-h-screen bg-${categoryColor}-50 text-[#0a1f44] px-4 pb-[120px] pt-12`}
>
  <QuizTitle />

      {/* Griglia certificazioni */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto animate-fadeInUp">
        {certifications.map((cert) => (
          <Link
            key={getLabel(cert.name)}
            to={cert.link}
            className={`bg-${categoryColor}-100 hover:bg-${categoryColor}-200 text-[#0a1f44] p-6 rounded-xl shadow-md flex flex-col items-center justify-center text-center h-48 transition-all`}
          >
            <div className="text-4xl mb-3">{cert.icon}</div>
            <h2 className="text-xl font-semibold mb-1">{getLabel(cert.name)}</h2>
            <p className="text-sm text-gray-700 max-w-xs">{getLabel(cert.description)}</p>
          </Link>
        ))}

        {/* Box quiz misti */}
        <Link
          to={quizRoute}
          className={`bg-${categoryColor}-300 hover:bg-${categoryColor}-400 text-[#0a1f44] p-6 rounded-xl shadow-md flex flex-col items-center justify-center text-center h-48 font-bold transition-all`}
        >
          <div className="text-4xl mb-3">🎯</div>
          <h2 className="text-xl font-semibold mb-1">{getLabel(quizTitle)}</h2>
          <p className="text-sm text-[#0a1f44]">{getLabel(quizSubtitle)}</p>
        </Link>
      </div>

      <BottomNavbar />
    </div>
  );
}
