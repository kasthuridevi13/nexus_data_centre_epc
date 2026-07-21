async function runGroqTest() {
  console.log("Testing RFI Copilot with Groq Agent...");
  try {
    const res = await fetch("http://localhost:5000/api/rfi/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: "According to the Sample Cooling Memo, what is the required temperature range for the precision cooling units?" })
    });
    
    const data = await res.json();
    console.log("Full response:", data);
  } catch (err) {
    console.error("Test Failed:", err);
  }
}

runGroqTest();
