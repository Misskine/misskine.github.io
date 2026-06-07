/* ============================================================
   Professeur Layton et le Voyage de Widad
   Moteur de scènes — vanilla JS
   ============================================================ */
(function () {
  "use strict";

  const A = {
    layton: "assets/layton.png",
    luke: "assets/luke.png",
    town: "assets/bg_town.jpg",
    study: "assets/bg_study.jpg",
    museum: "assets/bg_museum.jpg",
    lobby: "assets/bg_lobby.jpg",
    cafe: "assets/bg_cafe.jpg",
    london: "assets/bg_london.jpg",
  };

  /* ---------- DIALOGUES ---------- */
  const INTRO = {
    bg: A.town,
    lines: [
      { who: "luke", name: "Luke", t: "Professeur ! Regardez... une lettre vient d'arriver." },
      { who: "layton", name: "Layton", t: "Une lettre ? À cette heure-ci ? Voyons cela de plus près, mon garçon." },
      { who: "luke", name: "Luke", t: "C'est étrange... elle n'est adressée ni à vous, ni à moi. Un seul nom y figure : Widad." },
      { who: "layton", name: "Layton", t: "Hmm. Et le cachet de cire dissimule trois énigmes scellées." },
      { who: "layton", name: "Layton", t: "Chaque énigme révèle un indice. Ensemble, ils désigneront une destination... et un voyageur." },
      { who: "luke", name: "Luke", t: "Un mystère à résoudre ! Par où commençons-nous ?" },
      { who: "layton", name: "Layton", t: "Là où commencent toutes les bonnes histoires. Widad, la première énigme vous attend." },
    ],
  };

  const INTER1 = {
    bg: A.study,
    lines: [
      { who: "luke", name: "Luke", t: "Londres ! Mais... que vient faire cette ville dans une lettre destinée à Widad ?" },
      { who: "layton", name: "Layton", t: "Patience. Une énigme résolue n'est qu'une porte vers la suivante. Poursuivons." },
    ],
  };

  const INTER2 = {
    bg: A.cafe,
    lines: [
      { who: "layton", name: "Layton", t: "Londres... treize heures cinq. Le tableau se précise, ne trouvez-vous pas ?" },
      { who: "luke", name: "Luke", t: "Il ne manque plus qu'une chose, Professeur : QUI prend ce train ?" },
      { who: "layton", name: "Layton", t: "La dernière énigme nous le dira. À vous de jouer, Widad." },
    ],
  };

  const FINALE = {
    bg: A.town,
    lines: [
      { who: "luke", name: "Luke", t: "Londres... 13h05... Widad ! Professeur, les trois indices ne forment qu'une seule phrase !" },
      { who: "layton", name: "Layton", t: "En effet. « Widad part pour Londres, à treize heures cinq. »" },
      { who: "layton", name: "Layton", t: "Cette lettre n'était pas une énigme à résoudre. C'était une invitation." },
      { who: "luke", name: "Luke", t: "Alors la valise est déjà prête, et le quai n'attend plus qu'elle !" },
      { who: "layton", name: "Layton", t: "Un vrai gentleman n'arrive jamais en retard à un anniversaire. En voiture, Widad." },
    ],
  };

  /* ---------- ÉNIGMES ---------- */
  const PUZZLES = [
    {
      no: "001", title: "La Ville aux Mille Visages", picarats: 20, coins: 10, bg: A.lobby,
      prompt: "« Je veille au bord d'un fleuve nommé Tamise. Mes autobus sont rouges, mes cabines aussi, et une grande tour sonne l'heure pour le monde entier. »",
      question: "Quelle ville se cache derrière ces indices ?",
      instr: "Touche la bonne réponse.",
      choices: ["Paris", "Londres", "Venise"],
      answer: 1,
      clue: "LONDRES",
      hints: [
        "Pensez à un pays où l'on conduit à gauche.",
        "La fameuse tour qui sonne l'heure s'appelle Big Ben.",
        "C'est la capitale du Royaume-Uni. La réponse commence par un L.",
      ],
    },
    {
      no: "002", title: "L'Heure du Départ", picarats: 30, coins: 20, bg: A.museum,
      prompt: "Le train pour Londres s'élance à l'instant précis, juste après midi, où la grande et la petite aiguille d'une horloge se superposent parfaitement.",
      question: "À quelle heure ce train part-il ?",
      instr: "Touche la bonne réponse.",
      choices: ["12 h 30", "13 h 05", "12 h 55"],
      answer: 1,
      clue: "13 H 05",
      hints: [
        "À midi pile, les deux aiguilles sont ensemble — mais après, la grande file plus vite.",
        "Elles ne se rejoignent donc pas à 13h00 exactement, mais un tout petit peu plus tard.",
        "Les aiguilles se superposent à nouveau vers 13 h 05.",
      ],
    },
    {
      no: "003", title: "Le Voyageur", picarats: 40, coins: 30, bg: A.london,
      prompt: "« Cette personne possède un billet qu'elle n'a pas acheté. Son voyage commence bientôt, et pourtant, là-bas, on l'attend déjà. »",
      question: "Qui est ce mystérieux voyageur ?",
      instr: "Touche la bonne réponse.",
      choices: ["Le Professeur Layton", "Widad", "Le facteur"],
      answer: 1,
      clue: "WIDAD",
      hints: [
        "La lettre du tout début ne portait qu'un seul nom...",
        "Ce n'est ni Layton, ni Luke, ni celui qui livre le courrier.",
        "Relisez la première énigme. Le nom du voyageur y était déjà inscrit.",
      ],
    },
  ];

  /* ============================================================
     SÉQUENCE
  ============================================================ */
  const STEPS = [
    { type: "menu" },
    { type: "dialogue", data: INTRO },
    { type: "pintro", p: 0 },
    { type: "puzzle", p: 0 },
    { type: "dialogue", data: INTER1 },
    { type: "pintro", p: 1 },
    { type: "puzzle", p: 1 },
    { type: "dialogue", data: INTER2 },
    { type: "pintro", p: 2 },
    { type: "puzzle", p: 2 },
    { type: "dialogue", data: FINALE },
    { type: "credits" },
    { type: "reveal" },
  ];

  /* ============================================================
     ÉTAT
  ============================================================ */
  const top = document.getElementById("topInner");
  const bot = document.getElementById("botInner");
  const state = { step: 0, line: 0, total: 0 };

  const SAVE = "widad_layton_v1";
  function save() { try { localStorage.setItem(SAVE, JSON.stringify({ step: state.step, total: state.total })); } catch (e) {} }
  function load() { try { const s = JSON.parse(localStorage.getItem(SAVE) || "{}"); if (typeof s.step === "number") { state.step = s.step; state.total = s.total || 0; } } catch (e) {} }

  /* ---------- petit son ---------- */
  let actx = null;
  function blip(freq, dur, type) {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type || "triangle"; o.frequency.value = freq || 520;
      g.gain.value = 0.05; o.connect(g); g.connect(actx.destination);
      o.start(); g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + (dur || 0.12));
      o.stop(actx.currentTime + (dur || 0.12));
    } catch (e) {}
  }

  /* ---------- rendu d'écran ---------- */
  function setTop(html, fade) { top.innerHTML = ""; const d = document.createElement("div"); if (fade !== false) d.className = "fadein"; d.innerHTML = html; top.appendChild(d); return d; }
  function setBot(html, fade) { bot.innerHTML = ""; const d = document.createElement("div"); if (fade !== false) d.className = "fadein"; d.innerHTML = html; bot.appendChild(d); return d; }

  function castHTML(activeWho, hasLuke, hasLayton) {
    let h = '<div class="cast">';
    if (hasLuke) h += `<img class="char luke enter-l ${activeWho === "luke" ? "" : "dim"}" src="${A.luke}" alt="Luke">`;
    if (hasLayton) h += `<img class="char layton enter-r ${activeWho === "layton" ? "" : "dim"}" src="${A.layton}" alt="Layton">`;
    h += "</div>";
    return h;
  }

  /* ============================================================
     RENDERERS
  ============================================================ */
  function render() {
    save();
    const s = STEPS[state.step];
    if (!s) return;
    if (s.type === "menu") return renderMenu();
    if (s.type === "dialogue") return renderDialogue(s.data);
    if (s.type === "pintro") return renderPIntro(PUZZLES[s.p]);
    if (s.type === "puzzle") return renderPuzzle(PUZZLES[s.p]);
    if (s.type === "credits") return renderCredits();
    if (s.type === "reveal") return renderReveal();
  }

  function goNext() { state.step = Math.min(state.step + 1, STEPS.length - 1); state.line = 0; render(); }

  /* ---------- MENU ---------- */
  function renderMenu() {
    setTop(`
      <div class="menuTop">
        <img class="bg" src="${A.town}" alt="">
        <div class="haze"></div>
        <div class="titlePlate">
          <div class="kicker">PROFESSEUR&nbsp;LAYTON</div>
          <div class="bigTitle">et le Voyage<br>de <span class="em">Widad</span></div>
          <div class="ribbon">Un mystère scellé à la cire</div>
        </div>
      </div>`);
    const d = setBot(`
      <div class="menuBot">
        <div class="hello">Joyeux anniversaire, Widad ✦</div>
        <button class="mbtn play" data-go="1"><span class="ic"></span>Nouvelle Partie</button>
        <button class="mbtn cont" data-go="cont"><span class="ic"></span>Continuer</button>
        <button class="mbtn bonus" data-go="bonus"><span class="ic"></span>Bonus</button>
        <div class="menuFoot">© Un cadeau mystérieux · 2026</div>
      </div>`);
    d.querySelector('[data-go="1"]').onclick = () => { blip(620, .1); state.total = 0; state.step = 1; state.line = 0; render(); };
    d.querySelector('[data-go="cont"]').onclick = () => {
      blip(560, .1);
      // reprend à la dernière énigme commencée, sinon début
      const saved = (() => { try { return JSON.parse(localStorage.getItem(SAVE) || "{}").step || 1; } catch (e) { return 1; } })();
      state.step = Math.max(1, saved); state.line = 0; render();
    };
    d.querySelector('[data-go="bonus"]').onclick = () => {
      blip(480, .1);
      setBot(`<div class="menuBot"><div class="hello">Bonus</div>
        <div style="font-family:var(--font-story);font-size:26px;color:#6a4a1a;text-align:center;line-height:1.5;padding:0 40px">
        Les vrais bonus se débloquent à Londres.<br>Résous d'abord les trois énigmes, Widad. 🎩</div>
        <button class="mbtn cont" id="back"><span class="ic"></span>Retour</button></div>`)
        .querySelector("#back").onclick = renderMenu;
    };
  }

  /* ---------- DIALOGUE ---------- */
  function renderDialogue(dlg) {
    const seenLuke = dlg.lines.slice(0, state.line + 1).some(l => l.who === "luke");
    const seenLayton = dlg.lines.slice(0, state.line + 1).some(l => l.who === "layton");
    const line = dlg.lines[state.line];

    setTop(`
      <div class="scene">
        <img class="bg" src="${dlg.bg}" alt="">
        <div class="scrim" style="background:linear-gradient(180deg,rgba(0,0,0,.04),rgba(20,12,4,.18))"></div>
        ${castHTML(line.who, seenLuke, seenLayton)}
      </div>`, state.line === 0);

    const last = state.line >= dlg.lines.length - 1;
    const d = setBot(`
      <div class="dlgWrap">
        <div class="dlgBox">
          <div class="nameTag">${line.name}</div>
          <div class="dlgText">${line.t}</div>
          <div class="nextArrow">${last ? "▸" : "▾"}</div>
        </div>
      </div>`, false);

    const advance = () => {
      blip(700, .06, "sine");
      if (state.line < dlg.lines.length - 1) { state.line++; renderDialogue(dlg); }
      else goNext();
    };
    d.querySelector(".dlgWrap").onclick = advance;
    armKeys(advance);
  }

  /* ---------- INTRO ÉNIGME (carte) ---------- */
  function renderPIntro(pz) {
    const idx = pz.answer; // unused
    setTop(`
      <div class="introTop cardTop">
        <div class="lbl">Énigme !</div>
        <div class="no">N°${pz.no}</div>
        <div class="nm">${pz.title}</div>
      </div>`);
    const d = setBot(`
      <div class="introBot cardBot">
        <div class="hat"></div>
        <div class="worth">Cette énigme vaut</div>
        <div class="val"><b>${pz.picarats}</b>/${pz.picarats}</div>
        <div class="pic">Picarats</div>
        <div class="tap">— touche pour découvrir l'énigme —</div>
      </div>`);
    const go = () => { blip(580, .1); goNext(); };
    d.querySelector(".introBot").onclick = go;
    top.firstChild.onclick = go;
    armKeys(go);
  }

  /* ---------- ÉNIGME ---------- */
  function renderPuzzle(pz) {
    const pst = { hints: 0, solved: false };

    function drawTop() {
      setTop(`
        <div class="pzTop">
          <div class="hud">
            <span class="pno">N°${pz.no}</span>
            <span class="pp">${pz.picarats} PICARATS</span>
            <span>PIÈCES : ${pz.coins}</span>
          </div>
          <div class="pzBody">
            <div class="skyline"></div>
            <div class="pzPrompt">
              <span class="pzQuote">${pz.prompt}</span>
              <span class="q">${pz.question}</span>
            </div>
          </div>
        </div>`, false);
    }

    function drawBot() {
      const pips = [1, 2, 3].map(n => `<span class="pip ${n <= pst.hints ? "" : "off"}">${n}</span>`).join("");
      const choices = pz.choices.map((c, i) =>
        `<button class="choice" data-i="${i}"><span class="num">${i + 1}</span><span>${c}</span></button>`).join("");
      const d = setBot(`
        <div class="pzBot">
          <div class="pzTools">
            <button class="toolBtn hints" id="hintBtn">INDICES ${pips}</button>
            <button class="toolBtn quit" id="quitBtn">QUITTER</button>
          </div>
          <div class="pzInstr">${pz.instr}</div>
          <div class="choices">${choices}</div>
        </div>`, false);

      d.querySelectorAll(".choice").forEach(btn => {
        btn.onclick = () => {
          if (pst.solved) return;
          const i = +btn.dataset.i;
          if (i === pz.answer) { pst.solved = true; btn.classList.add("right"); blip(880, .14, "sine"); setTimeout(() => showCorrect(pz), 480); }
          else { btn.classList.add("wrong"); blip(180, .22, "square"); setTimeout(() => { btn.classList.remove("wrong"); showIncorrect(pz, drawTop, drawBot); }, 480); }
        };
      });
      d.querySelector("#hintBtn").onclick = () => openHint(pz, pst, drawBot);
      d.querySelector("#quitBtn").onclick = () => { blip(300, .1); renderMenu(); };
    }

    drawTop();
    drawBot();
    armKeys(null);
  }

  function openHint(pz, pst, drawBot) {
    if (pst.hints < 3) pst.hints++;
    const i = pst.hints - 1;
    blip(640, .08, "sine");
    const card = document.createElement("div");
    card.className = "hintCard fadein";
    card.innerHTML = `
      <div class="hintInner">
        <h4>Indice ${pst.hints} / 3</h4>
        <p>${pz.hints[i]}</p>
        <div class="close"><button class="rbtn hint" style="font-size:24px;padding:12px 28px">Compris !</button></div>
      </div>`;
    bot.firstChild.appendChild(card);
    card.querySelector("button").onclick = () => { card.remove(); drawBot(); };
    card.onclick = (e) => { if (e.target === card) { card.remove(); drawBot(); } };
  }

  function showIncorrect(pz, drawTop, drawBot) {
    setTop(`<div class="noTop cardTop"><div class="big">INCORRECT</div><div class="sil"></div></div>`);
    const d = setBot(`
      <div class="noBot cardBot">
        <button class="rbtn retry" id="retry">Réessayer</button>
        <button class="rbtn hint" id="vhint">Voir un indice</button>
        <button class="rbtn quit" id="quit">Quitter</button>
      </div>`);
    d.querySelector("#retry").onclick = () => { blip(520, .1); drawTop(); drawBot(); };
    d.querySelector("#vhint").onclick = () => { blip(520, .1); renderPuzzle(pz); setTimeout(() => bot.querySelector("#hintBtn") && bot.querySelector("#hintBtn").click(), 60); };
    d.querySelector("#quit").onclick = () => { blip(300, .1); renderMenu(); };
  }

  function showCorrect(pz) {
    state.total += pz.picarats;
    save();
    setTop(`<div class="okTop cardTop"><div class="big">CORRECT&nbsp;!</div><div class="sil"></div></div>`);
    const d = setBot(`
      <div class="okBot cardBot">
        <div class="okRow"><span class="coin"></span>Picarats gagnés<span style="margin-left:auto;color:var(--pica);font-weight:700">+${pz.picarats}</span></div>
        <div class="okClue"><div class="lab">Indice obtenu</div><div class="word">${pz.clue}</div></div>
        <div class="okRow" style="border:none;margin-top:6px"><span class="coin"></span>Total</div>
        <div class="okTotal"><span class="n">${state.total}</span><span class="u">PICARATS</span></div>
        <div class="tap">— touche pour continuer —</div>
      </div>`);
    const go = () => { blip(760, .1, "sine"); goNext(); };
    d.querySelector(".okBot").onclick = go;
    top.firstChild.onclick = go;
    armKeys(go);
  }

  /* ---------- GÉNÉRIQUE ---------- */
  function renderCredits() {
    setTop(`
      <div class="creditsTop">
        <img class="bg" src="${A.london}" alt="">
        <div class="veil"></div>
        <div class="creditList">
          <div class="fin">Fin</div>
          <div class="h">Professeur Layton<br>et le Voyage de Widad</div>
          <div class="crow"><b>ÉNIGMES</b>Luke Triton</div>
          <div class="crow"><b>DÉDUCTIONS</b>Pr. Hershel Layton</div>
          <div class="crow"><b>INDICES</b>Londres · 13 h 05 · Widad</div>
          <div class="crow"><b>DESTINATION</b>Londres, Angleterre</div>
          <div class="crow"><b>POUR</b>Widad, avec toute notre affection</div>
        </div>
      </div>`);
    const d = setBot(`
      <div class="creditsBot cardBot">
        <div class="msg">« Toute énigme a sa solution.<br>Celle-ci s'appelait : le départ. »</div>
        <button class="openBtn" id="open">Ouvrir l'enveloppe ✉</button>
      </div>`);
    d.querySelector("#open").onclick = () => { blip(700, .12, "sine"); goNext(); };
    armKeys(() => { const b = bot.querySelector("#open"); if (b) b.click(); });
  }

  /* ---------- RÉVÉLATION : LE BILLET ---------- */
  function renderReveal() {
    setTop(`
      <div class="revTop">
        <img class="bg" src="${A.london}" alt="">
        <div class="veil"></div>
        <div class="stamp">BON VOYAGE</div>
        <img class="laytonHat" src="${A.layton}" alt="Layton">
      </div>`);
    const d = setBot(`
      <div class="revBot">
        <div class="confetti" id="conf"></div>
        <div class="ticket">
          <div class="main">
            <div class="airline"><span class="nm">LONDON CALLING</span><span class="cls">CLASSE ENchanteur</span></div>
            <div class="tkRoute">
              <div class="city"><div class="code">PAR</div><div class="sub">DÉPART</div></div>
              <div class="plane"><span>✈</span></div>
              <div class="city"><div class="code">LDN</div><div class="sub">LONDRES</div></div>
            </div>
            <div class="tkRow">
              <div class="tkField"><div class="k">PASSAGÈRE</div><div class="v big">WIDAD</div></div>
              <div class="tkField"><div class="k">DÉPART</div><div class="v">Bientôt</div></div>
            </div>
            <div class="tkRow">
              <div class="tkField"><div class="k">DATE</div><div class="v">Bientôt</div></div>
              <div class="tkField"><div class="k">VOL</div><div class="v">PL&nbsp;2026</div></div>
            </div>
          </div>
          <div class="stub">
            <div>
              <div class="nm">EMBARQUEMENT</div>
              <div class="pax">WIDAD</div>
            </div>
            <div class="bar"></div>
            <div class="seat">SIÈGE&nbsp;1A · LDN</div>
          </div>
        </div>
        <div class="replay" id="replay">↺ Revoir l'histoire</div>
      </div>`);
    confetti(d.querySelector("#conf"));
    d.querySelector("#replay").onclick = () => { blip(560, .1); state.step = 0; state.line = 0; state.total = 0; save(); render(); };
    armKeys(null);
  }

  function confetti(host) {
    if (!host) return;
    const cols = ["#d9853a", "#37a221", "#d4691e", "#4a9aa8", "#e0a02a", "#b14a2a"];
    for (let i = 0; i < 46; i++) {
      const s = document.createElement("i");
      s.style.left = Math.random() * 100 + "%";
      s.style.background = cols[i % cols.length];
      s.style.animationDuration = (1.8 + Math.random() * 2.2) + "s";
      s.style.animationDelay = (Math.random() * 1.2) + "s";
      s.style.transform = `rotate(${Math.random() * 360}deg)`;
      host.appendChild(s);
    }
  }

  /* ============================================================
     CLAVIER + SCALING
  ============================================================ */
  let keyHandler = null;
  function armKeys(advanceFn) {
    if (keyHandler) window.removeEventListener("keydown", keyHandler);
    keyHandler = (e) => {
      if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") { e.preventDefault(); if (advanceFn) advanceFn(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); state.step = Math.max(0, state.step - 1); state.line = 0; render(); }
    };
    window.addEventListener("keydown", keyHandler);
  }

  function fit() {
    const stage = document.getElementById("stage");
    const W = 820, H = 1180;
    const pad = 24;
    const s = Math.min((window.innerWidth - pad) / W, (window.innerHeight - pad) / H);
    stage.style.transform = `scale(${s})`;
  }
  window.addEventListener("resize", fit);

  /* ---------- boot ---------- */
  fit();
  load();
  // au chargement on démarre toujours par le menu pour l'effet de surprise
  state.step = 0; state.line = 0;
  render();
})();
