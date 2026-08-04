# Exam blueprint verification status

Last audit: 2026-08-04

Only primary sources published by the certification provider are accepted.
`Complete` means that the current exam version, domains, weights (when
published), source URL and verification date are stored in the registry.

## Complete

| Certification | Exam | Source status |
| --- | --- | --- |
| Cisco CCNA | 200-301 v1.1 | Official Cisco exam page and Exam Topics PDF |
| CompTIA Network+ | N10-009, objectives v4.0 | Official CompTIA objectives PDF |
| CompTIA Cloud+ | CV0-004, objectives v2.0 | Official CompTIA objectives PDF |
| CompTIA Security+ | SY0-701, objectives v5.0 | Official CompTIA objectives PDF |
| CompTIA Tech+ | FC0-U71, objectives v2.0 | Official CompTIA objectives PDF; registry retains legacy ITF+ slug |
| CompTIA A+ | Core 1 220-1201 + Core 2 220-1202, V15 (Objectives Doc. 3.0) | Official CompTIA objectives PDFs (two separate exams, `exams[]` blueprint) |
| AWS Certified Cloud Practitioner | CLF-C02 | Official AWS Exam Guide PDF (docs.aws.amazon.com) |
| AWS Certified Solutions Architect – Associate | SAA-C03 | Official AWS Exam Guide PDF (docs.aws.amazon.com) |
| AWS Certified AI Practitioner | AIF-C01 | Official AWS Exam Guide PDF (docs.aws.amazon.com) |
| Microsoft Azure Fundamentals | AZ-900 | Official Microsoft Learn study guide (percentage ranges) |
| Microsoft Power BI Data Analyst | PL-300 | Official Microsoft Learn study guide (percentage ranges) |
| Microsoft Azure Data Fundamentals | DP-900 | Official Microsoft Learn study guide (percentage ranges) |
| Microsoft Azure AI Fundamentals | AI-901 (was AI-900, retired 2026-06-30) | Official Microsoft Learn study guide; page copy (title/meta/FAQ) rewritten to AI-901, retirement noted in FAQ |
| Microsoft Azure AI Apps and Agents Developer Associate | AI-103 (was AI-102 "Azure AI Engineer Associate", retired 2026-06-30) | Official Microsoft Learn study guide; page copy rewritten to the renamed certification, slug/quizRoute kept unchanged for SEO stability |
| Cisco CCST Networking | 100-150 | Official Cisco Objective Domains PDF (learningcontent.cisco.com); no official percentage weights published |
| Cisco CCST Cybersecurity | 100-160 | Official Cisco Objective Domains PDF (learningcontent.cisco.com); no official percentage weights published |
| Cisco CCNP Enterprise | Core 350-401 ENCOR v1.2 | Official Cisco Exam Topics PDF; Core exam only (documents the shared requirement), `note` field explains the required concentration exam (candidate's choice of 8) is not fixed |
| ISC2 Certified in Cybersecurity (CC) | Exam Outline effective 2025-10-01 | Official ISC2 exam outline PDF; `note` field flags the 2026-09-01 outline refresh (AI security content) |
| ISC2 CISSP | Exam Outline effective 2024-04-15 | Official ISC2 exam outline PDF (8 domains) |

## Pending official-source verification

- EC-Council CEH
- Google Cloud Digital Leader
- IBM Cloud certification registry entry
- ICDL
- EIPASS
- F5 certification registry entry
- JavaScript Developer registry entry
- Oracle Java SE
- Juniper JNCIE registry entry
- MongoDB Developer
- MySQL certification registry entry
- Oracle Database SQL
- PEKIT
- Python Institute certification registry entry
- VMware VCP registry entry
- ITIL 4 Foundation
- NVIDIA Generative AI LLMs
- Linux Foundation KCNA
- PMI PMP
- Scrum.org PSM I

## No single official exam blueprint

These entries are aggregate pages, internal learning paths, or generic
technology collections. They must not display an official-exam card unless
they are later mapped to a specific provider exam.

- CCST umbrella page
- Google Cloud generic collection
- TensorFlow Developer (certificate program discontinued)
- Microsoft SQL Server generic collection
- Microsoft Virtualization generic collection
- AI Foundations
- Networking Foundations
- Cloud Foundations
- Cybersecurity Foundations
- Database Foundations
- Programming Foundations
- Virtualization Foundations
- Project Management Foundations
- Data Analytics Foundations

## Needs clarification

- IBM Cloud V5: registry title does not identify one unambiguous current exam.
- F5: registry entry aggregates multiple F5 certification exams.
- JNCIE: registry entry does not specify the JNCIE track.
- JavaScript Developer: current source points to W3Schools rather than a
  vendor-neutral certification authority.
- MySQL, Python and VMware entries need exact exam/version matching before a
  blueprint can be published.
- Microsoft Azure Developer Associate (AZ-204, registry slug `csharp`): exam
  retired 2026-07-31. No successor exam or certification has been announced
  by Microsoft. No blueprint box (there is no current exam to document); the
  page was repositioned as a skills-review resource based on the retired
  exam's objectives, with an explicit retirement notice in the FAQ and
  exam-reference list. Revisit if Microsoft announces a successor.
