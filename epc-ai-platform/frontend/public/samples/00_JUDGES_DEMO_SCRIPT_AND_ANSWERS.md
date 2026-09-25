# NEXUS EPC AI — JUDGES DEMONSTRATION CHEATSHEET & EXPECTED OUTPUTS

This document contains everything you need to deliver a winning demo to the judges, including the exact files to upload, the exact steps to follow, and the exact answers the AI produces.

---

## 📁 Where Are The Sample Files Located?

You can access the sample files in two ways:

1. **Local Folder on Your Computer:**
   `c:\Users\kavimalar\OneDrive\Desktop\nexus_data_centre_epc\sample_demo_files\`
   - `01_Baseline_Spec_UPS_Systems.txt`
   - `02_Vendor_Submittal_UPS_With_Deviations.txt` *(⭐ Star of the Demo)*
   - `03_Vendor_Submittal_Cooling_Compliant.txt`
   - `04_Baseline_Spec_Cooling_Towers.txt`

2. **Direct Browser Links (while localhost:5173 is running):**
   - [http://localhost:5173/samples/01_Baseline_Spec_UPS_Systems.txt](http://localhost:5173/samples/01_Baseline_Spec_UPS_Systems.txt)
   - [http://localhost:5173/samples/02_Vendor_Submittal_UPS_With_Deviations.txt](http://localhost:5173/samples/02_Vendor_Submittal_UPS_With_Deviations.txt)
   - [http://localhost:5173/samples/03_Vendor_Submittal_Cooling_Compliant.txt](http://localhost:5173/samples/03_Vendor_Submittal_Cooling_Compliant.txt)
   - [http://localhost:5173/samples/04_Baseline_Spec_Cooling_Towers.txt](http://localhost:5173/samples/04_Baseline_Spec_Cooling_Towers.txt)

---

## 🎯 DEMO 1: Catching Submittal Deviations (The "Killer Feature")

### Pitch to Judges:
> *"In a billion-dollar data centre project, vendor submittals are hundreds of pages long. If a vendor silently downgrades equipment specs to save costs, human engineers might miss it until installation day, causing months of delays and millions in rework. Watch our AI catch 5 critical deviations in 3 seconds."*

### Steps to Perform:
1. Open the browser to [http://localhost:5173/](http://localhost:5173/)
2. Navigate to **Compliance Agent** in the sidebar.
3. Click **"Upload Submittal"** and select:
   `02_Vendor_Submittal_UPS_With_Deviations.txt`
4. Select the uploaded document in the dropdown and click **"Run Compliance Check"**.

### Exact Answer / Result Judges Will See:
* **Verdict:** `DEVIATION` (Highlighted in Red / Warning badge)
* **Confidence:** `95% - 98%`
* **Summary:** *"Submittal deviates from baseline specification across multiple critical clauses including redundancy architecture, battery autonomy runtime, operating efficiency, environmental cooling separation, and commission testing phases."*
* **Detailed Findings (Side-by-Side Clause Comparison):**
  1. **Clause 3.1 (Redundancy):**
     - *Issue:* Proposed N+1 modular array does not satisfy mandatory 2N concurrently maintainable requirement.
     - *Spec:* Requires 2N redundancy where each module independently supports 100% critical load.
     - *Submittal:* Vendor proposed N+1 redundant modular array.
  2. **Clause 3.2 (Battery Autonomy):**
     - *Issue:* Battery runtime is 10 minutes, failing the 12-minute specification minimum.
     - *Spec:* Minimum 12 minutes full load battery autonomy.
     - *Submittal:* 10 minutes continuous runtime.
  3. **Clause 3.4 (Efficiency):**
     - *Issue:* 95.2% efficiency is below the 96.0% Tier III threshold.
  4. **Clause 3.6 (Dedicated Cooling):**
     - *Issue:* Proposes shared HVAC cooling; spec strictly demands isolated dedicated precision cooling.
  5. **Clause 4.1 (Testing):**
     - *Issue:* Vendor omits 25% and 75% load bank testing stages.
* **Closed-Loop Action:** Shows:
  `→ Auto-generated RFI opened for this deviation (see RFI Copilot)`

---

## 🎯 DEMO 2: Approving a Compliant Submittal

### Pitch to Judges:
> *"Our AI doesn't just reject everything — it validates compliance with international standards like ASHRAE 188."*

### Steps to Perform:
1. Still in **Compliance Agent**, click **"Upload Submittal"** and choose:
   `03_Vendor_Submittal_Cooling_Compliant.txt`
2. Select it and click **"Run Compliance Check"**.

### Exact Answer / Result Judges Will See:
* **Verdict:** `COMPLIANT` (Green Badge)
* **Confidence:** `96%`
* **Summary:** *"Vendor submittal satisfies all baseline requirements for Cooling Towers (Clause 2.1 N+1 redundancy, Clause 2.3 ASHRAE 188 water treatment and Legionella control, and Clause 2.5 5.0°F approach temperature)."*
* **Findings:** Zero deviations detected.

---

## 🎯 DEMO 3: RFI Copilot (RAG Engineering Assistant)

### Pitch to Judges:
> *"Engineers spend up to 40% of their day hunting through PDFs to answer Request For Information (RFI) questions. Our RFI Copilot uses RAG to provide instant, cited answers with document references."*

### Steps to Perform:
1. Click **RFI Copilot** in the left sidebar.
2. In the input box, type or paste any of these sample questions:

#### Sample Question 1:
> *"What are the redundancy and battery autonomy requirements for the UPS system in Block C?"*

#### Exact Answer Judges Will See:
> *"According to Section 26.30 - UPS Specification (Clause 3.1), the UPS system must be configured as **2N redundant**, with each UPS module rated for 100% of the critical IT load independently. Under Clause 3.2, battery autonomy must provide a **minimum of 12 minutes** continuous run time at full rated load before generator transfer."*
> 
> **Sources Cited:**
> `[Source 1] Section 26.30 - UPS Specification Rev C (Clause 3.1, Clause 3.2)`

#### Sample Question 2:
> *"What standard governs water treatment and Legionella prevention for the cooling towers?"*

#### Exact Answer Judges Will See:
> *"Water treatment and Legionella control are governed by **ASHRAE Standard 188**. The cooling tower specification requires automated chemical dosing, biocide injection, and continuous conductivity monitoring to mitigate legionellosis risk."*
> 
> **Sources Cited:**
> `[Source 1] Section 23.10 - Cooling Tower Specification (Clause 2.3)`

---

## 🎯 DEMO 4: Schedule Risk & Supply Chain Intelligence

### Pitch to Judges:
> *"Delays in tier-1 equipment like UPS systems and Switchgears directly impact the critical path. Nexus EPC correlates supply chain tracking with construction schedules."*

### What to Show:
1. **Supply Chain Tab:**
   - Highlights equipment status on an interactive route map.
   - Points out **Medium Voltage Switchgear** marked as `DELAYED`.
   - Points out **UPS Module 2N** currently held in `CUSTOMS`.
   - Displays alternate pre-qualified suppliers (e.g., Vertiv, Schneider Electric) for risk mitigation.
2. **Schedule Risk Tab:**
   - Shows predicted slip on the Critical Path.
   - Visualizes planned vs. forecast finish dates.
   - Provides AI-recommended mitigations (e.g., expedited customs clearance, parallel switchgear testing).
