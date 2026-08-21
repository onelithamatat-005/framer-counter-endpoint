export default async function handler(req, res) {
  // 1. PASTE YOUR GOOGLE SHEET CSV LINK BETWEEN THE QUOTES BELOW:
  const SHEET_CSV_URL = "PASTE_YOUR_PUBLISHED_CSV_LINK_HERE";

  // Set up standard cross-origin headers so Framer can read your endpoint safely
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Content-Type", "application/json");

  try {
    // Fetch the live rows from your Google Sheet
    const response = await fetch(SHEET_CSV_URL);
    if (!response.ok) throw new Error("Sheet unavailable");
    
    const csvText = await response.text();

    // Clean up rows and filter out blank lines
    const rows = csvText.split("\n").filter(row => row.trim() !== "");
    
    // Subtract 1 if your sheet has a header row (like "Name, Email, Timestamp")
    const totalCount = rows.length > 0 ? rows.length - 1 : 0;

    // Send the clean data back to Framer
    return res.status(200).json({ count: totalCount });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
