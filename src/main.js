const elt = document.getElementById('graph');
const calculator = Desmos.GraphingCalculator(elt, {
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

function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    function setTheme(isDark) {
        document.documentElement.classList.toggle('dark', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        calculator.updateSettings({ invertedColors: isDark });
    }

    const savedTheme = localStorage.getItem('theme');
    setTheme(savedTheme ? savedTheme === 'dark' : prefersDark.matches);

    themeToggle.addEventListener('click', () => setTheme(!document.documentElement.classList.contains('dark')));
    prefersDark.addEventListener('change', e => !localStorage.getItem('theme') && setTheme(e.matches));
}

function validateInput(input, min, errorId) {
    const value = parseFloat(input.value);
    const error = document.getElementById(errorId);

    if (isNaN(value)) {
        error.textContent = 'Please enter a valid number';
        return false;
    }
    if (value < min) {
        error.textContent = `Value must be at least ${min}`;
        return false;
    }

    error.textContent = '';
    return true;
}

const XP_POWER = 1.0501716659439975;
const xpToPoints = xp => 2 * Math.pow(xp, 1 / XP_POWER);
const pointsToXP = pts => Math.floor(0.5 * Math.pow(pts, XP_POWER));

function calculateXPBetweenLevels(start, end) {
    let totalXP = 0;
    for (let x = start; x < end; x += 0.01) {
        const f = Math.floor(x);
        totalXP += (10 + f * f) * 0.01;
    }
    return Math.round(totalXP * 30);
}

const calculatePointsBetweenLevels = (s, e) => Math.round(xpToPoints(calculateXPBetweenLevels(s, e)));

function calculateTimeEstimate(start, end, ppm) {
    const pts = calculatePointsBetweenLevels(start, end);
    const mins = pts / ppm;
    return {
        hours: Math.floor(mins / 60),
        minutes: Math.floor(mins % 60),
        seconds: Math.round((mins % 1) * 60),
        totalMinutes: mins
    };
}

function parseTimeToMilliseconds(timeStr) {
    const parts = timeStr.split(':').map(Number);
    if (parts.length < 2 || parts.length > 3) return null;

    const [hours, minutes, seconds = 0] = parts;
    if (hours > 23 || minutes > 59 || seconds > 59) return null;

    return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

const formatTime = t => `${t.hours ? t.hours + 'h ' : ''}${t.minutes ? t.minutes + 'm ' : ''}${t.seconds}s`;

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

const calculateComboScore = (t, l, h, b) => b === 0 ? 0 : (t * l * Math.min(h, 5)) / (1.75 * b);

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
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    }));

    updateActiveState();
}


function initEventListeners() {
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', updateResults);
        input.addEventListener('wheel', e => {
            e.preventDefault();
            const step = parseFloat(input.step) || 1;
            const value = parseFloat(input.value) || 0;
            const newValue = e.deltaY < 0 ? value + step : value - step;
            const min = parseFloat(input.min);
            const max = parseFloat(input.max || Infinity);
            if (newValue >= min && newValue <= max) {
                input.value = newValue;
                input.dispatchEvent(new Event('input'));
            }
        }, { passive: false });
    });
}

function updateResults(e) {
    const id = e?.target?.id;

	if (!e || !e.target || !e.target.id) {
		// No event or unknown field — run all updates
		runAllUpdates();
		return;
	}
    
    switch (id) {
        case 'base-level':
        case 'points-to-convert':
            updatePointsToLevel();
            break;

        case 'start-level':
        case 'end-level':
            updateLevelRange();
            break;

        case 'time-start-level':
        case 'time-end-level':
        case 'points-per-minute':
            updateTimeEstimator();
            break;

        case 'points-input':
            updatePointsToXP();
            break;

        case 'total-combos-input':
        case 'longest-combo-input':
        case 'highest-combo-input':
        case 'combo-breaks-input':
            updateComboScore();
            break;
    }
}

function runAllUpdates() {
    updatePointsToLevel();
    updateLevelRange();
    updateTimeEstimator();
    updatePointsToXP();
    updateComboScore();
}

function updatePointsToLevel() {
    const base = document.getElementById('base-level');
    const points = document.getElementById('points-to-convert');
    if (!validateInput(base, 0, 'base-level-error') || !validateInput(points, 0, 'points-to-convert-error')) return;

    const { level, xp } = calculateLevelFromPoints(parseFloat(base.value), parseFloat(points.value));
    document.getElementById('result-level').textContent = level.toFixed(2);
    document.getElementById('converted-xp').textContent = xp.toLocaleString();
}

function updateLevelRange() {
    const start = document.getElementById('start-level');
    const end = document.getElementById('end-level');
    if (!validateInput(start, 0, 'start-level-error') || !validateInput(end, 0, 'end-level-error')) return;

    const s = parseInt(start.value), e = parseInt(end.value);
    if (e <= s) {
        document.getElementById('end-level-error').textContent = 'End level must be greater than start level';
        return;
    }

    const xp = calculateXPBetweenLevels(s, e);
    const pts = xpToPoints(xp);

    document.getElementById('required-xp').textContent = xp.toLocaleString();
    document.getElementById('required-points').textContent = Math.round(pts).toLocaleString();
}

function updateTimeEstimator() {
    const s = document.getElementById('time-start-level');
    const e = document.getElementById('time-end-level');
    const ppm = document.getElementById('points-per-minute');

    if (!validateInput(s, 0, 'time-start-level-error') || !validateInput(e, 0, 'time-end-level-error') || !validateInput(ppm, 1, 'points-per-minute-error')) return;

    const start = parseInt(s.value), end = parseInt(e.value), rate = parseFloat(ppm.value);
    if (end <= start) {
        document.getElementById('time-end-level-error').textContent = 'End level must be greater than start level';
        return;
    }

    const time = calculateTimeEstimate(start, end, rate);
    document.getElementById('estimated-time').textContent = formatTime(time);
}

function updatePointsToXP() {
    const input = document.getElementById('points-input');
    if (!validateInput(input, 0, 'points-input-error')) return;

    const points = parseFloat(input.value);
    const xp = pointsToXP(points);
    const xpp = xp / points;

    document.getElementById('total-xp').textContent = xp.toLocaleString();
    document.getElementById('xp-per-point').textContent = xpp.toFixed(4);
}

function updateComboScore() {
    const totalCombos = parseInt(document.getElementById('total-combos-input')?.value || 0);
    const highestCombo = parseInt(document.getElementById('highest-combo-input')?.value || 0);
    const comboBreaks = parseInt(document.getElementById('combo-breaks-input')?.value || 0);

    const comboTimeStr = document.getElementById('longest-combo-input')?.value || "0";
    const comboTime = parseTimeToMilliseconds(comboTimeStr);

    const comboScore = (totalCombos + comboTime * 2 + highestCombo * 1.5 - comboBreaks * 1.2) * (comboTime > 0 ? 1000 / comboTime : 0);

    document.getElementById('combo-score-result').textContent = comboScore.toFixed(2);
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initEventListeners();
    initNavigation();
    runAllUpdates();
});
