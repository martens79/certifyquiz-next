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

// 👇 Registro centrale: nessuna modifica ai singoli moduli necessaria
export const CERTS = [
  AWSCloudPractitioner,
  AWSSolutionsArchitect,
  CCNA,
  CCST,
  CEH,
  CiscoCCSTNetworking,
  CiscoCCSTSecurity,
  CISSP,
  CompTIACloudPlus,
  CompTIA_A_Plus,
  CompTIA_ITF_Plus,
  CSharpCertification,
  ECDL,
  EIPASS,
  F5,
  GoogleCloud,
  GoogleTensorFlowDeveloper,
  IBMCloudV5,
  ISC2_CC,
  JavaScriptDeveloper,
  JavaSE,
  JNCIE,
  MicrosoftAIFundamentals,
  MicrosoftAzureFundamentals,
  MicrosoftSQLServer,
  MicrosoftVirtualization,
  MongoDBDeveloper,
  MySQLCertification,
  NetworkPlus,
  OracleDatabaseSQL,
  PEKIT,
  PythonDeveloper,
  SecurityPlus,
  VMwareVCP,
] as const satisfies readonly CertificationData[];
