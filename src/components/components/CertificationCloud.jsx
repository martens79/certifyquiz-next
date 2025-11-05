import React from "react";
import { Link } from "react-router-dom";
import { getLabel } from "../utils/langUtils";

const CertificationCloud = ({ certifications }) => {
  if (!certifications || certifications.length === 0) return null;

  const column1 = certifications.slice(0, Math.ceil(certifications.length / 2));
  const column2 = certifications.slice(Math.ceil(certifications.length / 2));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 text-sm mt-2">
      <ul className="list-disc list-inside space-y-1">
        {column1.map((cert, idx) => (
          <li key={idx} className="truncate">
            <Link
              to={cert.link}
              className="text-blue-700 hover:underline hover:text-blue-900"
            >
              {getLabel(cert.name)}
            </Link>
          </li>
        ))}
      </ul>
      <ul className="list-disc list-inside space-y-1">
        {column2.map((cert, idx) => (
          <li key={idx} className="truncate">
            <Link
              to={cert.link}
              className="text-blue-700 hover:underline hover:text-blue-900"
            >
              {getLabel(cert.name)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CertificationCloud;
