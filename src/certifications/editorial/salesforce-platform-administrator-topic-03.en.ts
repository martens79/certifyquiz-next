import type { SalesforceEditorialQuestion } from "./salesforce-editorial-types";

type Topic03Question = SalesforceEditorialQuestion<
  "permissions-record-sharing",
  "CS-05" | "CS-06"
>;

export const SALESFORCE_PLATFORM_ADMIN_TOPIC_03_SOURCES = [
  { title: "Salesforce Certified Platform Administrator Exam Guide", url: "https://help.salesforce.com/s/articleView?id=005298966&type=1&language=en_US", lastVerifiedAt: "2026-08-20", objectiveIds: ["CS-05", "CS-06"] },
  { title: "Data Security — Control Access to Objects", url: "https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_objects", lastVerifiedAt: "2026-08-20", objectiveIds: ["CS-06"] },
  { title: "Data Security — Control Access to Fields", url: "https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_fields", lastVerifiedAt: "2026-08-20", objectiveIds: ["CS-06"] },
  { title: "Data Security — Control Access to Records", url: "https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_records", lastVerifiedAt: "2026-08-20", objectiveIds: ["CS-05"] },
  { title: "Platform Sharing Architecture", url: "https://architect.salesforce.com/docs/architect/fundamentals/guide/platform-sharing-architecture", lastVerifiedAt: "2026-08-20", objectiveIds: ["CS-05", "CS-06"] },
] as const;

export const SALESFORCE_PLATFORM_ADMIN_TOPIC_03_REVIEW = {
  id: "SF-PA-T03-REVIEW-EN",
  language: "en",
  topicSlug: "permissions-record-sharing",
  title: "Permissions and Record Sharing — Exam Review",
  objectiveIds: ["CS-05", "CS-06"],
  blueprintDomains: ["Configuration and Setup", "Data and Analytics Management", "Productivity and Collaboration", "Agentforce"],
  lastVerifiedAt: "2026-08-20",
  sourceUrls: SALESFORCE_PLATFORM_ADMIN_TOPIC_03_SOURCES.map((source) => source.url),
  content: `## Learning objectives

After this review, you should be able to explain why an authenticated user can or cannot perform an action, view a field, or access a record. You should be able to select among profiles, permission sets, permission set groups, muting, organization-wide defaults, role hierarchy, sharing rules, teams, and manual sharing while preserving least privilege.

This topic owns **CS-05** (the Salesforce sharing model) and **CS-06** (profiles, permission sets, permission set groups, and muting). User login and authentication remain in Topic 2.

## Access layers: object, field, and record

Salesforce authorization is layered. A user generally needs access at every applicable layer:

1. **License:** establishes the maximum capability available.
2. **Object permission:** controls whether the user can create, read, edit, or delete records of an object.
3. **Field-level security:** controls whether a field is visible or editable.
4. **Record-level access:** determines which individual records the user can read or edit.

Record sharing cannot compensate for missing object Read permission. A page layout does not provide security: it organizes the interface, while field-level security enforces field visibility across supported access paths. Start troubleshooting at the broadest missing layer and move inward.

## Profiles and permission sets

Every user has one profile. The profile supplies baseline settings, including fundamental permissions and login controls. Permission sets grant additional permissions to selected users without requiring another profile. A user can have multiple permission sets.

Use profiles for a controlled baseline shared by a population. Use permission sets for additive job functions or exceptions. Permission sets do not normally remove permissions already granted elsewhere. Design toward minimum baseline access plus modular permission sets instead of proliferating profiles.

Object permissions such as Read, Create, Edit, and Delete apply to the object. **View All** and **Modify All** on an object are powerful permissions that can override record-level sharing for that object. **View All Data** and **Modify All Data** are broader system permissions. Do not use them as a quick fix for ordinary sharing requirements.

## Permission set groups and muting

A permission set group bundles permission sets for a persona or job function. This improves assignment and lifecycle management. A muting permission set suppresses selected permissions within that group; it does not revoke permissions granted independently by the user's profile, another permission set, or another group.

Decision rule: use a group for a reusable combination, and use muting for a controlled variant of that group. Always evaluate the user's total effective access, not only one assignment.

## Record ownership and organization-wide defaults

Record access begins with ownership and organization-wide defaults (OWD). OWD defines baseline access users have to records they do not own. A common secure design sets the baseline to the most restrictive level that meets broad requirements, then opens access with appropriate mechanisms.

Typical OWD values include Private, Public Read Only, Public Read/Write, and object-specific options such as Controlled by Parent. Changing OWD can trigger sharing recalculation, so evaluate scale and business impact.

Record ownership does not replace object permission. An owner without object Edit permission cannot edit merely because they own the record. Conversely, a user with object Edit permission still needs record-level edit access to edit another user's private record unless a broad permission overrides sharing.

## Role hierarchy

Roles primarily influence record visibility, not job titles or object permissions. Users above another user in the hierarchy can inherit access to records owned by or shared with users below them, subject to Salesforce rules. The hierarchy should represent required data access and does not have to copy the HR organization chart exactly.

For standard objects, hierarchy access is built into the sharing model. For custom objects, **Grant Access Using Hierarchies** can be disabled when the business model requires it. A role does not grant object or field permission by itself.

## Sharing rules, teams, and manual sharing

Sharing rules automatically grant additional record access to defined groups of users. Owner-based rules share records based on who owns them; criteria-based rules share records that meet field criteria. Sharing rules open access; they do not make a permissive OWD more restrictive.

Public groups are reusable collections of users, roles, roles and subordinates, and other groups. They are useful sharing targets but do not directly grant access until a sharing mechanism references them.

Teams provide collaborative access around supported records such as accounts, opportunities, and cases. Manual sharing grants an individual record to a user or group for an exceptional, ad hoc need where supported. Prefer an automatic sharing rule for a repeatable business policy rather than many manual shares.

Folder sharing for reports and dashboards is another access decision: a user may have object and record access but still lack access to the folder containing an analytical asset.

## Troubleshooting effective access

Ask the question in this order:

1. Did the user authenticate? If not, return to Topic 2.
2. Does the license support the capability?
3. Does the user have object permission?
4. Does field-level security expose the required field?
5. Does the user own the record or receive access through OWD?
6. Does hierarchy, a sharing rule, a team, or manual sharing add access?
7. Does a powerful permission such as View All or Modify All bypass normal sharing?
8. For reports or dashboards, does the user also have folder access?

Effective access is cumulative. A permission can come from the profile, any assigned permission set, or any permission set group. Check all sources before concluding that muting or removal worked.

## Least-privilege decision rules

- Set the profile baseline to what the population consistently needs.
- Add job capabilities with permission sets.
- Bundle repeatable personas with permission set groups.
- Use muting only within a group and verify other grant sources.
- Set OWD as restrictive as practical, then open access deliberately.
- Use hierarchy for managerial record access, not object permissions.
- Use sharing rules for repeatable policies; manual sharing for exceptional records.
- Avoid View All, Modify All, View All Data, or Modify All Data unless the role truly requires that breadth.

## Mini-scenarios

**Object versus record:** A user is shared one Opportunity but cannot open it. Check Opportunity Read permission before adding more sharing.

**Field versus layout:** A sensitive field is removed from one page layout but remains visible in reports. Enforce field-level security; page layout alone is not a security boundary.

**Cross-functional team:** Every active strategic Account must be visible to a compliance group. Use a criteria-based sharing rule rather than recurring manual shares.

**Temporary exception:** One specialist needs one supported record for a short investigation. Manual sharing can fit if the need is truly exceptional and revocation is governed.

## Common mistakes and exam traps

- Confusing authentication with authorization.
- Assuming a role grants object permission.
- Assuming sharing grants access when object Read is absent.
- Using page layouts instead of field-level security.
- Trying to restrict access with a sharing rule; sharing rules grant access.
- Assuming muting removes permissions granted outside its group.
- Making OWD broadly permissive to solve one team's requirement.
- Granting View All or Modify All as a troubleshooting shortcut.
- Copying the HR hierarchy without validating data-access needs.
- Using manual sharing for a repeatable organization policy.

## Final checklist

- Can I identify the failing access layer?
- Can I distinguish profile baseline from additive permission sets?
- Can I explain permission set groups and muting?
- Can I distinguish object permission, field security, and record sharing?
- Can I explain ownership, OWD, hierarchy, sharing rules, teams, and manual sharing?
- Can I identify permissions that bypass record sharing?
- Can I design for least privilege and repeatability?
- Can I troubleshoot total effective access across all grant sources?

## Related topics

Return to **Users, Authentication, and Access Foundations** for login, MFA, SSO, user state, and licenses. Continue to **Reports and Dashboards** for analytical folder visibility and to **Agentforce Administration Fundamentals** for agent-specific access and guardrails.
`,
} as const;

const T = "permissions-record-sharing" as const;
const S = "SUPPORTED" as const;
const q = (question: Topic03Question): Topic03Question => question;

export const SALESFORCE_PLATFORM_ADMIN_TOPIC_03_QUIZZES: ReadonlyArray<Topic03Question> = [
q({id:"SF-PA-T03-Q01",topicSlug:T,objectiveId:"CS-06", blueprintDomain: "objects-app-builder", blueprintDomainRationale: "The evaluated competency is access to an object.",concept:"Object permission",difficulty:"easy",type:"conceptual",prompt:"Which access layer determines whether a user can read any records of an object at all?",answers:[{id:"A",text:"Object permission"},{id:"B",text:"Role hierarchy"},{id:"C",text:"Record ownership"},{id:"D",text:"Manual sharing"}],correctAnswerId:"A",explanation:"Object Read permission is required before record-level mechanisms can expose records. Roles, ownership, and manual sharing operate at the record layer and cannot replace missing object access. Objective CS-06, Topic 3. Review: Access layers.",reviewSection:"Access layers: object, field, and record",supportStatus:S}),
  q({id:"SF-PA-T03-Q02",topicSlug:T,objectiveId:"CS-06", blueprintDomain: "objects-app-builder", blueprintDomainRationale: "The evaluated competency is access to fields in the object model.",concept:"Field-level security",difficulty:"easy",type:"conceptual",prompt:"Which control should protect a sensitive field across supported interfaces, reports, and access paths?",answers:[{id:"A",text:"A compact layout"},{id:"B",text:"Field-level security"},{id:"C",text:"A role"},{id:"D",text:"A sharing rule"}],correctAnswerId:"B",explanation:"Field-level security is the security boundary for field visibility and editability. Layouts arrange UI, roles influence records, and sharing rules grant record access. Objective CS-06, Topic 3. Review: Access layers.",reviewSection:"Access layers: object, field, and record",supportStatus:S}),
  q({id:"SF-PA-T03-Q03",topicSlug:T,objectiveId:"CS-06", blueprintDomain: "objects-app-builder", blueprintDomainRationale: "The scenario grants capabilities on an object through declarative access metadata.",concept:"Permission sets",difficulty:"easy",type:"configuration-choice",prompt:"One user needs an additional object permission that most users with the same profile do not need. What is the preferred additive tool?",answers:[{id:"A",text:"A new OWD setting"},{id:"B",text:"A new role hierarchy"},{id:"C",text:"A permission set"},{id:"D",text:"Manual record sharing"}],correctAnswerId:"C",explanation:"A permission set adds selected permissions without creating another profile. OWD, roles, and manual shares manage record visibility, not reusable object-level exceptions. Objective CS-06, Topic 3. Review: Profiles and permission sets.",reviewSection:"Profiles and permission sets",supportStatus:S}),
  q({id:"SF-PA-T03-Q04",topicSlug:T,objectiveId:"CS-06", blueprintDomain: "objects-app-builder", blueprintDomainRationale: "The baseline is evaluated through object and field capability configuration.",concept:"Profile baseline",difficulty:"easy",type:"conceptual",prompt:"How many profiles can be assigned directly to one Salesforce user?",answers:[{id:"A",text:"Any number"},{id:"B",text:"Two"},{id:"C",text:"None when permission sets are used"},{id:"D",text:"One"}],correctAnswerId:"D",explanation:"Each user has one profile, which provides a baseline. The user can also receive multiple permission sets and groups. Confusing profiles with additive permission assignments leads to unnecessary profile proliferation. Objective CS-06, Topic 3. Review: Profiles and permission sets.",reviewSection:"Profiles and permission sets",supportStatus:S}),
  q({id:"SF-PA-T03-Q05",topicSlug:T,objectiveId:"CS-06", blueprintDomain: "objects-app-builder", blueprintDomainRationale: "The question tests grouped declarative permissions applied to the object experience.",concept:"Permission set groups",difficulty:"easy",type:"conceptual",prompt:"What is the main purpose of a permission set group?",answers:[{id:"A",text:"Bundle permission sets for a reusable persona or job function"},{id:"B",text:"Define organization-wide record defaults"},{id:"C",text:"Authenticate users through SSO"},{id:"D",text:"Replace record ownership"}],correctAnswerId:"A",explanation:"Permission set groups package additive permission sets for repeatable assignment. They do not define OWD, authenticate users, or own records. Objective CS-06, Topic 3. Review: Permission set groups and muting.",reviewSection:"Permission set groups and muting",supportStatus:S}),
  q({id:"SF-PA-T03-Q06",topicSlug:T,objectiveId:"CS-06", blueprintDomain: "objects-app-builder", blueprintDomainRationale: "Muting is tested through its effect on declarative object capabilities.",concept:"Muting scope",difficulty:"medium",type:"short-scenario",prompt:"A permission is muted in one permission set group, but the user still has it. What should the administrator check next?",answers:[{id:"A",text:"Whether the OWD is Private"},{id:"B",text:"Whether another profile, permission set, or group grants it"},{id:"C",text:"Whether the user owns a record"},{id:"D",text:"Whether MFA is enabled"}],correctAnswerId:"B",explanation:"Muting suppresses selected permissions within that group; it does not revoke the same permission from independent grant sources. OWD and ownership concern records, and MFA concerns authentication. Objective CS-06, Topic 3. Review: Permission set groups and muting.",reviewSection:"Permission set groups and muting",supportStatus:S}),
  q({id:"SF-PA-T03-Q07",topicSlug:T,objectiveId:"CS-06", blueprintDomain: "objects-app-builder", blueprintDomainRationale: "The competency is the licensed capability ceiling for an object.",concept:"License ceiling",difficulty:"medium",type:"troubleshooting",prompt:"A permission set includes an object capability, but assignment fails because the user's license does not support it. What is the correct conclusion?",answers:[{id:"A",text:"A sharing rule will override the license"},{id:"B",text:"A higher role will override the license"},{id:"C",text:"Permissions cannot exceed the capability supported by the license"},{id:"D",text:"Manual sharing will add the object capability"}],correctAnswerId:"C",explanation:"The license establishes the capability ceiling. Record-sharing tools and hierarchy cannot grant an unsupported product or object capability. Verify license compatibility before permission design. Objective CS-06, Topic 3 with Topic 2 prerequisite. Review: Access layers.",reviewSection:"Access layers: object, field, and record",supportStatus:S}),
  q({id:"SF-PA-T03-Q08",topicSlug:T,objectiveId:"CS-06", blueprintDomain: "objects-app-builder", blueprintDomainRationale: "The question explicitly distinguishes page-layout presentation from field security.",concept:"Page layout versus security",difficulty:"medium",type:"troubleshooting",prompt:"A field removed from a page layout is still visible in a report. Which change addresses the security requirement?",answers:[{id:"A",text:"Move the user to a lower role"},{id:"B",text:"Make OWD Private"},{id:"C",text:"Change the record owner"},{id:"D",text:"Restrict the field with field-level security"}],correctAnswerId:"D",explanation:"Page layouts are presentation controls, not a complete field security boundary. Field-level security governs supported visibility across pages, reports, and other paths. Roles, OWD, and ownership govern records. Objective CS-06, Topic 3. Review: Access layers.",reviewSection:"Access layers: object, field, and record",supportStatus:S}),
  q({id:"SF-PA-T03-Q09",topicSlug:T,objectiveId:"CS-06", blueprintDomain: "objects-app-builder", blueprintDomainRationale: "The scenario designs a least-privilege object capability baseline.",concept:"Least-privilege baseline",difficulty:"medium",type:"best-practice",prompt:"A company has many job-specific permission combinations. Which design best limits profile proliferation?",answers:[{id:"A",text:"Use a minimal profile baseline plus modular permission sets and groups"},{id:"B",text:"Create a profile for every individual"},{id:"C",text:"Grant Modify All Data to all employees"},{id:"D",text:"Make all OWD settings Public Read/Write"}],correctAnswerId:"A",explanation:"A minimum baseline with modular permission sets and groups supports least privilege and maintainable personas. Individual profiles and broad global access create unnecessary risk and complexity. Objective CS-06, Topic 3. Review: Least-privilege decision rules.",reviewSection:"Least-privilege decision rules",supportStatus:S}),
  q({id:"SF-PA-T03-Q10",topicSlug:T,objectiveId:"CS-06", blueprintDomain: "objects-app-builder", blueprintDomainRationale: "Modify All is evaluated as an object-level capability.",concept:"Modify All",difficulty:"medium",type:"administrative-decision",prompt:"An analyst needs to edit a defined subset of Cases owned by another team. Why is granting Modify All on Case usually excessive?",answers:[{id:"A",text:"It only changes page layouts"},{id:"B",text:"It grants broad access across Case records instead of the required subset"},{id:"C",text:"It prevents the user from reading Cases"},{id:"D",text:"It disables the role hierarchy"}],correctAnswerId:"B",explanation:"Modify All on an object bypasses normal record-sharing boundaries for that object, far beyond a defined subset. A targeted sharing mechanism plus appropriate object permission better preserves least privilege. Objective CS-06, Topic 3. Review: Profiles and permission sets.",reviewSection:"Profiles and permission sets",supportStatus:S}),
  q({id:"SF-PA-T03-Q11",topicSlug:T,objectiveId:"CS-05", blueprintDomain: "configuration",concept:"OWD baseline",difficulty:"medium",type:"conceptual",prompt:"What do organization-wide defaults primarily establish?",answers:[{id:"A",text:"The user's authentication method"},{id:"B",text:"Field editability"},{id:"C",text:"Baseline access to records users do not own"},{id:"D",text:"The corporate fiscal year"}],correctAnswerId:"C",explanation:"OWD establishes baseline record access to other users' records. Authentication, fields, and fiscal periods are separate layers. Additional mechanisms can open access from this baseline. Objective CS-05, Topic 3. Review: Record ownership and organization-wide defaults.",reviewSection:"Record ownership and organization-wide defaults",supportStatus:S}),
  q({id:"SF-PA-T03-Q12",topicSlug:T,objectiveId:"CS-05", blueprintDomain: "productivity-collaboration", blueprintDomainRationale: "The question tests collaborative access granted to a working population.",concept:"Sharing grants access",difficulty:"medium",type:"conceptual",prompt:"Which statement about sharing rules is correct?",answers:[{id:"A",text:"They remove permissions granted by profiles"},{id:"B",text:"They make permissive OWD settings more restrictive"},{id:"C",text:"They authenticate users"},{id:"D",text:"They grant additional record access to defined users or groups"}],correctAnswerId:"D",explanation:"Sharing rules open record access beyond the baseline; they do not revoke profile permissions, restrict permissive OWD, or authenticate identities. Objective CS-05, Topic 3. Review: Sharing rules, teams, and manual sharing.",reviewSection:"Sharing rules, teams, and manual sharing",supportStatus:S}),
  q({id:"SF-PA-T03-Q13",topicSlug:T,objectiveId:"CS-05", blueprintDomain: "productivity-collaboration", blueprintDomainRationale: "The hierarchy is evaluated as an organizational collaboration structure.",concept:"Role hierarchy",difficulty:"medium",type:"configuration-choice",prompt:"Managers should inherit access to records owned by their direct reports. Which mechanism is designed for this pattern?",answers:[{id:"A",text:"Role hierarchy"},{id:"B",text:"Field-level security"},{id:"C",text:"MFA"},{id:"D",text:"Fiscal-year settings"}],correctAnswerId:"A",explanation:"The role hierarchy supports upward record access based on data-access relationships. It does not grant field permission, authenticate users, or define fiscal periods. Objective CS-05, Topic 3. Review: Role hierarchy.",reviewSection:"Role hierarchy",supportStatus:S}),
  q({id:"SF-PA-T03-Q14",topicSlug:T,objectiveId:"CS-05", blueprintDomain: "automation", blueprintDomainRationale: "The question tests criteria-driven declarative sharing automation.",concept:"Criteria-based sharing",difficulty:"medium",type:"short-scenario",prompt:"All high-risk Accounts, regardless of owner, must be readable by a compliance public group. Which mechanism best fits?",answers:[{id:"A",text:"An owner-based sharing rule"},{id:"B",text:"A criteria-based sharing rule"},{id:"C",text:"Profile login hours"},{id:"D",text:"A custom fiscal year"}],correctAnswerId:"B",explanation:"The policy depends on a record attribute, not owner, so a criteria-based sharing rule is the repeatable solution. Login hours and fiscal year are unrelated. Objective CS-05, Topic 3. Review: Sharing rules, teams, and manual sharing.",reviewSection:"Sharing rules, teams, and manual sharing",supportStatus:S}),
  q({id:"SF-PA-T03-Q15",topicSlug:T,objectiveId:"CS-05", blueprintDomain: "automation", blueprintDomainRationale: "The question tests owner-driven declarative sharing automation.",concept:"Owner-based sharing",difficulty:"medium",type:"configuration-choice",prompt:"Records owned by the EMEA Sales role must be shared read-only with the Legal group. Which design is most direct?",answers:[{id:"A",text:"A criteria rule based on every possible field value"},{id:"B",text:"A permission set group"},{id:"C",text:"An owner-based sharing rule"},{id:"D",text:"Organization trusted IP ranges"}],correctAnswerId:"C",explanation:"The access policy is based on owner population, so an owner-based sharing rule is direct and maintainable. Permission groups grant permissions, not a selected ownership population; trusted IP ranges concern login. Objective CS-05, Topic 3. Review: Sharing rules, teams, and manual sharing.",reviewSection:"Sharing rules, teams, and manual sharing",supportStatus:S}),
  q({id:"SF-PA-T03-Q16",topicSlug:T,objectiveId:"CS-05", blueprintDomain: "productivity-collaboration", blueprintDomainRationale: "Manual sharing is tested as ad-hoc collaboration on a record.",concept:"Manual sharing",difficulty:"medium",type:"administrative-decision",prompt:"One specialist needs temporary access to one supported record for an exceptional investigation. Which option can be appropriate?",answers:[{id:"A",text:"Change OWD to Public Read/Write"},{id:"B",text:"Grant Modify All Data"},{id:"C",text:"Create a new profile for the record"},{id:"D",text:"Use manual sharing with governed revocation"}],correctAnswerId:"D",explanation:"Manual sharing can fit an exceptional record-specific need. Broad OWD or Modify All changes exceed scope, and profiles do not target one record. Repeatable policies should use automated sharing instead. Objective CS-05, Topic 3. Review: Sharing rules, teams, and manual sharing.",reviewSection:"Sharing rules, teams, and manual sharing",supportStatus:S}),
  q({id:"SF-PA-T03-Q17",topicSlug:T,objectiveId:"CS-05", blueprintDomain: "productivity-collaboration", blueprintDomainRationale: "Public groups are tested as reusable collaboration audiences.",concept:"Public groups",difficulty:"medium",type:"conceptual",prompt:"What does adding users to a public group do by itself?",answers:[{id:"A",text:"Creates a reusable sharing target but grants no record access until referenced"},{id:"B",text:"Grants Modify All Data"},{id:"C",text:"Changes each user's profile"},{id:"D",text:"Authenticates the users"}],correctAnswerId:"A",explanation:"A public group is a reusable collection used by sharing mechanisms. Membership alone is not the share; a rule, manual share, or other supported mechanism must reference it. Objective CS-05, Topic 3. Review: Sharing rules, teams, and manual sharing.",reviewSection:"Sharing rules, teams, and manual sharing",supportStatus:S}),
  q({id:"SF-PA-T03-Q18",topicSlug:T,objectiveId:"CS-05", blueprintDomain: "data-analytics", blueprintDomainRationale: "Folder sharing is tested through report visibility and analytics access.",concept:"Folder sharing",difficulty:"medium",type:"troubleshooting",prompt:"A user can report on Opportunity data but cannot open a dashboard stored in a restricted folder. What should be checked?",answers:[{id:"A",text:"The user's password policy"},{id:"B",text:"Dashboard folder access"},{id:"C",text:"The corporate currency"},{id:"D",text:"The user's fiscal year"}],correctAnswerId:"B",explanation:"Analytical assets have folder-sharing requirements in addition to underlying data access. Password, currency, and fiscal settings do not grant dashboard folder visibility. Objective CS-05, Topic 3. Review: Sharing rules, teams, and manual sharing.",reviewSection:"Sharing rules, teams, and manual sharing",supportStatus:S}),
  q({id:"SF-PA-T03-Q19",topicSlug:T,objectiveId:"CS-05", blueprintDomain: "objects-app-builder", blueprintDomainRationale: "The question tests the intersection of object capability and record access.",concept:"Object and record intersection",difficulty:"hard",type:"troubleshooting",prompt:"A sharing rule grants a user access to selected Opportunities, but the user still cannot open them. What should be verified first?",answers:[{id:"A",text:"Whether the organization uses multicurrency"},{id:"B",text:"Whether the user is above the owner in the role hierarchy"},{id:"C",text:"Whether the user has Opportunity Read permission"},{id:"D",text:"Whether the user has a personal time zone"}],correctAnswerId:"C",explanation:"Sharing grants record access only when the user already has object-level Read permission. Hierarchy could be another record source but does not fix missing object permission; currency and time zone are unrelated. Objective CS-05, Topic 3. Review: Access layers.",reviewSection:"Access layers: object, field, and record",supportStatus:S}),
  q({id:"SF-PA-T03-Q20",topicSlug:T,objectiveId:"CS-05", blueprintDomain: "objects-app-builder", blueprintDomainRationale: "The scenario distinguishes record ownership from object edit capability.",concept:"Ownership versus edit permission",difficulty:"hard",type:"short-scenario",prompt:"A user owns a custom-object record but has Read without Edit on that object. What is the expected result?",answers:[{id:"A",text:"Ownership automatically adds Edit"},{id:"B",text:"The user can edit because OWD is irrelevant to owners"},{id:"C",text:"The role hierarchy adds Edit"},{id:"D",text:"The user can read but cannot edit without object Edit permission"}],correctAnswerId:"D",explanation:"Ownership supplies record access but does not manufacture missing object Edit permission. OWD and hierarchy affect record visibility, while the object permission controls allowed actions. Objective CS-05, Topic 3. Review: Record ownership and organization-wide defaults.",reviewSection:"Record ownership and organization-wide defaults",supportStatus:S}),
  q({id:"SF-PA-T03-Q21",topicSlug:T,objectiveId:"CS-05", blueprintDomain: "configuration",concept:"Restrictive baseline",difficulty:"hard",type:"best-practice",prompt:"Only a defined cross-functional group should see confidential records, while most users should not. Which design best follows least privilege?",answers:[{id:"A",text:"Use restrictive OWD and grant the group access with a targeted sharing mechanism"},{id:"B",text:"Use Public Read/Write OWD and ask users not to open records"},{id:"C",text:"Grant View All Data to the group and all managers"},{id:"D",text:"Hide the navigation tab only"}],correctAnswerId:"A",explanation:"A restrictive baseline plus deliberate sharing provides scoped, enforceable access. Broad OWD, View All Data, or UI hiding exceed or fail the security requirement. Objective CS-05, Topic 3. Review: Least-privilege decision rules.",reviewSection:"Least-privilege decision rules",supportStatus:S}),
  q({id:"SF-PA-T03-Q22",topicSlug:T,objectiveId:"CS-05", blueprintDomain: "productivity-collaboration", blueprintDomainRationale: "The hierarchy design is evaluated against organizational collaboration needs.",concept:"Hierarchy design",difficulty:"hard",type:"administrative-decision",prompt:"The HR org chart gives a project lead no managerial need to see team records, but the proposed Salesforce role places the lead above all members. What should guide the role design?",answers:[{id:"A",text:"Copy the HR chart exactly"},{id:"B",text:"Model required record-access relationships, not titles alone"},{id:"C",text:"Give every user the same role"},{id:"D",text:"Replace roles with MFA"}],correctAnswerId:"B",explanation:"The Salesforce role hierarchy represents needed record access and need not mirror reporting titles exactly. One role for all users loses access structure, and MFA is authentication. Objective CS-05, Topic 3. Review: Role hierarchy.",reviewSection:"Role hierarchy",supportStatus:S}),
  q({id:"SF-PA-T03-Q23",topicSlug:T,objectiveId:"CS-06", blueprintDomain: "objects-app-builder", blueprintDomainRationale: "Effective access is evaluated across declarative object permission layers.",concept:"Effective access",difficulty:"hard",type:"troubleshooting",prompt:"An administrator removes Edit from one permission set, but the user can still edit the object. What is the best next step?",answers:[{id:"A",text:"Make OWD Private"},{id:"B",text:"Freeze the user"},{id:"C",text:"Inspect the profile, other permission sets, groups, and broad permissions for another grant"},{id:"D",text:"Change the record owner"}],correctAnswerId:"C",explanation:"Effective object permission is cumulative across the profile and all permission assignments. OWD and ownership govern records, while freezing blocks login rather than explaining the grant. Objective CS-06, Topic 3. Review: Troubleshooting effective access.",reviewSection:"Troubleshooting effective access",supportStatus:S}),
  q({id:"SF-PA-T03-Q24",topicSlug:T,objectiveId:"CS-05", blueprintDomain: "productivity-collaboration", blueprintDomainRationale: "The competency is selecting repeatable versus ad-hoc collaboration access.",concept:"Repeatable versus ad hoc sharing",difficulty:"hard",type:"best-practice",prompt:"Administrators manually share hundreds of records each month using the same business condition. What is the best improvement?",answers:[{id:"A",text:"Make the object Public Read/Write"},{id:"B",text:"Grant Modify All to the recipients"},{id:"C",text:"Create separate profiles for each record"},{id:"D",text:"Replace recurring manual work with an appropriate criteria- or owner-based sharing rule"}],correctAnswerId:"D",explanation:"A repeatable business policy belongs in an automatic sharing rule. Public OWD and Modify All grant excessive access; profiles cannot target individual record populations. Objective CS-05, Topic 3. Review: Sharing rules, teams, and manual sharing.",reviewSection:"Sharing rules, teams, and manual sharing",supportStatus:S}),
];
