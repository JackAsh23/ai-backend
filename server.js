const express = require("express");
const cors = require("cors");

const app = express();

// ✅ STRONG CORS FIX
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

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

app.listen(3000, () => console.log("Server running"));