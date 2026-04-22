const express = require("express");
const cors = require("cors");

const app = express();

// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json());

// ✅ TEST ROUTE
app.get("/", (req, res) => {
    res.send("Gemini Backend Running 🚀");
});

// ✅ AI ROUTE
app.post("/ai", async (req, res) => {

    const { faculty, facility } = req.body;

    const prompt = `
You are analyzing student survey results.

Faculty Issue: ${faculty || "No major issue detected"}
Facility Issue: ${facility || "No major issue detected"}

Give:
1. Faculty Recommendation
2. Facility Recommendation
3. Overall Performance Summary
`;

    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: prompt }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        console.log("GEMINI RESPONSE:", JSON.stringify(data, null, 2));

        let text = "⚠️ No AI response.";

        if (data.candidates && data.candidates.length > 0) {
            text = data.candidates[0].content?.parts?.[0]?.text || text;
        } else if (data.error) {
            text = "⚠️ Gemini Error: " + data.error.message;
        }

        res.json({
            choices: [{
                message: {
                    content: text
                }
            }]
        });

    } catch (err) {
        console.error("AI ERROR:", err);

        res.json({
            choices: [{
                message: {
                    content: "⚠️ Gemini AI error."
                }
            }]
        });
    }
});

// ✅ PORT (RENDER REQUIRED)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});