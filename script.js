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
  { text: '  [████████████████████] react.ko', cls: 'cyan', delay: 30 },
  { text: '  [████████████████████] node.ko', cls: 'cyan', delay: 30 },
  { text: '  [████████████████████] typescript.ko', cls: 'cyan', delay: 30 },
  { text: '  [████████████████████] docker.ko', cls: 'cyan', delay: 30 },
  { text: '  [████████████████████] postgresql.ko', cls: 'cyan', delay: 30 },
  { text: '  [████████████████████] creativity.ko', cls: 'green', delay: 30 },
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

function addResponse(html) {
  const div = document.createElement('div');
  div.className = 'response';
  div.innerHTML = html;
  output.appendChild(div);
  scrollToBottom();
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
  'education', 'experience', 'socials', 'echo', 'banner', 'tree', 'matrix', 'gui'];

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
  addResponse(`<span class="dim">Welcome to Txdo's portfolio terminal. Type</span> <span class="cyan">'help'</span> <span class="dim">to get started.</span>`);
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
<span class="cyan bold">║</span>  <span class="cyan">about</span>      <span class="dim">→</span> Who is Txdo?                           <span class="cyan bold">║</span>
<span class="cyan bold">║</span>  <span class="cyan">skills</span>     <span class="dim">→</span> Technical skill bars                   <span class="cyan bold">║</span>
<span class="cyan bold">║</span>  <span class="cyan">projects</span>   <span class="dim">→</span> Featured projects & repos              <span class="cyan bold">║</span>
<span class="cyan bold">║</span>  <span class="cyan">experience</span> <span class="dim">→</span> Work experience                        <span class="cyan bold">║</span>
<span class="cyan bold">║</span>  <span class="cyan">education</span>  <span class="dim">→</span> Education background                   <span class="cyan bold">║</span>
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
<span class="cyan bold">┌─ ABOUT ─────────────────────────────────────────────┐</span>

  <span class="green bold">Tedo "Txdo"</span> <span class="dim">·</span> <span class="white">19 y/o Full-Stack Developer</span>
  <span class="dim">📍</span> <span class="white">Sofia, Bulgaria</span>

  Passionate developer who builds scalable, modern
  applications. Fast learner driven by curiosity and
  the desire to create things that actually matter.

  <span class="cyan bold">Currently:</span>
  <span class="white">→ Founder & Lead Dev at</span> <span class="green bold">Nooze</span> <span class="dim">(noozealarm.com)</span>
  <span class="white">→ Building reactive state management (Pulse)</span>
  <span class="white">→ Creating educational coding games (Sudo Quest)</span>

  <span class="cyan bold">Philosophy:</span>
  <span class="dim italic">"Ship fast, learn faster, break things, fix them,
   then build something even better."</span>

<span class="cyan bold">└─────────────────────────────────────────────────────┘</span>`);
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
<span class="cyan bold">┌─ SKILLS ────────────────────────────────────────────┐</span>

  <span class="green bold">⟩ Languages</span>
${skillBar('JavaScript', 95, 'cyan')}
${skillBar('TypeScript', 90, 'cyan')}
${skillBar('Java', 75)}
${skillBar('Python', 70)}
${skillBar('C#', 65)}
${skillBar('Haskell', 45)}
${skillBar('HTML/CSS', 95, 'cyan')}

  <span class="green bold">⟩ Frameworks & Libraries</span>
${skillBar('React', 90, 'cyan')}
${skillBar('React Native', 80, 'cyan')}
${skillBar('Node.js', 85, 'cyan')}
${skillBar('Spring Boot', 60)}
${skillBar('Tailwind CSS', 85, 'cyan')}
${skillBar('Bootstrap', 80, 'cyan')}

  <span class="green bold">⟩ Databases & Infra</span>
${skillBar('PostgreSQL', 80, 'cyan')}
${skillBar('MySQL', 70)}
${skillBar('Redis', 65)}
${skillBar('Docker', 70)}
${skillBar('Nginx', 60)}

  <span class="green bold">⟩ Tools & Other</span>
${skillBar('Git', 90, 'cyan')}
${skillBar('Figma', 70)}
${skillBar('Arduino', 55)}
${skillBar('Android', 60)}

<span class="cyan bold">└─────────────────────────────────────────────────────┘</span>`);
}

function cmdProjects() {
  addResponse(`
<span class="cyan bold">┌─ PROJECTS ──────────────────────────────────────────┐</span>

<div class="project-item">
  <span class="cyan bold">🚀 Nooze</span> <span class="dim">— noozealarm.com</span>
  <span class="white">My biggest project. A modern alarm/notification
  platform. Built with love and sleepless nights.</span>
  <span class="dim">Founder & Lead Developer</span>
  <span class="green">▸ Full-Stack</span> <span class="dim">·</span> <span class="yellow">React Native · Node.js · PostgreSQL</span>
</div>

<div class="project-item">
  <span class="cyan bold">⚡ Pulse</span> <span class="dim">— github.com/TedoNeObichaJavaScript/pulse</span>
  <span class="white">Powerful, lightweight reactive state management
  framework with automatic dependency tracking.</span>
  <span class="green">★ 5 stars</span> <span class="dim">·</span> <span class="yellow">TypeScript</span>
</div>

<div class="project-item">
  <span class="cyan bold">🎮 Sudo Quest</span> <span class="dim">— github.com/TedoNeObichaJavaScript/Sudo-Quest</span>
  <span class="white">Browser-based interactive coding game. Learn
  JavaScript, Git, Terminal, HTML, CSS, and C#
  by actually doing challenges.</span>
  <span class="green">▸ Educational</span> <span class="dim">·</span> <span class="yellow">JavaScript</span>
</div>

  <span class="dim">Run</span> <span class="cyan">'cat projects.json'</span> <span class="dim">for raw data.</span>

<span class="cyan bold">└─────────────────────────────────────────────────────┘</span>`);
}

function cmdContact() {
  addResponse(`
<span class="cyan bold">┌─ CONTACT ───────────────────────────────────────────┐</span>

  <span class="green bold">⟩ Connect with me</span>

  <span class="cyan">GitHub</span>     <span class="dim">→</span>  <a href="https://github.com/TedoNeObichaJavaScript" target="_blank">github.com/TedoNeObichaJavaScript</a>
  <span class="cyan">LinkedIn</span>   <span class="dim">→</span>  <a href="https://linkedin.com/in/teodor-mirchev-91115a305" target="_blank">in/teodor-mirchev-91115a305</a>
  <span class="cyan">Instagram</span>  <span class="dim">→</span>  <a href="https://instagram.com/t.db3" target="_blank">@t.db3</a>
  <span class="cyan">Website</span>    <span class="dim">→</span>  <a href="https://noozealarm.com" target="_blank">noozealarm.com</a>

  <span class="dim">Always open to collaborations and cool projects.</span>

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
   │  <span class="dim">est. 2007</span>       │
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
    <span class="label">Packages:</span> <span class="value">React, Node, TS, Java, Python, C#, Haskell</span>
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
  addResponse(`<span class="cyan bold">Tedo "Txdo"</span> <span class="dim">—</span> <span class="white">19yo Full-Stack Developer & Founder of Nooze</span>
<span class="dim">Sofia, Bulgaria · Builds things that matter · Ships fast</span>
<span class="green">Currently:</span> <span class="white">Working on Nooze, Pulse, and Sudo Quest</span>`);
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
  <span class="cyan">"languages"</span>: <span class="yellow">[</span><span class="green">"JavaScript"</span>, <span class="green">"TypeScript"</span>, <span class="green">"Java"</span>, <span class="green">"Python"</span>, <span class="green">"C#"</span>, <span class="green">"Haskell"</span><span class="yellow">]</span>,
  <span class="cyan">"frontend"</span>: <span class="yellow">[</span><span class="green">"React"</span>, <span class="green">"React Native"</span>, <span class="green">"Tailwind"</span>, <span class="green">"Bootstrap"</span>, <span class="green">"HTML5"</span>, <span class="green">"CSS3"</span><span class="yellow">]</span>,
  <span class="cyan">"backend"</span>: <span class="yellow">[</span><span class="green">"Node.js"</span>, <span class="green">"Spring Boot"</span>, <span class="green">"Nginx"</span><span class="yellow">]</span>,
  <span class="cyan">"databases"</span>: <span class="yellow">[</span><span class="green">"PostgreSQL"</span>, <span class="green">"MySQL"</span>, <span class="green">"Redis"</span><span class="yellow">]</span>,
  <span class="cyan">"devops"</span>: <span class="yellow">[</span><span class="green">"Docker"</span>, <span class="green">"Git"</span>, <span class="green">"Nginx"</span><span class="yellow">]</span>,
  <span class="cyan">"other"</span>: <span class="yellow">[</span><span class="green">"Figma"</span>, <span class="green">"Arduino"</span>, <span class="green">"Android"</span><span class="yellow">]</span>
<span class="yellow">}</span>`),
    'projects.json': () => addResponse(`<span class="yellow">[</span>
  <span class="yellow">{</span>
    <span class="cyan">"name"</span>: <span class="green">"Nooze"</span>,
    <span class="cyan">"url"</span>: <span class="green">"noozealarm.com"</span>,
    <span class="cyan">"role"</span>: <span class="green">"Founder & Lead Developer"</span>,
    <span class="cyan">"stack"</span>: <span class="yellow">[</span><span class="green">"React Native"</span>, <span class="green">"Node.js"</span>, <span class="green">"PostgreSQL"</span><span class="yellow">]</span>
  <span class="yellow">}</span>,
  <span class="yellow">{</span>
    <span class="cyan">"name"</span>: <span class="green">"Pulse"</span>,
    <span class="cyan">"url"</span>: <span class="green">"github.com/TedoNeObichaJavaScript/pulse"</span>,
    <span class="cyan">"desc"</span>: <span class="green">"Reactive state management framework"</span>,
    <span class="cyan">"stars"</span>: <span class="purple">5</span>,
    <span class="cyan">"lang"</span>: <span class="green">"TypeScript"</span>
  <span class="yellow">}</span>,
  <span class="yellow">{</span>
    <span class="cyan">"name"</span>: <span class="green">"Sudo Quest"</span>,
    <span class="cyan">"url"</span>: <span class="green">"github.com/TedoNeObichaJavaScript/Sudo-Quest"</span>,
    <span class="cyan">"desc"</span>: <span class="green">"Interactive coding game"</span>,
    <span class="cyan">"lang"</span>: <span class="green">"JavaScript"</span>
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

  <span class="green bold">⟩ Self-Taught Developer</span>
  <span class="white">The best education is building real things.</span>
  <span class="dim">Started coding, never stopped.</span>

  <span class="green bold">⟩ Continuous Learning</span>
  <span class="white">Currently deepening knowledge in:</span>
  <span class="cyan">→</span> <span class="white">React & React Native ecosystem</span>
  <span class="cyan">→</span> <span class="white">Node.js backend architecture</span>
  <span class="cyan">→</span> <span class="white">Java & Spring Boot</span>
  <span class="cyan">→</span> <span class="white">System design & scalability</span>

  <span class="dim">"Every repo is a classroom."</span>

<span class="cyan bold">└─────────────────────────────────────────────────────┘</span>`);
}

function cmdExperience() {
  addResponse(`
<span class="cyan bold">┌─ EXPERIENCE ────────────────────────────────────────┐</span>

  <span class="green bold">⟩ Founder & Lead Developer</span>
  <span class="cyan">Nooze</span> <span class="dim">· noozealarm.com</span>
  <span class="dim">2024 → Present</span>
  <span class="white">Building a modern alarm/notification platform
  from the ground up. Handling everything from
  mobile development to backend infrastructure.</span>

  <span class="green bold">⟩ Open Source Creator</span>
  <span class="cyan">Pulse</span> <span class="dim">· State Management Framework</span>
  <span class="dim">2024 → Present</span>
  <span class="white">Created a reactive state management library
  for JS/TS with automatic dependency tracking.
  5 stars and growing.</span>

  <span class="green bold">⟩ Educational Content Creator</span>
  <span class="cyan">Sudo Quest</span> <span class="dim">· Interactive Coding Game</span>
  <span class="dim">2024 → Present</span>
  <span class="white">Browser-based game teaching JS, Git, Terminal,
  HTML, CSS, and C# through interactive challenges.</span>

<span class="cyan bold">└─────────────────────────────────────────────────────┘</span>`);
}

function cmdUptime() {
  const now = new Date();
  const born = new Date(2007, 0, 1);
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

// ─── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  runBoot();
});
