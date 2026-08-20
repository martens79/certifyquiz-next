import type { SalesforceEditorialQuestion } from "./salesforce-editorial-types";

type Topic02Question = SalesforceEditorialQuestion<
  "users-authentication-access",
  "CS-03" | "CS-04"
>;

export const SALESFORCE_PLATFORM_ADMIN_TOPIC_02_SOURCES = [
  { title: "Salesforce Certified Platform Administrator Exam Guide", url: "https://help.salesforce.com/s/articleView?id=005298966&type=1&language=en_US", lastVerifiedAt: "2026-08-20", objectiveIds: ["CS-03", "CS-04"] },
  { title: "Control Access to the Org", url: "https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_org", lastVerifiedAt: "2026-08-20", objectiveIds: ["CS-03", "CS-04"] },
  { title: "Enhance Security with MFA Verification", url: "https://trailhead.salesforce.com/content/learn/modules/identity_login/identity_login_2fa", lastVerifiedAt: "2026-08-20", objectiveIds: ["CS-04"] },
  { title: "Manage Identity and Access", url: "https://trailhead.salesforce.com/content/learn/trails/identity", lastVerifiedAt: "2026-08-20", objectiveIds: ["CS-04"] },
] as const;

export const SALESFORCE_PLATFORM_ADMIN_TOPIC_02_REVIEW = {
  id: "SF-PA-T02-REVIEW-EN",
  language: "en",
  topicSlug: "users-authentication-access",
  title: "Users, Authentication, and Access Foundations — Exam Review",
  objectiveIds: ["CS-03", "CS-04"],
  blueprintDomains: ["Configuration and Setup", "Agentforce"],
  lastVerifiedAt: "2026-08-20",
  sourceUrls: SALESFORCE_PLATFORM_ADMIN_TOPIC_02_SOURCES.map((source) => source.url),
  content: `## Learning objectives

After this review, you should be able to administer the user lifecycle, select appropriate licenses and login methods, distinguish deactivation from freezing, separate authentication from authorization, reason about MFA and identity verification, and troubleshoot login failures by checking the correct control layer.

This topic owns **CS-03** (user setup and maintenance) and **CS-04** (organization security controls). It does not own object, field, or record authorization; those controls belong primarily to Permissions and Record Sharing.

## User lifecycle and licenses

A Salesforce user record represents a person or integration identity that can authenticate to the org. A username must be globally unique and formatted like an email address, but it does not have to be the user's actual email address. The email field is a separate delivery and contact setting.

Select the user license before assigning access. A license determines the broad feature and data capabilities available to that user; profiles and permission sets cannot grant capabilities excluded by the license. Feature licenses add access to particular capabilities where applicable. Avoid treating a profile as a substitute for the correct user license.

Salesforce users are not deleted. Deactivate a departing user to prevent login while preserving ownership and audit history. Transfer important records and responsibilities deliberately. If deactivation is temporarily blocked by a dependency, freezing the account immediately stops login while the administrator resolves the dependency. Freezing does not release the user license; deactivation does.

### Decision rule

- **Immediate login stop while cleanup is pending:** freeze.
- **Permanent departure after dependencies are handled:** deactivate.
- **Business data and ownership:** transfer explicitly; do not expect deactivation to erase history.
- **Missing capability:** verify the user license before adjusting permissions.

## Authentication and identity verification

Authentication answers **who is attempting to enter**. Authorization answers **what an authenticated identity can do or see**. Passwords, SSO, MFA, identity verification, login IP restrictions, and login hours are authentication or entry controls. Object permissions, field-level security, organization-wide defaults, roles, and sharing are authorization controls.

Multi-factor authentication requires an additional verification factor beyond a password for covered logins. Identity verification can also be prompted when login context is unfamiliar, such as an untrusted network. A trusted IP range at the organization level can reduce identity challenges for known networks; it does not grant object or record access.

Single sign-on delegates or coordinates authentication with an identity provider. It does not automatically determine Salesforce record visibility. When troubleshooting SSO, determine whether the identity provider authenticated the user, whether the Salesforce user mapping is correct, and whether the user is active before changing sharing settings.

## Login hours and IP controls

Profile login hours restrict when users assigned to that profile can log in. Profile login IP ranges restrict login to the configured network range. Organization trusted IP ranges have a different purpose: a login outside a trusted range can require identity verification rather than being categorically blocked.

This difference is frequently tested:

| Control | Typical result |
|---|---|
| Organization trusted IP range | Reduces verification challenges on trusted networks |
| Profile login IP range | Blocks profile users outside the allowed range |
| Profile login hours | Restricts when profile users can act in the org |
| Business hours | Models service operating time; not a login restriction |

## Sessions and access troubleshooting

Session settings govern behavior after authentication, including session security and timeout policies. Do not solve every login complaint by resetting a password. First identify the stage of failure.

1. Confirm the user exists, is active, and is not frozen.
2. Confirm the assigned license supports the intended login and product access.
3. Identify the login method: direct credentials, SSO, or another supported method.
4. Check login hours and profile IP restrictions.
5. Check MFA, identity verification, and session-related evidence.
6. Use login history and audit information to identify the actual failure.
7. Only after successful authentication, investigate authorization in Topic 3.

Setup Audit Trail helps administrators review recent configuration changes. Login History helps diagnose authentication attempts and statuses. Neither grants access; both provide evidence.

## Authentication versus authorization

A user who cannot log in has an authentication or entry-control problem. A user who logs in but cannot open an object, field, or record has an authorization problem. Keep the diagnostic boundary clear:

- **Cannot authenticate:** active/frozen state, credentials, SSO, MFA, login hours, IP policy.
- **Authenticates but cannot use an object:** license, profile, or permission set.
- **Can open the object but not a field:** field-level security.
- **Can open the object but not one record:** ownership, OWD, hierarchy, or sharing.

## Agent access boundary

Agent access still depends on a valid identity, appropriate licenses, and security controls. If an agent-related user cannot authenticate or lacks an assigned capability, start with identity and license evidence. Detailed record authorization and Agentforce behavior belong to later topics. Do not bypass least privilege merely to make an agent work.

## Decision rules and comparisons

- Freeze before cleanup when access must stop immediately; deactivate for the completed departure.
- A license sets the capability ceiling; permissions grant within that ceiling.
- Organization trusted IP ranges and profile IP restrictions are not equivalent.
- MFA strengthens authentication; it does not expand authorization.
- SSO changes how identity is authenticated, not which records become visible.
- Use Login History and Setup Audit Trail as evidence before making broad changes.

## Mini-scenarios

**Departing employee:** Access must stop now, but deactivation fails because of a dependency. Freeze the user, resolve ownership or hierarchy dependencies, transfer responsibilities, then deactivate.

**Office versus travel:** Office users normally avoid verification challenges, but a traveler is prompted for verification. Check trusted network context; do not grant extra permissions.

**Successful login, missing opportunity:** Authentication succeeded. Move to object and record access analysis in Topic 3 instead of resetting MFA.

**SSO failure:** The identity provider reports success, but Salesforce rejects the login. Verify user mapping, active/frozen state, login restrictions, and Login History before changing record sharing.

## Common mistakes and exam traps

- Trying to delete a user instead of deactivating the account.
- Assuming freeze releases a license.
- Confusing username with email address.
- Using permissions to overcome an incompatible license.
- Treating trusted IP ranges as the same as profile IP restrictions.
- Resetting passwords when login hours, MFA, SSO mapping, or frozen state is the cause.
- Changing sharing settings for a user who cannot authenticate.
- Assuming MFA or SSO grants access to objects and records.

## Final checklist

- Can I distinguish freeze from deactivate?
- Can I explain why a license is checked before permissions?
- Can I separate username and email?
- Can I identify authentication versus authorization failures?
- Can I distinguish trusted IP ranges from profile restrictions?
- Can I use Login History and Setup Audit Trail as diagnostic evidence?
- Can I keep Agentforce access inside normal identity and least-privilege controls?

## Related topics

Continue with **Permissions and Record Sharing** to decide what an authenticated user can do and which records the user can see. Return to **Platform Foundations and Org Setup** for organization defaults such as locale and time zone. Agent-specific use cases and prompt administration remain in **Agentforce Administration Fundamentals**.
`,
} as const;

const T = "users-authentication-access" as const;
const S = "SUPPORTED" as const;
const q = (question: Topic02Question): Topic02Question => question;

export const SALESFORCE_PLATFORM_ADMIN_TOPIC_02_QUIZZES: ReadonlyArray<Topic02Question> = [
q({ id:"SF-PA-T02-Q01",topicSlug:T,objectiveId:"CS-03", blueprintDomain: "configuration",concept:"User deactivation",difficulty:"easy",type:"conceptual",prompt:"An employee permanently leaves the company. Which action prevents future login while preserving the user's historical record?",answers:[{id:"A",text:"Delete the user"},{id:"B",text:"Deactivate the user"},{id:"C",text:"Remove the user's role only"},{id:"D",text:"Change the user's locale"}],correctAnswerId:"B",explanation:"Salesforce users are deactivated rather than deleted, preserving ownership and audit history while preventing login. Removing a role changes record access but does not disable authentication; locale is unrelated. Remember: transfer responsibilities, then deactivate. Objective CS-03, Topic 2. Review: User lifecycle and licenses.",reviewSection:"User lifecycle and licenses",supportStatus:S}),
  q({ id:"SF-PA-T02-Q02",topicSlug:T,objectiveId:"CS-03", blueprintDomain: "configuration",concept:"Username uniqueness",difficulty:"easy",type:"conceptual",prompt:"Which statement about a Salesforce username is correct?",answers:[{id:"A",text:"It must be globally unique and use an email-like format"},{id:"B",text:"It must always equal the user's email field"},{id:"C",text:"It only needs to be unique inside one org"},{id:"D",text:"It is automatically reused after deactivation"}],correctAnswerId:"A",explanation:"A Salesforce username must be globally unique and formatted like an email address, but it can differ from the email field. Org-only uniqueness and automatic reuse are unsafe assumptions. Objective CS-03, Topic 2. Review: User lifecycle and licenses.",reviewSection:"User lifecycle and licenses",supportStatus:S}),
  q({ id:"SF-PA-T02-Q03",topicSlug:T,objectiveId:"CS-03", blueprintDomain: "configuration",concept:"User license",difficulty:"easy",type:"configuration-choice",prompt:"A new user's license does not include a required product capability. What should the administrator verify before adding permission sets?",answers:[{id:"A",text:"The role hierarchy"},{id:"B",text:"The organization fiscal year"},{id:"C",text:"The assigned user license"},{id:"D",text:"The record owner"}],correctAnswerId:"C",explanation:"The user license establishes the capability ceiling. Permission sets can grant permissions only within supported licensed capabilities; roles and ownership affect records, and fiscal year is unrelated. Objective CS-03, Topic 2. Review: User lifecycle and licenses.",reviewSection:"User lifecycle and licenses",supportStatus:S}),
  q({ id:"SF-PA-T02-Q04",topicSlug:T,objectiveId:"CS-04", blueprintDomain: "configuration",concept:"MFA",difficulty:"easy",type:"conceptual",prompt:"What security property does multi-factor authentication primarily strengthen?",answers:[{id:"A",text:"Record ownership"},{id:"B",text:"Field-level authorization"},{id:"C",text:"Dashboard folder sharing"},{id:"D",text:"Confidence that the login user is the claimed identity"}],correctAnswerId:"D",explanation:"MFA strengthens authentication by requiring an additional factor. It does not determine ownership, field permission, or folder sharing. Those are authorization concerns handled after identity is established. Objective CS-04, Topic 2. Review: Authentication and identity verification.",reviewSection:"Authentication and identity verification",supportStatus:S}),
  q({ id:"SF-PA-T02-Q05",topicSlug:T,objectiveId:"CS-04", blueprintDomain: "configuration",concept:"Authentication versus authorization",difficulty:"easy",type:"conceptual",prompt:"A user logs in successfully but cannot open the Opportunities tab. Which category should the administrator investigate next?",answers:[{id:"A",text:"Authorization and licensed object access"},{id:"B",text:"Password authentication only"},{id:"C",text:"Business hours"},{id:"D",text:"Fiscal-year configuration"}],correctAnswerId:"A",explanation:"Successful login means authentication completed. Missing object capability points to the license, profile, or permission sets, which are authorization controls. Business hours and fiscal year do not control object access. Objective CS-04 with the Topic 3 boundary. Review: Authentication versus authorization.",reviewSection:"Authentication versus authorization",supportStatus:S}),
  q({ id:"SF-PA-T02-Q06",topicSlug:T,objectiveId:"CS-03", blueprintDomain: "configuration",concept:"Freeze versus deactivate",difficulty:"medium",type:"short-scenario",prompt:"Access must stop immediately, but Salesforce blocks deactivation because the user is referenced by a configuration dependency. What is the best first action?",answers:[{id:"A",text:"Delete the user's records"},{id:"B",text:"Assign a more restrictive role"},{id:"C",text:"Freeze the user"},{id:"D",text:"Change the username"}],correctAnswerId:"C",explanation:"Freezing immediately blocks login while the administrator resolves dependencies and prepares deactivation. A role does not block authentication, changing the username is insufficient, and deleting records destroys business context. Objective CS-03, Topic 2. Review: User lifecycle and licenses.",reviewSection:"User lifecycle and licenses",supportStatus:S}),
  q({ id:"SF-PA-T02-Q07",topicSlug:T,objectiveId:"CS-03", blueprintDomain: "configuration",concept:"License release",difficulty:"medium",type:"administrative-decision",prompt:"Which action normally releases a Salesforce user license for reassignment?",answers:[{id:"A",text:"Freezing the user"},{id:"B",text:"Deactivating the user"},{id:"C",text:"Removing the user's role"},{id:"D",text:"Resetting the password"}],correctAnswerId:"B",explanation:"Deactivation releases the user license; freezing only blocks login temporarily. Role removal changes record hierarchy access and password reset changes credentials, neither frees the license. Objective CS-03, Topic 2. Review: User lifecycle and licenses.",reviewSection:"User lifecycle and licenses",supportStatus:S}),
  q({ id:"SF-PA-T02-Q08",topicSlug:T,objectiveId:"CS-03", blueprintDomain: "configuration",concept:"Username versus email",difficulty:"medium",type:"troubleshooting",prompt:"A user receives email at a new address, but an integration still relies on the existing Salesforce username. Which statement guides the change?",answers:[{id:"A",text:"Email and username are separate fields and can be managed separately"},{id:"B",text:"Changing email must delete the user"},{id:"C",text:"The username must always match the new email"},{id:"D",text:"The role hierarchy controls email delivery"}],correctAnswerId:"A",explanation:"Username identifies the login and must be globally unique; email is a separate delivery/contact field. They can resemble each other without being required to match. Deletion is unavailable and roles do not manage email delivery. Objective CS-03, Topic 2. Review: User lifecycle and licenses.",reviewSection:"User lifecycle and licenses",supportStatus:S}),
  q({ id:"SF-PA-T02-Q09",topicSlug:T,objectiveId:"CS-04", blueprintDomain: "configuration",concept:"Organization trusted IP ranges",difficulty:"medium",type:"configuration-choice",prompt:"Employees on the corporate network should avoid repeated identity-verification challenges, while travel logins may still be allowed after verification. Which control best fits?",answers:[{id:"A",text:"Private organization-wide defaults"},{id:"B",text:"A sharing rule"},{id:"C",text:"Profile login hours"},{id:"D",text:"Organization trusted IP ranges"}],correctAnswerId:"D",explanation:"Organization trusted IP ranges identify known networks and can reduce verification challenges; outside logins can still proceed with identity verification. OWD and sharing govern records, while login hours govern time. Objective CS-04, Topic 2. Review: Login hours and IP controls.",reviewSection:"Login hours and IP controls",supportStatus:S}),
  q({ id:"SF-PA-T02-Q10",topicSlug:T,objectiveId:"CS-04", blueprintDomain: "configuration",concept:"Profile IP restrictions",difficulty:"medium",type:"short-scenario",prompt:"Call-center users must be prevented from logging in outside the company network. Which configuration most directly enforces this for their profile?",answers:[{id:"A",text:"A profile login IP range"},{id:"B",text:"An organization trusted IP range only"},{id:"C",text:"A permission set group"},{id:"D",text:"A public group"}],correctAnswerId:"A",explanation:"A profile login IP range blocks users assigned to that profile when they are outside the allowed range. Trusted IP ranges mainly affect verification challenges; permission set groups and public groups do not define login networks. Objective CS-04, Topic 2. Review: Login hours and IP controls.",reviewSection:"Login hours and IP controls",supportStatus:S}),
  q({ id:"SF-PA-T02-Q11",topicSlug:T,objectiveId:"CS-04", blueprintDomain: "configuration",concept:"Login hours",difficulty:"medium",type:"configuration-choice",prompt:"Support users should be unable to perform Salesforce work overnight and on weekends. Which control is designed for this requirement?",answers:[{id:"A",text:"Business hours"},{id:"B",text:"Profile login hours"},{id:"C",text:"Opportunity sharing rules"},{id:"D",text:"Personal locale"}],correctAnswerId:"B",explanation:"Profile login hours restrict when assigned users can log in and act. Business hours model service operating time, sharing rules grant record visibility, and locale affects presentation. Objective CS-04, Topic 2. Review: Login hours and IP controls.",reviewSection:"Login hours and IP controls",supportStatus:S}),
  q({ id:"SF-PA-T02-Q12",topicSlug:T,objectiveId:"CS-04", blueprintDomain: "configuration",concept:"Login History",difficulty:"medium",type:"troubleshooting",prompt:"Several users report failed logins after a security change. What evidence should the administrator inspect before weakening controls?",answers:[{id:"A",text:"Opportunity history"},{id:"B",text:"Campaign member status"},{id:"C",text:"Login History and recent setup changes"},{id:"D",text:"Dashboard subscriptions"}],correctAnswerId:"C",explanation:"Login History identifies authentication outcomes, while Setup Audit Trail can reveal recent configuration changes. Business records and dashboard subscriptions do not explain login failures. Diagnose with evidence before broadening access. Objective CS-04, Topic 2. Review: Sessions and access troubleshooting.",reviewSection:"Sessions and access troubleshooting",supportStatus:S}),
  q({ id:"SF-PA-T02-Q13",topicSlug:T,objectiveId:"CS-04", blueprintDomain: "configuration",concept:"SSO troubleshooting",difficulty:"medium",type:"troubleshooting",prompt:"An identity provider reports successful authentication, but Salesforce rejects one mapped user. What should be checked before record sharing?",answers:[{id:"A",text:"The user's active/frozen state, mapping, login restrictions, and Login History"},{id:"B",text:"Opportunity organization-wide defaults"},{id:"C",text:"A criteria-based sharing rule"},{id:"D",text:"The corporate currency"}],correctAnswerId:"A",explanation:"The failure occurs at entry, so verify identity mapping, user state, login controls, and evidence. Record sharing matters only after authentication succeeds; corporate currency is unrelated. Objective CS-04, Topic 2. Review: Sessions and access troubleshooting.",reviewSection:"Sessions and access troubleshooting",supportStatus:S}),
  q({ id:"SF-PA-T02-Q14",topicSlug:T,objectiveId:"CS-03", blueprintDomain: "configuration",concept:"Feature license",difficulty:"medium",type:"administrative-decision",prompt:"A user has the correct base user license but needs a separately licensed feature available in the org. What should the administrator evaluate?",answers:[{id:"A",text:"Changing the fiscal year"},{id:"B",text:"Assigning the applicable feature license and permissions"},{id:"C",text:"Making OWD Public Read/Write"},{id:"D",text:"Changing the record owner"}],correctAnswerId:"B",explanation:"Where Salesforce uses a feature license, the user needs that entitlement plus appropriate permissions. OWD and ownership affect records, and fiscal year is unrelated. Objective CS-03, Topic 2. Review: User lifecycle and licenses.",reviewSection:"User lifecycle and licenses",supportStatus:S}),
  q({ id:"SF-PA-T02-Q15",topicSlug:T,objectiveId:"CS-04", blueprintDomain: "configuration",concept:"Session timeout",difficulty:"medium",type:"conceptual",prompt:"Which control primarily governs how long an authenticated session can remain inactive before requiring renewed access?",answers:[{id:"A",text:"Session settings"},{id:"B",text:"Role hierarchy"},{id:"C",text:"Manual sharing"},{id:"D",text:"Record type assignment"}],correctAnswerId:"A",explanation:"Session settings govern behavior after authentication, including timeout policy. Roles and sharing govern record access, while record types influence process and UI choices. Objective CS-04, Topic 2. Review: Sessions and access troubleshooting.",reviewSection:"Sessions and access troubleshooting",supportStatus:S}),
  q({ id:"SF-PA-T02-Q16",topicSlug:T,objectiveId:"CS-03", blueprintDomain: "configuration",concept:"Departure process",difficulty:"hard",type:"best-practice",prompt:"A sales manager leaves today and owns records, scheduled activities, and process responsibilities. Which sequence is most appropriate?",answers:[{id:"A",text:"Delete the user and recreate the records"},{id:"B",text:"Remove the role and leave the user active"},{id:"C",text:"Change the email address only"},{id:"D",text:"Stop login, transfer ownership and responsibilities, resolve dependencies, then deactivate"}],correctAnswerId:"D",explanation:"A controlled offboarding process stops access, preserves history, transfers business responsibilities, resolves dependencies, and completes deactivation. Deletion is unavailable; role or email changes do not stop login or transfer ownership. Objective CS-03, Topic 2. Review: User lifecycle and licenses.",reviewSection:"User lifecycle and licenses",supportStatus:S}),
  q({ id:"SF-PA-T02-Q17",topicSlug:T,objectiveId:"CS-04", blueprintDomain: "configuration",concept:"Authentication versus record access",difficulty:"hard",type:"troubleshooting",prompt:"A user passes MFA and opens Salesforce but receives insufficient-privileges errors only on selected Account records. What is the best next diagnostic step?",answers:[{id:"A",text:"Reset the user's MFA method"},{id:"B",text:"Inspect object permission and record-level sharing in Topic 3"},{id:"C",text:"Change organization trusted IP ranges"},{id:"D",text:"Extend login hours"}],correctAnswerId:"B",explanation:"Authentication succeeded, so repeating MFA or changing entry controls is unlikely to solve selected-record authorization. Verify object permission first, then ownership, OWD, hierarchy, and sharing. Objective CS-04 boundary, Topic 2 leading to Topic 3. Review: Authentication versus authorization.",reviewSection:"Authentication versus authorization",supportStatus:S}),
  q({ id:"SF-PA-T02-Q18",topicSlug:T,objectiveId:"CS-04", blueprintDomain: "configuration",concept:"Trusted versus restricted IP",difficulty:"hard",type:"administrative-decision",prompt:"Executives may log in while traveling after verification, but contractors must never log in outside a fixed network. Which design best matches both requirements?",answers:[{id:"A",text:"Use organization trusted IP ranges for verification context and profile IP restrictions for contractors"},{id:"B",text:"Use one public group for both populations"},{id:"C",text:"Set OWD to Private for every object"},{id:"D",text:"Use business hours as the only network control"}],correctAnswerId:"A",explanation:"Trusted IP ranges and profile IP restrictions solve different problems: verification context versus hard network boundaries. Public groups and OWD control record sharing; business hours are operational schedules. Objective CS-04, Topic 2. Review: Login hours and IP controls.",reviewSection:"Login hours and IP controls",supportStatus:S}),
  q({ id:"SF-PA-T02-Q19",topicSlug:T,objectiveId:"CS-04", blueprintDomain: "agentforce", blueprintDomainRationale: "The prompt explicitly tests identity, entitlement, and least-privilege access for an agent.",concept:"Agent access identity",difficulty:"hard",type:"short-scenario",prompt:"An agent-related identity cannot access an assigned capability after deployment. Which approach best preserves the security model?",answers:[{id:"A",text:"Grant Modify All Data immediately"},{id:"B",text:"Make all relevant objects public"},{id:"C",text:"Verify identity state, license or feature entitlement, and required least-privilege permissions"},{id:"D",text:"Disable MFA for all users"}],correctAnswerId:"C",explanation:"Agent access still relies on valid identity, entitlements, and least-privilege authorization. Broad data access or disabling MFA creates unnecessary risk. Detailed record and Agentforce behavior is handled in later topics. Objective CS-04, Topic 2. Review: Agent access boundary.",reviewSection:"Agent access boundary",supportStatus:S}),
  q({ id:"SF-PA-T02-Q20",topicSlug:T,objectiveId:"CS-04", blueprintDomain: "configuration",concept:"Evidence-led troubleshooting",difficulty:"hard",type:"best-practice",prompt:"After an administrator changes several security controls, remote users report mixed login failures. What is the best first response?",answers:[{id:"A",text:"Remove all IP and MFA controls"},{id:"B",text:"Grant every user a new permission set"},{id:"C",text:"Change sharing defaults to public"},{id:"D",text:"Segment affected users and compare Login History, user state, login method, time, and network policy"}],correctAnswerId:"D",explanation:"Mixed failures require evidence-led isolation by identity state, method, time, and network context. Broadly weakening security or granting permissions does not diagnose authentication. Objective CS-04, Topic 2. Review: Sessions and access troubleshooting.",reviewSection:"Sessions and access troubleshooting",supportStatus:S}),
];
