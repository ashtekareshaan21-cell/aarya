// ===== QUOTES DATABASE =====
const quotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Write your story. Let your heart guide your pen. - Unknown",
    "Today is a fresh start. Make it count. - Unknown",
    "Be kind to yourself. You deserve it. - Unknown",
    "Progress, not perfection. - Unknown",
    "Your story matters. Your voice matters. - Unknown",
    "Every day is a new opportunity to grow. - Unknown",
    "You are stronger than you think. - Unknown",
    "Write down the good. Remember the lessons. - Unknown",
    "This moment is an opportunity to reflect and reconnect. - Unknown",
];

// ===== REFLECTION QUESTIONS =====
const reflectionQuestions = [
    "What made you smile today?",
    "What are you most proud of today?",
    "What challenged you today and what did you learn?",
    "Who made a positive impact on your day?",
    "What would you do differently if you could?",
    "What are you looking forward to tomorrow?",
    "What moment today will you remember forever?",
    "How did you show kindness today?",
    "What are you grateful for right now?",
    "What inspired you today?",
    "How did you grow today?",
    "What made you laugh today?",
    "What is something you learned about yourself?",
    "What are you most excited about?",
    "How can you be a better version of yourself?",
    "What would your future self thank you for doing today?",
    "What brings you peace?",
    "What adventure can you have today?",
    "What would make tomorrow even better?",
    "How did you honor your emotions today?",
    "What small act of self-love did you do today?",
    "What are you working towards?",
    "What does success look like for you?",
    "Who inspires you and why?",
    "What does your ideal day look like?",
    "What are your core values?",
    "What brings out the best in you?",
    "What are you learning about yourself?",
    "What would you tell your younger self?",
    "What are your dreams for the future?"
];

// ===== DOM ELEMENTS =====
const welcomeScreen = document.getElementById('welcomeScreen');
const appContainer = document.getElementById('appContainer');
const startJournalBtn = document.getElementById('startJournalBtn');
const backBtn = document.getElementById('backBtn');
const backToCalendarBtn = document.getElementById('backToCalendarBtn');
const calendarSection = document.querySelector('.calendar-section');
const entrySection = document.getElementById('entrySection');
const monthEndSection = document.getElementById('monthEndSection');
const calendarGrid = document.getElementById('calendarGrid');
const entryText = document.getElementById('entryText');
const moodInput = document.getElementById('moodInput');
const highlightText = document.getElementById('highlightText');
const wordCount = document.getElementById('wordCount');
const saveEntryBtn = document.getElementById('saveEntryBtn');
const progressFill = document.getElementById('progressFill');
const progressLabel = document.getElementById('progressLabel');
const darkModeToggle = document.getElementById('darkModeToggle');
const exportBtn = document.getElementById('exportBtn');
const refreshQuoteBtn = document.getElementById('refreshQuoteBtn');
const dailyQuote = document.getElementById('dailyQuote');
const saveReflectionBtn = document.getElementById('saveReflectionBtn');
const reflectionSaved = document.getElementById('reflectionSaved');

// ===== STATE =====
let currentDay = null;
let journalData = {};
let monthEndReflection = {};

// ===== INITIALIZATION =====
function init() {
    loadFromStorage();
    setupEventListeners();
    applyDarkMode();
}

function loadFromStorage() {
    const saved = localStorage.getItem('aaryaJournal');
    if (saved) {
        journalData = JSON.parse(saved);
    }
    
    const monthReflection = localStorage.getItem('aaryaMonthEnd');
    if (monthReflection) {
        monthEndReflection = JSON.parse(monthReflection);
    }
    
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
}

function saveToStorage() {
    localStorage.setItem('aaryaJournal', JSON.stringify(journalData));
}

function applyDarkMode() {
    const isDark = document.body.classList.contains('dark-mode');
    const icon = darkModeToggle.querySelector('.theme-icon');
    icon.textContent = isDark ? '☀️' : '🌙';
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    startJournalBtn.addEventListener('click', startJournal);
    backBtn.addEventListener('click', backToCalendar);
    backToCalendarBtn.addEventListener('click', backToCalendar);
    saveEntryBtn.addEventListener('click', saveEntry);
    saveReflectionBtn.addEventListener('click', saveReflection);
    darkModeToggle.addEventListener('click', toggleDarkMode);
    exportBtn.addEventListener('click', exportJournal);
    entryText.addEventListener('input', updateWordCount);
    refreshQuoteBtn.addEventListener('click', changeQuote);
    
    // Mood selector
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', selectMood);
    });
}

// ===== WELCOME & START =====
function startJournal() {
    welcomeScreen.classList.add('hidden');
    appContainer.classList.remove('hidden');
    createConfetti();
    setTimeout(() => {
        renderCalendar();
        updateProgress();
    }, 100);
}

function createConfetti() {
    const container = document.querySelector('.confetti-container');
    const emojis = ['🌸', '✨', '💖', '🌙', '⭐', '🎀', '💫', '🌺'];
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.fontSize = Math.random() * 20 + 20 + 'px';
        confetti.style.opacity = Math.random() * 0.7 + 0.3;
        confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        container.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
    }
}

// ===== CALENDAR =====
function renderCalendar() {
    calendarGrid.innerHTML = '';
    
    // Days 1-30
    for (let day = 1; day <= 30; day++) {
        const dayBtn = createDayButton(day);
        calendarGrid.appendChild(dayBtn);
    }
    
    // Month-end reflection button
    const monthEndBtn = document.createElement('button');
    monthEndBtn.classList.add('calendar-day', 'month-end-btn');
    monthEndBtn.innerHTML = '<div style="font-size: 28px;">💌</div><div>Month End</div><div style="font-size: 12px;">Reflection</div>';
    monthEndBtn.addEventListener('click', () => openMonthEnd());
    calendarGrid.appendChild(monthEndBtn);
}

function createDayButton(day) {
    const btn = document.createElement('button');
    btn.classList.add('calendar-day');
    
    const entry = journalData[day];
    if (entry) {
        btn.classList.add('completed');
        btn.innerHTML = `<div class="day-number">${day}</div><div class="day-mood">${entry.mood || '📝'}</div>`;
    } else {
        btn.innerHTML = `<div class="day-number">${day}</div>`;
    }
    
    // Lock past days (only current day and future days can be edited)
    const today = new Date().getDate();
    if (day < today && !entry) {
        btn.classList.add('locked');
        btn.disabled = true;
    } else {
        btn.addEventListener('click', () => openDay(day));
    }
    
    return btn;
}

function updateProgress() {
    const completed = Object.keys(journalData).length;
    const percentage = (completed / 30) * 100;
    progressFill.style.width = percentage + '%';
    progressLabel.textContent = `${completed} / 30 days completed`;
}

// ===== OPEN DAY =====
function openDay(day) {
    currentDay = day;
    entrySection.classList.remove('hidden');
    monthEndSection.classList.add('hidden');
    calendarSection.style.display = 'none';
    
    // Update header
    const date = new Date(2026, 0, day);
    document.getElementById('entryDate').textContent = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    document.getElementById('dayNumber').textContent = `Day ${day} of 30`;
    
    // Load existing entry or create new
    const entry = journalData[day] || {};
    entryText.value = entry.text || '';
    highlightText.value = entry.highlight || '';
    moodInput.value = entry.mood || '';
    
    // Load gratitude
    const gratitudeInputs = document.querySelectorAll('.gratitude-input');
    gratitudeInputs.forEach((input, index) => {
        input.value = (entry.gratitude && entry.gratitude[index]) || '';
    });
    
    // Update mood selection
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.mood === entry.mood) {
            btn.classList.add('selected');
        }
    });
    
    // Show/hide locked message based on whether entry is already submitted
    const lockedMessage = document.getElementById('lockedMessage');
    if (entry.submitted) {
        lockedMessage.classList.add('visible');
        saveEntryBtn.disabled = true;
        entryText.disabled = true;
        highlightText.disabled = true;
        document.querySelectorAll('.gratitude-input').forEach(inp => inp.disabled = true);
        document.querySelectorAll('.mood-btn').forEach(btn => btn.disabled = true);
        refreshQuoteBtn.disabled = true;
    } else {
        lockedMessage.classList.remove('visible');
        saveEntryBtn.disabled = false;
        entryText.disabled = false;
        highlightText.disabled = false;
        document.querySelectorAll('.gratitude-input').forEach(inp => inp.disabled = false);
        document.querySelectorAll('.mood-btn').forEach(btn => btn.disabled = false);
        refreshQuoteBtn.disabled = false;
    }
    
    // Set random quote
    changeQuote();
    
    // Set reflection question
    document.getElementById('reflectionQuestion').textContent = reflectionQuestions[day - 1];
    
    // Scroll to top
    entrySection.scrollIntoView({ behavior: 'smooth' });
    updateWordCount();
}

function openMonthEnd() {
    calendarSection.style.display = 'none';
    entrySection.classList.add('hidden');
    monthEndSection.classList.remove('hidden');
    
    // Load existing reflection
    document.getElementById('learningText').value = monthEndReflection.learning || '';
    document.getElementById('memoryText').value = monthEndReflection.memory || '';
    document.getElementById('letterText').value = monthEndReflection.letter || '';
    
    reflectionSaved.classList.remove('visible');
    
    monthEndSection.scrollIntoView({ behavior: 'smooth' });
}

function backToCalendar() {
    entrySection.classList.add('hidden');
    monthEndSection.classList.add('hidden');
    calendarSection.style.display = 'block';
    calendarSection.scrollIntoView({ behavior: 'smooth' });
    renderCalendar();
}

// ===== SAVE ENTRY =====
function saveEntry() {
    if (!entryText.value.trim()) {
        alert('Please write something in your journal entry! 💭');
        return;
    }
    
    const gratitude = Array.from(document.querySelectorAll('.gratitude-input')).map(inp => inp.value);
    
    journalData[currentDay] = {
        text: entryText.value,
        mood: moodInput.value,
        highlight: highlightText.value,
        gratitude: gratitude,
        date: new Date().toISOString(),
        submitted: true
    };
    
    saveToStorage();
    updateProgress();
    
    // Show success animation
    const btn = saveEntryBtn;
    const originalText = btn.textContent;
    btn.textContent = '✨ Saved! ✨';
    btn.style.background = 'linear-gradient(135deg, #a8e6cf, #d4a5d4)';
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        backToCalendar();
    }, 1500);
}

function saveReflection() {
    monthEndReflection = {
        learning: document.getElementById('learningText').value,
        memory: document.getElementById('memoryText').value,
        letter: document.getElementById('letterText').value,
        date: new Date().toISOString()
    };
    
    localStorage.setItem('aaryaMonthEnd', JSON.stringify(monthEndReflection));
    
    reflectionSaved.classList.add('visible');
    setTimeout(() => {
        reflectionSaved.classList.remove('visible');
    }, 2000);
}

// ===== MOOD SELECTION =====
function selectMood(e) {
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    e.target.classList.add('selected');
    moodInput.value = e.target.dataset.mood;
}

// ===== QUOTE FUNCTIONALITY =====
function changeQuote() {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    dailyQuote.textContent = randomQuote;
}

// ===== WORD COUNT =====
function updateWordCount() {
    const text = entryText.value.trim();
    const words = text === '' ? 0 : text.split(/\s+/).length;
    wordCount.textContent = words;
}

// ===== DARK MODE =====
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    applyDarkMode();
}

// ===== EXPORT =====
function exportJournal() {
    let content = `📔 AARYA'S BIRTHDAY JOURNAL 📔\nGenerated: ${new Date().toLocaleDateString()}\n\n${'='.repeat(60)}\n\n`;
    
    // Add daily entries
    for (let day = 1; day <= 30; day++) {
        const entry = journalData[day];
        if (entry) {
            const date = new Date(2026, 0, day);
            content += `📅 DAY ${day} - ${date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}\n`;
            content += `Mood: ${entry.mood}\n\n`;
            content += `📝 Entry:\n${entry.text}\n\n`;
            
            if (entry.highlight) {
                content += `⭐ Highlight: ${entry.highlight}\n\n`;
            }
            
            if (entry.gratitude && entry.gratitude.some(g => g)) {
                content += `💜 Grateful for:\n`;
                entry.gratitude.forEach((g, i) => {
                    if (g) content += `  ${i + 1}. ${g}\n`;
                });
                content += '\n';
            }
            
            content += '$'.repeat(60) + '\n\n';
        }
    }
    
    // Add month-end reflection
    if (Object.keys(monthEndReflection).length > 0) {
        content += `\n💖 MONTH-END REFLECTION 💖\n`;
        content += `${'='.repeat(60)}\n\n`;
        
        if (monthEndReflection.learning) {
            content += `📚 What I Learned:\n${monthEndReflection.learning}\n\n`;
        }
        if (monthEndReflection.memory) {
            content += `✨ Best Memories:\n${monthEndReflection.memory}\n\n`;
        }
        if (monthEndReflection.letter) {
            content += `💌 Letter to Myself:\n${monthEndReflection.letter}\n\n`;
        }
    }
    
    // Create and download file
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', 'aaryaJournal.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// ===== START APPLICATION =====
window.addEventListener('DOMContentLoaded', init);
