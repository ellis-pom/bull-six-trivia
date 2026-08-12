// CS-06 Bull Six Flight Trivia — standalone site
// No API keys, no live AI calls. Everything runs from the local question bank +
// this browser's storage. New "current" questions (news/pop culture) get added
// by pasting in a batch generated in a separate Claude chat — see the Bank tab.

const { useState, useEffect, useCallback, useRef, useLayoutEffect } = React;
const h = React.createElement;

/* ---------- constants (logo + bank injected below) ---------- */
const LOGO_DATA_URI = "data:image/jpeg;base64,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";

const QUESTION_BANK = [
  { id: "ff1", category: "Fun Facts", difficulty: 3, question: "What is the only food that never spoils?", answer: "Honey" },
  { id: "ff2", category: "Fun Facts", difficulty: 4, question: "How many hearts does an octopus have?", answer: "Three" },
  { id: "ff3", category: "Fun Facts", difficulty: 3, question: "What is the tallest species of penguin?", answer: "The emperor penguin" },
  { id: "ff4", category: "Fun Facts", difficulty: 5, question: "What color is a polar bear's skin underneath its fur?", answer: "Black" },
  { id: "ff5", category: "Fun Facts", difficulty: 5, question: "What is the collective noun for a group of crows?", answer: "A murder" },
  { id: "ff6", category: "Fun Facts", difficulty: 3, question: "How many bones are in the adult human body?", answer: "206" },
  { id: "ff7", category: "Fun Facts", difficulty: 6, question: "What is the largest desert in the world by area (including polar deserts)?", answer: "Antarctica" },
  { id: "ff8", category: "Fun Facts", difficulty: 7, question: "Which mammal has the longest lifespan?", answer: "The bowhead whale" },
  { id: "ff9", category: "Fun Facts", difficulty: 1, question: "What is the fastest land animal?", answer: "The cheetah" },
  { id: "ff10", category: "Fun Facts", difficulty: 7, question: "What popular children's toy was originally invented as a wallpaper cleaner?", answer: "Play-Doh" },
  { id: "sc1", category: "Science", difficulty: 3, question: "What gas makes up about 78% of Earth's atmosphere?", answer: "Nitrogen" },
  { id: "sc2", category: "Science", difficulty: 2, question: "What is the chemical symbol for gold?", answer: "Au" },
  { id: "sc3", category: "Science", difficulty: 1, question: "What organelle is known as the powerhouse of the cell?", answer: "The mitochondria" },
  { id: "sc4", category: "Science", difficulty: 1, question: "What force keeps planets in orbit around the sun?", answer: "Gravity" },
  { id: "sc5", category: "Science", difficulty: 2, question: "What is the hardest naturally occurring substance on Earth?", answer: "Diamond" },
  { id: "sc6", category: "Science", difficulty: 2, question: "What type of blood cell is primarily responsible for fighting infection?", answer: "White blood cells" },
  { id: "sc7", category: "Science", difficulty: 5, question: "Roughly how fast does light travel in a vacuum, in miles per second?", answer: "About 186,000 miles per second" },
  { id: "sc8", category: "Science", difficulty: 3, question: "What subatomic particle carries a negative electric charge?", answer: "The electron" },
  { id: "sc9", category: "Science", difficulty: 2, question: "What is the process by which plants convert sunlight into energy called?", answer: "Photosynthesis" },
  { id: "sc10", category: "Science", difficulty: 6, question: "What is the SI unit of electrical resistance?", answer: "The ohm" },
  { id: "mt1", category: "Math", difficulty: 2, question: "What is the value of pi rounded to two decimal places?", answer: "3.14" },
  { id: "mt2", category: "Math", difficulty: 1, question: "What do you call a triangle with all three sides equal?", answer: "Equilateral" },
  { id: "mt3", category: "Math", difficulty: 2, question: "What is the square root of 144?", answer: "12" },
  { id: "mt4", category: "Math", difficulty: 3, question: "What is the next prime number after 7?", answer: "11" },
  { id: "mt5", category: "Math", difficulty: 3, question: "What is the sum of the interior angles of a quadrilateral, in degrees?", answer: "360 degrees" },
  { id: "mt6", category: "Math", difficulty: 2, question: "In a right triangle, what is the longest side called?", answer: "The hypotenuse" },
  { id: "mt7", category: "Math", difficulty: 3, question: "What is 15% of 200?", answer: "30" },
  { id: "mt8", category: "Math", difficulty: 1, question: "What do you call a number that can only be divided evenly by 1 and itself?", answer: "A prime number" },
  { id: "mt9", category: "Math", difficulty: 6, question: "The mathematical constant e is approximately equal to what value?", answer: "2.718" },
  { id: "mt10", category: "Math", difficulty: 1, question: "How many degrees are in a full circle?", answer: "360" },
  { id: "hs1", category: "History", difficulty: 1, question: "Who was the first person to walk on the Moon?", answer: "Neil Armstrong" },
  { id: "hs2", category: "History", difficulty: 3, question: "In what year did the Titanic sink?", answer: "1912" },
  { id: "hs3", category: "History", difficulty: 2, question: "Which ancient wonder of the world was located in Giza, Egypt?", answer: "The Great Pyramid of Giza" },
  { id: "hs4", category: "History", difficulty: 1, question: "What year did the United States declare independence?", answer: "1776" },
  { id: "hs5", category: "History", difficulty: 3, question: "Who was the first female Prime Minister of the United Kingdom?", answer: "Margaret Thatcher" },
  { id: "hs6", category: "History", difficulty: 1, question: "What war was fought between the North and South United States from 1861 to 1865?", answer: "The American Civil War" },
  { id: "hs7", category: "History", difficulty: 5, question: "Which explorer's expedition completed the first circumnavigation of the globe, though he died partway through the voyage?", answer: "Ferdinand Magellan" },
  { id: "hs8", category: "History", difficulty: 1, question: "Which U.S. president is depicted on the one-dollar bill?", answer: "George Washington" },
  { id: "hs9", category: "History", difficulty: 3, question: "What year did World War I begin?", answer: "1914" },
  { id: "hs10", category: "History", difficulty: 2, question: "Who is credited as the primary author of the Declaration of Independence?", answer: "Thomas Jefferson" },
  { id: "wc1", category: "Wildcard", difficulty: 5, question: "What is the most spoken language in the world counting both native and non-native speakers?", answer: "English" },
  { id: "wc2", category: "Wildcard", difficulty: 2, question: "What musical instrument has 88 keys?", answer: "The piano" },
  { id: "wc3", category: "Wildcard", difficulty: 4, question: "What is the capital city of Australia (it's not Sydney)?", answer: "Canberra" },
  { id: "wc4", category: "Wildcard", difficulty: 1, question: "What is the largest ocean on Earth?", answer: "The Pacific Ocean" },
  { id: "wc5", category: "Wildcard", difficulty: 2, question: "How many squares are on a standard chess board?", answer: "64" },
  { id: "wc6", category: "Wildcard", difficulty: 2, question: "What currency is used in Japan?", answer: "The yen" },
  { id: "wc7", category: "Wildcard", difficulty: 3, question: "What is the smallest country in the world by area?", answer: "Vatican City" },
  { id: "wc8", category: "Wildcard", difficulty: 2, question: "How many players does a standard soccer team have on the field at once?", answer: "11" },
  { id: "wc9", category: "Wildcard", difficulty: 4, question: "What is the longest-running animated sitcom on U.S. television?", answer: "The Simpsons" },
  { id: "wc10", category: "Wildcard", difficulty: 1, question: "Which planet is best known for its prominent, easily visible ring system?", answer: "Saturn" },
];

const CATEGORIES = ["Current News", "Pop Culture", "Fun Facts", "Science", "Math", "History", "Wildcard"];

// Fixed round template — position in the array = position in the round.
// 1: world news (forced easy/popular, see EASY_CATEGORIES below)
// 2-4: pop culture
// 5-8: science / math / history
// 9: fun fact
// 10: wildcard
const ROUND_TEMPLATE = [
  "Current News",
  "Pop Culture", "Pop Culture", "Pop Culture",
  "Science", "Science", "Math", "History",
  "Fun Facts",
  "Wildcard",
];

// Categories that should always be biased toward the EASY end regardless of the
// difficulty slider — right now just world news, which you asked to keep "easy
// and popular" no matter what.
const FORCE_EASY_CATEGORIES = { "Current News": 2 };

const LS_KEYS = {
  log: "bull6-question-log",
  customBank: "bull6-custom-bank",
  teams: "bull6-team-scores",
  lockedRounds: "bull6-locked-rounds",
};

function lsGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function lsSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage error:", e);
  }
}

function diffColor(d) {
  if (d <= 3) return { bg: "#1F3D2E", fg: "#7FD99A", label: "EASY" };
  if (d <= 6) return { bg: "#3D3316", fg: "#E8B84B", label: "MEDIUM" };
  return { bg: "#3D1F1F", fg: "#E87D7D", label: "HARD" };
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function makeQid() {
  return "q-" + Date.now() + "-" + Math.random().toString(36).slice(2, 9);
}

const IMPORT_SCHEMA_EXAMPLE = `[
  {"question": "Which country won the 2026 World Cup?", "answer": "Spain", "category": "Current News", "difficulty": 4},
  {"question": "Who won Album of the Year at the 2026 Grammys?", "answer": "Bad Bunny", "category": "Pop Culture", "difficulty": 5}
]`;

const CHAT_PROMPT = `Give me 50 new trivia questions for this month's Bull Six lunch trivia, matching this exact per-round template (positions 1-10): 1 world news (must be EASY and widely known — big, popular headlines only, nothing obscure — difficulty 1-3), 3 pop culture (mainstream/recognizable — blockbuster movies, chart-topping music, major awards, huge celebrities, popular sports — skip obscure industry-insider stuff, difficulty 1-5 mostly), 4 across science/math/history (roughly 2 science, 1 math, 1 history, difficulty 1-8), 1 fun fact (difficulty 1-8), 1 wildcard/anything-goes (difficulty 1-8). Scale that template up to 50 total questions in the same proportions (~5 easy/popular world news, ~15 pop culture, ~20 science/math/history, ~5 fun facts, ~5 wildcard). Return ONLY a raw JSON array, no markdown fences, no prose, of objects shaped exactly like this: [{"question": "...", "answer": "...", "category": "one of: Current News, Pop Culture, Fun Facts, Science, Math, History, Wildcard", "difficulty": 1-10 integer}]. Keep questions under 30 words and answers under 12 words.`;

function pickBankEntry(fullBank, usedIds, category, taken, target) {
  const pool = fullBank.filter((b) => b.category === category && !usedIds.has(b.id) && !taken.has(b.id));
  const fallbackPool = pool.length ? pool : fullBank.filter((b) => !usedIds.has(b.id) && !taken.has(b.id));
  if (!fallbackPool.length) return null;
  const sorted = [...fallbackPool].sort((a, b) => Math.abs(a.difficulty - target) - Math.abs(b.difficulty - target));
  const closestN = sorted.slice(0, Math.max(1, Math.min(3, sorted.length)));
  return closestN[Math.floor(Math.random() * closestN.length)];
}

function normalizeQ(entry, qid) {
  return {
    qid: qid || makeQid(),
    question: entry.question,
    answer: entry.answer,
    category: CATEGORIES.includes(entry.category) ? entry.category : "Wildcard",
    difficulty: Math.min(10, Math.max(1, Number(entry.difficulty) || 5)),
    bankId: entry.id,
    liked: null,
  };
}

function App() {
  const [tab, setTab] = useState("generate");
  const [log, setLog] = useState(() => lsGet(LS_KEYS.log, []));
  const [customBank, setCustomBank] = useState(() => lsGet(LS_KEYS.customBank, []));
  const [lockedRounds, setLockedRounds] = useState(() => lsGet(LS_KEYS.lockedRounds, []));
  const [teams, setTeams] = useState(() => lsGet(LS_KEYS.teams, {}));
  const [round, setRound] = useState(null);
  const [difficultyTarget, setDifficultyTarget] = useState(4);
  const [revealed, setRevealed] = useState({});
  const [draggedQid, setDraggedQid] = useState(null);
  const [resetArmed, setResetArmed] = useState(false);
  const [resetScoresArmed, setResetScoresArmed] = useState(false);
  const [teamNameInput, setTeamNameInput] = useState("");
  const [teamScoreInput, setTeamScoreInput] = useState("");
  const [expandedTeam, setExpandedTeam] = useState(null);
  const [logOpenRound, setLogOpenRound] = useState(null);
  const [importText, setImportText] = useState("");
  const [importMsg, setImportMsg] = useState(null);
  const [importErr, setImportErr] = useState(null);
  const [promptCopied, setPromptCopied] = useState(false);

  const persistLog = useCallback((next) => { setLog(next); lsSet(LS_KEYS.log, next); }, []);
  const persistCustomBank = useCallback((next) => { setCustomBank(next); lsSet(LS_KEYS.customBank, next); }, []);
  const persistTeams = useCallback((next) => { setTeams(next); lsSet(LS_KEYS.teams, next); }, []);
  const persistLockedRounds = useCallback((next) => { setLockedRounds(next); lsSet(LS_KEYS.lockedRounds, next); }, []);

  function fullBank() { return [...QUESTION_BANK, ...customBank]; }
  function usedBankIds() { return new Set(log.filter((q) => q.bankId).map((q) => q.bankId)); }

  function biasTargetFor(category) {
    return FORCE_EASY_CATEGORIES.hasOwnProperty(category) ? FORCE_EASY_CATEGORIES[category] : difficultyTarget;
  }

  function generateRound() {
    const taken = new Set();
    const picked = [];
    ROUND_TEMPLATE.forEach((category) => {
      const entry = pickBankEntry(fullBank(), usedBankIds(), category, taken, biasTargetFor(category));
      if (entry) { taken.add(entry.id); picked.push(entry); }
    });
    const normalized = picked.map((e) => normalizeQ(e));
    const roundId = Date.now();
    const date = todayStr();
    setRound({ id: roundId, date, questions: normalized, locked: false });
    setRevealed({});
    persistLog([...log, ...normalized.map((q) => ({ ...q, roundId, date }))]);
  }

  function swapQuestion(qid) {
    if (!round) return;
    const beingReplaced = round.questions.find((q) => q.qid === qid);
    if (!beingReplaced) return;
    const taken = new Set(round.questions.map((q) => q.bankId).filter(Boolean));
    const entry = pickBankEntry(fullBank(), usedBankIds(), beingReplaced.category, taken, biasTargetFor(beingReplaced.category));
    if (!entry) { alert(`Bank is out of fresh "${beingReplaced.category}" questions.`); return; }
    const replacement = normalizeQ(entry, qid);
    const nextQuestions = round.questions.map((q) => (q.qid === qid ? replacement : q));
    setRound({ ...round, questions: nextQuestions });
    setRevealed((r) => ({ ...r, [qid]: false }));
    persistLog(log.map((entry2) =>
      entry2.roundId === round.id && entry2.qid === qid ? { ...replacement, roundId: round.id, date: round.date } : entry2
    ));
  }

  function rateQuestion(qid, liked) {
    if (!round) return;
    const nextQuestions = round.questions.map((q) => (q.qid === qid ? { ...q, liked } : q));
    setRound({ ...round, questions: nextQuestions });
    persistLog(log.map((entry) =>
      entry.roundId === round.id && entry.qid === qid ? { ...entry, liked } : entry
    ));
    if (liked === false) swapQuestion(qid);
  }

  function reorderQuestions(dragQid, dropQid) {
    if (!round || dragQid === dropQid) return;
    const qs = [...round.questions];
    const from = qs.findIndex((q) => q.qid === dragQid);
    const to = qs.findIndex((q) => q.qid === dropQid);
    if (from === -1 || to === -1) return;
    const [item] = qs.splice(from, 1);
    qs.splice(to, 0, item);
    setRound({ ...round, questions: qs });
  }

  function lockRound() {
    if (!round) return;
    const nextRound = { ...round, locked: true };
    setRound(nextRound);
    persistLockedRounds([...lockedRounds, nextRound]);
  }

  function resetAllPreviousQuestions() {
    if (!resetArmed) { setResetArmed(true); return; }
    persistLog([]);
    setResetArmed(false);
  }

  function resetAllScores() {
    if (!resetScoresArmed) { setResetScoresArmed(true); return; }
    persistTeams({});
    setResetScoresArmed(false);
  }

  function addTeamScore() {
    const name = teamNameInput.trim();
    const score = Number(teamScoreInput);
    if (!name || Number.isNaN(score) || score < 0 || score > 10) return;
    const existing = teams[name] || [];
    persistTeams({ ...teams, [name]: [...existing, { date: todayStr(), score }] });
    setTeamNameInput("");
    setTeamScoreInput("");
  }

  function importQuestions() {
    setImportErr(null);
    setImportMsg(null);
    let parsed;
    try {
      parsed = JSON.parse(importText.trim());
    } catch (e) {
      setImportErr("That's not valid JSON. Paste exactly what the chat gave you, starting with [ and ending with ].");
      return;
    }
    if (!Array.isArray(parsed) || parsed.length === 0) {
      setImportErr("Expected a JSON array of question objects.");
      return;
    }
    const stamp = Date.now();
    const valid = [];
    const problems = [];
    parsed.forEach((q, i) => {
      if (!q || typeof q.question !== "string" || typeof q.answer !== "string") {
        problems.push(`#${i + 1}: missing question/answer`);
        return;
      }
      valid.push({
        id: `custom-${stamp}-${i}`,
        category: CATEGORIES.includes(q.category) ? q.category : "Wildcard",
        difficulty: Math.min(10, Math.max(1, Number(q.difficulty) || 5)),
        question: q.question,
        answer: q.answer,
      });
    });
    if (!valid.length) {
      setImportErr("Nothing usable in that batch. " + problems.join("; "));
      return;
    }
    persistCustomBank([...customBank, ...valid]);
    setImportMsg(`Added ${valid.length} question${valid.length !== 1 ? "s" : ""} to the bank.` + (problems.length ? ` (${problems.length} skipped — bad format)` : ""));
    setImportText("");
  }

  function copyPrompt() {
    navigator.clipboard.writeText(CHAT_PROMPT).then(() => {
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 2000);
    }).catch(() => {});
  }

  const rounds = {};
  log.forEach((q) => {
    if (!rounds[q.roundId]) rounds[q.roundId] = { date: q.date, questions: [] };
    rounds[q.roundId].questions.push(q);
  });
  const roundIds = Object.keys(rounds).sort((a, b) => b - a);

  const leaderboard = Object.entries(teams)
    .map(([name, entries]) => {
      const total = entries.reduce((s, e) => s + e.score, 0);
      const avg = entries.length ? total / entries.length : 0;
      return { name, entries, total, avg, weeks: entries.length };
    })
    .sort((a, b) => b.total - a.total);

  const predictedAvg = round
    ? Math.round((round.questions.reduce((s, q) => s + (11 - q.difficulty), 0) / round.questions.length) * 10) / 10
    : null;

  return renderApp({
    tab, setTab, round, difficultyTarget, setDifficultyTarget, revealed, setRevealed,
    draggedQid, setDraggedQid, resetArmed, resetScoresArmed, teamNameInput, setTeamNameInput,
    teamScoreInput, setTeamScoreInput, expandedTeam, setExpandedTeam, logOpenRound, setLogOpenRound,
    importText, setImportText, importMsg, importErr, promptCopied,
    generateRound, swapQuestion, rateQuestion, reorderQuestions, lockRound,
    resetAllPreviousQuestions, resetAllScores, addTeamScore, importQuestions, copyPrompt,
    log, customBank, lockedRounds, leaderboard, rounds, roundIds, predictedAvg,
  });
}

/* ---------- rendering ---------- */

function renderApp(s) {
  const tabs = [
    { id: "generate", label: "Generate" },
    { id: "teams", label: "Team Scores" },
    { id: "log", label: "Question Log" },
    { id: "bank", label: "Bank" },
    { id: "print", label: "Print Sheet" },
  ];

  return h("div", { style: { fontFamily: "'Inter', sans-serif", background: "#0B1220", minHeight: "100vh", color: "#E8EAED" } },
    h("style", null, `
      @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');
      .osw { font-family: 'Oswald', sans-serif; text-transform: uppercase; letter-spacing: 0.04em; }
      .mono { font-family: 'JetBrains Mono', monospace; }
      ::selection { background: #E8A33D; color: #0B1220; }
      @keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
    `),
    // Header
    h("div", { style: { borderBottom: "1px solid #1E2A3D", padding: "28px 24px 20px" } },
      h("div", { style: { maxWidth: 920, margin: "0 auto", display: "flex", alignItems: "center", gap: 14 } },
        h("div", { style: { width: 42, height: 42, borderRadius: 4, background: "#1B2A44", border: "1px solid #2C4870", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } },
          h("img", { src: LOGO_DATA_URI, alt: "logo", style: { width: 30, height: 30, borderRadius: 3 } })
        ),
        h("div", null,
          h("div", { className: "osw", style: { fontSize: 22, fontWeight: 700, color: "#F0EDE4", lineHeight: 1 } }, "CS-06 Flight Trivia"),
          h("div", { className: "mono", style: { fontSize: 12, color: "#6B7C99", marginTop: 4 } }, "WEEKLY LUNCH BRIEFING · NO API KEY · RUNS FROM LOCAL BANK")
        )
      )
    ),
    // Tabs
    h("div", { style: { maxWidth: 920, margin: "0 auto", padding: "18px 24px 0", display: "flex", gap: 8, flexWrap: "wrap" } },
      tabs.map((t) => {
        const active = s.tab === t.id;
        return h("button", {
          key: t.id,
          className: "osw",
          onClick: () => s.setTab(t.id),
          style: {
            padding: "10px 16px", borderRadius: 6,
            border: active ? "1px solid #E8A33D" : "1px solid #1E2A3D",
            background: active ? "#1B2A44" : "transparent",
            color: active ? "#E8A33D" : "#8A99B3",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
          },
        }, t.label);
      })
    ),
    h("div", { style: { maxWidth: 920, margin: "0 auto", padding: 24 } },
      s.tab === "generate" && renderGenerateTab(s),
      s.tab === "teams" && renderTeamsTab(s),
      s.tab === "log" && renderLogTab(s),
      s.tab === "bank" && renderBankTab(s),
      s.tab === "print" && h(PrintSheetTab, { lockedRounds: s.lockedRounds, leaderboard: s.leaderboard })
    )
  );
}

function renderGenerateTab(s) {
  const round = s.round;
  return h("div", null,
    h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 } },
      h("div", null,
        h("div", { className: "osw", style: { fontSize: 15, color: "#8A99B3", fontWeight: 600 } }, "This Week's Round"),
        round && h("div", { className: "mono", style: { fontSize: 12, color: "#6B7C99", marginTop: 2 } }, `Predicted team average: ${s.predictedAvg}/10`)
      ),
      h("button", {
        className: "osw", onClick: s.generateRound,
        style: { display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 6, border: "1px solid #E8A33D", background: "#E8A33D", color: "#0B1220", fontWeight: 700, fontSize: 13, cursor: "pointer" },
      }, round ? "Generate New Round" : "Generate Round")
    ),
    h("div", { style: { border: "1px solid #1E2A3D", borderRadius: 8, padding: "14px 16px", background: "#0F1928", marginBottom: 20 } },
      h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } },
        h("span", { className: "osw", style: { fontSize: 12, color: "#8A99B3", fontWeight: 700 } }, "Difficulty Target"),
        h("span", { className: "mono", style: { fontSize: 13, color: "#E8A33D", fontWeight: 700 } }, `${s.difficultyTarget}/10`)
      ),
      h("input", {
        type: "range", min: "1", max: "10", value: s.difficultyTarget,
        onChange: (e) => s.setDifficultyTarget(Number(e.target.value)),
        style: { width: "100%", accentColor: "#E8A33D" },
      }),
      h("div", { className: "mono", style: { display: "flex", justifyContent: "space-between", fontSize: 10, color: "#6B7C99", marginTop: 4 } },
        h("span", null, "Easier (gimme softballs)"),
        h("span", null, "Harder (make 'em sweat)")
      )
    ),
    !round && h("div", { style: { border: "1px dashed #2C4870", borderRadius: 8, padding: "40px 20px", textAlign: "center", color: "#6B7C99" } },
      "No round loaded yet. Hit generate to pull 10 questions from the local bank."
    ),
    round && h("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
      round.questions.map((q, i) => renderQuestionCard(s, q, i)),
      h("div", { style: { marginTop: 8, border: "1px solid #1E2A3D", borderRadius: 8, padding: 16, background: "#0F1928" } },
        !round.locked
          ? h("button", {
              className: "osw", onClick: s.lockRound,
              style: { width: "100%", padding: "10px 16px", borderRadius: 6, border: "1px solid #2C4870", background: "#1B2A44", color: "#F0EDE4", fontWeight: 700, fontSize: 13, cursor: "pointer" },
            }, "Lock This Round")
          : h("div", { className: "mono", style: { fontSize: 13, color: "#7FD99A", fontWeight: 700 } }, "ROUND LOCKED — head to the Print Sheet tab")
      )
    )
  );
}

function renderQuestionCard(s, q, i) {
  const dc = diffColor(q.difficulty);
  const isRevealed = s.revealed[q.qid];
  const isDragging = s.draggedQid === q.qid;
  const draggable = !s.round.locked;
  return h("div", {
    key: q.qid,
    draggable: draggable,
    onDragStart: () => s.setDraggedQid(q.qid),
    onDragEnd: () => s.setDraggedQid(null),
    onDragOver: (e) => { if (draggable) e.preventDefault(); },
    onDrop: (e) => { e.preventDefault(); if (s.draggedQid) { s.reorderQuestions(s.draggedQid, q.qid); s.setDraggedQid(null); } },
    style: { border: "1px solid " + (isDragging ? "#E8A33D" : "#1E2A3D"), borderRadius: 8, padding: 16, background: "#0F1928", opacity: isDragging ? 0.4 : 1, display: "flex", gap: 10 },
  },
    !s.round.locked && h("div", { className: "mono", title: "Drag to reorder", style: { flexShrink: 0, color: "#3D4A63", cursor: "grab", paddingTop: 2, userSelect: "none" } }, "⠿"),
    h("div", { style: { flex: 1, minWidth: 0 } },
      h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 } },
        h("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" } },
          h("span", { className: "mono", style: { fontSize: 11, color: "#6B7C99" } }, `Q${i + 1}`),
          h("span", { className: "osw", style: { fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4, background: "#1B2A44", color: "#8A99B3" } }, q.category),
          h("span", { className: "osw", style: { fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: dc.bg, color: dc.fg } }, `${dc.label} · ${q.difficulty}/10`)
        ),
        h("div", { style: { display: "flex", gap: 6, flexShrink: 0 } },
          h("button", { onClick: () => s.swapQuestion(q.qid), disabled: s.round.locked, title: "Give me a new question",
            style: { border: "1px solid #1E2A3D", background: "transparent", borderRadius: 5, padding: "5px 9px", cursor: s.round.locked ? "default" : "pointer", color: "#6B7C99" } }, "↻"),
          h("button", { onClick: () => s.rateQuestion(q.qid, true), disabled: s.round.locked,
            style: { border: "1px solid " + (q.liked === true ? "#7FD99A" : "#1E2A3D"), background: q.liked === true ? "#1F3D2E" : "transparent", borderRadius: 5, padding: "5px 9px", cursor: s.round.locked ? "default" : "pointer", color: q.liked === true ? "#7FD99A" : "#6B7C99" } }, "👍"),
          h("button", { onClick: () => s.rateQuestion(q.qid, false), disabled: s.round.locked, title: "Dislike — swaps automatically",
            style: { border: "1px solid " + (q.liked === false ? "#E87D7D" : "#1E2A3D"), background: q.liked === false ? "#3D1F1F" : "transparent", borderRadius: 5, padding: "5px 9px", cursor: s.round.locked ? "default" : "pointer", color: q.liked === false ? "#E87D7D" : "#6B7C99" } }, "👎")
        )
      ),
      h("div", { style: { marginTop: 10, fontSize: 15, color: "#E8EAED", lineHeight: 1.5 } }, q.question),
      h("button", {
        onClick: () => s.setRevealed((r) => ({ ...r, [q.qid]: !r[q.qid] })), className: "mono",
        style: { marginTop: 10, display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#E8A33D", background: "none", border: "none", cursor: "pointer", padding: 0 },
      }, isRevealed ? "HIDE ANSWER" : "SHOW ANSWER"),
      isRevealed && h("div", { style: { marginTop: 6, fontSize: 13, color: "#8A99B3", borderLeft: "2px solid #2C4870", paddingLeft: 10 } }, q.answer)
    )
  );
}

function renderTeamsTab(s) {
  return h("div", null,
    h("div", { className: "osw", style: { fontSize: 15, color: "#8A99B3", fontWeight: 600, marginBottom: 14 } }, "Record This Week's Scores"),
    h("div", { style: { display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" } },
      h("input", { value: s.teamNameInput, onChange: (e) => s.setTeamNameInput(e.target.value), placeholder: "Team name",
        style: { flex: "1 1 180px", background: "#0F1928", border: "1px solid #1E2A3D", borderRadius: 6, padding: "10px 12px", color: "#E8EAED", fontSize: 13 } }),
      h("input", { value: s.teamScoreInput, onChange: (e) => s.setTeamScoreInput(e.target.value), placeholder: "Score /10", type: "number", min: "0", max: "10",
        style: { width: 100, background: "#0F1928", border: "1px solid #1E2A3D", borderRadius: 6, padding: "10px 12px", color: "#E8EAED", fontSize: 13 } }),
      h("button", { className: "osw", onClick: s.addTeamScore,
        style: { padding: "10px 16px", borderRadius: 6, border: "1px solid #E8A33D", background: "#E8A33D", color: "#0B1220", fontWeight: 700, fontSize: 12, cursor: "pointer" } }, "+ Add")
    ),
    h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, gap: 12, flexWrap: "wrap" } },
      h("div", { className: "osw", style: { fontSize: 15, color: "#8A99B3", fontWeight: 600 } }, "Leaderboard"),
      h("button", { className: "osw", onClick: s.resetAllScores,
        style: { padding: "8px 14px", borderRadius: 6, border: "1px solid " + (s.resetScoresArmed ? "#E87D7D" : "#1E2A3D"), background: s.resetScoresArmed ? "#3D1F1F" : "transparent", color: s.resetScoresArmed ? "#E87D7D" : "#8A99B3", fontWeight: 700, fontSize: 11, cursor: "pointer" } },
        s.resetScoresArmed ? "Click again to confirm" : "🗑 Reset All Scores")
    ),
    s.leaderboard.length === 0 && h("div", { style: { color: "#6B7C99", fontSize: 13 } }, "No scores logged yet."),
    h("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
      s.leaderboard.map((team, i) => {
        const open = s.expandedTeam === team.name;
        return h("div", { key: team.name, style: { border: "1px solid #1E2A3D", borderRadius: 8, background: "#0F1928" } },
          h("div", { onClick: () => s.setExpandedTeam(open ? null : team.name), style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: 14, cursor: "pointer" } },
            h("div", { style: { display: "flex", alignItems: "center", gap: 12 } },
              h("span", { className: "mono", style: { fontSize: 13, color: "#E8A33D", width: 20 } }, `#${i + 1}`),
              h("span", { style: { fontSize: 14, fontWeight: 600, color: "#E8EAED" } }, team.name),
              h("span", { className: "mono", style: { fontSize: 11, color: "#6B7C99" } }, `${team.weeks} wk${team.weeks !== 1 ? "s" : ""}`)
            ),
            h("div", { style: { display: "flex", alignItems: "center", gap: 16 } },
              h("div", { style: { textAlign: "right" } }, h("div", { className: "mono", style: { fontSize: 16, fontWeight: 700, color: "#F0EDE4" } }, team.total), h("div", { className: "mono", style: { fontSize: 10, color: "#6B7C99" } }, "TOTAL")),
              h("div", { style: { textAlign: "right" } }, h("div", { className: "mono", style: { fontSize: 16, fontWeight: 700, color: "#8A99B3" } }, team.avg.toFixed(1)), h("div", { className: "mono", style: { fontSize: 10, color: "#6B7C99" } }, "AVG")),
              h("span", { style: { color: "#6B7C99" } }, open ? "▲" : "▼")
            )
          ),
          open && h("div", { style: { borderTop: "1px solid #1E2A3D", padding: "10px 14px" } },
            team.entries.map((e, idx) => h("div", { key: idx, className: "mono", style: { display: "flex", justifyContent: "space-between", fontSize: 12, color: "#8A99B3", padding: "4px 0" } },
              h("span", null, e.date), h("span", null, `${e.score}/10`)))
          )
        );
      })
    )
  );
}

function renderLogTab(s) {
  return h("div", null,
    h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, gap: 12, flexWrap: "wrap" } },
      h("div", null,
        h("div", { className: "osw", style: { fontSize: 15, color: "#8A99B3", fontWeight: 600 } }, "Question History"),
        h("div", { className: "mono", style: { fontSize: 12, color: "#6B7C99", marginTop: 4 } },
          `${s.log.length} questions logged · ${s.log.filter((q) => q.liked === true).length} liked · ${s.log.filter((q) => q.liked === false).length} disliked`)
      ),
      h("button", { className: "osw", onClick: s.resetAllPreviousQuestions,
        style: { padding: "8px 14px", borderRadius: 6, border: "1px solid " + (s.resetArmed ? "#E87D7D" : "#1E2A3D"), background: s.resetArmed ? "#3D1F1F" : "transparent", color: s.resetArmed ? "#E87D7D" : "#8A99B3", fontWeight: 700, fontSize: 11, cursor: "pointer" } },
        s.resetArmed ? "Click again to confirm" : "🗑 Reset All Previous Questions")
    ),
    s.resetArmed && h("div", { className: "mono", style: { fontSize: 11, color: "#E8B84B", marginBottom: 14 } },
      "This clears \"already used\" history and lets everything — including your built-in and imported bank questions — come up again. Team scores are untouched."),
    h("div", { style: { marginBottom: 14 } }),
    s.roundIds.length === 0 && h("div", { style: { color: "#6B7C99", fontSize: 13 } }, "No rounds generated yet."),
    h("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
      s.roundIds.map((rid) => {
        const r = s.rounds[rid];
        const open = s.logOpenRound === rid;
        return h("div", { key: rid, style: { border: "1px solid #1E2A3D", borderRadius: 8, background: "#0F1928" } },
          h("div", { onClick: () => s.setLogOpenRound(open ? null : rid), style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14, cursor: "pointer" } },
            h("span", { style: { fontSize: 13, fontWeight: 600, color: "#E8EAED" } }, r.date),
            h("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
              h("span", { className: "mono", style: { fontSize: 11, color: "#6B7C99" } }, `${r.questions.length} questions`),
              h("span", { style: { color: "#6B7C99" } }, open ? "▲" : "▼"))
          ),
          open && h("div", { style: { borderTop: "1px solid #1E2A3D", padding: "10px 14px", display: "flex", flexDirection: "column", gap: 8 } },
            r.questions.map((q, idx) => h("div", { key: idx, style: { display: "flex", justifyContent: "space-between", gap: 10, fontSize: 12, padding: "4px 0", borderBottom: idx < r.questions.length - 1 ? "1px solid #16202F" : "none" } },
              h("span", { style: { color: "#8A99B3" } }, q.question),
              h("span", { style: { flexShrink: 0, color: q.liked === true ? "#7FD99A" : q.liked === false ? "#E87D7D" : "#3D4A63" } }, q.liked === true ? "liked" : q.liked === false ? "disliked" : "—")))
          )
        );
      })
    )
  );
}

function renderBankTab(s) {
  return h("div", null,
    h("div", { className: "osw", style: { fontSize: 15, color: "#8A99B3", fontWeight: 600, marginBottom: 6 } }, "Question Bank"),
    h("div", { className: "mono", style: { fontSize: 12, color: "#6B7C99", marginBottom: 20 } },
      `${QUESTION_BANK.length} built-in · ${s.customBank.length} imported from chat · this site never calls any AI API directly — all 10 questions each round come from this pool.`),

    h("div", { style: { border: "1px solid #1E2A3D", borderRadius: 8, padding: 16, background: "#0F1928", marginBottom: 20 } },
      h("div", { className: "osw", style: { fontSize: 13, color: "#F0EDE4", fontWeight: 700, marginBottom: 10 } }, "① Get New Questions (in a Claude chat)"),
      h("div", { style: { fontSize: 13, color: "#8A99B3", marginBottom: 12, lineHeight: 1.6 } },
        "This site has no AI wired in on purpose — no API key, no live calls, nothing that could rack up a bill or need credentials. For fresh current-news/pop-culture questions each week or month, open a chat with Claude, paste the prompt below, and it'll hand back a batch in the exact format this site expects."),
      h("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 } },
        h("a", { href: "https://claude.ai/new", target: "_blank", rel: "noopener noreferrer",
          className: "osw",
          style: { display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 6, border: "1px solid #2C4870", background: "#1B2A44", color: "#F0EDE4", fontWeight: 700, fontSize: 12, textDecoration: "none" } },
          "↗ Open Claude Chat"),
        h("button", { className: "osw", onClick: s.copyPrompt,
          style: { padding: "10px 16px", borderRadius: 6, border: "1px solid #E8A33D", background: s.promptCopied ? "#1F3D2E" : "#E8A33D", color: s.promptCopied ? "#7FD99A" : "#0B1220", fontWeight: 700, fontSize: 12, cursor: "pointer" } },
          s.promptCopied ? "Copied!" : "Copy the Prompt")
      ),
      h("pre", { className: "mono", style: { whiteSpace: "pre-wrap", fontSize: 11, color: "#6B7C99", background: "#0B1220", border: "1px solid #1E2A3D", borderRadius: 6, padding: 12, margin: 0 } }, CHAT_PROMPT)
    ),

    h("div", { style: { border: "1px solid #1E2A3D", borderRadius: 8, padding: 16, background: "#0F1928", marginBottom: 20 } },
      h("div", { className: "osw", style: { fontSize: 13, color: "#F0EDE4", fontWeight: 700, marginBottom: 10 } }, "② Paste What Claude Gave You"),
      h("textarea", {
        value: s.importText, onChange: (e) => s.setImportText(e.target.value),
        placeholder: IMPORT_SCHEMA_EXAMPLE,
        rows: 8,
        style: { width: "100%", boxSizing: "border-box", background: "#0B1220", border: "1px solid #1E2A3D", borderRadius: 6, padding: 12, color: "#E8EAED", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", resize: "vertical", marginBottom: 10 },
      }),
      h("button", { className: "osw", onClick: s.importQuestions, disabled: !s.importText.trim(),
        style: { padding: "10px 16px", borderRadius: 6, border: "1px solid #E8A33D", background: "#E8A33D", color: "#0B1220", fontWeight: 700, fontSize: 12, cursor: "pointer" } }, "+ Add to Bank"),
      s.importErr && h("div", { className: "mono", style: { fontSize: 11, color: "#E87D7D", marginTop: 8 } }, s.importErr),
      s.importMsg && h("div", { className: "mono", style: { fontSize: 11, color: "#7FD99A", marginTop: 8 } }, s.importMsg)
    ),

    s.customBank.length > 0 && h("div", null,
      h("div", { className: "osw", style: { fontSize: 13, color: "#8A99B3", fontWeight: 700, marginBottom: 10 } }, "Imported Questions"),
      h("div", { style: { display: "flex", flexDirection: "column", gap: 6 } },
        s.customBank.map((b) => h("div", { key: b.id, style: { border: "1px solid #1E2A3D", borderRadius: 6, padding: 10, background: "#0F1928", fontSize: 12 } },
          h("div", { style: { display: "flex", gap: 8, marginBottom: 4 } },
            h("span", { className: "osw", style: { fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3, background: "#1B2A44", color: "#8A99B3" } }, b.category),
            h("span", { className: "mono", style: { fontSize: 10, color: "#6B7C99" } }, `diff ${b.difficulty}/10`)),
          h("div", { style: { color: "#E8EAED" } }, b.question)))
      )
    )
  );
}

function PrintSheetTab(props) {
  const lockedRounds = props.lockedRounds;
  const leaderboard = props.leaderboard;
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const [qFontPt, setQFontPt] = useState(11);
  const [backShrunk, setBackShrunk] = useState(false);

  const current = lockedRounds.length ? lockedRounds[lockedRounds.length - 1] : null;
  const previous = lockedRounds.length > 1 ? lockedRounds[lockedRounds.length - 2] : null;
  const sortedTeams = [...leaderboard].sort((a, b) => b.total - a.total);

  useLayoutEffect(() => {
    if (!current || !frontRef.current) return;
    setQFontPt(11);
    const t = setTimeout(() => {
      const el = frontRef.current;
      if (!el) return;
      if (el.scrollHeight > el.clientHeight + 2) setQFontPt(10);
    }, 30);
    return () => clearTimeout(t);
  }, [current]);

  const SHRINK_STEPS = [
    { lbFont: 9, lbPad: 6, ansFont: 9.5 },
    { lbFont: 8.5, lbPad: 5, ansFont: 9 },
    { lbFont: 8, lbPad: 4, ansFont: 8.5 },
    { lbFont: 7.5, lbPad: 3, ansFont: 8 },
    { lbFont: 7, lbPad: 2, ansFont: 7.5 },
  ];
  useLayoutEffect(() => {
    if (!backRef.current) return;
    const el = backRef.current;
    const apply = (step) => {
      el.style.setProperty("--lb-font", step.lbFont + "pt");
      el.style.setProperty("--lb-pad", step.lbPad + "px");
      el.style.setProperty("--ans-font", step.ansFont + "pt");
    };
    const t = setTimeout(() => {
      let chosen = 0;
      for (let i = 0; i < SHRINK_STEPS.length; i++) {
        apply(SHRINK_STEPS[i]);
        chosen = i;
        if (el.scrollHeight <= el.clientHeight + 2) break;
      }
      setBackShrunk(chosen > 0);
    }, 30);
    return () => clearTimeout(t);
  }, [leaderboard, previous]);

  if (!lockedRounds.length) {
    return h("div", { style: { border: "1px dashed #2C4870", borderRadius: 8, padding: "40px 20px", textAlign: "center", color: "#6B7C99" } },
      "Lock a round on the Generate tab first — the print sheet builds from your most recently locked round.");
  }

  const printCss = `
    .print-page { font-family: 'Aharoni', 'Segoe UI', Arial, sans-serif; background: #fff; color: #111; width: 8.5in; height: 11in; padding: 0.55in 0.75in; box-sizing: border-box; margin: 0 auto 24px; border-radius: 4px; display: flex; flex-direction: column; }
    .print-title { font-family: 'Perpetua Titling MT', 'Times New Roman', serif; font-weight: 700; font-size: 22pt; color: #CC1B1B; text-align: center; text-decoration: underline; margin: 0; }
    .print-team { font-family: 'Perpetua Titling MT', 'Times New Roman', serif; font-weight: 700; font-size: 12pt; text-align: center; margin-top: 6px; }
    .print-q { font-family: 'Aharoni', 'Segoe UI', Arial, sans-serif; font-weight: 700; font-size: ${qFontPt}pt; margin: ${qFontPt <= 10 ? "10px" : "14px"} 0 4px; line-height: 1.35; }
    .print-blank { border-bottom: 1px solid #111; display: block; height: ${qFontPt <= 10 ? "16px" : "20px"}; }
    .print-footer { font-family: 'Perpetua Titling MT', 'Times New Roman', serif; font-weight: 700; font-size: 12pt; color: #CC1B1B; text-align: center; margin: auto 0 0; padding-top: 16px; }
    .print-lb-title { font-family: 'Perpetua Titling MT', 'Times New Roman', serif; font-weight: 700; font-size: 20pt; color: #CC1B1B; text-align: center; text-decoration: underline; margin: 0 0 10px; }
    .print-lastweek-title { font-family: 'Perpetua Titling MT', 'Times New Roman', serif; font-weight: 700; font-size: 16pt; color: #CC1B1B; text-align: center; text-decoration: underline; margin: 0 0 10px; }
    .print-lb-table { width: 100%; table-layout: fixed; border-collapse: collapse; font-family: 'Perpetua Titling MT', 'Times New Roman', serif; font-size: var(--lb-font, 9pt); margin-bottom: 22px; border: 1px solid #111; }
    .print-lb-table th, .print-lb-table td { width: 50%; text-align: center; padding: var(--lb-pad, 6px) 8px; border: 1px solid #111; }
    .print-lb-table th { color: #111; font-weight: 700; }
    .print-lb-table td { color: #CC1B1B; font-weight: 700; }
    .print-ans { font-family: 'Perpetua Titling MT', 'Times New Roman', serif; font-size: var(--ans-font, 9.5pt); margin: 8px 0; }
    .print-ans b { display: block; font-weight: 700; }
    .print-ans-value { font-weight: 700; text-decoration: underline; }
    @media print {
      body * { visibility: hidden; }
      .print-area, .print-area * { visibility: visible; }
      .print-area { position: absolute; left: 0; top: 0; width: 100%; }
      .print-page { box-shadow: none !important; page-break-after: always; margin: 0; border-radius: 0; }
      .no-print { display: none !important; }
    }
  `;

  return h("div", null,
    h("style", null, printCss),
    h("div", { className: "no-print", style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 12 } },
      h("div", null,
        h("div", { className: "osw", style: { fontSize: 15, color: "#8A99B3", fontWeight: 600 } }, "Front & Back Print Preview"),
        h("div", { className: "mono", style: { fontSize: 12, color: "#6B7C99", marginTop: 2 } },
          `${current.date} round · questions at ${qFontPt}pt${qFontPt <= 10 ? " (auto-shrunk)" : ""}${backShrunk ? " · leaderboard auto-shrunk to fit" : ""}`)
      ),
      h("button", { className: "osw", onClick: () => window.print(),
        style: { display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 6, border: "1px solid #E8A33D", background: "#E8A33D", color: "#0B1220", fontWeight: 700, fontSize: 13, cursor: "pointer" } },
        "🖨 Print / Save as PDF")
    ),
    h("div", { className: "print-area" },
      h("div", { ref: frontRef, className: "print-page", style: { boxShadow: "0 4px 24px rgba(0,0,0,0.4)" } },
        h("table", { style: { width: "100%", borderCollapse: "collapse" } },
          h("tbody", null, h("tr", null,
            h("td", { style: { width: 120, textAlign: "center" } }, h("img", { src: LOGO_DATA_URI, alt: "Bull Six logo", style: { width: 112, height: 112 } })),
            h("td", { style: { textAlign: "center" } },
              h("p", { className: "print-title" }, "BULL SIX TRIVIA SHEET"),
              h("p", { className: "print-team" }, "TEAM NAME: " + "_".repeat(32))),
            h("td", { style: { width: 120, textAlign: "center" } }, h("img", { src: LOGO_DATA_URI, alt: "Bull Six logo", style: { width: 112, height: 112 } }))
          ))
        ),
        h("div", { style: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-evenly" } },
          current.questions.map((q, i) => h("div", { key: i },
            h("p", { className: "print-q" }, `${i + 1}. ${q.question}`),
            h("span", { className: "print-blank" })))
        ),
        h("p", { className: "print-footer" }, "RAGE. EVERY. DAY.")
      ),
      h("div", { ref: backRef, className: "print-page", style: { boxShadow: "0 4px 24px rgba(0,0,0,0.4)" } },
        h("p", { className: "print-lb-title" }, "LEADERBOARDS:"),
        sortedTeams.length === 0
          ? h("p", { className: "print-ans", style: { marginBottom: 20 } }, "No team scores logged yet.")
          : h("table", { className: "print-lb-table" },
              h("thead", null, h("tr", null, h("th", null, "TEAM NAME"), h("th", null, "SCORE"))),
              h("tbody", null, sortedTeams.map((t) => h("tr", { key: t.name }, h("td", null, t.name), h("td", null, t.total))))
            ),
        h("p", { className: "print-lastweek-title" }, "Last week's answers:"),
        !previous
          ? h("p", { className: "print-ans" }, "No previous round yet — this back page will fill in once you lock a second round.")
          : previous.questions.map((q, i) => h("div", { className: "print-ans", key: i },
              h("b", null, q.question),
              h("span", { className: "print-ans-value" }, q.answer)))
      )
    )
  );
}

/* ---------- mount ---------- */
ReactDOM.createRoot(document.getElementById("root")).render(h(App));
