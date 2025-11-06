// src/certifications/data/index.ts
import type { CertificationData } from "../types";

import AWSCloudPractitioner from "./AWSCloudPractitioner";
import AWSSolutionsArchitect from "./AWSSolutionsArchitect";
import CCNA from "./CCNA";
import CCST from "./CCST";
import CEH from "./CEH";
import CiscoCCSTNetworking from "./CiscoCCSTNetworking";
import CiscoCCSTSecurity from "./CiscoCCSTSecurity";
import CISSP from "./CISSP";
import CompTIACloudPlus from "./CompTIACloudPlus";
import CompTIA_A_Plus from "./CompTIA_A_Plus";
import CompTIA_ITF_Plus from "./CompTIA_ITF_Plus";
import CSharpCertification from "./CSharpCertification";
import ECDL from "./ECDL";
import EIPASS from "./EIPASS";
import F5 from "./F5";
import GoogleCloud from "./GoogleCloud";
import GoogleTensorFlowDeveloper from "./GoogleTensorFlowDeveloper";
import IBMCloudV5 from "./IBMCloudV5";
import ISC2_CC from "./ISC2_CC";
import JavaScriptDeveloper from "./JavaScriptDeveloper";
import JavaSE from "./JavaSE";
import JNCIE from "./JNCIE";
import MicrosoftAIFundamentals from "./MicrosoftAIFundamentals";
import MicrosoftAzureFundamentals from "./MicrosoftAzureFundamentals";
import MicrosoftSQLServer from "./MicrosoftSQLServer";
import MicrosoftVirtualization from "./MicrosoftVirtualization";
import MongoDBDeveloper from "./MongoDBDeveloper";
import MySQLCertification from "./MySQLCertification";
import NetworkPlus from "./NetworkPlus";
import OracleDatabaseSQL from "./OracleDatabaseSQL";
import PEKIT from "./PEKIT";
import PythonDeveloper from "./PythonDeveloper";
import SecurityPlus from "./SecurityPlus";
import VMwareVCP from "./VMwareVCP";

/**
 * Registro centrale delle certificazioni.
 * Gli slug usati in QuizHome devono corrispondere agli slug definiti qui dentro
 * (nei singoli moduli).
 */
export const CERTS = [
  AWSCloudPractitioner,
  AWSSolutionsArchitect,
  CCNA,
  CCST,
  CEH,
  CiscoCCSTNetworking,
  CiscoCCSTSecurity,          // -> slug atteso: "cisco-ccst-security"
  CISSP,
  CompTIACloudPlus,           // -> "comptia-cloud-plus"
  CompTIA_A_Plus,             // -> "comptia-a-plus"
  CompTIA_ITF_Plus,           // -> "comptia-itf-plus"
  CSharpCertification,        // -> "csharp" (per ora)
  ECDL,                       // -> "ecdl"
  EIPASS,                     // -> "eipass"
  F5,                         // -> "f5"
  GoogleCloud,                // -> "google-cloud"
  GoogleTensorFlowDeveloper,  // -> "tensorflow"
  IBMCloudV5,                 // -> "ibm-cloud-v5"
  ISC2_CC,                    // -> "isc2-cc"
  JavaScriptDeveloper,        // -> "javascript-developer"
  JavaSE,                     // -> "java-se"
  JNCIE,                      // -> "jncie"
  MicrosoftAIFundamentals,    // -> "microsoft-ai-fundamentals"
  MicrosoftAzureFundamentals, // -> "microsoft-azure-fundamentals"
  MicrosoftSQLServer,         // -> "microsoft-sql-server"
  MicrosoftVirtualization,    // -> "microsoft-virtualization"
  MongoDBDeveloper,           // -> "mongodb-developer"
  MySQLCertification,         // -> "mysql"
  NetworkPlus,                // -> "network-plus"
  OracleDatabaseSQL,          // -> "oracle-database-sql"
  PEKIT,                      // -> "pekit"
  PythonDeveloper,            // -> "python-developer"
  SecurityPlus,               // -> "security-plus"
  VMwareVCP,                  // -> "vmware-vcp"
] as const satisfies readonly CertificationData[];

// Slug list utile per generateStaticParams / sitemap
export const CERT_SLUGS = CERTS.map(c => c.slug) as readonly string[];

// Lookup veloce: slug -> dato certificazione
export const CERTS_BY_SLUG: Record<string, CertificationData> =
  Object.fromEntries(CERTS.map(c => [c.slug, c]));

// (facoltativo) mini check in dev: slug duplicati
if (process.env.NODE_ENV !== "production") {
  const seen = new Set<string>();
  for (const s of CERT_SLUGS) {
    if (seen.has(s)) {
      console.warn(`[certs] Duplicate slug found: ${s}`);
    }
    seen.add(s);
  }
}

export default CERTS;
