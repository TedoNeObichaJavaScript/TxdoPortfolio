/* =============================================================
   TXDO — Terminal Portfolio
   Matrix rain · CRT boot · Interactive shell
   ============================================================= */

// ─── Matrix Rain ────────────────────────────────────────────
(function matrixRain() {
  const canvas = document.getElementById('matrix-rain');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>{}[]=/\\|;:';
  const fontSize = 14;
  let columns = Math.floor(canvas.width / fontSize);
  let drops = Array(columns).fill(1);

  window.addEventListener('resize', () => {
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1);
  });

  function draw() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // Mix green and cyan
      ctx.fillStyle = Math.random() > 0.85 ? '#00e5ff' : '#00ff41';
      ctx.font = fontSize + 'px monospace';
      ctx.fillText(char, x, y);

      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ─── Boot Sequence ──────────────────────────────────────────
const bootLog = document.getElementById('boot-log');
const bootScreen = document.getElementById('boot-screen');
const terminal = document.getElementById('terminal');

const bootLines = [
  { text: 'BIOS v4.2.0 — Txdo Systems Inc.', cls: 'cyan bold', delay: 80 },
  { text: 'Checking memory... 16384 MB OK', cls: '', delay: 60 },
  { text: 'Detecting storage devices...', cls: 'dim', delay: 100 },
  { text: '  /dev/sda: 1TB NVMe SSD — PORTFOLIO_DRIVE', cls: '', delay: 40 },
  { text: '  /dev/sdb: 512GB Skills Cache — MOUNTED', cls: '', delay: 40 },
  { text: '', cls: '', delay: 30 },
  { text: 'Loading kernel: txdo-portfolio-os v2.0.26...', cls: 'cyan', delay: 120 },
  { text: '[    0.001] Initializing CPU: Full-Stack Core i∞ @ ∞GHz', cls: '', delay: 50 },
  { text: '[    0.012] Mounting /dev/skills... OK', cls: 'green', delay: 40 },
  { text: '[    0.023] Mounting /dev/projects... OK', cls: 'green', delay: 40 },
  { text: '[    0.034] Mounting /dev/experience... OK', cls: 'green', delay: 40 },
  { text: '[    0.045] Loading modules:', cls: '', delay: 60 },
  { text: '  [████████████████████] react.ko', cls: 'cyan', delay: 25 },
  { text: '  [████████████████████] node.ko', cls: 'cyan', delay: 25 },
  { text: '  [████████████████████] typescript.ko', cls: 'cyan', delay: 25 },
  { text: '  [████████████████████] kotlin-native.ko', cls: 'cyan', delay: 25 },
  { text: '  [████████████████████] claude-code.ko', cls: 'green', delay: 25 },
  { text: '  [████████████████████] mcp-servers.ko', cls: 'green', delay: 25 },
  { text: '  [████████████████████] ml-pipeline.ko', cls: 'cyan', delay: 25 },
  { text: '  [████████████████████] rag-engine.ko', cls: 'cyan', delay: 25 },
  { text: '  [████████████████████] docker.ko', cls: 'cyan', delay: 25 },
  { text: '  [████████████████████] multi-agent-8x.ko', cls: 'green', delay: 25 },
  { text: '  [████████████████████] creativity.ko', cls: 'green', delay: 25 },
  { text: '', cls: '', delay: 20 },
  { text: '[    0.128] Network: Connected to the Matrix', cls: 'green', delay: 80 },
  { text: '[    0.156] Starting portfolio-daemon...', cls: '', delay: 100 },
  { text: '[    0.200] All systems operational.', cls: 'green bold', delay: 60 },
  { text: '', cls: '', delay: 40 },
  { text: '  ████████╗██╗  ██╗██████╗  ██████╗ ', cls: 'cyan bold', delay: 20 },
  { text: '  ╚══██╔══╝╚██╗██╔╝██╔══██╗██╔═══██╗', cls: 'cyan bold', delay: 20 },
  { text: '     ██║    ╚███╔╝ ██║  ██║██║   ██║', cls: 'cyan bold', delay: 20 },
  { text: '     ██║    ██╔██╗ ██║  ██║██║   ██║', cls: 'cyan bold', delay: 20 },
  { text: '     ██║   ██╔╝ ██╗██████╔╝╚██████╔╝', cls: 'cyan bold', delay: 20 },
  { text: '     ╚═╝   ╚═╝  ╚═╝╚═════╝  ╚═════╝ ', cls: 'cyan bold', delay: 20 },
  { text: '', cls: '', delay: 40 },
  { text: '  Full-Stack Developer · Founder of Nooze · Sofia, Bulgaria', cls: 'green', delay: 80 },
  { text: '', cls: '', delay: 30 },
  { text: '  Initializing interactive shell...', cls: 'dim', delay: 200 },
  { text: '  Type "help" to see available commands.', cls: 'yellow', delay: 100 },
  { text: '', cls: '', delay: 400 },
];

async function runBoot() {
  for (const line of bootLines) {
    const span = document.createElement('span');
    if (line.cls) span.className = line.cls;
    span.textContent = line.text + '\n';
    bootLog.appendChild(span);
    bootLog.parentElement.scrollTop = bootLog.parentElement.scrollHeight;
    await sleep(line.delay);
  }
  await sleep(300);
  bootScreen.classList.add('fade-out');
  await sleep(800);
  bootScreen.style.display = 'none';
  terminal.classList.remove('hidden');
  terminal.classList.add('show');
  showWelcome();
  document.getElementById('command-input').focus();
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ─── Terminal Engine ────────────────────────────────────────
const output = document.getElementById('output');
const commandInput = document.getElementById('command-input');
const cursorBlock = document.getElementById('cursor-block');
const terminalBody = document.getElementById('terminal-body');

const commandHistory = [];
let historyIndex = -1;
let currentPath = '~';
let isTyping = false;
let skipTyping = false;
let typingGeneration = 0;

// Update cursor position
function updateCursor() {
  const textWidth = getTextWidth(commandInput.value, '14px Fira Code');
  cursorBlock.style.left = (commandInput.offsetLeft + textWidth) + 'px';
}

function getTextWidth(text, font) {
  const canvas = getTextWidth._canvas || (getTextWidth._canvas = document.createElement('canvas'));
  const ctx = canvas.getContext('2d');
  ctx.font = font;
  return ctx.measureText(text).width;
}

commandInput.addEventListener('input', updateCursor);

commandInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    skipTyping = true;
    const cmd = commandInput.value.trim();
    if (cmd) {
      commandHistory.push(cmd);
      historyIndex = commandHistory.length;
    }
    processCommand(cmd);
    commandInput.value = '';
    updateCursor();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      commandInput.value = commandHistory[historyIndex];
      updateCursor();
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      commandInput.value = commandHistory[historyIndex];
    } else {
      historyIndex = commandHistory.length;
      commandInput.value = '';
    }
    updateCursor();
  } else if (e.key === 'Tab') {
    e.preventDefault();
    tabComplete();
  } else if (e.key === 'l' && e.ctrlKey) {
    e.preventDefault();
    output.innerHTML = '';
  }
});

// Keep focus on input
document.addEventListener('click', () => {
  commandInput.focus();
});

function addPromptLine(cmd) {
  const div = document.createElement('div');
  div.className = 'cmd-line';
  div.innerHTML = `<span class="prompt-user">visitor</span><span class="prompt-at">@</span><span class="prompt-host">txdo.dev</span><span class="prompt-colon">:</span><span class="prompt-path">${currentPath}</span><span class="prompt-dollar"> $</span> <span class="typed-cmd">${escapeHtml(cmd)}</span>`;
  output.appendChild(div);
}

async function addResponse(html) {
  // Clean whitespace from template literals
  html = html.replace(/^\n+/, '').replace(/\n+$/, '');
  html = html.replace(/(<div[^>]*>)[ \t]*\n[ \t]*/g, '$1');
  html = html.replace(/\n[ \t]*(<\/div>)/g, '$1');

  const div = document.createElement('div');
  div.className = 'response';
  output.appendChild(div);

  const thisGen = ++typingGeneration;
  const plainLen = html.replace(/<[^>]*>/g, '').length;

  isTyping = true;
  skipTyping = false;

  if (plainLen > 1500) {
    // Line-by-line reveal for long content
    const lines = html.split('\n');
    let acc = '';
    for (let j = 0; j < lines.length; j++) {
      if (skipTyping || typingGeneration !== thisGen) break;
      acc += (j > 0 ? '\n' : '') + lines[j];
      div.innerHTML = acc + '<span class="type-cursor">\u2588</span>';
      scrollToBottom();
      if (j % 3 === 0) await sleep(8);
    }
  } else {
    // Character-by-character typing
    const batch = plainLen > 500 ? 5 : plainLen > 200 ? 3 : 2;
    const delay = plainLen > 500 ? 2 : plainLen > 200 ? 4 : 8;
    let buf = '';
    let i = 0;
    let c = 0;

    while (i < html.length) {
      if (skipTyping || typingGeneration !== thisGen) break;

      // HTML tags — add whole tag at once
      if (html[i] === '<') {
        const end = html.indexOf('>', i);
        if (end !== -1) { buf += html.substring(i, end + 1); i = end + 1; continue; }
      }

      // HTML entities — add whole entity at once
      if (html[i] === '&') {
        const semi = html.indexOf(';', i);
        if (semi !== -1 && semi - i < 10) { buf += html.substring(i, semi + 1); i = semi + 1; c++; continue; }
      }

      buf += html[i];
      i++;
      c++;

      if (c >= batch) {
        div.innerHTML = buf + '<span class="type-cursor">\u2588</span>';
        scrollToBottom();
        await sleep(delay);
        c = 0;
      }
    }
  }

  div.innerHTML = html;
  scrollToBottom();
  if (typingGeneration === thisGen) isTyping = false;
}

function scrollToBottom() {
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ─── Tab completion ─────────────────────────────────────────
const allCommands = ['help', 'about', 'skills', 'projects', 'contact', 'neofetch', 'whoami',
  'clear', 'history', 'ls', 'cat', 'pwd', 'date', 'uptime', 'sudo', 'exit',
  'education', 'experience', 'socials', 'echo', 'banner', 'tree', 'matrix', 'gui', 'nooze'];

function tabComplete() {
  const val = commandInput.value;
  const matches = allCommands.filter(c => c.startsWith(val));
  if (matches.length === 1) {
    commandInput.value = matches[0];
    updateCursor();
  } else if (matches.length > 1) {
    addPromptLine(val);
    addResponse(matches.map(m => `<span class="cyan">${m}</span>`).join('    '));
  }
}

// ─── Command Processing ─────────────────────────────────────
function processCommand(cmd) {
  addPromptLine(cmd);

  const parts = cmd.split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (command) {
    case '': break;
    case 'help': cmdHelp(); break;
    case 'about': cmdAbout(); break;
    case 'skills': cmdSkills(); break;
    case 'projects': cmdProjects(); break;
    case 'contact': case 'socials': cmdContact(); break;
    case 'neofetch': cmdNeofetch(); break;
    case 'whoami': cmdWhoami(); break;
    case 'clear': output.innerHTML = ''; break;
    case 'history': cmdHistory(); break;
    case 'ls': cmdLs(); break;
    case 'cat': cmdCat(args); break;
    case 'pwd': addResponse(`/home/visitor${currentPath === '~' ? '' : '/' + currentPath}`); break;
    case 'date': addResponse(`<span class="cyan">${new Date().toString()}</span>`); break;
    case 'uptime': cmdUptime(); break;
    case 'sudo': cmdSudo(args); break;
    case 'exit': cmdExit(); break;
    case 'education': cmdEducation(); break;
    case 'experience': cmdExperience(); break;
    case 'echo': addResponse(escapeHtml(args.join(' '))); break;
    case 'banner': showBanner(); break;
    case 'tree': cmdTree(); break;
    case 'matrix': cmdMatrix(); break;
    case 'gui': cmdGui(); break;
    case 'nooze': cmdNooze(); break;
    case 'cd': addResponse(`<span class="dim">There's no escaping this terminal.</span>`); break;
    case 'rm': addResponse(`<span class="red">Nice try. Permission denied: you can't delete my portfolio.</span>`); break;
    case 'vim': case 'nano': case 'vi': addResponse(`<span class="yellow">This isn't that kind of terminal. But I respect the reflex.</span>`); break;
    case 'curl': addResponse(`<span class="dim">curl: (7) Try visiting the links in</span> <span class="cyan">'contact'</span> <span class="dim">instead.</span>`); break;
    case 'man': addResponse(`<span class="dim">No manual entry for ${escapeHtml(args[0] || 'nothing')}. Try</span> <span class="cyan">'help'</span>.`); break;
    case 'ping': addResponse(`<span class="green">PONG!</span> <span class="dim">64 bytes from txdo.dev: time=0.42ms ttl=∞</span>`); break;
    case 'cowsay': cmdCowsay(args); break;
    default:
      addResponse(`<span class="red">command not found:</span> ${escapeHtml(command)}\n<span class="dim">Type</span> <span class="cyan">'help'</span> <span class="dim">for available commands.</span>`);
  }

  scrollToBottom();
}

// ─── Commands ───────────────────────────────────────────────

function showWelcome() {
  addResponse(`<span class="white">Welcome to Txdo's portfolio terminal. Type</span> <span class="cyan">'help'</span> <span class="white">to get started.</span>`);
}

function showBanner() {
  addResponse(`<pre class="ascii-art">
  ████████╗██╗  ██╗██████╗  ██████╗
  ╚══██╔══╝╚██╗██╔╝██╔══██╗██╔═══██╗
     ██║    ╚███╔╝ ██║  ██║██║   ██║
     ██║    ██╔██╗ ██║  ██║██║   ██║
     ██║   ██╔╝ ██╗██████╔╝╚██████╔╝
     ╚═╝   ╚═╝  ╚═╝╚═════╝  ╚═════╝
</pre>
<span class="green">  Full-Stack Developer · Founder of Nooze</span>`);
}

function cmdHelp() {
  addResponse(`
<span class="cyan bold">╔══════════════════════════════════════════════════════╗</span>
<span class="cyan bold">║</span>  <span class="green bold">AVAILABLE COMMANDS</span>                                  <span class="cyan bold">║</span>
<span class="cyan bold">╠══════════════════════════════════════════════════════╣</span>
<span class="cyan bold">║</span>                                                      <span class="cyan bold">║</span>
<span class="cyan bold">║</span>  <span class="cyan">about</span>      <span class="dim">→</span> Classified dossier                     <span class="cyan bold">║</span>
<span class="cyan bold">║</span>  <span class="cyan">skills</span>     <span class="dim">→</span> Technical skill bars                   <span class="cyan bold">║</span>
<span class="cyan bold">║</span>  <span class="cyan">projects</span>   <span class="dim">→</span> Featured projects & repos              <span class="cyan bold">║</span>
<span class="cyan bold">║</span>  <span class="cyan">nooze</span>      <span class="dim">→</span> Deep dive into my biggest project      <span class="cyan bold">║</span>
<span class="cyan bold">║</span>  <span class="cyan">experience</span> <span class="dim">→</span> Work experience                        <span class="cyan bold">║</span>
<span class="cyan bold">║</span>  <span class="cyan">education</span>  <span class="dim">→</span> Education & certificates               <span class="cyan bold">║</span>
<span class="cyan bold">║</span>  <span class="cyan">contact</span>    <span class="dim">→</span> How to reach me                        <span class="cyan bold">║</span>
<span class="cyan bold">║</span>  <span class="cyan">neofetch</span>   <span class="dim">→</span> System info (the cool way)             <span class="cyan bold">║</span>
<span class="cyan bold">║</span>  <span class="cyan">whoami</span>     <span class="dim">→</span> Quick intro                            <span class="cyan bold">║</span>
<span class="cyan bold">║</span>  <span class="cyan">banner</span>     <span class="dim">→</span> Show ASCII banner                      <span class="cyan bold">║</span>
<span class="cyan bold">║</span>                                                      <span class="cyan bold">║</span>
<span class="cyan bold">║</span>  <span class="yellow">ls</span>         <span class="dim">→</span> List directory contents                <span class="cyan bold">║</span>
<span class="cyan bold">║</span>  <span class="yellow">cat</span> <span class="dim">&lt;file&gt;</span> <span class="dim">→</span> Read a file                            <span class="cyan bold">║</span>
<span class="cyan bold">║</span>  <span class="yellow">tree</span>       <span class="dim">→</span> Directory tree view                    <span class="cyan bold">║</span>
<span class="cyan bold">║</span>  <span class="yellow">history</span>    <span class="dim">→</span> Command history                        <span class="cyan bold">║</span>
<span class="cyan bold">║</span>  <span class="yellow">clear</span>      <span class="dim">→</span> Clear terminal                         <span class="cyan bold">║</span>
<span class="cyan bold">║</span>  <span class="yellow">matrix</span>     <span class="dim">→</span> Toggle matrix rain intensity           <span class="cyan bold">║</span>
<span class="cyan bold">║</span>  <span class="yellow">gui</span>        <span class="dim">→</span> Who needs a GUI?                       <span class="cyan bold">║</span>
<span class="cyan bold">║</span>                                                      <span class="cyan bold">║</span>
<span class="cyan bold">║</span>  <span class="dim">↑/↓ arrows for history · Tab for autocomplete</span>      <span class="cyan bold">║</span>
<span class="cyan bold">║</span>  <span class="dim">Ctrl+L to clear screen</span>                             <span class="cyan bold">║</span>
<span class="cyan bold">╚══════════════════════════════════════════════════════╝</span>`);
}

function cmdAbout() {
  addResponse(`
<span class="red bold">╔══════════════════════════════════════════════════════════════╗</span>
<span class="red bold">║</span>  <span class="red bold">█▓▒░ CLASSIFIED DOSSIER ░▒▓█</span>         <span class="dim">CLEARANCE: LEVEL 5</span>  <span class="red bold">║</span>
<span class="red bold">╠══════════════════════════════════════════════════════════════╣</span>
<span class="red bold">║</span>  <span class="dim">FILE#: 0x7846-TXDO</span>            <span class="dim">STATUS:</span> <span class="green bold">ACTIVE THREAT</span>       <span class="red bold">║</span>
<span class="red bold">╚══════════════════════════════════════════════════════════════╝</span>

<div class="neofetch" style="gap:20px;align-items:flex-start;">
  <div style="flex-shrink:0;text-align:center;">
    <img src="az.webp" alt="TXDO" style="width:120px;height:120px;border-radius:6px;border:2px solid #00e5ff;box-shadow:0 0 15px #00e5ff40;object-fit:cover;">
    <div style="margin-top:6px;"><span class="cyan bold">[ PHOTO ID ]</span></div>
  </div>
  <div class="neofetch-info" style="line-height:1.8;">
    <span class="cyan bold">SUBJECT:</span>     <span class="white bold">Teodor "Txdo" Mirchev</span>
    <span class="cyan bold">ALIAS:</span>       <span class="green bold">TedoNeObichaJavaScript</span>
    <span class="cyan bold">AGE:</span>         <span class="white">19</span> <span class="dim">(born 2006, Sofia, BG)</span>
    <span class="cyan bold">LOCATION:</span>    <span class="white">Sofia, Bulgaria</span> <span class="dim">(UTC+3)</span>
    <span class="cyan bold">CLASS:</span>       <span class="yellow bold">Full-Stack Software Engineer</span>
    <span class="cyan bold">THREAT LVL:</span>  <span class="red bold">██████████</span> <span class="red">MAXIMUM</span>
  </div>
</div>

<span class="yellow bold">━━━ BACKGROUND ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

  <span class="white">Subject first made contact with a keyboard at an unverified
  age. By 17, had already shipped production systems. Based in
  Sofia — the epicenter of his operations. Cover story:
  university student. Real mission: infiltrate the tech scene.</span>

  <span class="white">Secondary education:</span>
  <span class="cyan">СУ „Св.св.Кирил и Методий"</span> <span class="white">— Natural Sciences, Карнобат</span>
  <span class="cyan">ПГЕЕ „Константин Фотинов"</span> <span class="white">— Applied Programming, Бургас</span>

  <span class="white">Currently enrolled at</span> <span class="cyan">UNIBIT</span> <span class="white">(Computer Science) and</span> <span class="cyan">SoftUni</span>
  <span class="white">(Software Engineering — JS & Node.js track). Holds a</span>
  <span class="cyan">Cybersecurity Certificate</span> <span class="white">from the Erasmus Program,</span>
  <span class="cyan">Cambridge C1 Advanced</span> <span class="white">+</span> <span class="cyan">B2 First</span> <span class="white">English clearances,</span>
  <span class="cyan">Special Award at RoboDays '25</span><span class="white">, and multiple SoftUni
  certifications in JavaScript.</span>

<span class="yellow bold">━━━ MOST NOTORIOUS OPERATION ━━━━━━━━━━━━━━━━━━━━━━━━━</span>

  <span class="green bold">OPERATION: NOOZE</span> <span class="dim">// codename: "Kill the Snooze Button"</span>
  <span class="white">Cross-platform sleep intelligence app that tracks your brain,</span>
  <span class="white">controls your lights, challenges you to prove you're awake,</span>
  <span class="white">and turns mornings into a competitive sport.</span>
  <span class="yellow">Stack: Kotlin 1.9 · Jetpack Compose · MVVM/Clean Arch · Hilt</span>
  <span class="yellow">Room+SQLCipher · Firestore · Firebase Auth · FCM · Retrofit</span>
  <span class="yellow">Health Connect · ML Sensor Fusion · IoT · 137+ test cases</span>
  <span class="cyan">🥈 2nd Place RoboDays '26</span> <span class="white">·</span> <span class="cyan">2nd Place Startup Fair UNIBIT '25</span>
  <span class="white">Targeting a $15B sleep tech market</span>
  <span class="red bold">Subject built the entire system solo in 1 year. Age: 18-19.</span>

<span class="yellow bold">━━━ KNOWN ASSOCIATES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

  <span class="cyan">Pulse</span>        <span class="white">→ Reactive state management framework (TypeScript)</span>
  <span class="cyan">Sudo Quest</span>   <span class="white">→ Browser coding game teaching JS, Git, HTML, C# ·</span> <span class="cyan">🥉 3rd Place RoboDays '26</span>
  <span class="cyan">Fraud Shield</span> <span class="white">→ Invoice fraud detection microservices backend</span>
  <span class="cyan">Treasurer</span>    <span class="white">→ AI-integrated enterprise file manager (C#)</span>

<span class="yellow bold">━━━ ASSESSMENT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

  <span class="red bold">⚠ WARNING:</span> <span class="white">Subject is self-taught, dangerously curious,
  and ships code at an alarming velocity. Known to mass-produce
  side projects. Mass-consumes caffeine. Does not sleep — ironic,
  given he built a sleep app.</span>

  <span class="green italic">"He didn't choose the terminal life. The terminal life chose him."</span>

<span class="red bold">╔══════════════════════════════════════════════════════════════╗</span>
<span class="red bold">║</span>  <span class="dim">END OF FILE — AUTHORIZED PERSONNEL ONLY</span>                    <span class="red bold">║</span>
<span class="red bold">║</span>  <span class="dim">Run</span> <span class="cyan">'contact'</span> <span class="dim">to initiate communication protocol</span>             <span class="red bold">║</span>
<span class="red bold">╚══════════════════════════════════════════════════════════════╝</span>`);
}

function skillBar(name, pct, color = '') {
  const filled = Math.round(pct / 5);
  const empty = 20 - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  const colorClass = color || (pct >= 80 ? 'cyan' : '');
  return `<div class="skill-bar-container"><span class="skill-label">${name}</span><span class="skill-bar ${colorClass}">${bar}</span><span class="skill-pct">${pct}%</span></div>`;
}

function cmdSkills() {
  addResponse(`
<span class="cyan bold">╔══════════════════════════════════════════════════════════════╗</span>
<span class="cyan bold">║</span>  <span class="red bold">█▓▒░ FULL ARSENAL ░▒▓█</span>          <span class="dim">THREAT LEVEL: MAXIMUM</span>     <span class="cyan bold">║</span>
<span class="cyan bold">╚══════════════════════════════════════════════════════════════╝</span>

  <span class="green bold">⟩ Languages</span>
${skillBar('JavaScript / ES2024+', 95, 'cyan')}
${skillBar('TypeScript', 90, 'cyan')}
${skillBar('Kotlin', 85, 'cyan')}
${skillBar('Python', 55)}
${skillBar('Swift', 75)}
${skillBar('Java', 75)}
${skillBar('C#', 70)}
${skillBar('SQL', 80, 'cyan')}
${skillBar('HTML5 / CSS3', 95, 'cyan')}
${skillBar('Bash / Shell', 75)}
${skillBar('Go', 40)}

  <span class="green bold">⟩ Frontend Frameworks</span>
${skillBar('React 18+', 90, 'cyan')}
${skillBar('Next.js 14+', 80, 'cyan')}
${skillBar('React Native', 85, 'cyan')}
${skillBar('Jetpack Compose', 85, 'cyan')}
${skillBar('Tailwind CSS', 85, 'cyan')}
${skillBar('Material 3 / MUI', 80, 'cyan')}
${skillBar('Bootstrap', 80, 'cyan')}
${skillBar('Vite', 80, 'cyan')}
${skillBar('Webpack', 70)}
${skillBar('Framer Motion', 70)}

  <span class="green bold">⟩ Backend & Runtime</span>
${skillBar('Node.js', 85, 'cyan')}
${skillBar('Express.js', 80, 'cyan')}
${skillBar('NestJS', 45)}
${skillBar('Firebase Cloud Fn', 80, 'cyan')}
${skillBar('Retrofit + OkHttp', 75)}
${skillBar('Spring Boot', 60)}
${skillBar('.NET', 55)}
${skillBar('Nginx', 65)}
${skillBar('GraphQL', 40)}
${skillBar('WebSockets', 45)}

  <span class="green bold">⟩ Mobile & Cross-Platform</span>
${skillBar('Android Native', 85, 'cyan')}
${skillBar('Kotlin Multiplatform', 80, 'cyan')}
${skillBar('React Native', 85, 'cyan')}
${skillBar('iOS (Swift)', 45)}
${skillBar('Hilt / Dagger 2', 55)}
${skillBar('Jetpack Navigation', 80, 'cyan')}
${skillBar('Health Connect API', 75)}
${skillBar('Play Billing v7', 70)}

  <span class="green bold">⟩ Databases & Data</span>
${skillBar('PostgreSQL', 80, 'cyan')}
${skillBar('Firebase Firestore', 80, 'cyan')}
${skillBar('Room + SQLCipher', 80, 'cyan')}
${skillBar('MySQL', 70)}
${skillBar('Redis', 65)}
${skillBar('JSON', 55)}

  <span class="green bold">⟩ DevOps & Infrastructure</span>
${skillBar('Git / GitHub', 90, 'cyan')}
${skillBar('GitHub Actions CI/CD', 80, 'cyan')}
${skillBar('Docker', 70)}
${skillBar('Gradle', 75)}
${skillBar('Fastlane', 65)}
${skillBar('Netlify', 70)}
${skillBar('Nginx', 65)}

  <span class="green bold">⟩ Security</span>
${skillBar('OAuth 2.0 / SSO', 75)}
${skillBar('SQLCipher AES-256', 75)}
${skillBar('BCrypt / AndroidX Sec', 70)}
${skillBar('ProGuard / R8', 70)}
${skillBar('HTTPS Pinning', 70)}
${skillBar('HMAC-SHA256 (Tuya)', 70)}
${skillBar('Firestore ACL', 70)}
${skillBar('Cybersecurity (Cert)', 70)}

  <span class="green bold">⟩ Architecture & Patterns</span>
${skillBar('MVVM + Clean Arch', 85, 'cyan')}
${skillBar('Microservices', 75)}
${skillBar('Repository Pattern', 80, 'cyan')}
${skillBar('Reactive State Mgmt', 85, 'cyan')}
${skillBar('Dependency Injection', 80, 'cyan')}
${skillBar('Event-Driven Arch', 75)}
${skillBar('Coroutines + Flows', 85, 'cyan')}

  <span class="green bold">⟩ Testing & Quality</span>
${skillBar('JUnit 5', 75)}
${skillBar('Compose UI Testing', 70)}
${skillBar('Jest + React Testing', 75)}
${skillBar('Ktlint / Detekt', 70)}
${skillBar('Crashlytics', 70)}

  <span class="green bold">⟩ IoT & Hardware</span>
${skillBar('Home Assistant REST', 70)}
${skillBar('Tuya Cloud Protocol', 70)}
${skillBar('Tellur Integration', 65)}
${skillBar('Arduino', 60)}
${skillBar('Webhook Protocols', 75)}
${skillBar('Sunrise Simulation', 70)}

  <span class="green bold">⟩ Design & Tools</span>
${skillBar('Figma', 45)}
${skillBar('VS Code (Power User)', 90, 'cyan')}
${skillBar('Firebase Console', 80, 'cyan')}
${skillBar('Android Studio', 85, 'cyan')}

<span class="red bold">╔══════════════════════════════════════════════════════════════╗</span>
<span class="red bold">║</span>  <span class="yellow bold">⚡ AI / ML / LLM OPS — THE REAL WEAPON ⚡</span>                   <span class="red bold">║</span>
<span class="red bold">╚══════════════════════════════════════════════════════════════╝</span>

  <span class="green bold">⟩ Machine Learning & AI</span>
${skillBar('Sleep Phase Classif.', 80, 'cyan')}
${skillBar('Fine-tuning / LoRA', 65)}
${skillBar('Prompt Engineering', 90, 'cyan')}
${skillBar('ML Sensor Fusion', 80, 'cyan')}

<span class="red bold">╔══════════════════════════════════════════════════════════════╗</span>
<span class="red bold">║</span>  <span class="cyan bold">🧠 CLAUDE CODE MASTERY — GRANDMASTER LEVEL 🧠</span>              <span class="red bold">║</span>
<span class="red bold">╚══════════════════════════════════════════════════════════════╝</span>

  <span class="green bold">⟩ Core Claude Code</span>
${skillBar('Claude Code CLI', 95, 'cyan')}
${skillBar('Claude Opus/Sonnet', 95, 'cyan')}
${skillBar('Anthropic API / SDK', 90, 'cyan')}
${skillBar('Claude Agent SDK', 85, 'cyan')}
${skillBar('Custom Skills (/cmd)', 90, 'cyan')}
${skillBar('Auto-Memory Systems', 95, 'cyan')}
${skillBar('CLAUDE.md Config', 90, 'cyan')}
${skillBar('Plan Mode Architect', 90, 'cyan')}

  <span class="yellow bold">⟩ ⚡ SPECIAL SKILL: MULTI-TERMINAL ORCHESTRATION</span>
${skillBar('8x Parallel Claudes', 95, 'cyan')}
  <span class="white">Can simultaneously pilot </span><span class="red bold">8 terminal instances</span>
  <span class="white">of Claude Code at once. Coordinate parallel
  agents across different repos, tasks, and goals.
  Like conducting an orchestra — if the orchestra
  was made of superintelligent AI terminals.</span>

  <span class="green bold">⟩ MCP Server Integration</span>
${skillBar('MCP Protocol', 90, 'cyan')}
${skillBar('Playwright (Browser)', 85, 'cyan')}
${skillBar('Context7 (Live Docs)', 85, 'cyan')}
${skillBar('Custom MCP Servers', 80, 'cyan')}
${skillBar('Database MCP', 75)}

  <span class="green bold">⟩ Agent Orchestration</span>
${skillBar('Sub-agent Spawning', 90, 'cyan')}
${skillBar('Background Agents', 90, 'cyan')}
${skillBar('Parallel Task Exec', 90, 'cyan')}
${skillBar('Agent Composition', 85, 'cyan')}

  <span class="green bold">⟩ Lifecycle Hooks & Events</span>
${skillBar('Pre-command Hooks', 90, 'cyan')}
${skillBar('Post-command Hooks', 90, 'cyan')}
${skillBar('Pre-commit Hooks', 85, 'cyan')}
${skillBar('Tool-call Intercept', 85, 'cyan')}
${skillBar('Event-driven Chains', 85, 'cyan')}
${skillBar('Hook Error Recovery', 80, 'cyan')}

  <span class="green bold">⟩ Remote & Scheduled Ops</span>
${skillBar('Remote Agent Trigger', 90, 'cyan')}
${skillBar('Remote Monitoring', 80, 'cyan')}
${skillBar('CI/CD Agent Pipelines', 80, 'cyan')}
${skillBar('Auto-deploy Triggers', 80, 'cyan')}

  <span class="green bold">⟩ Advanced Claude Techniques</span>
${skillBar('Multi-file Refactors', 90, 'cyan')}
${skillBar('Codebase-wide Search', 90, 'cyan')}
${skillBar('Test Generation', 85, 'cyan')}
${skillBar('Git Workflow Automate', 90, 'cyan')}
${skillBar('Web Fetch + Scrape', 80, 'cyan')}
${skillBar('Screenshot Analysis', 80, 'cyan')}
${skillBar('PDF Ingestion', 75)}

<span class="yellow bold">╔══════════════════════════════════════════════════════════════╗</span>
<span class="yellow bold">║</span>  <span class="white bold">👤 SOFT SKILLS — THE HUMAN LAYER</span>                           <span class="yellow bold">║</span>
<span class="yellow bold">╚══════════════════════════════════════════════════════════════╝</span>

  <span class="green bold">⟩ Leadership & Ownership</span>
${skillBar('Solo Project Delivery', 95, 'cyan')}
${skillBar('Founder Mentality', 95, 'cyan')}
${skillBar('Decision-making', 85, 'cyan')}
${skillBar('Product Thinking', 85, 'cyan')}
${skillBar('Initiative / Bias to Act', 90, 'cyan')}

  <span class="green bold">⟩ Communication</span>
${skillBar('Technical Writing', 85, 'cyan')}
${skillBar('English (C1 Cambridge)', 90, 'cyan')}
${skillBar('Bulgarian (Native)', 100, 'cyan')}
${skillBar('Presentation Skills', 80, 'cyan')}
${skillBar('Documentation', 80, 'cyan')}

  <span class="green bold">⟩ Problem Solving</span>
${skillBar('Debugging Under Fire', 70)}
${skillBar('Rapid Prototyping', 90, 'cyan')}
${skillBar('Root Cause Analysis', 85, 'cyan')}
${skillBar('Creative Workarounds', 90, 'cyan')}
${skillBar('System-level Thinking', 85, 'cyan')}

  <span class="green bold">⟩ Work Ethic & Mindset</span>
${skillBar('Self-taught Drive', 90, 'cyan')}
${skillBar('Ship-it Velocity', 100, 'cyan')}
${skillBar('Learning Speed', 90, 'cyan')}
${skillBar('Curiosity', 100, 'cyan')}
${skillBar('Caffeine Tolerance', 100, 'cyan')}
${skillBar('Sleep Deprivation', 100, 'cyan')}
  <span class="dim">(ironic for the guy who built a sleep app)</span>

  <span class="green bold">⟩ Collaboration</span>
${skillBar('Open Source Contrib.', 60)}
${skillBar('Code Review', 60)}
${skillBar('Pair Programming', 55)}
${skillBar('Mentoring', 50)}
${skillBar('Async Communication', 65)}

  <span class="green bold">⟩ Business & Strategy</span>
${skillBar('Market Research', 70)}
${skillBar('Startup Thinking', 100, 'cyan')}
${skillBar('User Empathy', 70)}
${skillBar('Freemium Modeling', 65)}
${skillBar('Pitch / Demo', 70)}

<span class="dim">  ── Total: 160+ skills loaded ──</span>
<span class="dim">  ── Status: ALL SYSTEMS OPERATIONAL ──</span>

<span class="cyan bold">╔══════════════════════════════════════════════════════════════╗</span>
<span class="cyan bold">║</span>  <span class="green italic">"I don't just use AI tools. I make them do my bidding."</span>     <span class="cyan bold">║</span>
<span class="cyan bold">╚══════════════════════════════════════════════════════════════╝</span>`);
}

function cmdProjects() {
  addResponse(`
<span class="cyan bold">┌─ PROJECTS ──────────────────────────────────────────┐</span>

<div class="project-item">
  <span class="cyan bold">🚀 Nooze</span> <span class="dim">— noozealarm.com</span>
  <span class="white">Cross-platform sleep intelligence app. Kills the
  snooze button with Smart Wake (sleep phase detection),
  Wake Challenges (math, QR, object recognition), and
  competitive gamification (XP, streaks, Wake Duels).
  IoT sunrise simulation via Home Assistant/Tuya/Tellur.</span>
  <span class="white">Founder & Solo Developer · 1 year · Presented at RoboDays '26</span>
  <span class="green">▸ Mobile + Backend + IoT + ML</span>
  <span class="yellow">Kotlin · Jetpack Compose · MVVM · Hilt · Room · SQLCipher
  Firestore · Firebase Auth · FCM · Retrofit · OkHttp
  Health Connect · ML Sensor Fusion · 137+ tests · CI/CD</span>
</div>

<div class="project-item">
  <span class="cyan bold">⚡ Pulse</span> <span class="dim">— github.com/TedoNeObichaJavaScript/pulse</span>
  <span class="white">Lightweight reactive state management library
  with automatic dependency tracking and predictable
  state updates. Built for React applications.</span>
  <span class="green">★ Stars</span> <span class="dim">·</span> <span class="yellow">TypeScript</span>
</div>

<div class="project-item">
  <span class="cyan bold">🎮 Sudo Quest</span> <span class="dim">— github.com/TedoNeObichaJavaScript/Sudo-Quest</span>
  <span class="white">Browser-based interactive coding game. Learn
  JavaScript, Git, Terminal, HTML, CSS, and C#
  through hands-on challenges.</span>
  <span class="green">▸ Educational</span> <span class="dim">·</span> <span class="yellow">JavaScript</span>
</div>

<div class="project-item">
  <span class="cyan bold">🛡 Instant Invoice Fraud Shield</span>
  <span class="white">Backend microservices system for invoice validation
  and fraud-risk analysis. Business rules, data
  validation, and scalable service design.</span>
  <span class="green">▸ Backend</span> <span class="dim">·</span> <span class="yellow">Microservices Architecture</span>
</div>

<div class="project-item">
  <span class="cyan bold">📂 Treasurer</span>
  <span class="white">Enterprise-level AI-integrated file management system.
  Intelligent categorization, search assistance, and
  context-aware recommendations.</span>
  <span class="green">▸ Desktop</span> <span class="dim">·</span> <span class="yellow">C# · AI/ML</span>
</div>

  <span class="dim">Run</span> <span class="cyan">'cat projects.json'</span> <span class="dim">for raw data.</span>

<span class="cyan bold">└─────────────────────────────────────────────────────┘</span>`);
}

function cmdContact() {
  addResponse(`
<span class="cyan bold">┌─ CONTACT ───────────────────────────────────────────┐</span>

  <span class="green bold">⟩ Connect with me</span>

  <span class="cyan">GitHub</span>     <span class="dim">→</span>  <a href="https://github.com/TedoNeObichaJavaScript" target="_blank">github.com/TedoNeObichaJavaScript</a>
  <span class="cyan">LinkedIn</span>   <span class="dim">→</span>  <a href="https://www.linkedin.com/in/teodormirchev" target="_blank">in/teodormirchev</a>
  <span class="cyan">Instagram</span>  <span class="dim">→</span>  <a href="https://instagram.com/t.db3" target="_blank">@t.db3</a>
  <span class="cyan">Website</span>    <span class="dim">→</span>  <a href="https://noozealarm.com" target="_blank">noozealarm.com</a>

  <span class="white">Always open to collaborations and cool projects.</span>

<span class="cyan bold">└─────────────────────────────────────────────────────┘</span>`);
}

function cmdNeofetch() {
  addResponse(`
<div class="neofetch">
  <pre class="neofetch-ascii">
      ████████╗
     ╚══██╔══╝
        ██║   ╔═╗ ╔╗╔═╗
        ██║   ╚═╝ ╚╝╚═╝
        ██║   ╔═╗ ╔╗╔═╗
        ╚═╝   ╚═╝ ╚╝╚═╝
   ┌──────────────────┐
   │  <span class="green">TXDO.DEV</span>        │
   │  <span class="dim">est. 2006</span>       │
   └──────────────────┘
  </pre>
  <div class="neofetch-info">
    <span class="label">visitor</span><span class="white">@</span><span class="label">txdo.dev</span>
    <div class="neofetch-separator">────────────────────────────</div>
    <span class="label">OS:</span> <span class="value">Developer OS v19.0 LTS</span>
    <span class="label">Host:</span> <span class="value">Tedo "Txdo" Mirchev</span>
    <span class="label">Location:</span> <span class="value">Sofia, Bulgaria (UTC+3)</span>
    <span class="label">Kernel:</span> <span class="value">Full-Stack v6.4.2-NOOZE</span>
    <span class="label">Uptime:</span> <span class="value">19 years, always coding</span>
    <span class="label">Packages:</span> <span class="value">JS, TS, Kotlin, Python, Swift, React, Next.js, Node, C#, Go + 120 more</span>
    <span class="label">Shell:</span> <span class="value">txdo-sh 2.0 (interactive)</span>
    <span class="label">Resolution:</span> <span class="value">Pixel perfect</span>
    <span class="label">DE:</span> <span class="value">Terminal-only (GUI is overrated)</span>
    <span class="label">Terminal:</span> <span class="value">This one right here</span>
    <span class="label">CPU:</span> <span class="value">Curiosity-Driven @ ∞GHz</span>
    <span class="label">GPU:</span> <span class="value">Creative Engine RTX ON</span>
    <span class="label">Memory:</span> <span class="value">16GB Skills / 512GB Ideas (87% used)</span>

    <div class="color-blocks">
      <span class="color-block" style="background:#0a0a0a"></span>
      <span class="color-block" style="background:#ff0040"></span>
      <span class="color-block" style="background:#00ff41"></span>
      <span class="color-block" style="background:#ffd600"></span>
      <span class="color-block" style="background:#00e5ff"></span>
      <span class="color-block" style="background:#bf00ff"></span>
      <span class="color-block" style="background:#ff9100"></span>
      <span class="color-block" style="background:#e0e0e0"></span>
    </div>
  </div>
</div>`);
}

function cmdWhoami() {
  addResponse(`<span class="cyan bold">Tedo "Txdo" Mirchev</span> <span class="dim">—</span> <span class="white">19yo Full-Stack Software Engineer</span>
<span class="white">Sofia, Bulgaria · UNIBIT CS · SoftUni JS/Node.js · Cambridge C1</span>
<span class="green">Founder:</span> <span class="white">Nooze (noozealarm.com) — cross-platform sleep intelligence</span>
<span class="green">Stack:</span> <span class="white">JS/TS · Kotlin · Python · React · Next.js · Node · Claude Code · ML · 130+ skills</span>
<span class="dim">Run</span> <span class="cyan">'about'</span> <span class="dim">for the full classified dossier.</span>`);
}

function cmdHistory() {
  if (commandHistory.length === 0) {
    addResponse('<span class="dim">No commands in history.</span>');
    return;
  }
  const lines = commandHistory.map((c, i) => `  <span class="dim">${String(i + 1).padStart(4)}</span>  ${escapeHtml(c)}`).join('\n');
  addResponse(lines);
}

function cmdLs() {
  addResponse(`<span class="cyan bold">about.txt</span>    <span class="cyan bold">skills.json</span>    <span class="cyan bold">projects.json</span>    <span class="cyan bold">contact.txt</span>
<span class="green bold">nooze/</span>       <span class="green bold">pulse/</span>         <span class="green bold">sudo-quest/</span>      <span class="cyan bold">resume.pdf</span>
<span class="cyan bold">.bashrc</span>      <span class="cyan bold">.gitconfig</span>     <span class="cyan bold">README.md</span>        <span class="cyan bold">secrets.enc</span>`);
}

function cmdCat(args) {
  const file = (args[0] || '').toLowerCase();

  const files = {
    'about.txt': () => cmdAbout(),
    'skills.json': () => addResponse(`<span class="yellow">{</span>
  <span class="cyan">"languages"</span>: <span class="yellow">[</span><span class="green">"JavaScript"</span>, <span class="green">"TypeScript"</span>, <span class="green">"Kotlin"</span>, <span class="green">"Python"</span>, <span class="green">"Swift"</span>, <span class="green">"Java"</span>, <span class="green">"C#"</span>, <span class="green">"Go"</span>, <span class="green">"SQL"</span>, <span class="green">"Bash"</span><span class="yellow">]</span>,
  <span class="cyan">"frontend"</span>: <span class="yellow">[</span><span class="green">"React 18"</span>, <span class="green">"Next.js 14"</span>, <span class="green">"React Native"</span>, <span class="green">"Jetpack Compose"</span>, <span class="green">"Tailwind"</span>, <span class="green">"Material 3"</span>, <span class="green">"Vite"</span>, <span class="green">"Webpack"</span>, <span class="green">"Framer Motion"</span><span class="yellow">]</span>,
  <span class="cyan">"backend"</span>: <span class="yellow">[</span><span class="green">"Node.js"</span>, <span class="green">"Express"</span>, <span class="green">"NestJS"</span>, <span class="green">"Firebase Functions"</span>, <span class="green">"Retrofit"</span>, <span class="green">"GraphQL"</span>, <span class="green">"WebSockets"</span>, <span class="green">"Spring Boot"</span>, <span class="green">".NET"</span><span class="yellow">]</span>,
  <span class="cyan">"mobile"</span>: <span class="yellow">[</span><span class="green">"Android Native"</span>, <span class="green">"Kotlin MP"</span>, <span class="green">"React Native"</span>, <span class="green">"iOS Swift"</span>, <span class="green">"Hilt/Dagger"</span>, <span class="green">"Health Connect"</span>, <span class="green">"Play Billing v7"</span><span class="yellow">]</span>,
  <span class="cyan">"databases"</span>: <span class="yellow">[</span><span class="green">"PostgreSQL"</span>, <span class="green">"Firestore"</span>, <span class="green">"Room+SQLCipher"</span>, <span class="green">"MySQL"</span>, <span class="green">"MongoDB"</span>, <span class="green">"Redis"</span>, <span class="green">"Prisma"</span>, <span class="green">"ChromaDB"</span>, <span class="green">"Pinecone"</span><span class="yellow">]</span>,
  <span class="cyan">"devops"</span>: <span class="yellow">[</span><span class="green">"Docker"</span>, <span class="green">"Git"</span>, <span class="green">"GitHub Actions"</span>, <span class="green">"Gradle"</span>, <span class="green">"Fastlane"</span>, <span class="green">"Vercel"</span>, <span class="green">"Nginx"</span>, <span class="green">"Linux"</span><span class="yellow">]</span>,
  <span class="cyan">"security"</span>: <span class="yellow">[</span><span class="green">"OAuth 2.0"</span>, <span class="green">"AES-256"</span>, <span class="green">"BCrypt"</span>, <span class="green">"HTTPS Pinning"</span>, <span class="green">"HMAC-SHA256"</span>, <span class="green">"ProGuard/R8"</span><span class="yellow">]</span>,
  <span class="cyan">"ai_ml"</span>: <span class="yellow">[</span><span class="green">"ML Sensor Fusion"</span>, <span class="green">"TensorFlow"</span>, <span class="green">"PyTorch"</span>, <span class="green">"scikit-learn"</span>, <span class="green">"RAG Pipelines"</span>, <span class="green">"LangChain"</span>, <span class="green">"LlamaIndex"</span>, <span class="green">"Embeddings"</span>, <span class="green">"Fine-tuning"</span>, <span class="green">"ONNX"</span><span class="yellow">]</span>,
  <span class="cyan">"claude_code"</span>: <span class="yellow">[</span><span class="green">"8x Multi-Terminal Orchestration"</span>, <span class="green">"MCP Servers"</span>, <span class="green">"Lifecycle Hooks"</span>, <span class="green">"Remote Triggers"</span>, <span class="green">"Cron Agents"</span>, <span class="green">"RAG Integration"</span>, <span class="green">"Sub-agent Parallelism"</span>, <span class="green">"Worktree Isolation"</span>, <span class="green">"Auto-Memory"</span>, <span class="green">"Plan Mode"</span>, <span class="green">"Custom Skills"</span>, <span class="green">"Playwright MCP"</span>, <span class="green">"Context7 MCP"</span>, <span class="green">"Gmail/Calendar MCP"</span><span class="yellow">]</span>,
  <span class="cyan">"iot"</span>: <span class="yellow">[</span><span class="green">"Home Assistant"</span>, <span class="green">"Tuya Cloud"</span>, <span class="green">"Tellur"</span>, <span class="green">"Arduino"</span>, <span class="green">"Webhooks"</span><span class="yellow">]</span>,
  <span class="cyan">"architecture"</span>: <span class="yellow">[</span><span class="green">"MVVM"</span>, <span class="green">"Clean Architecture"</span>, <span class="green">"Microservices"</span>, <span class="green">"Reactive State"</span>, <span class="green">"Event-Driven"</span>, <span class="green">"DI Patterns"</span><span class="yellow">]</span>,
  <span class="cyan">"_meta"</span>: <span class="yellow">{</span> <span class="cyan">"total_skills"</span>: <span class="red">130</span>, <span class="cyan">"threat_level"</span>: <span class="green">"MAXIMUM"</span> <span class="yellow">}</span>
<span class="yellow">}</span>`),
    'projects.json': () => addResponse(`<span class="yellow">[</span>
  <span class="yellow">{</span>
    <span class="cyan">"name"</span>: <span class="green">"Nooze"</span>,
    <span class="cyan">"url"</span>: <span class="green">"noozealarm.com"</span>,
    <span class="cyan">"role"</span>: <span class="green">"Founder & Solo Developer"</span>,
    <span class="cyan">"started"</span>: <span class="green">"2025-04"</span>,
    <span class="cyan">"stack"</span>: <span class="yellow">[</span><span class="green">"Kotlin"</span>, <span class="green">"Swift"</span>, <span class="green">"Kotlin MP"</span>, <span class="green">"React Native"</span>, <span class="green">"Firestore"</span>, <span class="green">"SQLCipher"</span><span class="yellow">]</span>,
    <span class="cyan">"features"</span>: <span class="yellow">[</span><span class="green">"Smart Wake"</span>, <span class="green">"Wake Challenges"</span>, <span class="green">"Gamification"</span>, <span class="green">"IoT"</span><span class="yellow">]</span>
  <span class="yellow">}</span>,
  <span class="yellow">{</span>
    <span class="cyan">"name"</span>: <span class="green">"Pulse"</span>,
    <span class="cyan">"url"</span>: <span class="green">"github.com/TedoNeObichaJavaScript/pulse"</span>,
    <span class="cyan">"desc"</span>: <span class="green">"Reactive state management library"</span>,
    <span class="cyan">"lang"</span>: <span class="green">"TypeScript"</span>
  <span class="yellow">}</span>,
  <span class="yellow">{</span>
    <span class="cyan">"name"</span>: <span class="green">"Sudo Quest"</span>,
    <span class="cyan">"url"</span>: <span class="green">"github.com/TedoNeObichaJavaScript/Sudo-Quest"</span>,
    <span class="cyan">"desc"</span>: <span class="green">"Interactive coding game"</span>,
    <span class="cyan">"lang"</span>: <span class="green">"JavaScript"</span>
  <span class="yellow">}</span>,
  <span class="yellow">{</span>
    <span class="cyan">"name"</span>: <span class="green">"Instant Invoice Fraud Shield"</span>,
    <span class="cyan">"desc"</span>: <span class="green">"Invoice fraud detection microservices"</span>,
    <span class="cyan">"arch"</span>: <span class="green">"Microservices"</span>
  <span class="yellow">}</span>,
  <span class="yellow">{</span>
    <span class="cyan">"name"</span>: <span class="green">"Treasurer"</span>,
    <span class="cyan">"desc"</span>: <span class="green">"AI-integrated enterprise file manager"</span>,
    <span class="cyan">"lang"</span>: <span class="green">"C#"</span>
  <span class="yellow">}</span>
<span class="yellow">]</span>`),
    'contact.txt': () => cmdContact(),
    '.bashrc': () => addResponse(`<span class="dim"># Txdo's .bashrc — nothing to see here</span>
<span class="green">export</span> <span class="white">PS1</span>=<span class="yellow">"\\[\\033[36m\\]\\u@txdo.dev\\[\\033[0m\\]:\\w\\$ "</span>
<span class="green">alias</span> <span class="white">code</span>=<span class="yellow">"ship-it --fast"</span>
<span class="green">alias</span> <span class="white">sleep</span>=<span class="yellow">"echo 'Not today.'"</span>
<span class="green">alias</span> <span class="white">nooze</span>=<span class="yellow">"cd ~/projects/nooze && npm run dev"</span>
<span class="green">export</span> <span class="white">CREATIVITY</span>=<span class="yellow">"∞"</span>
<span class="green">export</span> <span class="white">COFFEE_LEVEL</span>=<span class="yellow">"CRITICAL"</span>`),
    '.gitconfig': () => addResponse(`<span class="yellow">[user]</span>
  <span class="cyan">name</span> = <span class="white">Txdo</span>
  <span class="cyan">email</span> = <span class="white">tedo@txdo.dev</span>
<span class="yellow">[core]</span>
  <span class="cyan">editor</span> = <span class="white">code --wait</span>
<span class="yellow">[alias]</span>
  <span class="cyan">yolo</span> = <span class="white">!git add -A && git commit -m "ship it 🚀" && git push</span>
  <span class="cyan">undo</span> = <span class="white">reset HEAD~1 --soft</span>
  <span class="cyan">graph</span> = <span class="white">log --oneline --graph --all</span>`),
    'readme.md': () => addResponse(`<span class="cyan bold"># Txdo's Portfolio</span>

<span class="white">Welcome to my terminal-based portfolio.</span>
<span class="white">If you're reading this, you clearly have good taste.</span>

<span class="green">## Quick Start</span>
<span class="dim">$ help          # see all commands</span>
<span class="dim">$ neofetch      # the cool system info</span>
<span class="dim">$ skills        # what I'm good at</span>
<span class="dim">$ projects      # what I've built</span>

<span class="yellow">Made with caffeine and curiosity.</span>`),
    'resume.pdf': () => addResponse(`<span class="red">Error:</span> <span class="white">Cannot render PDF in terminal.</span>
<span class="dim">Try</span> <span class="cyan">'about'</span><span class="dim">,</span> <span class="cyan">'skills'</span><span class="dim">, and</span> <span class="cyan">'experience'</span> <span class="dim">instead.</span>`),
    'secrets.enc': () => addResponse(`<span class="red">🔒 ACCESS DENIED</span>
<span class="dim">This file is encrypted with AES-256-GCM.</span>
<span class="dim">Nice try though. I like your curiosity.</span>
<span class="yellow">Hint:</span> <span class="dim">The secret is that there is no secret.</span>
<span class="dim">      (Just hard work and consistency.)</span>`),
  };

  if (!file) {
    addResponse(`<span class="red">cat:</span> <span class="white">missing file operand</span>\n<span class="dim">Usage: cat &lt;filename&gt;  — try</span> <span class="cyan">'ls'</span> <span class="dim">to see available files.</span>`);
    return;
  }

  if (files[file]) {
    files[file]();
  } else {
    addResponse(`<span class="red">cat: ${escapeHtml(file)}: No such file or directory</span>\n<span class="dim">Try</span> <span class="cyan">'ls'</span> <span class="dim">to see available files.</span>`);
  }
}

function cmdTree() {
  addResponse(`<span class="cyan bold">.</span>
<span class="dim">├──</span> <span class="cyan">about.txt</span>
<span class="dim">├──</span> <span class="cyan">skills.json</span>
<span class="dim">├──</span> <span class="cyan">projects.json</span>
<span class="dim">├──</span> <span class="cyan">contact.txt</span>
<span class="dim">├──</span> <span class="cyan">resume.pdf</span>
<span class="dim">├──</span> <span class="cyan">.bashrc</span>
<span class="dim">├──</span> <span class="cyan">.gitconfig</span>
<span class="dim">├──</span> <span class="cyan">README.md</span>
<span class="dim">├──</span> <span class="cyan">secrets.enc</span>  <span class="red">🔒</span>
<span class="dim">├──</span> <span class="green bold">nooze/</span>
<span class="dim">│   ├──</span> <span class="cyan">package.json</span>
<span class="dim">│   ├──</span> <span class="green bold">src/</span>
<span class="dim">│   └──</span> <span class="cyan">README.md</span>
<span class="dim">├──</span> <span class="green bold">pulse/</span>
<span class="dim">│   ├──</span> <span class="cyan">index.ts</span>
<span class="dim">│   └──</span> <span class="cyan">README.md</span>
<span class="dim">└──</span> <span class="green bold">sudo-quest/</span>
    <span class="dim">├──</span> <span class="cyan">index.html</span>
    <span class="dim">└──</span> <span class="cyan">game.js</span>

<span class="dim">3 directories, 14 files</span>`);
}

function cmdEducation() {
  addResponse(`
<span class="cyan bold">┌─ EDUCATION ─────────────────────────────────────────┐</span>

  <span class="green bold">⟩ Computer Science</span>
  <span class="cyan">UNIBIT</span> <span class="white">— University of Library Studies & IT, Sofia</span>
  <span class="dim">Currently studying</span>

  <span class="green bold">⟩ Software Engineering (JavaScript & Node.js)</span>
  <span class="cyan">SoftUni</span> <span class="white">— Software University</span>
  <span class="dim">Currently studying</span>

  <span class="green bold">⟩ Applied Programming</span>
  <span class="white">Professional Secondary Education — Sofia</span>

  <span class="green bold">⟩ Natural Sciences</span>
  <span class="white">Secondary Education — Sofia</span>

<span class="cyan bold">┌─ CERTIFICATES ──────────────────────────────────────┐</span>

  <span class="cyan">►</span> <span class="white">JavaScript Beginner & Fundamentals</span> <span class="white">— SoftUni</span>
  <span class="cyan">►</span> <span class="white">JavaScript Advanced</span> <span class="white">— SoftUni</span> <span class="yellow">(in progress)</span>
  <span class="cyan">►</span> <span class="white">Software Engineering JS & Node.js</span> <span class="white">— SoftUni</span> <span class="yellow">(in progress)</span>
  <span class="cyan">►</span> <span class="white">Cybersecurity Certificate</span> <span class="white">— Erasmus Program</span>
  <span class="cyan">►</span> <span class="white">C1 Advanced English</span> <span class="white">— Cambridge</span>
  <span class="cyan">►</span> <span class="white">B2 Upper-Intermediate English</span> <span class="white">— Cambridge</span>

<span class="cyan bold">└─────────────────────────────────────────────────────┘</span>`);
}

function cmdExperience() {
  addResponse(`
<span class="cyan bold">┌─ EXPERIENCE ────────────────────────────────────────┐</span>

  <span class="green bold">⟩ Founder & Solo Developer</span>
  <span class="cyan">Nooze</span> <span class="white">· noozealarm.com</span>
  <span class="dim">Apr 2025 → Present</span>
  <span class="white">Built an entire cross-platform sleep intelligence
  app from scratch — solo. Engineered multi-sensor
  sleep stage classification, bi-directional cloud
  sync (Room + Firestore), IoT smart home integration
  (4 protocols), gamification engine, and wake
  challenge system with object recognition.</span>
  <span class="yellow">Kotlin · Swift · Kotlin MP · React Native · Firestore</span>

  <span class="green bold">⟩ Open Source Creator</span>
  <span class="cyan">Pulse</span> <span class="white">· Reactive State Management</span>
  <span class="dim">Nov 2025</span>
  <span class="white">Designed a lightweight reactive state management
  library for JavaScript with automatic dependency
  tracking. Used in React-based applications.</span>
  <span class="yellow">TypeScript</span>

  <span class="green bold">⟩ Backend Engineer (Project)</span>
  <span class="cyan">Instant Invoice Fraud Shield</span>
  <span class="dim">Oct 2025</span>
  <span class="white">Built a microservices backend for invoice validation
  and fraud-risk analysis with scalable service design.</span>

  <span class="green bold">⟩ Desktop Developer (Project)</span>
  <span class="cyan">Treasurer</span> <span class="white">· AI File Manager</span>
  <span class="dim">Mar 2024</span>
  <span class="white">Enterprise-level AI-integrated file management system
  with intelligent categorization and context-aware
  recommendations.</span>
  <span class="yellow">C#</span>

<span class="cyan bold">└─────────────────────────────────────────────────────┘</span>`);
}

function cmdUptime() {
  const now = new Date();
  const born = new Date(2006, 0, 1);
  const diff = now - born;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  addResponse(`<span class="white">up ${days} days,</span> <span class="cyan">${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}</span><span class="white">, load average: </span><span class="green">creativity/∞</span><span class="white">, </span><span class="green">coffee/critical</span><span class="white">, </span><span class="green">ambition/max</span>`);
}

function cmdSudo(args) {
  const subcmd = args.join(' ').toLowerCase();
  if (subcmd.includes('rm -rf')) {
    addResponse(`<span class="red bold">☠  NICE TRY.</span>
<span class="white">You really thought you could rm -rf my portfolio?</span>
<span class="dim">Incident reported. Your IP has been... just kidding.</span>
<span class="yellow">But seriously, don't do that.</span>`);
  } else if (subcmd.includes('hire')) {
    addResponse(`<span class="green bold">✓ SUDO HIRE ACCEPTED</span>
<span class="white">Great choice! Let's build something amazing together.</span>
<span class="dim">Run</span> <span class="cyan">'contact'</span> <span class="dim">to initiate the hiring protocol.</span>`);
  } else {
    addResponse(`<span class="red">[sudo] password for visitor: </span><span class="dim">Nice try, but you're not root here.</span>
<span class="dim">visitor is not in the sudoers file. This incident will be reported.</span>
<span class="yellow">Pro tip:</span> <span class="dim">Try</span> <span class="cyan">'sudo hire txdo'</span>`);
  }
}

function cmdExit() {
  addResponse(`<span class="red">Logout?</span> <span class="white">Where would you even go?</span>
<span class="dim">There is no escape from this terminal.</span>
<span class="dim">But you can check out</span> <span class="cyan">'contact'</span> <span class="dim">to reach the real me.</span>`);
}

let matrixIntensity = 1;
function cmdMatrix() {
  matrixIntensity = matrixIntensity === 1 ? 3 : matrixIntensity === 3 ? 0 : 1;
  const canvas = document.getElementById('matrix-rain');
  const levels = { 0: 0, 1: 0.12, 3: 0.35 };
  const names = { 0: 'OFF', 1: 'NORMAL', 3: 'INTENSE' };
  canvas.style.opacity = levels[matrixIntensity];
  canvas.style.transition = 'opacity 0.5s ease';
  addResponse(`<span class="green">Matrix rain:</span> <span class="cyan bold">${names[matrixIntensity]}</span>`);
}

function cmdGui() {
  addResponse(`<span class="red bold">ERROR: gui.exe not found</span>

<span class="white">GUIs are for people who can't handle the terminal.</span>
<span class="dim">You clearly can. Respect.</span>

<span class="yellow">     _______________</span>
<span class="yellow">    |  ___________  |</span>
<span class="yellow">    | |           | |</span>
<span class="yellow">    | |   </span><span class="green">TERMINAL</span><span class="yellow"> | |</span>
<span class="yellow">    | |    </span><span class="green">&gt; IS</span><span class="yellow">   | |</span>
<span class="yellow">    | |   </span><span class="green">ENOUGH</span><span class="yellow">  | |</span>
<span class="yellow">    | |___________| |</span>
<span class="yellow">    |_______________|</span>
<span class="yellow">       /_________\\</span>
<span class="yellow">      /___________\\</span>`);
}

function cmdCowsay(args) {
  const msg = args.length ? args.join(' ') : 'Moo! Txdo is awesome!';
  const border = '-'.repeat(msg.length + 2);
  addResponse(`<span class="white"> ${border}</span>
<span class="white">&lt; ${escapeHtml(msg)} &gt;</span>
<span class="white"> ${border}</span>
<span class="white">        \\   ^__^</span>
<span class="white">         \\  (oo)\\_______</span>
<span class="white">            (__)\\       )\\/\\</span>
<span class="white">                ||----w |</span>
<span class="white">                ||     ||</span>`);
}

function cmdNooze() {
  addResponse(`
<span class="cyan bold">╔══════════════════════════════════════════════════════════════╗</span>
<span class="cyan bold">║</span>  <span class="green bold">NOOZE</span> <span class="dim">— Kill the Snooze Button</span>                             <span class="cyan bold">║</span>
<span class="cyan bold">╠══════════════════════════════════════════════════════════════╣</span>
<span class="cyan bold">║</span>  <span class="dim">noozealarm.com</span>           <span class="dim">Solo-built · Apr 2025 → Present</span>   <span class="cyan bold">║</span>
<span class="cyan bold">╚══════════════════════════════════════════════════════════════╝</span>

  <span class="white bold">The standard alarm was invented 200 years ago and hasn't
  changed. Nooze is a cross-platform sleep intelligence app
  that replaces the snooze button with science.</span>

<span class="yellow bold">━━━ CORE FEATURES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

  <span class="green bold">01. Smart Wake</span>
  <span class="white">Multi-sensor fusion engine classifies sleep phases in
  real-time (accelerometer RMS + microphone dB analysis).
  Opens a wake window and wakes you in light sleep.
  Confidence scoring (0-1) with 0.60 threshold.</span>

  <span class="green bold">02. Wake Challenges</span>
  <span class="white">Prove you're awake: solve math, scan a QR code in
  another room, shake phone 30x, or use camera object
  recognition ("Show me a coffee cup").</span>

  <span class="green bold">03. Gamification</span>
  <span class="white">XP, levels, streaks, achievements, daily quests.
  Wake Duels — challenge friends: who wakes faster?
  Who has better sleep quality this week?</span>

  <span class="green bold">04. IoT Smart Home</span>
  <span class="white">Sunrise simulation via real lights. Supports 4
  protocols: Home Assistant, Tuya Cloud, Tellur,
  and generic webhooks. Your home puts you to sleep
  and wakes you up.</span>

<span class="yellow bold">━━━ TECH STACK (Android / Kotlin) ━━━━━━━━━━━━━━━━━━━━</span>

  <span class="green bold">Core</span>
  <span class="cyan">Platform:</span>    <span class="white">React Native 0.73+ (TS) + Kotlin 1.9.22 native</span>
  <span class="cyan">UI:</span>          <span class="white">Jetpack Compose + Material 3 (BOM 2024)</span>
  <span class="cyan">Arch:</span>        <span class="white">MVVM + Clean Architecture + Repository Pattern</span>
  <span class="cyan">DI:</span>          <span class="white">Hilt / Dagger 2</span>
  <span class="cyan">Async:</span>       <span class="white">Kotlin Coroutines + StateFlow + SharedFlow</span>

  <span class="green bold">Data & Security</span>
  <span class="cyan">Local DB:</span>    <span class="white">Room + SQLCipher 4.5.4 (AES-256, 15 DAOs, 19 migrations)</span>
  <span class="cyan">Backend:</span>     <span class="white">Firebase Firestore (real-time, offline persistence)</span>
  <span class="cyan">Auth:</span>        <span class="white">Firebase Auth + Credential Mgr (OAuth 2.0, Google SSO)</span>
  <span class="cyan">Crypto:</span>      <span class="white">BCrypt + AndroidX Security (EncryptedSharedPrefs)</span>
  <span class="cyan">Security:</span>    <span class="white">ProGuard/R8 + HTTPS pinning + Firestore ACL</span>

  <span class="green bold">Intelligence & IoT</span>
  <span class="cyan">Sensors:</span>     <span class="white">Accelerometer + Microphone (ML confidence scoring)</span>
  <span class="cyan">Health:</span>      <span class="white">Health Connect API (HR, HRV, SpO2, sleep stages)</span>
  <span class="cyan">Smart Home:</span>  <span class="white">Home Assistant REST + Tuya Cloud (HMAC-SHA256)</span>
  <span class="cyan">Network:</span>    <span class="white">Retrofit 2 + OkHttp + Moshi (interceptors, JSON)</span>

  <span class="green bold">Infrastructure</span>
  <span class="cyan">Cloud:</span>       <span class="white">Firebase Cloud Functions (Node.js) + FCM push</span>
  <span class="cyan">Payments:</span>    <span class="white">Google Play Billing v7.1.1 (freemium subs)</span>
  <span class="cyan">Analytics:</span>   <span class="white">Firebase Analytics + Crashlytics + Remote Config</span>
  <span class="cyan">CI/CD:</span>       <span class="white">GitHub Actions + Gradle + Fastlane</span>
  <span class="cyan">Testing:</span>     <span class="white">JUnit 5 + Mockito + Compose UI (137+ test cases)</span>
  <span class="cyan">Quality:</span>     <span class="white">Ktlint + Detekt + SonarQube</span>
  <span class="cyan">Nav:</span>         <span class="white">Jetpack Navigation + Deep Links (nooze:// scheme)</span>

  <span class="white">Targeting a</span> <span class="green bold">$15B</span> <span class="white">sleep tech market growing 15%/year.</span>
  <span class="white">Freemium model · Premium at</span> <span class="cyan">€0.99/month</span>
  <span class="white">Presented at</span> <span class="cyan bold">RoboDays '26</span>

  <span class="green italic">"We don't want to improve the alarm.
   We want to improve the way you wake up."</span>`);
}

// ─── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  runBoot();
});
