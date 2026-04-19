const API_BASE = "http://localhost:5000/api";

/* ================= CLEAN & FORMAT AI TEXT ================= */
function formatGeminiText(text = "") {
    if (!text) return "";

    text = text.replace(/[`*_>#•→]/g, "");
    text = text.replace(/\b(Step\s*\d+|Important|Note|Solution|Action Required)[:]?/gi, "<h4>$1</h4>");
    text = text.replace(/^[\-\•]\s*(.*)$/gm, "<li>$1</li>");
    text = text.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");
    text = text.replace(/<\/ul>\s*<ul>/g, "");
    text = text.replace(/\n+/g, "<br><br>");

    return text;
}

function cleanTextForVoice(text = "") {
    return text
        .replace(/<[^>]*>/g, "")
        .replace(/[`*_>#•→\-]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

/* ================= POPUP ================= */
function closePopup() {
    document.getElementById("complaintPopup")?.classList.add("hidden");
}

/* ================= VOICE INPUT ================= */
let recognition = null, activeTextarea = null, finalTranscript = "", isListening = false;

function startListening(textareaId) {
    if (!("webkitSpeechRecognition" in window)) {
        alert("Speech recognition not supported");
        return;
    }

    activeTextarea = document.getElementById(textareaId);
    if (!activeTextarea) return;

    finalTranscript = activeTextarea.value || "";

    if (!recognition) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (e) => {
            let interim = "";
            for (let i = e.resultIndex; i < e.results.length; i++) {
                const text = e.results[i][0].transcript;
                if (e.results[i].isFinal) finalTranscript += text + " ";
                else interim += text;
            }
            activeTextarea.value = finalTranscript + interim;
        };

        recognition.onerror = (e) => console.error("Speech error:", e.error);
        recognition.onend = () => isListening = false;
    }

    recognition.lang = document.getElementById("language")?.value || "en-IN";

    if (!isListening) {
        recognition.start();
        isListening = true;
    }
}

function stopListening() {
    if (recognition && isListening) {
        recognition.stop();
        isListening = false;
    }
}

/* ================= VOICE OUTPUT ================= */
function speakText(text) {
    if (!("speechSynthesis" in window)) return;

    speechSynthesis.cancel();

    const selectedLang = document.getElementById("language")?.value || "en-IN";
    const utter = new SpeechSynthesisUtterance(cleanTextForVoice(text));
    utter.lang = selectedLang;

    const setVoice = () => {
        const voices = speechSynthesis.getVoices();
        utter.voice = voices.find(v => v.lang === selectedLang) || voices[0];

        utter.rate = selectedLang.startsWith("ta") || selectedLang.startsWith("hi") ? 0.85 : 0.95;
        utter.pitch = 1;

        speechSynthesis.speak(utter);
    };

    // FIX: voices may not load immediately
    if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.onvoiceschanged = setVoice;
    } else {
        setVoice();
    }
}

function stopSpeech() {
    speechSynthesis.cancel();
}

/* ================= COMMON API ================= */
async function sendRequest(endpoint, payload, title, loadingText) {

    if (endpoint === "complaint") {
        const aiTextarea = document.getElementById("generatedComplaint");
        if (aiTextarea) aiTextarea.value = loadingText;

        document.getElementById("downloadBtn")?.setAttribute("disabled", true);
        document.getElementById("complaintPopup")?.classList.remove("hidden");
    } else {
        showPopup(title, loadingText);
    }

    try {
        const langSelect = document.getElementById("language")?.value || "en-IN";

        const res = await fetch(`${API_BASE}/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...payload, language: langSelect })
        });

        const data = await res.json();

        if (endpoint === "complaint") {
            const aiTextarea = document.getElementById("generatedComplaint");
            if (aiTextarea) {
                aiTextarea.value = (data.result || "").replace(/[`*_>#•→]/g, "");
            }
            document.getElementById("downloadBtn")?.removeAttribute("disabled");
        } else {
            showPopup(title, data.result || "No response");
        }

    } catch (error) {
        console.error(error);

        if (endpoint === "complaint") {
            document.getElementById("generatedComplaint").value = "Error generating complaint";
        } else {
            showPopup("Error", "Something went wrong");
        }
    }
} // ✅ FIXED MISSING BRACKET HERE

/* ================= POPUP FOR OTHER MODULES ================= */
function showPopup(title, content) {
    document.getElementById("popup")?.remove();

    const popup = document.createElement("div");
    popup.id = "popup";
    popup.className = "popup";

    popup.innerHTML = `
        <div class="popup-box">
            <span class="popup-close">×</span>
            <h3>${title}</h3>
            <div class="popup-body ai-output">${formatGeminiText(content || "")}</div>
            <div class="popup-buttons">
                <button id="readBtn">🔊 Read</button>
                <button id="stopReadBtn">⏹ Stop</button>
            </div>
        </div>
    `;

    document.body.appendChild(popup);

    popup.querySelector(".popup-close").onclick = () => {
        stopSpeech();
        popup.remove();
    };

    popup.querySelector("#readBtn").onclick = () => speakText(content);
    popup.querySelector("#stopReadBtn").onclick = stopSpeech;
}

/* ================= MODULE BUTTONS ================= */

document.getElementById("legalBtn")?.addEventListener("click", () => {
    const problem = document.getElementById("problemText")?.value;
    if (!problem) return showPopup("Error", "Enter your problem");

    sendRequest("legal", { problem }, "Legal Guidance", "Analyzing legal options...");
});

document.getElementById("riskBtn")?.addEventListener("click", () => {
    const issue = document.getElementById("riskInput")?.value;
    if (!issue) return showPopup("Error", "Enter issue");

    sendRequest("risk", { issue }, "Risk Analysis", "Analyzing risks...");
});

document.getElementById("complaintBtn")?.addEventListener("click", () => {
    const name = document.getElementById("complainantName")?.value.trim();
    const authority = document.getElementById("complaintTo")?.value.trim();
    const issue = document.getElementById("complaintInput")?.value.trim();

    if (!name || !authority || !issue) return alert("Fill all fields");

    sendRequest("complaint", { name, authority, issue }, "Complaint Letter", "Generating complaint...");
});

document.getElementById("aidBtn")?.addEventListener("click", () => {
    const category = document.getElementById("eligibilityCategory")?.value.trim();
    const state = document.getElementById("stateSelect")?.value.trim();
    const issue = document.getElementById("aidInput")?.value.trim();

    if (!category || !state || !issue)
        return showPopup("Government Aid", "Please fill Category, State, and Problem details.");

    sendRequest("govt", { category, state, issue }, "Government Aid", "Searching government schemes...");
});

document.getElementById("lawyerBtn")?.addEventListener("click", () => {
    const problem = document.getElementById("lawyerInput")?.value;
    const location = document.getElementById("locationInput")?.value;

    if (!problem || !location) return showPopup("Error", "Enter problem and location");

    sendRequest("lawyer", { problem, location }, "Lawyer / NGO", "Finding help...");
});

/* ================= DOWNLOAD COMPLAINT ================= */
function downloadComplaint() {
    const name = document.getElementById("complainantName")?.value.trim();
    const aiText = document.getElementById("generatedComplaint")?.value.trim();

    if (!name || !aiText) {
        alert("No complaint generated.");
        return;
    }

    const finalLetter = `${aiText}\n\nYours sincerely,\n${name}`;
    const blob = new Blob([finalLetter], { type: "text/plain" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Complaint_Letter.txt";

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
}