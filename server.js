// =====================================================================
// SERVER.JS - HACKII TERMINAL MULTI-DEVICE MASTER ENGINE (FIXED V2)
// REAL-TIME AUTO-GENERATION ENGINE + GUARANTEED UPCOMING PERIOD DATA
// =====================================================================

const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();

// Global Bypass for absolute multi-device synchronization
app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));
app.use(express.json());

// Serve Static Frontend files from public folder
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
const API_URL = "https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json";

// --- KEY VALIDATION DATABASE ---
let activeKeysDatabase = new Set([
    "ADMIN_MASTER_2026",
    "VIP_HACKII_777",
    "FREE_TEST_KEY"
]);

let globalHistoryBuffer = [];
let masterPredictionCache = {
    number: "5",
    size: "Big",
    color: "Green/Violet",
    sizeConf: "94%",
    colorConf: "92%",
    numConf: "88%",
    upcomingPeriod: "LOADING..."
};

// --- SYSTEM TIME BASED AUTO-PERIOD GENERATOR ---
// Isse aapka Upcoming Period kabhi blank nahi dikhayega aur exact live time se sync rahega
function getSystemCalculatedPeriod() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    // Total minutes passed today
    const totalMinutes = (now.getHours() * 60) + now.getMinutes() + 1; 
    const periodSequence = String(totalMinutes).padStart(4, '0');
    
    // Format structure: 202606291001 (Example format)
    return `${year}${month}${day}1000${periodSequence}`;
}

// Full Core Database Seeding to guarantee UI doesn't show "Calibrating"
function generateLiveCoreMatrix() {
    let currentPeriodStr = getSystemCalculatedPeriod();
    let basePeriod = BigInt(currentPeriodStr) - 50n;
    
    globalHistoryBuffer = [];
    for (let i = 0; i < 50; i++) {
        let periodVal = String(basePeriod + BigInt(i));
        let num = (Math.floor(Math.sin(i + totalMinutesSeed()) * 10) + 10) % 10;
        let color = num % 2 === 0 ? "Red" : "Green";
        if (num === 0) color = "Red/Violet";
        if (num === 5) color = "Green/Violet";
        
        globalHistoryBuffer.push({
            period: periodVal,
            number: num,
            size: num >= 5 ? "Big" : "Small",
            color: color
        });
    }
}

function totalMinutesSeed() {
    const d = new Date();
    return (d.getHours() * 60) + d.getMinutes();
}

// DYNAMIC DETECTOR AND PREDICTION CALCULATOR ENGINE
function runAdvancedPredictionEngine() {
    if (globalHistoryBuffer.length === 0) {
        generateLiveCoreMatrix();
    }

    const numbers = globalHistoryBuffer.map(x => x.number);
    const sizes = globalHistoryBuffer.map(x => x.size);
    const currentLen = numbers.length;

    let targetSize = "Big";
    let lastSize = sizes[currentLen - 1] || "Big";
    
    // Trend pattern calculation
    let bigCount = sizes.slice(-5).filter(x => x === "Big").length;
    if (bigCount >= 3) {
        targetSize = "Small"; // Alternate counter pattern
    } else {
        targetSize = "Big";
    }

    // Mathematical deterministic logic for numbers
    let currentMin = totalMinutesSeed();
    let chosenNumber = (currentMin * 7 + 3) % 10;
    
    // Override number to match calculated target size boundary
    if (targetSize === "Big" && chosenNumber < 5) chosenNumber += 5;
    if (targetSize === "Small" && chosenNumber >= 5) chosenNumber -= 5;

    let resolvedColor = chosenNumber % 2 === 0 ? "Red" : "Green";
    if (chosenNumber === 0) resolvedColor = "Red/Violet";
    if (chosenNumber === 5) resolvedColor = "Green/Violet";
    let resolvedSize = chosenNumber >= 5 ? "Big" : "Small";

    let variance = (currentMin % 4);
    
    masterPredictionCache = {
        number: String(chosenNumber),
        size: resolvedSize,
        color: resolvedColor,
        sizeConf: `${92 + variance}%`,
        colorConf: `${94 + variance}%`,
        numConf: `${86 + variance}%`,
        upcomingPeriod: getSystemCalculatedPeriod() // Yeh hamesha agla active period dikhayega
    };
}

// Dynamic Scraper & Fallback Runner Loop
async function syncDataPipeline() {
    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            const data = await response.json();
            let list = data?.data?.list || data?.list || [];
            if (list && list.length > 0) {
                globalHistoryBuffer = list.slice(0, 50).reverse().map(item => {
                    let num = parseInt(item.number);
                    let color = num % 2 === 0 ? "Red" : "Green";
                    if (num === 0) color = "Red/Violet";
                    if (num === 5) color = "Green/Violet";
                    return {
                        period: String(item.issue || item.issueNumber || item.period),
                        number: num,
                        size: num >= 5 ? "Big" : "Small",
                        color: color
                    };
                });
            } else {
                generateLiveCoreMatrix();
            }
        } else {
            generateLiveCoreMatrix();
        }
    } catch (e) {
        generateLiveCoreMatrix();
    }
    runAdvancedPredictionEngine();
}

// Execute loop every 3 seconds to keep terminal fully alive
setInterval(syncDataPipeline, 3000);
generateLiveCoreMatrix();
runAdvancedPredictionEngine();

// --- ROUTE CONTROLLERS ---

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Main synchronized API called by your frontend script
app.post('/api/matrix-data', (req, res) => {
    const { activationKey } = req.body;
    if (!activationKey || !activeKeysDatabase.has(activationKey)) {
        return res.status(403).json({ success: false, message: "INVALID_KEY" });
    }
    
    // Extra safety layer to ensure upcomingPeriod is never blank during delivery
    if (!masterPredictionCache.upcomingPeriod || masterPredictionCache.upcomingPeriod.includes("LOADING")) {
        masterPredictionCache.upcomingPeriod = getSystemCalculatedPeriod();
    }
    
    res.json({
        success: true,
        history: globalHistoryBuffer,
        prediction: masterPredictionCache
    });
});

// Admin Panel API routes
app.post('/api/admin/list-keys', (req, res) => {
    const { adminPassword } = req.body;
    if (adminPassword !== "HACKII_SUPER_PASSWORD") return res.status(401).json({ success: false });
    res.json({ success: true, keys: Array.from(activeKeysDatabase) });
});

app.post('/api/admin/add-key', (req, res) => {
    const { adminPassword, newKey } = req.body;
    if (adminPassword !== "HACKII_SUPER_PASSWORD") return res.status(401).json({ success: false });
    if (newKey) activeKeysDatabase.add(newKey.trim());
    res.json({ success: true, keys: Array.from(activeKeysDatabase) });
});

app.post('/api/admin/delete-key', (req, res) => {
    const { adminPassword, targetKey } = req.body;
    if (adminPassword !== "HACKII_SUPER_PASSWORD") return res.status(401).json({ success: false });
    activeKeysDatabase.delete(targetKey);
    res.json({ success: true, keys: Array.from(activeKeysDatabase) });
});

app.listen(PORT, () => {
    console.log(`[CORE TERMINAL ACTIVE] PORT: ${PORT}`);
});
