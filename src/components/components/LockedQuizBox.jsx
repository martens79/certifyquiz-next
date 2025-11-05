import React from "react";
import { Lock } from "lucide-react";
import { getLabel } from "../utils/langUtils";
import { Link } from "react-router-dom";

const LockedQuizBox = ({ title }) => {
  return (
    <div className="relative bg-gray-200 text-gray-600 rounded-xl p-4 shadow-md flex flex-col items-center justify-center cursor-not-allowed opacity-70">
      <Lock size={32} className="mb-2" />
      <h3 className="text-lg font-semibold text-center">{getLabel(title)}</h3>
      <p className="text-sm text-center mt-1">
        {getLabel({
          it: "Disponibile dal 31 agosto con Premium",
          en: "Available from August 31st with Premium",
          fr: "Disponible à partir du 31 août avec Premium",
          es: "Disponible a partir del 31 de agosto con Premium"
        })}
      </p>
      <Link
        to="/premium/upgrade"
        className="text-xs text-blue-600 hover:underline mt-2 z-20"
      >
        {getLabel({
          it: "Scopri i vantaggi",
          en: "See benefits",
          fr: "Voir les avantages",
          es: "Ver ventajas"
        })}
      </Link>
      <div className="absolute inset-0 z-10" title="Premium" />
    </div>
  );
};

export default LockedQuizBox;
