# CyberLaw Atlas — Legal Data Research Workflow & Methodology

This document defines the standardized, 14-step empirical research protocol and evidence verification standards for researching, validating, and ingesting sovereign cyber legislation into **CyberLaw Atlas**.

---

## 1. Core Principles

1. **Accuracy Over Quantity**: Never fabricate, estimate, or hallucinate legislation, citations, authorities, or penalties to hit arbitrary targets.
2. **Provenance & Primary Sources**: Every legal instrument must link directly to an official government repository, official gazette, or verified primary legislative portal.
3. **Hierarchy of Norms**: Recognize the distinct structural hierarchy between:
   - Primary Statutes (Acts of Parliament / Congress)
   - Penal Code Chapters
   - Executive Decrees / Presidential Orders
   - Subordinate Regulations / Statutory Instruments
   - Regulatory Directives / Agency Circulars (e.g., CERT-In directives, FTC guidelines)
   - International Treaties / Conventions (e.g., Budapest Convention on Cybercrime)
4. **Distinguish Database Gaps from Absence of Law**: Missing data in CyberLaw Atlas signifies `"Not yet documented in this database"`, NEVER `"No legislation exists"`.
5. **UNCTAD as Coverage Baseline**: UNCTAD Cyberlaw Tracker serves as a baseline classification and regional benchmark, not as conclusive proof that every instrument has been cataloged.

---

## 2. The 14-Step Research Protocol

When researching a new jurisdiction or updating an existing jurisdiction, researchers must execute the following sequential workflow:

```
 Step 1: Country & ISO Verification
    │
 Step 2: UNCTAD Baseline Evaluation
    │
 Step 3: Official Gazette / National Portal Discovery
    │
 Step 4: Regulatory & Enforcement Authority Mapping
    │
 Step 5: Multi-Instrument Legal Discovery (per Category)
    │
 Step 6: Instrument Disaggregation (No Flat Bundling)
    │
 Step 7: Official Primary Source URL Capture
    │
 Step 8: Issuing & Enforcing Authority Attribution
    │
 Step 9: Enactment, Effective, and Amendment Date Verification
    │
 Step 10: Section-Level Provision & Penalty Extraction
    │
 Step 11: Uncertainty Tagging & Review Flagging
    │
 Step 12: Country Coverage Status Calculation
    │
 Step 13: Automated Quality Validation Script Execution
    │
 Step 14: Final Peer/Researcher Approval
```

### Step-by-Step Instructions

#### Step 1: Confirm Country & ISO Code
- Verify the jurisdiction name and its official **ISO 3166-1 alpha-2** standard code (e.g. `IN`, `US`, `DE`, `SG`).
- Confirm regional classification (Asia-Pacific, Middle East, Europe, Americas, Africa, Oceania).

#### Step 2: Check UNCTAD Baseline Categories
- Review the country’s status in the UNCTAD Cyberlaw Tracker across the 5 baseline pillars:
  1. E-Transactions / E-Commerce
  2. Data Protection & Privacy
  3. Cybercrime
  4. Consumer Protection
  5. Indirect Taxation
- Record UNCTAD's baseline assessment (`Legislation exists`, `Draft legislation`, or `No data`).

#### Step 3: Identify Official Government Legislation Portal
- Identify the sovereign national legislation repository.
- Examples of accepted primary portals:
  - United Kingdom: `legislation.gov.uk`
  - United States: `congress.gov`, `uscode.house.gov`
  - India: `indiacode.nic.in`, `egazette.gov.in`
  - Germany: `gesetze-im-internet.de`
  - France: `legifrance.gouv.fr`
  - Singapore: `sso.agc.gov.sg`
  - European Union: `eur-lex.europa.eu`

#### Step 4: Identify Official Regulators & Cybersecurity Authorities
- Identify statutory supervisory authorities:
  - Cybersecurity Incident Response: CERT / CSIRT (e.g. CERT-In, CISA, BSI, ANSSI, SingCERT).
  - Data Protection Authority: Independent Privacy Commissioner / Data Protection Board (e.g. CNIL, ICO, DPC, ANPD, MeitY).
  - Telecommunications & Media Regulators: FCC, Ofcom, TRAI, IDA/IMDA.

#### Step 5: Find Individual Instruments for Each Category
- Research all applicable instruments per category:
  - Do not stop at the primary Cybercrime Act if computer fraud is also codified in the national Penal Code.
  - Do not stop at the primary Data Protection Act if sector-specific rules govern financial institutions or health data.

#### Step 6: Record Each Instrument Separately
- Disaggregate laws into distinct records:
  - Primary Act $\neq$ Subordinate Regulations issued under that Act.
  - Amendments must link to the parent statute via `parentInstrumentId`.
  - Assign the correct `instrumentType`:
    - `ACT` | `LAW` | `CODE_PROVISION` | `REGULATION` | `RULE` | `DIRECTIVE` | `DECREE` | `AMENDMENT` | `NOTIFICATION` | `SECTOR_REGULATION` | `TREATY` | `FRAMEWORK` | `STRATEGY`

#### Step 7: Record Official Source URL
- Obtain the direct URL to the official statute text or gazette publication.
- Avoid third-party commercial law blogs or generic news articles as the primary URL.

#### Step 8: Record Issuing & Enforcing Authority
- Clearly specify the ministry, agency, or parliamentary body with statutory jurisdiction.

#### Step 9: Record Enactment and Effective Dates
- Record `yearEnacted` and exact `effectiveDate` only when verified directly from the legislative text or gazette enactment clause.

#### Step 10: Extract Provisions Supported by the Source
- Extract discrete provisions into `LegalProvision` records:
  - Article / Section number (e.g. `Section 66`, `Article 83`)
  - Heading / Subject matter
  - Content summary
  - Specific statutory penalties (e.g. `Imprisonment up to 3 years and fine up to 500,000 INR`)
  - Incident notification window (e.g. `6 hours for cybersecurity incidents`, `72 hours for personal data breaches`)

#### Step 11: Mark Uncertain Information for Review
- If an instrument's enforcement date is pending or translations differ:
  - Set `verificationStatus: NEEDS_REVIEW` or `IN_PROGRESS`.
  - Populate `researchNotes` with exact ambiguities.

#### Step 12: Update Country/Category Coverage Status
- Update `CountryCoverage` record:
  - If verified instruments exist: `PARTIALLY_RESEARCHED` or `VERIFIED`.
  - If no instruments have been collected yet: `NOT_RESEARCHED` or `RESEARCH_PENDING`.
  - Set `confidenceLevel`: `LOW`, `MEDIUM`, or `HIGH`.

#### Step 13: Run Validation Checks
- Run the automated test suite:
  ```bash
  npx tsx scripts/validate-legal-data.ts
  ```
- Ensure zero errors and zero unhandled warnings before committing.

#### Step 14: Final Approval & Ingestion
- Ingest the record via the database seeding or ingestion pipeline.

---

## 3. Minimum Evidence Standard for `VERIFIED` Status

A legal instrument may be designated as **`VERIFIED`** in CyberLaw Atlas only when it meets **all** of the following criteria:

| Requirement | Description | Verification Criterion |
|:---|:---|:---|
| **1. Primary Authority** | Reliable official source | Direct link to official gazette, parliamentary repository, or verified government department portal. |
| **2. Formal Title** | Specific statutory title | Official formal name in English or official national language (with transliteration/translation). |
| **3. Jurisdiction Mapping** | Valid sovereign jurisdiction | Correct country name and ISO 3166-1 alpha-2 code. |
| **4. Taxonomy Classification** | Valid legal category | Assigned to one of CyberLaw Atlas's 9 controlled categories. |
| **5. Instrument Type** | Defined legal typology | Classified using controlled `instrumentType` enum. |
| **6. Statutory Provisions** | Factual provisions | Minimum 1 verified provision or article with concrete legal mandate or penalty. |
| **7. Enforcing Body** | Identified regulator | Ministry, judicial authority, or regulatory commission specified. |
| **8. Temporal Verification** | Enactment year | Documented year of enactment or formal assent. |
| **9. Verification Timestamp** | Traceable audit date | Explicit `lastVerifiedDate` timestamp. |

If any of requirements 1, 2, 3, or 4 are missing, the instrument **must not** be marked as `VERIFIED`. It must be classified as `NEEDS_REVIEW` or `UNVERIFIED`.
