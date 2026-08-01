import type { Locale } from "@/lib/i18n";
import type { PortDifficulty, PortEntry, Transport } from "./types";

const note=(service:string):Record<Locale,string>=>({
 it:`Porta predefinita o comunemente associata a ${service}.`, en:`Default or commonly associated port for ${service}.`,
 fr:`Port par défaut ou couramment associé à ${service}.`, es:`Puerto predeterminado o asociado habitualmente a ${service}.`,
});
const e=(id:string,service:string,ports:number[],transports:Transport[],difficulty:PortDifficulty,aliases?:string[]):PortEntry=>({id,service,ports,transports,difficulty,aliases,description:note(service)});

export const PORTS: readonly PortEntry[] = [
 e("ftp-data","FTP data",[20],["TCP"],"basic"),e("ftp-control","FTP control",[21],["TCP"],"basic"),e("ssh","SSH",[22],["TCP"],"basic"),e("telnet","Telnet",[23],["TCP"],"basic"),e("smtp","SMTP",[25],["TCP"],"basic"),e("dns","DNS",[53],["TCP","UDP"],"basic"),e("dhcp-server","DHCP server",[67],["UDP"],"basic"),e("dhcp-client","DHCP client",[68],["UDP"],"basic"),e("tftp","TFTP",[69],["UDP"],"basic"),e("http","HTTP",[80],["TCP"],"basic"),e("pop3","POP3",[110],["TCP"],"basic"),e("ntp","NTP",[123],["UDP"],"basic"),e("imap","IMAP",[143],["TCP"],"basic"),e("snmp","SNMP",[161],["UDP"],"basic"),e("snmp-trap","SNMP Trap",[162],["UDP"],"basic"),e("https","HTTPS",[443],["TCP"],"basic"),
 e("ldap","LDAP",[389],["TCP","UDP"],"intermediate"),e("smb","SMB/CIFS",[445],["TCP"],"intermediate",["SMB"]),e("syslog","Syslog",[514],["UDP"],"intermediate"),e("smtp-submission","SMTP Submission",[587],["TCP"],"intermediate"),e("ldaps","LDAPS",[636],["TCP"],"intermediate"),e("imaps","IMAPS",[993],["TCP"],"intermediate"),e("pop3s","POP3S",[995],["TCP"],"intermediate"),e("mssql","Microsoft SQL Server",[1433],["TCP"],"intermediate",["MSSQL"]),e("oracle","Oracle Database",[1521],["TCP"],"intermediate"),e("rdp","RDP",[3389],["TCP","UDP"],"intermediate"),e("mysql","MySQL",[3306],["TCP"],"intermediate"),e("postgresql","PostgreSQL",[5432],["TCP"],"intermediate"),e("sip","SIP",[5060],["TCP","UDP"],"intermediate"),e("sip-tls","SIP TLS",[5061],["TCP"],"intermediate"),
 e("kerberos","Kerberos",[88],["TCP","UDP"],"advanced"),e("rpc","RPC Endpoint Mapper",[135],["TCP"],"advanced"),e("netbios-name","NetBIOS Name Service",[137],["UDP"],"advanced"),e("netbios-datagram","NetBIOS Datagram",[138],["UDP"],"advanced"),e("netbios-session","NetBIOS Session",[139],["TCP"],"advanced"),e("bgp","BGP",[179],["TCP"],"advanced"),e("tacacs","TACACS+",[49],["TCP"],"advanced"),e("radius-auth","RADIUS Authentication",[1812],["UDP"],"advanced"),e("radius-accounting","RADIUS Accounting",[1813],["UDP"],"advanced"),e("l2tp","L2TP",[1701],["UDP"],"advanced"),e("pptp","PPTP",[1723],["TCP"],"advanced"),e("ike","IKE/ISAKMP",[500],["UDP"],"advanced"),e("ipsec-natt","IPsec NAT-T",[4500],["UDP"],"advanced"),e("vnc","VNC",[5900],["TCP"],"advanced"),e("http-alt","HTTP Alternate",[8080],["TCP"],"advanced"),e("https-alt","HTTPS Alternate",[8443],["TCP"],"advanced"),
] as const;

const rank:Record<PortDifficulty,number>={basic:0,intermediate:1,advanced:2};
export function portPool(difficulty:PortDifficulty):readonly PortEntry[]{return PORTS.filter(x=>rank[x.difficulty]<=rank[difficulty]);}
export function portAndTransport(entry:PortEntry):string{return `${entry.ports.join("/")}/${entry.transports.join("+")}`;}
