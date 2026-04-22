const express = require("express");
const cors = require("cors");

const app = express();

// ✅ USE CORS LIBRARY (IMPORTANT)
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));

// ✅ HANDLE PREFLIGHT (VERY IMPORTANT)
app.options("*", cors());

app.use(express.json());

// ✅ TEST ROUTE (so /ai won't show Not Found anymore)
app.get("/", (req, res) => {
    res.send("AI Backend is running 🚀");
});

// ✅ AI ROUTE
app.post("/ai", async (req, res) => {

    const { faculty, facility } = req.body;

    const prompt = `
Faculty Issue: ${faculty}
Facility Issue: ${facility}

Give:
1. Faculty recommendation
2. Facility recommendation
3. Overall performance summary
`;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }]
            })
        });

        const data = await response.json();
        res.json(data);

    } catch (err) {
        console.error(err);
        res.json({
            choices: [{
                message: {
                    content: "⚠️ AI temporarily unavailable."
                }
            }]
        });
    }
});

// ✅ PORT FIX (RENDER REQUIREMENT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));