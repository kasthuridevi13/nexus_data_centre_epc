const sampleText = `
DATA CENTRE COMMISSIONING MEMO
Subject: Additional Guidelines for Cooling Systems
All precision cooling units must maintain temperature within 20C - 25C and humidity between 40% - 60%.
Testing should include full load simulation for 48 hours without interruption.
`;

async function runTest() {
  try {
    console.log("Uploading sample document...");
    const res = await fetch("http://localhost:5000/api/documents/text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Sample Cooling Memo",
        rawText: sampleText,
        type: "specification",
        system: "HVAC"
      })
    });
    const data = await res.json();
    console.log("Upload Success:", data);
  } catch (err) {
    console.error("Upload Failed:", err);
  }
}

runTest();
