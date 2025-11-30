// src/certifications/data/index.ts
import type { CertificationData } from "../types";

/* ---------------------------------------------------------------------
 * 🔢 ID reali dal database (slug → id) — CHIAVI TUTTE QUOTATE
 * -------------------------------------------------------------------*/
export const IDS_BY_SLUG: Record<string, number> = {
  "comptia-itf-plus": 1,
  "comptia-a-plus": 2,
  "eipass": 3,
  "ecdl": 4,
  "pekit": 5,
  "security-plus": 6,
  "cissp": 7,
  "isc2-cc": 8,
  "ceh": 9,
  "ccna": 10,
  "network-plus": 11,
  "ccst": 12,
  "comptia-cloud-plus": 13,
  "ibm-cloud-v5": 14,
  "aws-solutions-architect": 15,
  "microsoft-azure-fundamentals": 16,
  "oracle-database-sql": 17,
  "csharp": 18,
  "python-developer": 19,
  "java-se": 20,
  "javascript-developer": 21,
  "vmware-vcp": 22,
  "microsoft-virtualization": 23,
  "microsoft-ai-fundamentals": 24,
  "tensorflow": 25,
  "mongodb-developer": 26,
  "mysql": 27,
  "jncie": 28,
  "f5": 29,
  "microsoft-sql-server": 30,
  "google-cloud": 31,
  "aws-cloud-practitioner": 32,
  "cisco-ccst-networking": 33,
};

/* ---------------------------------------------------------------------
 * 📦 Import singoli moduli certificazione
 * -------------------------------------------------------------------*/
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

/* ---------------------------------------------------------------------
 * 🧩 Registro principale
 * -------------------------------------------------------------------*/

// Elenco base (immutabile a livello di riferimento)
const RAW_CERTS = [
  AWSCloudPractitioner,
  AWSSolutionsArchitect,
  CCNA,
  CCST,
  CEH,
  CiscoCCSTNetworking,
  CiscoCCSTSecurity,          // slug: "cisco-ccst-security"
  CISSP,
  CompTIACloudPlus,           // slug: "comptia-cloud-plus"
  CompTIA_A_Plus,             // slug: "comptia-a-plus"
  CompTIA_ITF_Plus,           // slug: "comptia-itf-plus"
  CSharpCertification,        // slug: "csharp" (rinomina futura: "azure-developer")
  ECDL,                       // slug: "ecdl"
  EIPASS,                     // slug: "eipass"
  F5,                         // slug: "f5"
  GoogleCloud,                // slug: "google-cloud"
  GoogleTensorFlowDeveloper,  // slug: "tensorflow"
  IBMCloudV5,                 // slug: "ibm-cloud-v5"
  ISC2_CC,                    // slug: "isc2-cc"
  JavaScriptDeveloper,        // slug: "javascript-developer"
  JavaSE,                     // slug: "java-se"
  JNCIE,                      // slug: "jncie"
  MicrosoftAIFundamentals,    // slug: "microsoft-ai-fundamentals"
  MicrosoftAzureFundamentals, // slug: "microsoft-azure-fundamentals"
  MicrosoftSQLServer,         // slug: "microsoft-sql-server"
  MicrosoftVirtualization,    // slug: "microsoft-virtualization"
  MongoDBDeveloper,           // slug: "mongodb-developer"
  MySQLCertification,         // slug: "mysql"
  NetworkPlus,                // slug: "network-plus"
  OracleDatabaseSQL,          // slug: "oracle-database-sql"
  PEKIT,                      // slug: "pekit"
  PythonDeveloper,            // slug: "python-developer"
  SecurityPlus,               // slug: "security-plus"
  VMwareVCP,                  // slug: "vmware-vcp"
] as const;

/**
 * Applica l’overlay degli ID (dal DB) agli oggetti certificazione.
 * Nota: niente `as const` sul risultato di `.map()`.
 */
export const CERTS: ReadonlyArray<CertificationData> = RAW_CERTS.map((c) => ({
  ...c,
  id: IDS_BY_SLUG[c.slug] ?? undefined,
}));

/* ---------------------------------------------------------------------
 * 🧭 Utility e lookup
 * -------------------------------------------------------------------*/

export const CERT_SLUGS: ReadonlyArray<string> = CERTS.map((c) => c.slug);

export const CERTS_BY_SLUG: Record<string, CertificationData> =
  Object.fromEntries(CERTS.map((c) => [c.slug, c]));

/** Mini check anti-duplicati + id mancanti (solo in dev) */
if (process.env.NODE_ENV !== "production") {
  const seen = new Set<string>();
  for (const s of CERT_SLUGS) {
    if (seen.has(s)) {
      console.warn(`[certs] Duplicate slug found: ${s}`);
    }
    seen.add(s);
  }
  for (const c of CERTS) {
    if (typeof c.id !== "number") {
      console.warn(`[certs] Missing DB id for slug: "${c.slug}"`);
    }
  }
}

export default CERTS;
