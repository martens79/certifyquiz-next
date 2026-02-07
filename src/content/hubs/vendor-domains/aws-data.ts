import type { HubData } from "./google-cloud";

export const awsDataHub: HubData = {
  hubKind: "vendorDomain",
  hubSlug: "aws-data",
  vendorKey: "aws",
  domainKey: "data",
  title: {
    it: "AWS Data & Analytics: quiz e percorsi",
    en: "AWS Data & Analytics: quizzes and paths",
    fr: "AWS Data & Analytics : quiz et parcours",
    es: "AWS Datos y Analítica: quizzes y rutas",
  },
  description: {
    it: "Database, data lake, analytics e casi d’uso su AWS. Contenuti in crescita (in arrivo).",
    en: "Databases, data lakes, analytics and use cases on AWS. Growing content (coming soon).",
    fr: "Bases de données, data lakes, analytics et cas d’usage sur AWS. Contenu en croissance (bientôt).",
    es: "Bases de datos, data lakes, analítica y casos de uso en AWS. Contenido en crecimiento (próximamente).",
  },
  certs: [],
};
