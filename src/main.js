// === Constants & Setup ===
const pts_xp_graph = document.getElementById('points-xp-graph');
const calculator = Desmos.GraphingCalculator(pts_xp_graph, {
    xAxisLabel: 'Points',
    yAxisLabel: 'Xp Per Point',
    keypad: false,
    xAxisScale: 'logarithmic',
    expressions: false,
    settingsMenu: false,
    zoomButtons: true,
    border: false,
    invertedColors: localStorage.getItem('theme') === 'dark'
});

calculator.setExpression({ id: 'm', latex: '\\frac{x^{1.0501716659439975}}{2x}', color: '#f0a0a0' });

const xp_pts_graph = document.getElementById('xp-points-graph');
const calculator2 = Desmos.GraphingCalculator(xp_pts_graph, {
    xAxisLabel: 'Points',
    yAxisLabel: 'Xp Per Point',
    keypad: false,
    xAxisScale: 'logarithmic',
    expressions: false,
    settingsMenu: false,
    zoomButtons: true,
    border: false,
    invertedColors: localStorage.getItem('theme') === 'dark'
});

calculator2.setExpression({ id: 'm', latex: '\\frac{x^{\\frac{1}{1.0501716659439975}}}{2x}', color: '#f0a0a0' });

const XP_POWER = 1.0501716659439975;


// === Utility Functions ===
const xpToPoints = xp => 2 * Math.pow(xp, 1 / XP_POWER);
const pointsToXP = pts => 0.5 * Math.pow(pts, XP_POWER);


function calculateXPBetweenLevels(start, end) {
    let totalXP = 0;
    for (let x = start; x < end; x += 0.01) {
        const f = Math.floor(x);
        totalXP += (10 + f * f) * 0.01;
    }
    return Math.round(totalXP * 30);
}

function calculateLevelFromPoints(base, pts) {
    const xp = pointsToXP(pts);
    let currXP = 0, lvl = base;
    while (true) {
        const nextXP = calculateXPBetweenLevels(lvl, lvl + 1);
        if (currXP + nextXP > xp) {
            return { level: lvl + (xp - currXP) / nextXP, xp };
        }
        currXP += nextXP;
        lvl++;
    }
}

function calculateLevelFromXP(base, xp) {
    let currXP = 0, lvl = base;
    while (true) {
        const nextXP = calculateXPBetweenLevels(lvl, lvl + 1);
        if (currXP + nextXP > xp) {
            return { level: lvl + (xp - currXP) / nextXP, pts: xpToPoints(xp) };
        }
        currXP += nextXP;
        lvl++;
    }
}

function calculateTimeEstimate(start, end, ppm) {
    const pts = Math.round(xpToPoints(calculateXPBetweenLevels(start, end)));
    const mins = pts / ppm;
    return {
        hours: Math.floor(mins / 60),
        minutes: Math.floor(mins % 60),
        seconds: Math.round((mins % 1) * 60),
        totalMinutes: mins
    };
}

function parseTimeToSeconds(timeStr) {
    const parts = timeStr.split(':').map(Number);
    if (parts.length < 2 || parts.length > 3) return null;
    const [hours, minutes, seconds = 0] = parts;
    if (hours > 23 || minutes > 59 || seconds > 59) return null;
    return (hours * 3600 + minutes * 60 + seconds);
}

const formatTime = t => `${t.hours ? t.hours + 'h ' : ''}${t.minutes ? t.minutes + 'm ' : ''}${t.seconds}s`;

const calculateComboScore = (t, l, h, b) => b === 0 ? 0 : (t * l * Math.min(h, 5)) / (1.75 * b);

// ===- Section Engine ===
const SECTION_FUNCTIONS = {
    'points-to-level': ([base, pts]) => {
        const { level, xp } = calculateLevelFromPoints(base, pts);
        return { level: level.toFixed(2), xp: xp.toLocaleString() };
    },
    'xp-to-level': ([base, xp]) => {
        const { level, pts } = calculateLevelFromXP(base, xp);
        return { level: level.toFixed(2), pts: pts.toLocaleString() };
    },
    'level-range': ([start, end]) => {
        const xp = calculateXPBetweenLevels(start, end);
        const pts = xpToPoints(xp);
        return { xp: xp.toLocaleString(), pts: Math.round(pts).toLocaleString() };
    },
    'xp-to-points': ([xp]) => {
        const pts = xpToPoints(xp);
        return { pts: pts.toFixed(2).toLocaleString(), ratio: (pts / xp).toFixed(4) };
    },
    'points-to-xp': ([pts]) => {
        const xp = pointsToXP(pts);
        return { xp: xp.toLocaleString(), ratio: (xp / pts).toFixed(4) };
    },
    'time-estimator': ([start, end, ppm]) => {
        const time = calculateTimeEstimate(start, end, ppm);
        return { time: formatTime(time) };
    },
    'combo-score': ([total, timeStr, highest, breaks]) => {
        const time = parseTimeToSeconds(timeStr);
        const score = calculateComboScore(total, time, highest, breaks);
        return { score: score.toFixed(2) };
    }
};

function validateInputEl(el) {
    const val = parseFloat(el.value);
    const min = parseFloat(el.min || '-Infinity');
    const errorId = el.dataset.errorId;
    const errorEl = errorId ? document.getElementById(errorId) : null;

    if (isNaN(val)) {
        if (errorEl) errorEl.textContent = 'Enter a valid number';
        return null;
    }
    if (val < min) {
        if (errorEl) errorEl.textContent = `Must be at least ${min}`;
        return null;
    }
    if (errorEl) errorEl.textContent = '';
    return val;
}

function autoInitSections() {
    document.querySelectorAll('section[id]').forEach(section => {
        const sectionId = section.id;
        const calcFn = SECTION_FUNCTIONS[sectionId];
        if (!calcFn) return;

        const inputs = section.querySelectorAll('input');
        const outputs = section.querySelectorAll('[data-output]');

        function update() {
            const values = [];
            for (const input of inputs) {
                const v = input.type === 'text' ? input.value : validateInputEl(input);
                if (v === null) return;
                values.push(v);
            }
            const result = calcFn(values);
            for (const output of outputs) {
                const key = output.dataset.output;
                if (key in result) output.textContent = result[key];
            }
        }

        inputs.forEach(i => i.addEventListener('input', update));
        update();
    });
}

// === Navigation & Theme ===
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    function setTheme(isDark) {
        document.documentElement.classList.toggle('dark', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        calculator.updateSettings({ invertedColors: isDark });
        calculator2.updateSettings({ invertedColors: isDark });
    }

    const savedTheme = localStorage.getItem('theme');
    setTheme(savedTheme ? savedTheme === 'dark' : prefersDark.matches);

    themeToggle.addEventListener('click', () => setTheme(!document.documentElement.classList.contains('dark')));
    prefersDark.addEventListener('change', e => !localStorage.getItem('theme') && setTheme(e.matches));
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const aside = document.querySelector('aside');

    function updateActiveState() {
        const y = window.scrollY + 100;
        document.querySelectorAll('section').forEach(sec => {
            if (y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${sec.id}`);
                });
            }
        });
    }

    window.addEventListener('scroll', () => {
        aside.classList.toggle('scrolled', window.scrollY > 50);
        updateActiveState();
    });

    navLinks.forEach(link => link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth' });
    }));

    updateActiveState();
}

// === Initialization ===
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    autoInitSections();
});