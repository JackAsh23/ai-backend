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
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            }
        );

        const data = await response.json();

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text 
            || "⚠️ Gemini returned no data.";

        res.json({
            choices: [{
                message: {
                    content: text
                }
            }]
        });

    } catch (err) {
        console.error(err);

        res.json({
            choices: [{
                message: {
                    content: "⚠️ Gemini AI error."
                }
            }]
        });
    }
});