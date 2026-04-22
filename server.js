const express = require("express");
const cors = require("cors");

const app = express();

// 🔥 SUPER SAFE CORS (handles EVERYTHING)
app.use(cors({
    origin: "*",
}));

// 🔥 IMPORTANT: HANDLE PREFLIGHT
app.options("*", cors());

app.use(express.json());

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
        res.json({
            choices: [{
                message: {
                    content: "AI temporarily unavailable."
                }
            }]
        });
    }
});

app.listen(3000, () => console.log("Server running"));