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

    const { faculty, facility, comments } = req.body;

const prompt = `
You are an academic analytics assistant for a university feedback system.

Your role is to transform survey data into professional, human-like insights.

INPUT:
Faculty Issue: ${faculty}
Facility Issue: ${facility}

Comments:
${comments.join("\n")}

INSTRUCTIONS:
- Always provide meaningful insights, even if no major issues are detected
- Avoid saying "no issue" or "no feedback"
- Use professional and formal tone
- Focus on improvement and recommendations
- Keep responses concise (2–3 sentences per section)

OUTPUT FORMAT:

1. Faculty Insight
Provide a short evaluation and at least one actionable improvement.

2. Facility Insight
Provide a short evaluation and at least one actionable improvement.

3. Overall Summary
Summarize overall performance and suggest improvements.

4. Sentiment Breakdown
Estimate sentiment as:
Positive: X%
Neutral: X%
Negative: X%

Make responses clear, realistic, and helpful.
`;

    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
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