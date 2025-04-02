const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 9876;
const size = 10;

let num = []; // Stores the latest numbers

const retrieve = async (category) => {
    try {
        const { data } = await axios.get(`http://20.244.56.144/numbers/${category}`);
        return data.numbers || [];
    } catch (err) {
        console.error("Failed to fetch numbers:", err.message);
        return [];
    }
};

app.get("/numbers/:category", async (req, res) => {
    const { category } = req.params;
    const categories = ["p", "f", "e", "r"];

    if (!categories.includes(category)) {
        return res.status(400).json({ error: "'p', 'f', 'e', 'r'." });
    }

    const f_num = await retrieve(category);
    const previousNumbers = [...num]; // Copy previous state

    f_num.forEach(n => {
        if (!num.includes(n)) {
            num.push(n);
        }
    });

    // Keep only the last 'size' elements
    if (num.length > size) {
        num = num.slice(-size);
    }

    // Compute the average
    const avg = num.length
        ? (num.reduce((total, n) => total + n, 0) / num.length).toFixed(2)
        : 0;

    res.json({
        WPS: previousNumbers, // Previous numbers before the update
        WCS: num, // Updated number list
        numbers: f_num, // Fetched numbers
        avg: parseFloat(avg) // Average of stored numbers
    });
});

app.listen(PORT, () => {
    console.log(`Server is live at http://localhost:${PORT}`);
});
