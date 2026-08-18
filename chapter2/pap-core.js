// ============================================================================
// PasAPas — shared core (pap-core.js)
//
// Every chapter loads this with a CLASSIC script tag:
//     <script src="pap-core.js"></script>
// Classic scripts work from file:// — ES modules do NOT. So: no `type="module"`,
// no import/export. Keep it that way; opening the .html directly must keep working.
//
// A chapter file is expected to, in this order:
//     registerStrings({ en: {...}, fr: {...} });   // merged OVER CORE_STRINGS
//     const steps = [ ... ];
//     startGame(steps);
//
// Deploy note: pap-core.js is copied into EVERY DEPLOY/chapterN/ folder, so that
// src="pap-core.js" is correct verbatim in both APP/ and DEPLOY/. A change here
// means re-copying every chapter, not just the one you are working on.
// ============================================================================

const DEBUG = new URLSearchParams(location.search).has('debug');

// ============================================================
// I18N — resolver, core dictionary, merge, t()
// ============================================================
function resolveLang() {
  const p = new URLSearchParams(location.search).get('lang');
  if (p === 'en' || p === 'fr') { try { localStorage.setItem('pap_lang', p); } catch (e) {} return p; }
  try { const s = localStorage.getItem('pap_lang'); if (s === 'en' || s === 'fr') return s; } catch (e) {}
  return 'en'; // default (English)
}
let LANG = resolveLang();
document.documentElement.lang = LANG;

// Strings used by the shared helpers below. A chapter's own dictionary is merged
// on top of these, so a chapter may override any of them — but never has to define
// them. (Ch1's i18n retrofit repeatedly lost exactly these short button labels.)
const CORE_STRINGS = {
  en: {
    fb_wonderful: "Wonderful!",
    fb_exactly: "Yes, exactly right!",
    fb_notquite: "Not quite, try again!",
    fb_hint: "Not quite... Hint: {hint}",
    place_squares: "Place magic squares on the field to cover it!",
    q_squares_count: "Great, you've covered the whole field! How many magic squares are there?",
    q_seeds_count: "So, how many seeds do I need to plant this field?",
    hint_count_squares: "Count the squares on the field",
    hint_each_seed: "Each magic square needs one seed",
    btn_continue: "Continue!",
    btn_continue_plain: "Continue",
    fb_perfect: "Perfect!",
    supply_squares: "Your magic squares — click on the field to place them, or drag them:",
    supply_lengths_sides: "Drag magic lengths along the sides, or click on the sides:",
    lbl_horizontal: "Horizontal:",
    lbl_vertical: "Vertical:",
    fpc_intro: "Now let's protect this field too! Drag magic lengths along the sides to build the fence.",
    fpc_done: "The fence is complete! How many magic lengths did you need?",
    supply_blocks: "Drag blocks onto the field, or click on the field to place them:",
    hint_count_blocks: "Count the blocks",
    hint_find_in_table: "Find {a} × {b} in the table",
    supply_measure_field: "Drag magic lengths along the bottom and left sides to measure the field:",
    supply_length_side: "Drag magic lengths along the side, or click on the side:",
    mbs_left_first: "First, measure the <strong>left side</strong> of the field by placing magic lengths along it.",
    q_left_tall: "How many magic lengths tall is the left side?",
    mbs_left_done: "The left side is <strong>{h}</strong> magic lengths. Now measure the <strong>bottom side</strong>!",
    q_bottom_wide: "How many magic lengths wide is the bottom side?",
    hint_count_bottom: "Count the magic lengths on the bottom",
    hint_count_left: "Count the magic lengths on the left",
    hint_count_lengths: "Count the magic lengths",
    q_side_lengths: "How many magic lengths is the side?",
    q_nblocks_needed: "How many {n}-blocks did you need?",
    q_nblocks_used: "How many {n}-blocks did you use?",
    lbl_left_side: "left side",
    lbl_bottom_side: "bottom side",
    btn_lets_try: "Let's try!",
    btn_finished: "I am finished!",
    smf_which_block: "The side is <strong>{side}</strong>. What number of magic squares does a block need to be to fully fill one column? Click on the right block!",
    smf_ok_cover: "Correct! Now cover the whole field with {side}-blocks!",
    smf_table: "This square is fully covered by <strong>{side}² = {side}×{side}</strong> magic squares. How much is it? Look it up in the multiplication table!",
    fb_block_column: "A block of {sz} doesn't fill the whole column! Try again!",
    fb_block_fit: "A block of {sz} doesn't fit! The {which} is {target} magic lengths. Try again!",
    rbo_which_vblock: "Left side = <strong>{h}</strong>, bottom side = <strong>{w}</strong>. Now, what number of magic squares does a vertical block need to fully fill one column? Click on the right block!",
    rbo_ok_vcover: "Correct! Now cover the field with {n}-blocks. How many do you need?",
    rbo_formula: "You see, once we know the length of the left side (L = {h}) and the length of the bottom side (l = {w}), the total number of magic squares is <strong>l×L = {w}×{h}</strong>. How much is it? Look at the table!",
    rbo_area_ok: "Great! So the area is <strong>{w}×{h} = {p}</strong>. Magic, right?",
    rbo_other_dir: "But since multiplication is commutative, it should work in the other direction too. Let's try!",
    rbo_which_hblock: "Now let's use <strong>horizontal</strong> blocks instead. How many magic squares does a horizontal block need to fully fill one row? Click on the right block!",
    rbo_ok_hcover: "Correct! Now cover the field with horizontal {n}-blocks. How many do you need?",
    rbo_check: "Let's check: <strong>{h}×{w}</strong> = ? Look at the table!",
    rbo_comm: "Perfect! <strong>{w}×{h} = {h}×{w} = {p}</strong>. Multiplication is commutative — it doesn't care which way you do things!",
    mfc_intro: "Let's see how much faster we are now! Measure the sides of each field and write down how many magic squares are needed. Use the multiplication table at the bottom to help you!",
    mfc_hint: "Click on the sides to measure them, then type the area in the box below each field.",
    mfc_allcorrect: "All correct! Look how much faster that was! Before, we had to count every single magic square one by one. Now we just measure the sides and look up the answer in the multiplication table!",
    mfc_notyet: "Some answers are not right yet. Measure the sides carefully and check the multiplication table!",
    lbl_addition: "Addition",
    lbl_multiplication: "Multiplication",
    q_lengths_total: "How many magic lengths in total?",
    hint_count_green: "Count all the green segments",
    psp_intro: "A square field. Measure the side!",
    psp_choose: "The side is <strong>{side}</strong>. Choose the right stacked magic lengths and place them around the field!",
    q_stacked_total: "How many stacked lengths did you use in total?",
    psp_remind: "4 stacked lengths of {side} each. Does it remind you of:",
    psp_yes: "Yes! <strong>4×{side}</strong> = ? Look at the table!",
    psp_verify: "Let's verify by counting individual magic lengths!",
    psp_direct: "Side = {side}. The total wire needed to fully circumvent the field is <strong>4×{side}</strong>. How much is it? Look at the table!",
    prp_place: "Left side = <strong>{h}</strong>, bottom side = <strong>{w}</strong>. Now place stacked magic lengths around the field to build the fence!",
    prp_total: "The total wire needed to fully circumvent the field is <strong>2×{h} + 2×{w}</strong>. Let's compute each part.",
    prp_first: "First, <strong>2×{h}</strong> = ? Look at the table!",
    prp_good: "Good! 2×{h} = {dh}. Now, <strong>2×{w}</strong> = ?",
    prp_sum: "So the total wire is <strong>{dh} + {dw}</strong> = ? How much is that?",
    supply_stacked: "Drag {n}-stacked magic lengths around the field, or click on the sides:",
    supply_choose_blocks: "Choose your blocks and drag them onto the field:",
    fb_not_quite_times: "Not quite — “4 TIMES {side}”!",
    psp_lets_verify: "Let's verify!",
  },
  fr: {
    fb_wonderful: "Bravo !",
    fb_exactly: "Oui, c'est exactement ça !",
    fb_notquite: "Pas tout à fait, essaie encore !",
    fb_hint: "Pas tout à fait... Indice : {hint}",
    place_squares: "Place des carrés magiques sur le champ pour le couvrir !",
    q_squares_count: "Super, tu as couvert tout le champ ! Combien y a-t-il de carrés magiques ?",
    q_seeds_count: "Alors, combien de graines me faut-il pour planter ce champ ?",
    hint_count_squares: "Compte les carrés sur le champ",
    hint_each_seed: "Chaque carré magique a besoin d'une graine",
    btn_continue: "On continue !",
    btn_continue_plain: "Continuer",
    fb_perfect: "Parfait !",
    supply_squares: "Tes carrés magiques — clique sur le champ pour les poser, ou fais-les glisser :",
    supply_lengths_sides: "Fais glisser des longueurs magiques le long des côtés, ou clique sur les côtés :",
    lbl_horizontal: "Horizontales :",
    lbl_vertical: "Verticales :",
    fpc_intro: "Maintenant, protégeons ce champ aussi ! Fais glisser des longueurs magiques le long des côtés pour construire la clôture.",
    fpc_done: "La clôture est terminée ! Combien de longueurs magiques t'a-t-il fallu ?",
    supply_blocks: "Fais glisser les blocs sur le champ, ou clique sur le champ pour les poser :",
    hint_count_blocks: "Compte les blocs",
    hint_find_in_table: "Trouve {a} × {b} dans la table",
    supply_measure_field: "Fais glisser des longueurs magiques le long du côté du bas et du côté gauche pour mesurer le champ :",
    supply_length_side: "Fais glisser des longueurs magiques le long du côté, ou clique sur le côté :",
    mbs_left_first: "D'abord, mesure le <strong>côté gauche</strong> du champ en plaçant des longueurs magiques le long de ce côté.",
    q_left_tall: "Le côté gauche mesure combien de longueurs magiques ?",
    mbs_left_done: "Le côté gauche mesure <strong>{h}</strong> longueurs magiques. Maintenant, mesure le <strong>côté du bas</strong> !",
    q_bottom_wide: "Le côté du bas mesure combien de longueurs magiques ?",
    hint_count_bottom: "Compte les longueurs magiques en bas",
    hint_count_left: "Compte les longueurs magiques à gauche",
    hint_count_lengths: "Compte les longueurs magiques",
    q_side_lengths: "Le côté mesure combien de longueurs magiques ?",
    q_nblocks_needed: "Combien de blocs de {n} t'a-t-il fallu ?",
    q_nblocks_used: "Combien de blocs de {n} as-tu utilisés ?",
    lbl_left_side: "côté gauche",
    lbl_bottom_side: "côté du bas",
    btn_lets_try: "Essayons !",
    btn_finished: "J'ai fini !",
    smf_which_block: "Le côté mesure <strong>{side}</strong>. Combien de carrés magiques doit contenir un bloc pour remplir entièrement une colonne ? Clique sur le bon bloc !",
    smf_ok_cover: "C'est exact ! Maintenant, couvre tout le champ avec des blocs de {side} !",
    smf_table: "Ce carré est entièrement couvert par <strong>{side}² = {side}×{side}</strong> carrés magiques. Ça fait combien ? Cherche dans la table de multiplication !",
    fb_block_column: "Un bloc de {sz} ne remplit pas toute la colonne ! Essaie encore !",
    fb_block_fit: "Un bloc de {sz} ne convient pas ! Le {which} mesure {target} longueurs magiques. Essaie encore !",
    rbo_which_vblock: "Côté gauche = <strong>{h}</strong>, côté du bas = <strong>{w}</strong>. Maintenant, combien de carrés magiques doit contenir un bloc vertical pour remplir entièrement une colonne ? Clique sur le bon bloc !",
    rbo_ok_vcover: "C'est exact ! Maintenant, couvre le champ avec des blocs de {n}. Combien t'en faut-il ?",
    rbo_formula: "Tu vois, une fois qu'on connaît la longueur du côté gauche (L = {h}) et la longueur du côté du bas (l = {w}), le nombre total de carrés magiques est <strong>l×L = {w}×{h}</strong>. Ça fait combien ? Regarde la table !",
    rbo_area_ok: "Super ! Donc l'aire est <strong>{w}×{h} = {p}</strong>. Magique, non ?",
    rbo_other_dir: "Mais comme la multiplication est commutative, ça devrait aussi marcher dans l'autre sens. Essayons !",
    rbo_which_hblock: "Utilisons maintenant des blocs <strong>horizontaux</strong>. Combien de carrés magiques doit contenir un bloc horizontal pour remplir entièrement une ligne ? Clique sur le bon bloc !",
    rbo_ok_hcover: "C'est exact ! Maintenant, couvre le champ avec des blocs horizontaux de {n}. Combien t'en faut-il ?",
    rbo_check: "Vérifions : <strong>{h}×{w}</strong> = ? Regarde la table !",
    rbo_comm: "Parfait ! <strong>{w}×{h} = {h}×{w} = {p}</strong>. La multiplication est commutative — elle ne se soucie pas du sens dans lequel tu fais les choses !",
    mfc_intro: "Voyons à quel point nous sommes plus rapides maintenant ! Mesure les côtés de chaque champ et écris combien de carrés magiques sont nécessaires. Sers-toi de la table de multiplication en bas !",
    mfc_hint: "Clique sur les côtés pour les mesurer, puis tape l'aire dans la case sous chaque champ.",
    mfc_allcorrect: "Tout est juste ! Regarde comme ça a été plus rapide ! Avant, il fallait compter chaque carré magique un par un. Maintenant, on mesure simplement les côtés et on cherche la réponse dans la table de multiplication !",
    mfc_notyet: "Certaines réponses ne sont pas encore justes. Mesure bien les côtés et vérifie dans la table de multiplication !",
    lbl_addition: "l'addition",
    lbl_multiplication: "la multiplication",
    q_lengths_total: "Combien de longueurs magiques en tout ?",
    hint_count_green: "Compte tous les segments verts",
    psp_intro: "Un champ carré. Mesure le côté !",
    psp_choose: "Le côté mesure <strong>{side}</strong>. Choisis les bonnes longueurs magiques empilées et place-les autour du champ !",
    q_stacked_total: "Combien de longueurs empilées as-tu utilisées en tout ?",
    psp_remind: "4 longueurs empilées de {side} chacune. Ça te fait penser à :",
    psp_yes: "Oui ! <strong>4×{side}</strong> = ? Regarde la table !",
    psp_verify: "Vérifions en comptant les longueurs magiques une par une !",
    psp_direct: "Côté = {side}. Le fil total nécessaire pour faire entièrement le tour du champ est <strong>4×{side}</strong>. Ça fait combien ? Regarde la table !",
    prp_place: "Côté gauche = <strong>{h}</strong>, côté du bas = <strong>{w}</strong>. Maintenant, place des longueurs magiques empilées autour du champ pour construire la clôture !",
    prp_total: "Le fil total nécessaire pour faire entièrement le tour du champ est <strong>2×{h} + 2×{w}</strong>. Calculons chaque morceau.",
    prp_first: "D'abord, <strong>2×{h}</strong> = ? Regarde la table !",
    prp_good: "Bien ! 2×{h} = {dh}. Maintenant, <strong>2×{w}</strong> = ?",
    prp_sum: "Donc le fil total est <strong>{dh} + {dw}</strong> = ? Ça fait combien ?",
    supply_stacked: "Fais glisser des longueurs magiques empilées par {n} autour du champ, ou clique sur les côtés :",
    supply_choose_blocks: "Choisis tes blocs et fais-les glisser sur le champ :",
    fb_not_quite_times: "Pas tout à fait — «&nbsp;4 FOIS {side}&nbsp;» !",
    psp_lets_verify: "Vérifions !",
  },
};

const STRINGS = { en: Object.assign({}, CORE_STRINGS.en),
                  fr: Object.assign({}, CORE_STRINGS.fr) };

// Chapters call this once, before startGame().
function registerStrings(dict) {
  ['en', 'fr'].forEach(lang => {
    if (dict && dict[lang]) Object.assign(STRINGS[lang], dict[lang]);
  });
}

function t(key, vars) {
  let s = (STRINGS[LANG] && STRINGS[LANG][key] != null) ? STRINGS[LANG][key]
        : (STRINGS.en[key] != null ? STRINGS.en[key] : key);
  if (vars) for (const k in vars) s = s.split('{' + k + '}').join(vars[k]);
  return s;
}

// ============================================================
// NUMBERS — locale-aware display, tolerant input
// ============================================================
//
// French writes 6,2 where English writes 6.2. From Chapter 2 on, the app deals in
// tenths and hundredths, so a French child taught "6.2" is being taught something
// their teacher will mark wrong.
//
// This cannot live in the dictionary as literal text, because the numbers are
// computed and passed into parameterised keys. So the rule is:
//
//   * every decimal that is DISPLAYED goes through fmtNum()
//   * every decimal READ FROM A CHILD goes through parseNum()
//   * never string-concatenate a raw JS number into a sentence
//
// Retrofitting this later is the Chapter 1 i18n retrofit all over again.

const DECIMAL_SEP = { en: '.', fr: ',' };

function decimalSep(lang) {
  return DECIMAL_SEP[lang || LANG] || '.';
}

// 6.2 -> "6.2" (en) / "6,2" (fr).  0.05 -> "0,05".  18 -> "18" (no trailing zeros).
// maxDecimals defaults to 4, which is well past anything Chapters 2–4 need and
// keeps float artifacts (0.1 + 0.2) from leaking onto the screen.
function fmtNum(x, maxDecimals) {
  const n = Number(x);
  if (!isFinite(n)) return String(x);
  let s = n.toFixed(maxDecimals == null ? 4 : maxDecimals);
  if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
  if (s === '-0') s = '0';
  return s.replace('.', decimalSep());
}

// Accepts BOTH separators in BOTH languages, on purpose: a child on a French
// keyboard playing the English version will type a comma, and a child who has seen
// a calculator will type a point in French. Rejecting either would be punishing the
// child for a notation choice they did not make. Returns NaN if it isn't a number.
function parseNum(s) {
  if (typeof s === 'number') return s;
  if (s == null) return NaN;
  let str = String(s).trim().replace(/[\s  ]/g, '').replace(',', '.');
  if (!/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(str)) return NaN;
  return parseFloat(str);
}

// Float-safe comparison. Tenths and hundredths do not survive === (0.1+0.2 !== 0.3).
function numEquals(a, b, tol) {
  return Math.abs(a - b) < (tol == null ? 1e-9 : tol);
}

// In-app language toggle (small, top-right; remembers choice, reloads in new language)
(function addLangToggle() {
  const bar = document.createElement('div');
  bar.style.cssText = 'position:fixed; top:8px; right:8px; z-index:1100; display:flex; border:2px solid #c9b88b; border-radius:999px; overflow:hidden; background:#fffef5; box-shadow:0 2px 6px rgba(90,80,60,0.15);';
  ['en', 'fr'].forEach(code => {
    const b = document.createElement('button');
    b.textContent = code.toUpperCase();
    const on = code === LANG;
    b.style.cssText = 'font-family:Georgia,serif; font-size:13px; letter-spacing:1px; border:none; cursor:pointer; padding:4px 11px; background:' + (on ? '#5a8f3d' : 'transparent') + '; color:' + (on ? '#fff' : '#8b7355') + ';';
    b.addEventListener('click', () => {
      if (code === LANG) return;
      try { localStorage.setItem('pap_lang', code); } catch (e) {}
      const url = new URL(location.href); url.searchParams.set('lang', code); location.href = url.toString();
    });
    bar.appendChild(b);
  });
  document.body.appendChild(bar);
})();

// ============================================================
// GAME ENGINE
// ============================================================

const elfArea = document.getElementById('elf-area');
const story = document.getElementById('story-panel');
const gameArea = document.getElementById('game-area');
const buttonArea = document.getElementById('button-area');
const celebration = document.getElementById('celebration');
const celebTitle = document.getElementById('celeb-title');
const celebText = document.getElementById('celeb-text');
const celebBtn = document.getElementById('celeb-btn');

let currentStep = 0;

let STEPS = [];

// --- Eliel (shared across every chapter) ---
function elielSVG() {
  return `
    <svg width="160" height="220" viewBox="0 0 160 220" xmlns="http://www.w3.org/2000/svg">
      <!-- Pointed hat -->
      <polygon points="80,8 50,80 110,80" fill="#5a8f3d" stroke="#3a6b28" stroke-width="2"/>
      <!-- Hat brim curve -->
      <ellipse cx="80" cy="80" rx="35" ry="8" fill="#4a7a30" stroke="#3a6b28" stroke-width="1.5"/>
      <!-- Hat band -->
      <rect x="50" y="72" width="60" height="8" rx="2" fill="#c9b88b"/>
      <!-- Feather quill -->
      <g transform="translate(108,40) rotate(25)">
        <path d="M0,0 Q8,-35 4,-55 Q2,-35 -2,-20 Q-4,-35 -6,-55 Q-6,-30 0,0Z" fill="#c0392b" opacity="0.85"/>
        <line x1="0" y1="0" x2="1" y2="18" stroke="#8b5e3c" stroke-width="1.5"/>
      </g>
      <!-- Ears (pointed!) -->
      <path d="M46,105 Q28,90 38,75" fill="#f5d6b8" stroke="#d4a574" stroke-width="1.5"/>
      <path d="M114,105 Q132,90 122,75" fill="#f5d6b8" stroke="#d4a574" stroke-width="1.5"/>
      <!-- Face -->
      <ellipse cx="80" cy="110" rx="32" ry="35" fill="#f5d6b8" stroke="#d4a574" stroke-width="1.5"/>
      <!-- Eyes -->
      <ellipse cx="68" cy="105" rx="4" ry="4.5" fill="#3a3a3a"/>
      <ellipse cx="92" cy="105" rx="4" ry="4.5" fill="#3a3a3a"/>
      <!-- Eye shine -->
      <circle cx="69.5" cy="103.5" r="1.5" fill="white"/>
      <circle cx="93.5" cy="103.5" r="1.5" fill="white"/>
      <!-- Eyebrows -->
      <path d="M62,97 Q68,93 74,96" fill="none" stroke="#8b5e3c" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M86,96 Q92,93 98,97" fill="none" stroke="#8b5e3c" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Nose -->
      <path d="M78,112 Q80,117 82,112" fill="none" stroke="#d4a574" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Smile -->
      <path d="M68,122 Q80,134 92,122" fill="none" stroke="#c0785a" stroke-width="2" stroke-linecap="round"/>
      <!-- Rosy cheeks -->
      <ellipse cx="60" cy="120" rx="7" ry="4" fill="#f0a0a0" opacity="0.3"/>
      <ellipse cx="100" cy="120" rx="7" ry="4" fill="#f0a0a0" opacity="0.3"/>
      <!-- Tunic collar -->
      <path d="M55,142 Q80,160 105,142" fill="#5a8f3d" stroke="#3a6b28" stroke-width="1.5"/>
      <!-- Body / tunic -->
      <path d="M50,145 L42,210 L118,210 L110,145 Q80,165 50,145Z" fill="#5a8f3d" stroke="#3a6b28" stroke-width="1.5"/>
      <!-- Belt -->
      <rect x="48" y="175" width="64" height="7" rx="3" fill="#8b5e3c"/>
      <rect x="76" y="173" width="8" height="11" rx="2" fill="#c9b88b"/>
      <!-- Arms -->
      <path d="M50,155 Q30,170 35,190" fill="none" stroke="#3a6b28" stroke-width="3" stroke-linecap="round"/>
      <path d="M110,155 Q130,170 125,190" fill="none" stroke="#3a6b28" stroke-width="3" stroke-linecap="round"/>
      <!-- Hands -->
      <circle cx="35" cy="191" r="5" fill="#f5d6b8" stroke="#d4a574" stroke-width="1"/>
      <circle cx="125" cy="191" r="5" fill="#f5d6b8" stroke="#d4a574" stroke-width="1"/>
    </svg>
  `;
}

// Drops Eliel at the top of the game area. Call after clearGame().
function showEliel(target) {
  const elfDiv = document.createElement('div');
  elfDiv.style.cssText = 'display:flex; justify-content:center; margin-bottom: 16px;';
  elfDiv.innerHTML = elielSVG();
  (target || gameArea).appendChild(elfDiv);
  return elfDiv;
}

// --- Story helpers ---
function say(speaker, text) {
  story.innerHTML = `<div class="speaker">${speaker}</div><div>${text}</div>`;
}

function narrate(text) {
  story.innerHTML = `<div class="narration">${text}</div>`;
}

function storyHTML(html) {
  story.innerHTML = html;
}

function clearGame() {
  elfArea.innerHTML = '';
  gameArea.innerHTML = '';
  buttonArea.innerHTML = '';
}

function addButton(label, onClick, secondary) {
  const btn = document.createElement('button');
  btn.className = secondary ? 'btn btn-secondary' : 'btn';
  btn.textContent = label;
  btn.addEventListener('click', onClick);
  buttonArea.appendChild(btn);
  return btn;
}

function celebrate(title, text, onContinue) {
  celebTitle.textContent = title;
  celebText.textContent = text;
  celebration.classList.add('show');
  celebBtn.onclick = () => {
    celebration.classList.remove('show');
    if (onContinue) onContinue();
  };
}

// ============================================================
// FIELD BUILDER (drag & drop grid)
// ============================================================

let currentDraggedSquare = null;
let currentDraggedLength = null;

function buildField(rows, cols, cellSize, onComplete) {
  clearGame();

  const totalNeeded = rows * cols;
  const supplyCount = totalNeeded + 4; // a few extra
  let filledCount = 0;
  const filledCells = new Set();

  let counter = null; // no counter displayed

  // Field grid
  const fieldContainer = document.createElement('div');
  fieldContainer.id = 'field-container';
  const field = document.createElement('div');
  field.id = 'field';
  field.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
  field.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
  field.style.width = `${cols * cellSize}px`;
  field.style.height = `${rows * cellSize}px`;

  // Add perimeter dots
  addPerimeterTicks(fieldContainer, rows, cols, cellSize);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'field-cell';
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.style.width = cellSize + 'px';
      cell.style.height = cellSize + 'px';

      // Click to place
      cell.addEventListener('click', () => {
        const key = `${r},${c}`;
        if (filledCells.has(key)) {
          // Remove
          filledCells.delete(key);
          cell.classList.remove('filled');
          filledCount--;
        } else {
          // Place
          filledCells.add(key);
          cell.classList.add('filled');
          filledCount++;
        }
        // counter removed — child counts on their own

        if (filledCount === totalNeeded) {
          setTimeout(() => onComplete(totalNeeded), 400);
        }
      });

      // Drag-over support
      cell.addEventListener('dragover', (e) => e.preventDefault());
      cell.addEventListener('drop', (e) => {
        e.preventDefault();
        const key = `${r},${c}`;
        if (!filledCells.has(key)) {
          filledCells.add(key);
          cell.classList.add('filled');
          filledCount++;
          // counter removed — child counts on their own

          // Remove the dragged square from supply
          if (currentDraggedSquare) {
            currentDraggedSquare.remove();
            currentDraggedSquare = null;
          }

          if (filledCount === totalNeeded) {
            setTimeout(() => onComplete(totalNeeded), 400);
          }
        }
      });

      // Touch drop support
      field.appendChild(cell);
    }
  }

  fieldContainer.appendChild(field);
  gameArea.appendChild(fieldContainer);

  // Supply area
  const supplyLabel = document.createElement('div');
  supplyLabel.id = 'supply-label';
  supplyLabel.textContent = t('supply_squares');
  gameArea.appendChild(supplyLabel);

  const supplyArea = document.createElement('div');
  supplyArea.id = 'supply-area';

  for (let i = 0; i < supplyCount; i++) {
    const sq = document.createElement('div');
    sq.className = 'magic-square';
    sq.style.width = cellSize + 'px';
    sq.style.height = cellSize + 'px';
    sq.draggable = true;
    sq.textContent = '·';
    sq.addEventListener('dragstart', (e) => {
      currentDraggedSquare = sq;
      sq.classList.add('dragging');
      e.dataTransfer.setData('text/plain', 'magic-square');
    });
    sq.addEventListener('dragend', () => {
      sq.classList.remove('dragging');
      currentDraggedSquare = null;
    });
    supplyArea.appendChild(sq);
  }

  gameArea.appendChild(supplyArea);
}

function addPerimeterTicks(container, rows, cols, cellSize) {
  // Ticks at magic-length boundaries along sides, NOT at corners.
  // position:absolute is relative to the padding box (inside the border),
  // so cell boundaries are simply at c*cellSize / r*cellSize.
  const border = 3;
  const tickLen = 12;
  const tickThick = 2;

  // Top edge: ticks at c=1..cols-1
  for (let c = 1; c < cols; c++) {
    const tick = document.createElement('div');
    tick.style.cssText = `position:absolute; width:${tickThick}px; height:${tickLen}px; background:#3a3a3a; left:${c * cellSize - tickThick/2}px; top:${-tickLen/2 - border/2}px; z-index:2;`;
    container.appendChild(tick);
  }
  // Bottom edge
  for (let c = 1; c < cols; c++) {
    const tick = document.createElement('div');
    tick.style.cssText = `position:absolute; width:${tickThick}px; height:${tickLen}px; background:#3a3a3a; left:${c * cellSize - tickThick/2}px; top:${rows * cellSize - tickLen/2 + border/2}px; z-index:2;`;
    container.appendChild(tick);
  }
  // Left edge
  for (let r = 1; r < rows; r++) {
    const tick = document.createElement('div');
    tick.style.cssText = `position:absolute; height:${tickThick}px; width:${tickLen}px; background:#3a3a3a; top:${r * cellSize - tickThick/2}px; left:${-tickLen/2 - border/2}px; z-index:2;`;
    container.appendChild(tick);
  }
  // Right edge
  for (let r = 1; r < rows; r++) {
    const tick = document.createElement('div');
    tick.style.cssText = `position:absolute; height:${tickThick}px; width:${tickLen}px; background:#3a3a3a; top:${r * cellSize - tickThick/2}px; left:${cols * cellSize - tickLen/2 + border/2}px; z-index:2;`;
    container.appendChild(tick);
  }
}

// ============================================================
// ANSWER INPUT
// ============================================================

// opts.decimal — accept a decimal answer (Chapter 2 on). This switches the field to
// type="text" + inputmode="decimal" ON PURPOSE: <input type="number"> reports an
// EMPTY value when the text isn't valid for the browser's locale, so a French child
// typing "6,2" into a number field would silently submit nothing.
// opts.tol — comparison tolerance (default 1e-9); only meaningful with decimal.
function askNumber(prompt, correctAnswer, onCorrect, hint, opts) {
  const o = opts || {};
  const area = document.createElement('div');
  area.id = 'answer-area';
  area.innerHTML = `
    <p style="margin-bottom:10px">${prompt}</p>
    ${o.decimal
      ? `<input type="text" id="answer-input" inputmode="decimal" autocomplete="off">`
      : `<input type="number" id="answer-input" inputmode="numeric" autocomplete="off">`}
    <button class="btn" id="answer-submit">OK</button>
    <div id="answer-feedback"></div>
  `;
  gameArea.appendChild(area);

  const input = area.querySelector('#answer-input');
  const submit = area.querySelector('#answer-submit');
  const feedback = area.querySelector('#answer-feedback');

  let attempts = 0;

  function check() {
    const val = o.decimal ? parseNum(input.value) : parseInt(input.value);
    if (isNaN(val)) return;
    if (o.decimal ? numEquals(val, correctAnswer, o.tol) : val === correctAnswer) {
      feedback.className = 'correct';
      feedback.textContent = t('fb_exactly');
      input.disabled = true;
      submit.disabled = true;
      setTimeout(() => onCorrect(), 800);
    } else {
      attempts++;
      feedback.className = 'incorrect';
      if (attempts >= 2 && hint) {
        feedback.textContent = t('fb_hint', {hint});
      } else {
        feedback.textContent = t('fb_notquite');
      }
      input.value = '';
      input.focus();
    }
  }

  submit.addEventListener('click', check);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
  input.focus();
}

// ============================================================
// STATIC FIELD DISPLAY (no interaction, just show a filled grid)
// ============================================================

function showFilledField(rows, cols, cellSize) {
  const fieldContainer = document.createElement('div');
  fieldContainer.id = 'field-container';
  const field = document.createElement('div');
  field.id = 'field';
  field.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
  field.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
  field.style.width = `${cols * cellSize}px`;
  field.style.height = `${rows * cellSize}px`;

  addPerimeterTicks(fieldContainer, rows, cols, cellSize);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'field-cell filled';
      cell.style.width = cellSize + 'px';
      cell.style.height = cellSize + 'px';
      field.appendChild(cell);
    }
  }

  fieldContainer.appendChild(field);
  return fieldContainer;
}

// Show a filled field with green perimeter segments on all sides
// omitSegments: optional array of {side:'top'|'bottom'|'left'|'right', index:N} to leave out
function showFilledFieldWithPerimeter(rows, cols, cellSize, omitSegments, segColors) {
  const fc = showFilledField(rows, cols, cellSize);
  const lineW = 5;
  const omit = omitSegments || [];
  // segColors: optional array of {side, index, color} for per-segment coloring

  function isOmitted(side, idx) {
    return omit.some(o => o.side === side && o.index === idx);
  }

  function getColor(side, idx) {
    if (segColors) {
      const match = segColors.find(s => s.side === side && s.index === idx);
      if (match) return match.color;
    }
    return '#5a8f3d';
  }

  // All segments — append to the #field div, using plain background divs (no SVG)
  const fieldDiv = fc.querySelector('#field') || fc;
  const off = lineW;
  // Top segments (horizontal)
  for (let c = 0; c < cols; c++) {
    if (isOmitted('top', c)) continue;
    const seg = document.createElement('div');
    seg.style.cssText = `position:absolute; left:${c*cellSize}px; top:${-off}px; width:${cellSize}px; height:${lineW}px; background:${getColor('top',c)}; z-index:5;`;
    fieldDiv.appendChild(seg);
  }
  // Bottom segments (horizontal)
  for (let c = 0; c < cols; c++) {
    if (isOmitted('bottom', c)) continue;
    const seg = document.createElement('div');
    seg.style.cssText = `position:absolute; left:${c*cellSize}px; top:${rows*cellSize}px; width:${cellSize}px; height:${lineW}px; background:${getColor('bottom',c)}; z-index:5;`;
    fieldDiv.appendChild(seg);
  }
  // Left segments (vertical)
  for (let r = 0; r < rows; r++) {
    if (isOmitted('left', r)) continue;
    const seg = document.createElement('div');
    seg.style.cssText = `position:absolute; left:${-off}px; top:${r*cellSize}px; width:${lineW}px; height:${cellSize}px; background:${getColor('left',r)}; z-index:5;`;
    fieldDiv.appendChild(seg);
  }
  // Right segments (vertical)
  for (let r = 0; r < rows; r++) {
    if (isOmitted('right', r)) continue;
    const seg = document.createElement('div');
    seg.style.cssText = `position:absolute; left:${cols*cellSize}px; top:${r*cellSize}px; width:${lineW}px; height:${cellSize}px; background:${getColor('right',r)}; z-index:5;`;
    fieldDiv.appendChild(seg);
  }

  return fc;
}

// Show N detached green vertical magic length segments (no field, just the bars)
function showDetachedSegments(n, cellSize, horiz) {
  const wrapper = document.createElement('div');
  const lineW = 5;
  if (horiz) {
    wrapper.style.cssText = 'display:flex; flex-direction:row; align-items:center; gap:1px;';
    for (let i = 0; i < n; i++) {
      const seg = document.createElement('div');
      seg.style.cssText = `width:${cellSize}px; height:${lineW + 4}px;`;
      seg.innerHTML = `<svg width="${cellSize}" height="${lineW+4}"><line x1="1" y1="${(lineW+4)/2}" x2="${cellSize-1}" y2="${(lineW+4)/2}" stroke="#5a8f3d" stroke-width="${lineW}" stroke-linecap="round"/></svg>`;
      wrapper.appendChild(seg);
    }
  } else {
    wrapper.style.cssText = 'display:flex; flex-direction:column; align-items:center; gap:1px;';
    for (let i = 0; i < n; i++) {
      const seg = document.createElement('div');
      seg.style.cssText = `width:${lineW + 4}px; height:${cellSize}px;`;
      seg.innerHTML = `<svg width="${lineW+4}" height="${cellSize}"><line x1="${(lineW+4)/2}" y1="1" x2="${(lineW+4)/2}" y2="${cellSize-1}" stroke="#5a8f3d" stroke-width="${lineW}" stroke-linecap="round"/></svg>`;
      wrapper.appendChild(seg);
    }
  }
  return wrapper;
}

// ============================================================
// SHOW EMPTY FIELD (with dots, for perimeter counting)
// ============================================================

function showEmptyField(rows, cols, cellSize) {
  const fieldContainer = document.createElement('div');
  fieldContainer.id = 'field-container';
  const field = document.createElement('div');
  field.id = 'field';
  field.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
  field.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
  field.style.width = `${cols * cellSize}px`;
  field.style.height = `${rows * cellSize}px`;
  field.style.background = '#fafaf5';

  addPerimeterTicks(fieldContainer, rows, cols, cellSize);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'field-cell';
      cell.style.width = cellSize + 'px';
      cell.style.height = cellSize + 'px';
      cell.style.border = 'none';
      field.appendChild(cell);
    }
  }

  fieldContainer.appendChild(field);
  return fieldContainer;
}

// ============================================================
// QUEST STEPS
// ============================================================

// ============================================================
// BLOCK FIELD BUILDER (drag & drop grouped blocks)
// ============================================================

function buildBlockField(rows, cols, cellSize, blockRows, blockCols, onComplete) {
  // blockRows x blockCols = the size of each draggable block
  // e.g. blockRows=3, blockCols=1 = vertical 3-block
  // e.g. blockRows=1, blockCols=3 = horizontal 3-block
  clearGame();

  const totalCells = rows * cols;
  const filledCells = new Set();
  let filledCount = 0;

  // Field grid
  const fieldContainer = document.createElement('div');
  fieldContainer.id = 'field-container';
  const field = document.createElement('div');
  field.id = 'field';
  field.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
  field.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
  field.style.width = `${cols * cellSize}px`;
  field.style.height = `${rows * cellSize}px`;

  addPerimeterTicks(fieldContainer, rows, cols, cellSize);

  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'field-cell';
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.style.width = cellSize + 'px';
      cell.style.height = cellSize + 'px';

      // Click to place a whole block at the best-fit position near this cell
      cell.addEventListener('click', () => tryPlaceNear(r, c));
      cell.addEventListener('dragover', (e) => e.preventDefault());
      cell.addEventListener('drop', (e) => {
        e.preventDefault();
        tryPlaceNear(r, c);
        if (currentDraggedBlock) { currentDraggedBlock.remove(); currentDraggedBlock = null; }
      });

      field.appendChild(cell);
      cells.push(cell);
    }
  }

  function getCell(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return null;
    return cells[r * cols + c];
  }

  // Try to place a block starting at or near (startR, startC)
  // Snaps to the nearest valid column (for vertical blocks) or row (for horizontal blocks)
  function tryPlaceNear(startR, startC) {
    // For vertical blocks: snap row to multiple of blockRows, keep col
    // For horizontal blocks: snap col to multiple of blockCols, keep row
    if (blockRows > 1) {
      const snapR = Math.floor(startR / blockRows) * blockRows;
      if (placeBlock(snapR, startC)) return;
    }
    if (blockCols > 1) {
      const snapC = Math.floor(startC / blockCols) * blockCols;
      if (placeBlock(startR, snapC)) return;
    }
    // Fallback: try exact position
    placeBlock(startR, startC);
  }

  function placeBlock(startR, startC) {
    // Check if all cells in the block are available
    const toFill = [];
    for (let dr = 0; dr < blockRows; dr++) {
      for (let dc = 0; dc < blockCols; dc++) {
        const r = startR + dr, c = startC + dc;
        const key = `${r},${c}`;
        if (r >= rows || c >= cols || filledCells.has(key)) return false;
        toFill.push({ r, c, key });
      }
    }
    // Place them all
    toFill.forEach(({ r, c, key }) => {
      filledCells.add(key);
      const cell = getCell(r, c);
      cell.classList.add('filled');
      filledCount++;
    });

    if (filledCount === totalCells) {
      setTimeout(() => onComplete(totalCells), 400);
    }
    return true;
  }

  fieldContainer.appendChild(field);
  gameArea.appendChild(fieldContainer);

  // Supply area with blocks
  const supplyLabel = document.createElement('div');
  supplyLabel.id = 'supply-label';
  supplyLabel.textContent = t('supply_blocks');
  gameArea.appendChild(supplyLabel);

  const supplyArea = document.createElement('div');
  supplyArea.id = 'supply-area';
  supplyArea.style.alignItems = 'center';

  const blocksNeeded = Math.ceil(totalCells / (blockRows * blockCols)) + 3;
  for (let i = 0; i < blocksNeeded; i++) {
    const block = document.createElement('div');
    block.draggable = true;
    block.style.cssText = `
      width:${blockCols * cellSize}px; height:${blockRows * cellSize}px;
      display:grid; grid-template-columns:repeat(${blockCols}, ${cellSize}px);
      grid-template-rows:repeat(${blockRows}, ${cellSize}px);
      border:3px solid #5a8f3d; border-radius:3px; background:#fffef5;
      cursor:grab; user-select:none; touch-action:none;
    `;

    for (let br = 0; br < blockRows; br++) {
      for (let bc = 0; bc < blockCols; bc++) {
        const sub = document.createElement('div');
        sub.style.cssText = `
          display:flex; align-items:center; justify-content:center;
          border:1px solid #ddd; font-size:20px; color:#555;
          width:${cellSize}px; height:${cellSize}px; box-sizing:border-box;
        `;
        sub.textContent = '·';
        block.appendChild(sub);
      }
    }

    block.addEventListener('dragstart', (e) => {
      currentDraggedBlock = block;
      block.classList.add('dragging');
      e.dataTransfer.setData('text/plain', 'block');
    });
    block.addEventListener('dragend', () => {
      block.classList.remove('dragging');
      currentDraggedBlock = null;
    });
    supplyArea.appendChild(block);
  }

  gameArea.appendChild(supplyArea);
}

let currentDraggedBlock = null;

// ============================================================
// MULTI-BLOCK FIELD (free choice of block sizes)
// ============================================================

function buildFreeChoiceField(rows, cols, cellSize, blockSizes, onComplete) {
  // blockSizes: array of {rows, cols, label} for available block types
  clearGame();

  const totalCells = rows * cols;
  const filledCells = new Set();
  let filledCount = 0;
  let lastBlockUsed = null;
  let lastBlockCount = 0;

  const fieldContainer = document.createElement('div');
  fieldContainer.id = 'field-container';
  const field = document.createElement('div');
  field.id = 'field';
  field.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
  field.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
  field.style.width = `${cols * cellSize}px`;
  field.style.height = `${rows * cellSize}px`;

  addPerimeterTicks(fieldContainer, rows, cols, cellSize);

  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'field-cell';
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.style.width = cellSize + 'px';
      cell.style.height = cellSize + 'px';
      cell.addEventListener('dragover', (e) => e.preventDefault());
      cell.addEventListener('drop', (e) => {
        e.preventDefault();
        if (currentDraggedBlock && currentDraggedBlock._blockInfo) {
          placeBlock(r, c, currentDraggedBlock._blockInfo);
          currentDraggedBlock.remove();
          currentDraggedBlock = null;
        }
      });
      cell.addEventListener('click', () => {
        // Click places the first available block type
        if (blockSizes.length > 0) placeBlock(r, c, blockSizes[0]);
      });
      field.appendChild(cell);
      cells.push(cell);
    }
  }

  function getCell(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return null;
    return cells[r * cols + c];
  }

  function placeBlock(startR, startC, blockInfo) {
    const toFill = [];
    for (let dr = 0; dr < blockInfo.rows; dr++) {
      for (let dc = 0; dc < blockInfo.cols; dc++) {
        const r = startR + dr, c = startC + dc;
        const key = `${r},${c}`;
        if (r >= rows || c >= cols || filledCells.has(key)) return;
        toFill.push({ r, c, key });
      }
    }
    toFill.forEach(({ r, c, key }) => {
      filledCells.add(key);
      getCell(r, c).classList.add('filled');
      filledCount++;
    });
    lastBlockUsed = blockInfo;
    lastBlockCount++;

    if (filledCount === totalCells) {
      setTimeout(() => onComplete({ total: totalCells, blockLabel: lastBlockUsed.label, blockSize: Math.max(lastBlockUsed.rows, lastBlockUsed.cols), blocksUsed: lastBlockCount }), 400);
    }
  }

  fieldContainer.appendChild(field);
  gameArea.appendChild(fieldContainer);

  // Supply area with multiple block types
  const supplyLabel = document.createElement('div');
  supplyLabel.id = 'supply-label';
  supplyLabel.textContent = t('supply_choose_blocks');
  gameArea.appendChild(supplyLabel);

  const supplyArea = document.createElement('div');
  supplyArea.id = 'supply-area';
  supplyArea.style.alignItems = 'center';

  blockSizes.forEach(bs => {
    const label = document.createElement('div');
    label.style.cssText = 'width:100%; text-align:center; font-size:13px; color:#888; margin-top:6px; margin-bottom:4px;';
    label.textContent = bs.label + ':';
    supplyArea.appendChild(label);

    for (let i = 0; i < 12; i++) {
      const block = document.createElement('div');
      block.className = 'magic-square';
      block.draggable = true;
      block.style.width = (bs.cols * cellSize) + 'px';
      block.style.height = (bs.rows * cellSize) + 'px';
      block.style.display = 'grid';
      block.style.gridTemplateColumns = `repeat(${bs.cols}, ${cellSize}px)`;
      block.style.gridTemplateRows = `repeat(${bs.rows}, ${cellSize}px)`;
      block.style.padding = '0';
      block._blockInfo = bs;

      for (let br = 0; br < bs.rows; br++) {
        for (let bc = 0; bc < bs.cols; bc++) {
          const sub = document.createElement('div');
          sub.style.cssText = 'display:flex; align-items:center; justify-content:center; border:1px solid #ccc; font-size:20px; color:#555;';
          sub.textContent = '·';
          block.appendChild(sub);
        }
      }

      block.addEventListener('dragstart', (e) => {
        currentDraggedBlock = block;
        block.classList.add('dragging');
        e.dataTransfer.setData('text/plain', 'block');
      });
      block.addEventListener('dragend', () => {
        block.classList.remove('dragging');
        currentDraggedBlock = null;
      });
      supplyArea.appendChild(block);
    }
  });

  gameArea.appendChild(supplyArea);
}

// ============================================================
// MULTIPLICATION TABLE DISPLAY
// ============================================================

function showMultTable(entries, highlightPair) {
  // entries: array of {a, b, result} — e.g. [{a:2,b:2,result:4}, ...]
  // highlightPair: optional {a, b} to highlight
  const table = document.createElement('table');
  table.className = 'mult-table';

  entries.forEach(e => {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    const isHighlight = highlightPair && highlightPair.a === e.a && highlightPair.b === e.b;
    if (isHighlight) td.className = 'highlight';
    td.textContent = `${e.a} × ${e.b} = ${e.result}`;
    tr.appendChild(td);
    table.appendChild(tr);
  });

  return table;
}

function showFullMultTable(fromN, toN, highlightPair, hideAnswer, zebra = true) {
  // Full NxN multiplication table grid
  // highlightPair: {a, b} — a = column number, b = row number (ONE pair only)
  // hideAnswer: if true, highlight row+col bands but NOT the intersection cell
  const table = document.createElement('table');
  table.className = 'mult-table';
  table.style.fontSize = '14px';

  const hlCol = highlightPair ? highlightPair.a : null; // column = first number
  const hlRow = highlightPair ? highlightPair.b : null; // row = second number

  // Header row
  const headerRow = document.createElement('tr');
  const corner = document.createElement('th');
  corner.textContent = '×';
  headerRow.appendChild(corner);
  for (let c = fromN; c <= toN; c++) {
    const th = document.createElement('th');
    th.textContent = c;
    if (c === hlCol) th.style.background = '#b8dab0';
    headerRow.appendChild(th);
  }
  table.appendChild(headerRow);

  for (let r = fromN; r <= toN; r++) {
    const tr = document.createElement('tr');
    const rowHeader = document.createElement('th');
    rowHeader.textContent = r;
    if (r === hlRow) rowHeader.style.background = '#b8dab0';
    else if (zebra && (r - fromN) % 2 === 1) rowHeader.style.background = '#e5dfd1';
    tr.appendChild(rowHeader);
    for (let c = fromN; c <= toN; c++) {
      const td = document.createElement('td');
      td.textContent = r * c;
      let styled = false;
      if (highlightPair) {
        const isIntersection = (r === hlRow && c === hlCol);
        const isOnBand = (r === hlRow || c === hlCol);
        if (isIntersection && !hideAnswer) {
          td.className = 'highlight';
          styled = true;
        } else if (isOnBand) {
          td.style.background = '#eef7ec';
          styled = true;
        }
      }
      // Zebra striping: alternate row backgrounds for readability
      if (zebra && !styled) {
        if ((r - fromN) % 2 === 1) {
          td.style.background = '#ede7d9';
        }
      }
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  return table;
}

function showSingleMultTable(n, maxFactor, highlightFactor) {
  // Show the table of n: 1×n=n, 2×n=2n, ...
  const table = document.createElement('table');
  table.className = 'mult-table';

  for (let i = 1; i <= maxFactor; i++) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.textContent = `${i} × ${n} = ${i * n}`;
    if (highlightFactor && i === highlightFactor) td.className = 'highlight';
    tr.appendChild(td);
    table.appendChild(tr);
  }

  return table;
}

// ============================================================
// SUMMARY PAGE
// ============================================================

function showFieldsRow(fieldData, valueLabel) {
  // Show filled fields with values underneath
  // Supports both {side, value} for squares and {rows, cols, value} for rectangles
  const row = document.createElement('div');
  row.style.cssText = 'display:flex; flex-wrap:wrap; gap:12px; justify-content:center; align-items:flex-end;';

  fieldData.forEach(fd => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex; flex-direction:column; align-items:center; gap:4px;';
    const r = fd.rows || fd.side;
    const c = fd.cols || fd.side;
    const maxDim = Math.max(r, c);
    const cs = Math.min(20, 120 / maxDim);
    const f = showFilledField(r, c, cs);
    f.style.margin = '0';
    wrapper.appendChild(f);
    const label = document.createElement('div');
    label.style.cssText = 'font-size:13px; font-weight:bold; color:#5a8f3d; text-align:center;';
    label.textContent = `${fd.value} ${valueLabel}`;
    wrapper.appendChild(label);
    row.appendChild(wrapper);
  });

  return row;
}

// Smart addition: step-by-step guided addition
function smartAddition(addSteps, persistentSides, valueLabel, onDone, persistentElement) {
  // addSteps: array of {numbers, pairIndices, pairResult, prompt}
  // persistentSides: array of {side, value} for square fields (old format, still supported)
  // valueLabel: e.g. "seeds" or "magic lengths"
  // persistentElement: optional pre-built DOM element to show above the sum at every step
  let stepIdx = 0;

  function showStep() {
    if (stepIdx >= addSteps.length) {
      onDone();
      return;
    }
    const step = addSteps[stepIdx];
    gameArea.innerHTML = '';

    // Show persistent element if provided
    if (persistentElement) {
      gameArea.appendChild(persistentElement.cloneNode(true));
    }
    // Or show persistent fields row (old format)
    else if (persistentSides) {
      const fieldsRow = document.createElement('div');
      fieldsRow.style.cssText = 'display:flex; flex-wrap:wrap; gap:8px; justify-content:center; align-items:flex-end; margin-bottom:12px;';
      persistentSides.forEach(fd => {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'display:flex; flex-direction:column; align-items:center; gap:2px; padding:4px; border-radius:6px;';
        const r = fd.rows || fd.side; const c = fd.cols || fd.side;
        const f = showFilledField(r, c, Math.min(16, 80 / Math.max(r,c)));
        f.style.margin = '0';
        wrapper.appendChild(f);
        const label = document.createElement('div');
        label.style.cssText = 'font-size:11px; font-weight:bold; color:#5a8f3d;';
        label.textContent = `${fd.value} ${valueLabel}`;
        wrapper.appendChild(label);
        fieldsRow.appendChild(wrapper);
      });
      gameArea.appendChild(fieldsRow);
    }

    // Show the current sum with highlighted pair
    const sumDiv = document.createElement('div');
    sumDiv.style.cssText = 'text-align:center; margin:12px 0; font-size:20px; line-height:1.8;';

    const parts = step.numbers.map((n, i) => {
      const isHighlight = step.pairIndices.includes(i);
      return `<span style="${isHighlight ? 'background:#d4edda; padding:2px 6px; border-radius:4px; font-weight:bold;' : ''}">${n}</span>`;
    });
    sumDiv.innerHTML = parts.join(' + ') + ' = ?';
    gameArea.appendChild(sumDiv);

    const promptDiv = document.createElement('div');
    promptDiv.style.cssText = 'text-align:center; font-size:17px; margin-bottom:8px;';
    promptDiv.textContent = step.prompt;
    gameArea.appendChild(promptDiv);

    askNumber('', step.pairResult, () => {
      stepIdx++;
      showStep();
    }, `${step.numbers[step.pairIndices[0]]} + ${step.numbers[step.pairIndices[1]]} = ?`);
  }

  showStep();
}

// ============================================================
// INLINE ANSWER (inside story panel)
// ============================================================

// opts.decimal / opts.tol — see askNumber() above.
function askInline(question, correctAnswer, onCorrect, hint, opts) {
  const o = opts || {};
  storyHTML(`
    <div class="speaker">Eliel</div>
    <p>${question}</p>
    <div id="inline-answer" style="margin-top:12px">
      <input type="${o.decimal ? 'text' : 'number'}" id="answer-input"
        inputmode="${o.decimal ? 'decimal' : 'numeric'}" autocomplete="off"
        style="font-size:24px; font-family:Georgia,serif; width:${o.decimal ? 110 : 80}px; text-align:center; padding:8px; border:2px solid #c9b88b; border-radius:8px; margin-right:10px;">
      <button class="btn" id="answer-submit">OK</button>
      <div id="answer-feedback" style="font-size:18px; margin-top:8px; min-height:28px;"></div>
    </div>
  `);
  const input = document.getElementById('answer-input');
  const submit = document.getElementById('answer-submit');
  const feedback = document.getElementById('answer-feedback');
  input.focus();
  let attempts = 0;

  function check() {
    const val = o.decimal ? parseNum(input.value) : parseInt(input.value);
    if (isNaN(val)) return;
    if (o.decimal ? numEquals(val, correctAnswer, o.tol) : val === correctAnswer) {
      feedback.className = 'correct';
      feedback.textContent = t('fb_wonderful');
      input.disabled = true;
      submit.disabled = true;
      setTimeout(onCorrect, 800);
    } else {
      attempts++;
      feedback.className = 'incorrect';
      feedback.textContent = (attempts >= 2 && hint) ? t('fb_hint', {hint}) : t('fb_notquite');
      input.value = '';
      input.focus();
    }
  }
  submit.addEventListener('click', check);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
}

// ============================================================
// AREA CYCLE WITH SEED QUESTION
// ============================================================

// Reusable: full area cycle for a square field of given side
function fieldAreaCycle(side, cellSize, introText, onDone) {
  clearGame();
  storyHTML(`<div class="speaker">Eliel</div><p>${introText}</p>
    <p style="margin-top:8px"><em>${t('place_squares')}</em></p>`);

  buildField(side, side, cellSize, () => {
    // Ask how many magic squares
    askInline(
      t('q_squares_count'),
      side * side,
      () => {
        // Now ask how many seeds
        askInline(
          t('q_seeds_count'),
          side * side,
          () => {
            // Move to perimeter
            fieldPerimeterCycle(side, cellSize, onDone);
          },
          t('hint_each_seed')
        );
      },
      t('hint_count_squares')
    );
  });
}

// Reusable: perimeter cycle for a square field of given side
function fieldPerimeterCycle(side, cellSize, onDone) {
  clearGame();
  const rows = side, cols = side;
  const totalSegments = 2 * (rows + cols);
  const hitZone = 20;

  storyHTML(`<div class="speaker">Eliel</div>
    <p>${t('fpc_intro')}</p>`);

  const fieldContainer = document.createElement('div');
  fieldContainer.id = 'field-container';
  const field = document.createElement('div');
  field.id = 'field';
  field.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
  field.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
  field.style.width = `${cols * cellSize}px`;
  field.style.height = `${rows * cellSize}px`;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'field-cell filled';
      cell.style.width = cellSize + 'px';
      cell.style.height = cellSize + 'px';
      field.appendChild(cell);
    }
  }
  fieldContainer.appendChild(field);
  addPerimeterTicks(fieldContainer, rows, cols, cellSize);

  let coveredCount = 0;
  const halfHit = hitZone / 2;

  function onSegmentCovered() {
    coveredCount++;
    if (coveredCount === totalSegments) {
      setTimeout(() => {
        storyHTML(`
          <div class="speaker">Eliel</div>
          <p>${t('fpc_done')}</p>
          <div id="inline-answer" style="margin-top:12px">
            <input type="number" id="answer-input" inputmode="numeric" autocomplete="off"
              style="font-size:24px; font-family:Georgia,serif; width:80px; text-align:center; padding:8px; border:2px solid #c9b88b; border-radius:8px; margin-right:10px;">
            <button class="btn" id="answer-submit">OK</button>
            <div id="answer-feedback" style="font-size:18px; margin-top:8px; min-height:28px;"></div>
          </div>
        `);
        const input = document.getElementById('answer-input');
        const submit = document.getElementById('answer-submit');
        const feedback = document.getElementById('answer-feedback');
        input.focus();

        function check() {
          const val = parseInt(input.value);
          if (isNaN(val)) return;
          if (val === totalSegments) {
            feedback.className = 'correct';
            feedback.textContent = t('fb_perfect');
            input.disabled = true;
            submit.disabled = true;
            setTimeout(onDone, 1000);
          } else {
            feedback.className = 'incorrect';
            feedback.textContent = t('fb_notquite');
            input.value = '';
            input.focus();
          }
        }
        submit.addEventListener('click', check);
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
      }, 400);
    }
  }

  function makeSegment(x, y, w, h, isHoriz) {
    const seg = document.createElement('div');
    seg.className = 'perimeter-zone';
    seg.style.left = x + 'px';
    seg.style.top = y + 'px';
    seg.style.width = w + 'px';
    seg.style.height = h + 'px';
    seg.style.background = 'transparent';
    let covered = false;

    function cover() {
      if (covered) return;
      covered = true;
      const lineW = 7;
      if (isHoriz) {
        seg.innerHTML = `<svg width="${w}" height="${h}" style="position:absolute;left:0;top:0;">
          <line x1="0" y1="${h/2}" x2="${w}" y2="${h/2}" stroke="#5a8f3d" stroke-width="${lineW}" stroke-linecap="butt"/>
          <line x1="0" y1="${h/2-6}" x2="0" y2="${h/2+6}" stroke="#5a8f3d" stroke-width="2.5"/>
          <line x1="${w}" y1="${h/2-6}" x2="${w}" y2="${h/2+6}" stroke="#5a8f3d" stroke-width="2.5"/>
        </svg>`;
      } else {
        seg.innerHTML = `<svg width="${w}" height="${h}" style="position:absolute;left:0;top:0;">
          <line x1="${w/2}" y1="0" x2="${w/2}" y2="${h}" stroke="#5a8f3d" stroke-width="${lineW}" stroke-linecap="butt"/>
          <line x1="${w/2-6}" y1="0" x2="${w/2+6}" y2="0" stroke="#5a8f3d" stroke-width="2.5"/>
          <line x1="${w/2-6}" y1="${h}" x2="${w/2+6}" y2="${h}" stroke="#5a8f3d" stroke-width="2.5"/>
        </svg>`;
      }
      onSegmentCovered();
    }

    seg.addEventListener('click', cover);
    seg.addEventListener('dragover', (e) => e.preventDefault());
    seg.addEventListener('drop', (e) => {
      e.preventDefault();
      cover();
      if (currentDraggedLength) { currentDraggedLength.remove(); currentDraggedLength = null; }
    });
    fieldContainer.appendChild(seg);
  }

  for (let c = 0; c < cols; c++) {
    makeSegment(c * cellSize, -halfHit, cellSize, hitZone, true);
    makeSegment(c * cellSize, rows * cellSize - halfHit, cellSize, hitZone, true);
  }
  for (let r = 0; r < rows; r++) {
    makeSegment(-halfHit, r * cellSize, hitZone, cellSize, false);
    makeSegment(cols * cellSize - halfHit, r * cellSize, hitZone, cellSize, false);
  }

  gameArea.appendChild(fieldContainer);

  const supplyLabel = document.createElement('div');
  supplyLabel.id = 'supply-label';
  supplyLabel.textContent = t('supply_lengths_sides');
  gameArea.appendChild(supplyLabel);

  const supplyArea = document.createElement('div');
  supplyArea.id = 'supply-area';
  supplyArea.style.alignItems = 'center';

  function makeLengthPiece(isHoriz) {
    const ml = document.createElement('div');
    ml.className = 'magic-length';
    ml.draggable = true;
    if (isHoriz) {
      ml.style.width = cellSize + 'px';
      ml.style.height = '20px';
      ml.innerHTML = `<svg width="${cellSize}" height="20">
        <line x1="2" y1="10" x2="${cellSize-2}" y2="10" stroke="#3a3a3a" stroke-width="3" stroke-linecap="round"/>
        <line x1="2" y1="4" x2="2" y2="16" stroke="#3a3a3a" stroke-width="2"/>
        <line x1="${cellSize-2}" y1="4" x2="${cellSize-2}" y2="16" stroke="#3a3a3a" stroke-width="2"/>
      </svg>`;
    } else {
      ml.style.width = '20px';
      ml.style.height = cellSize + 'px';
      ml.innerHTML = `<svg width="20" height="${cellSize}">
        <line x1="10" y1="2" x2="10" y2="${cellSize-2}" stroke="#3a3a3a" stroke-width="3" stroke-linecap="round"/>
        <line x1="4" y1="2" x2="16" y2="2" stroke="#3a3a3a" stroke-width="2"/>
        <line x1="4" y1="${cellSize-2}" x2="16" y2="${cellSize-2}" stroke="#3a3a3a" stroke-width="2"/>
      </svg>`;
    }
    ml.addEventListener('dragstart', (e) => {
      currentDraggedLength = ml;
      ml.classList.add('dragging');
      e.dataTransfer.setData('text/plain', 'magic-length');
    });
    ml.addEventListener('dragend', () => {
      ml.classList.remove('dragging');
      currentDraggedLength = null;
    });
    return ml;
  }

  const horizLabel = document.createElement('div');
  horizLabel.style.cssText = 'width:100%; text-align:center; font-size:13px; color:#888; margin-bottom:4px;';
  horizLabel.textContent = t('lbl_horizontal');
  supplyArea.appendChild(horizLabel);
  for (let i = 0; i < totalSegments / 2 + 2; i++) supplyArea.appendChild(makeLengthPiece(true));

  const vertLabel = document.createElement('div');
  vertLabel.style.cssText = 'width:100%; text-align:center; font-size:13px; color:#888; margin-top:8px; margin-bottom:4px;';
  vertLabel.textContent = t('lbl_vertical');
  supplyArea.appendChild(vertLabel);
  for (let i = 0; i < totalSegments / 2 + 2; i++) supplyArea.appendChild(makeLengthPiece(false));

  gameArea.appendChild(supplyArea);
}

// ============================================================
// MEASURE SIDES FIELD (for rectangle practice with mult table)
// ============================================================

function buildMeasureSidesField(rows, cols, cellSize, onBothMeasured) {
  // Shows an empty field. Child places magic lengths on the bottom (horizontal)
  // and left (vertical) sides. When both are fully covered, calls onBothMeasured(cols, rows).
  const hitZone = 20;
  const halfHit = hitZone / 2;

  const fieldContainer = document.createElement('div');
  fieldContainer.id = 'field-container';
  const field = document.createElement('div');
  field.id = 'field';
  field.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
  field.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
  field.style.width = `${cols * cellSize}px`;
  field.style.height = `${rows * cellSize}px`;
  field.style.background = '#fafaf5';

  addPerimeterTicks(fieldContainer, rows, cols, cellSize);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'field-cell';
      cell.style.width = cellSize + 'px';
      cell.style.height = cellSize + 'px';
      field.appendChild(cell);
    }
  }
  fieldContainer.appendChild(field);

  let horizCovered = 0, vertCovered = 0;

  function checkDone() {
    if (horizCovered === cols && vertCovered === rows) {
      setTimeout(() => onBothMeasured(cols, rows), 400);
    }
  }

  // Bottom side: horizontal segments
  for (let c = 0; c < cols; c++) {
    const seg = document.createElement('div');
    seg.className = 'perimeter-zone';
    seg.style.left = (c * cellSize) + 'px';
    seg.style.top = (rows * cellSize - halfHit) + 'px';
    seg.style.width = cellSize + 'px';
    seg.style.height = hitZone + 'px';
    seg.style.background = 'transparent';
    let covered = false;
    function cover() {
      if (covered) return;
      covered = true;
      const lineW = 7;
      seg.innerHTML = `<svg width="${cellSize}" height="${hitZone}" style="position:absolute;left:0;top:0;">
        <line x1="0" y1="${hitZone/2}" x2="${cellSize}" y2="${hitZone/2}" stroke="#5a8f3d" stroke-width="${lineW}" stroke-linecap="butt"/>
        <line x1="0" y1="${hitZone/2-6}" x2="0" y2="${hitZone/2+6}" stroke="#5a8f3d" stroke-width="2.5"/>
        <line x1="${cellSize}" y1="${hitZone/2-6}" x2="${cellSize}" y2="${hitZone/2+6}" stroke="#5a8f3d" stroke-width="2.5"/>
      </svg>`;
      horizCovered++;
      checkDone();
    }
    seg.addEventListener('click', cover);
    seg.addEventListener('dragover', (e) => e.preventDefault());
    seg.addEventListener('drop', (e) => { e.preventDefault(); cover(); if(currentDraggedLength){currentDraggedLength.remove();currentDraggedLength=null;} });
    fieldContainer.appendChild(seg);
  }

  // Left side: vertical segments
  for (let r = 0; r < rows; r++) {
    const seg = document.createElement('div');
    seg.className = 'perimeter-zone';
    seg.style.left = (-halfHit) + 'px';
    seg.style.top = (r * cellSize) + 'px';
    seg.style.width = hitZone + 'px';
    seg.style.height = cellSize + 'px';
    seg.style.background = 'transparent';
    let covered = false;
    function cover() {
      if (covered) return;
      covered = true;
      const lineW = 7;
      seg.innerHTML = `<svg width="${hitZone}" height="${cellSize}" style="position:absolute;left:0;top:0;">
        <line x1="${hitZone/2}" y1="0" x2="${hitZone/2}" y2="${cellSize}" stroke="#5a8f3d" stroke-width="${lineW}" stroke-linecap="butt"/>
        <line x1="${hitZone/2-6}" y1="0" x2="${hitZone/2+6}" y2="0" stroke="#5a8f3d" stroke-width="2.5"/>
        <line x1="${hitZone/2-6}" y1="${cellSize}" x2="${hitZone/2+6}" y2="${cellSize}" stroke="#5a8f3d" stroke-width="2.5"/>
      </svg>`;
      vertCovered++;
      checkDone();
    }
    seg.addEventListener('click', cover);
    seg.addEventListener('dragover', (e) => e.preventDefault());
    seg.addEventListener('drop', (e) => { e.preventDefault(); cover(); if(currentDraggedLength){currentDraggedLength.remove();currentDraggedLength=null;} });
    fieldContainer.appendChild(seg);
  }

  gameArea.appendChild(fieldContainer);

  // Supply area with magic lengths
  const supplyLabel = document.createElement('div');
  supplyLabel.id = 'supply-label';
  supplyLabel.textContent = t('supply_measure_field');
  gameArea.appendChild(supplyLabel);

  const supplyArea = document.createElement('div');
  supplyArea.id = 'supply-area';
  supplyArea.style.alignItems = 'center';

  function makeLengthPiece(isHoriz) {
    const ml = document.createElement('div');
    ml.className = 'magic-length';
    ml.draggable = true;
    if (isHoriz) {
      ml.style.width = cellSize + 'px';
      ml.style.height = '20px';
      ml.innerHTML = `<svg width="${cellSize}" height="20">
        <line x1="2" y1="10" x2="${cellSize-2}" y2="10" stroke="#3a3a3a" stroke-width="3" stroke-linecap="round"/>
        <line x1="2" y1="4" x2="2" y2="16" stroke="#3a3a3a" stroke-width="2"/>
        <line x1="${cellSize-2}" y1="4" x2="${cellSize-2}" y2="16" stroke="#3a3a3a" stroke-width="2"/>
      </svg>`;
    } else {
      ml.style.width = '20px';
      ml.style.height = cellSize + 'px';
      ml.innerHTML = `<svg width="20" height="${cellSize}">
        <line x1="10" y1="2" x2="10" y2="${cellSize-2}" stroke="#3a3a3a" stroke-width="3" stroke-linecap="round"/>
        <line x1="4" y1="2" x2="16" y2="2" stroke="#3a3a3a" stroke-width="2"/>
        <line x1="4" y1="${cellSize-2}" x2="16" y2="${cellSize-2}" stroke="#3a3a3a" stroke-width="2"/>
      </svg>`;
    }
    ml.addEventListener('dragstart', (e) => {
      currentDraggedLength = ml;
      ml.classList.add('dragging');
      e.dataTransfer.setData('text/plain', 'magic-length');
    });
    ml.addEventListener('dragend', () => {
      ml.classList.remove('dragging');
      currentDraggedLength = null;
    });
    return ml;
  }

  const horizLabel = document.createElement('div');
  horizLabel.style.cssText = 'width:100%; text-align:center; font-size:13px; color:#888; margin-bottom:4px;';
  horizLabel.textContent = t('lbl_horizontal');
  supplyArea.appendChild(horizLabel);
  for (let i = 0; i < cols + 2; i++) supplyArea.appendChild(makeLengthPiece(true));

  const vertLabel = document.createElement('div');
  vertLabel.style.cssText = 'width:100%; text-align:center; font-size:13px; color:#888; margin-top:8px; margin-bottom:4px;';
  vertLabel.textContent = t('lbl_vertical');
  supplyArea.appendChild(vertLabel);
  for (let i = 0; i < rows + 2; i++) supplyArea.appendChild(makeLengthPiece(false));

  gameArea.appendChild(supplyArea);
}

// ============================================================
// MEASURE ONE SIDE (left or bottom)
// ============================================================

function buildMeasureLeftSide(rows, cols, cellSize, fieldContainer, onMeasured) {
  // Add clickable/draggable magic length zones on the left side only
  const hitZone = 20, halfHit = hitZone / 2;
  let covered = 0;

  for (let r = 0; r < rows; r++) {
    const seg = document.createElement('div');
    seg.className = 'perimeter-zone';
    seg.style.left = (-halfHit) + 'px';
    seg.style.top = (r * cellSize) + 'px';
    seg.style.width = hitZone + 'px';
    seg.style.height = cellSize + 'px';
    seg.style.background = 'transparent';
    let done = false;
    function cover() {
      if (done) return;
      done = true;
      const lineW = 7;
      seg.innerHTML = `<svg width="${hitZone}" height="${cellSize}" style="position:absolute;left:0;top:0;">
        <line x1="${hitZone/2}" y1="0" x2="${hitZone/2}" y2="${cellSize}" stroke="#5a8f3d" stroke-width="${lineW}" stroke-linecap="butt"/>
        <line x1="${hitZone/2-6}" y1="0" x2="${hitZone/2+6}" y2="0" stroke="#5a8f3d" stroke-width="2.5"/>
        <line x1="${hitZone/2-6}" y1="${cellSize}" x2="${hitZone/2+6}" y2="${cellSize}" stroke="#5a8f3d" stroke-width="2.5"/>
      </svg>`;
      covered++;
      if (covered === rows) setTimeout(() => onMeasured(rows), 300);
    }
    seg.addEventListener('click', cover);
    seg.addEventListener('dragover', (e) => e.preventDefault());
    seg.addEventListener('drop', (e) => { e.preventDefault(); cover(); if(currentDraggedLength){currentDraggedLength.remove();currentDraggedLength=null;} });
    fieldContainer.appendChild(seg);
  }
}

function buildMeasureBottomSide(rows, cols, cellSize, fieldContainer, onMeasured) {
  const hitZone = 20, halfHit = hitZone / 2;
  let covered = 0;

  for (let c = 0; c < cols; c++) {
    const seg = document.createElement('div');
    seg.className = 'perimeter-zone';
    seg.style.left = (c * cellSize) + 'px';
    seg.style.top = (rows * cellSize - halfHit) + 'px';
    seg.style.width = cellSize + 'px';
    seg.style.height = hitZone + 'px';
    seg.style.background = 'transparent';
    let done = false;
    function cover() {
      if (done) return;
      done = true;
      const lineW = 7;
      seg.innerHTML = `<svg width="${cellSize}" height="${hitZone}" style="position:absolute;left:0;top:0;">
        <line x1="0" y1="${hitZone/2}" x2="${cellSize}" y2="${hitZone/2}" stroke="#5a8f3d" stroke-width="${lineW}" stroke-linecap="butt"/>
        <line x1="0" y1="${hitZone/2-6}" x2="0" y2="${hitZone/2+6}" stroke="#5a8f3d" stroke-width="2.5"/>
        <line x1="${cellSize}" y1="${hitZone/2-6}" x2="${cellSize}" y2="${hitZone/2+6}" stroke="#5a8f3d" stroke-width="2.5"/>
      </svg>`;
      covered++;
      if (covered === cols) setTimeout(() => onMeasured(cols), 300);
    }
    seg.addEventListener('click', cover);
    seg.addEventListener('dragover', (e) => e.preventDefault());
    seg.addEventListener('drop', (e) => { e.preventDefault(); cover(); if(currentDraggedLength){currentDraggedLength.remove();currentDraggedLength=null;} });
    fieldContainer.appendChild(seg);
  }
}

function addMagicLengthSupply(cellSize, horizCount, vertCount) {
  const supplyLabel = document.createElement('div');
  supplyLabel.id = 'supply-label';
  supplyLabel.textContent = t('supply_length_side');
  gameArea.appendChild(supplyLabel);

  const supplyArea = document.createElement('div');
  supplyArea.id = 'supply-area';
  supplyArea.style.alignItems = 'center';

  function makePiece(isHoriz) {
    const ml = document.createElement('div');
    ml.className = 'magic-length';
    ml.draggable = true;
    if (isHoriz) {
      ml.style.width = cellSize + 'px'; ml.style.height = '20px';
      ml.innerHTML = `<svg width="${cellSize}" height="20"><line x1="2" y1="10" x2="${cellSize-2}" y2="10" stroke="#3a3a3a" stroke-width="3" stroke-linecap="round"/><line x1="2" y1="4" x2="2" y2="16" stroke="#3a3a3a" stroke-width="2"/><line x1="${cellSize-2}" y1="4" x2="${cellSize-2}" y2="16" stroke="#3a3a3a" stroke-width="2"/></svg>`;
    } else {
      ml.style.width = '20px'; ml.style.height = cellSize + 'px';
      ml.innerHTML = `<svg width="20" height="${cellSize}"><line x1="10" y1="2" x2="10" y2="${cellSize-2}" stroke="#3a3a3a" stroke-width="3" stroke-linecap="round"/><line x1="4" y1="2" x2="16" y2="2" stroke="#3a3a3a" stroke-width="2"/><line x1="4" y1="${cellSize-2}" x2="16" y2="${cellSize-2}" stroke="#3a3a3a" stroke-width="2"/></svg>`;
    }
    ml.addEventListener('dragstart', (e) => { currentDraggedLength = ml; ml.classList.add('dragging'); e.dataTransfer.setData('text/plain', 'magic-length'); });
    ml.addEventListener('dragend', () => { ml.classList.remove('dragging'); currentDraggedLength = null; });
    return ml;
  }

  if (horizCount > 0) {
    const hl = document.createElement('div');
    hl.style.cssText = 'width:100%; text-align:center; font-size:13px; color:#888; margin-bottom:4px;';
    hl.textContent = t('lbl_horizontal');
    supplyArea.appendChild(hl);
    for (let i = 0; i < horizCount; i++) supplyArea.appendChild(makePiece(true));
  }
  if (vertCount > 0) {
    const vl = document.createElement('div');
    vl.style.cssText = 'width:100%; text-align:center; font-size:13px; color:#888; margin-top:8px; margin-bottom:4px;';
    vl.textContent = t('lbl_vertical');
    supplyArea.appendChild(vl);
    for (let i = 0; i < vertCount; i++) supplyArea.appendChild(makePiece(false));
  }

  gameArea.appendChild(supplyArea);
}

// Build an empty field container (no interaction on cells)
function buildEmptyFieldContainer(rows, cols, cellSize) {
  const fieldContainer = document.createElement('div');
  fieldContainer.id = 'field-container';
  const field = document.createElement('div');
  field.id = 'field';
  field.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
  field.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
  field.style.width = `${cols * cellSize}px`;
  field.style.height = `${rows * cellSize}px`;
  field.style.background = '#fafaf5';

  addPerimeterTicks(fieldContainer, rows, cols, cellSize);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'field-cell';
      cell.style.width = cellSize + 'px';
      cell.style.height = cellSize + 'px';
      field.appendChild(cell);
    }
  }
  fieldContainer.appendChild(field);
  return fieldContainer;
}

// ============================================================
// MEASURE-BOTH-SIDES SEQUENTIAL (left first, then bottom)
// ============================================================

function measureBothSidesSequential(rows, cols, cellSize, onDone) {
  clearGame();
  storyHTML(`<div class="speaker">Eliel</div>
    <p>${t('mbs_left_first')}</p>`);

  const fc = buildEmptyFieldContainer(rows, cols, cellSize);
  gameArea.appendChild(fc);

  buildMeasureLeftSide(rows, cols, cellSize, fc, (h) => {
    askInline(t('q_left_tall'), h, () => {
      // Now measure bottom
      storyHTML(`<div class="speaker">Eliel</div>
        <p>${t('mbs_left_done', {h})}</p>`);

      // Remove old supply, add horizontal supply
      const oldSupply = document.getElementById('supply-area');
      const oldLabel = document.getElementById('supply-label');
      if (oldSupply) oldSupply.remove();
      if (oldLabel) oldLabel.remove();

      buildMeasureBottomSide(rows, cols, cellSize, fc, (w) => {
        askInline(t('q_bottom_wide'), w, () => {
          onDone(w, h);
        }, t('hint_count_bottom'));
      });

      addMagicLengthSupply(cellSize, cols + 2, 0);
    }, t('hint_count_left'));
  });

  addMagicLengthSupply(cellSize, 0, rows + 2);
}

// ============================================================
// SQUARE MEASURE-AND-FILL PROCEDURE
// ============================================================
// Full procedure: measure left side → place one s-block → place rest → table lookup → show filled
function squareMeasureAndFill(side, cellSize, onDone) {
  const fc = buildEmptyFieldContainer(side, side, cellSize);
  gameArea.appendChild(fc);

  buildMeasureLeftSide(side, side, cellSize, fc, () => {
    askInline(t('q_side_lengths'), side, () => {
      // Ask block size via clickable blocks
      storyHTML(`<div class="speaker">Eliel</div>
        <p>${t('smf_which_block', {side})}</p>`);

      const blockChoiceDiv = document.createElement('div');
      blockChoiceDiv.style.cssText = 'display:flex; gap:10px; justify-content:center; align-items:flex-end; margin:16px 0; flex-wrap:wrap;';
      const feedbackDiv = document.createElement('div');
      feedbackDiv.style.cssText = 'text-align:center; min-height:24px; font-size:16px; margin-top:8px;';

      for (let sz = 1; sz <= Math.max(side + 2, 6); sz++) {
        const bw = Math.min(cellSize, 36);
        const block = document.createElement('div');
        block.style.cssText = `width:${bw}px; display:flex; flex-direction:column; align-items:center; border:3px solid #5a8f3d; border-radius:3px; background:#fffef5; cursor:pointer; transition:transform 0.1s;`;
        for (let i = 0; i < sz; i++) {
          const sub = document.createElement('div');
          sub.style.cssText = `display:flex; align-items:center; justify-content:center; border-bottom:1px solid #ddd; font-size:14px; color:#555; width:${bw}px; height:${bw}px; box-sizing:border-box;`;
          sub.textContent = '·';
          block.appendChild(sub);
        }
        block.addEventListener('mouseenter', () => { block.style.transform = 'scale(1.1)'; });
        block.addEventListener('mouseleave', () => { block.style.transform = 'scale(1)'; });
        block.addEventListener('click', () => {
          if (sz === side) {
            blockChoiceDiv.remove();
            feedbackDiv.remove();
            storyHTML(`<div class="speaker">Eliel</div>
              <p>${t('smf_ok_cover', {side})}</p>`);
            clearGame();
            buildBlockField(side, side, cellSize, side, 1, () => {
              askInline(t('q_nblocks_needed', {n:side}), side, () => {
                storyHTML(`<div class="speaker">Eliel</div>
                  <p>${t('smf_table', {side})}</p>`);
                gameArea.appendChild(showFullMultTable(1, 10, {a:side, b:side}, true));
                askNumber(`${side}² = ${side} × ${side} = ?`, side*side, () => {
                  say('Eliel', `${side}² = ${side*side}!`);
                  addButton(t('btn_continue'), onDone);
                }, t('hint_find_in_table', {a:side, b:side}));
              }, t('hint_count_blocks'));
            });
          } else {
            feedbackDiv.innerHTML = `<span class="incorrect">${t('fb_block_column', {sz})}</span>`;
          }
        });
        blockChoiceDiv.appendChild(block);
      }
      gameArea.appendChild(blockChoiceDiv);
      gameArea.appendChild(feedbackDiv);
    }, t('hint_count_lengths'));
  });

  addMagicLengthSupply(cellSize, 0, side + 2);
}

// ============================================================
// RECTANGLE BOTH-ORIENTATIONS PROCEDURE
// ============================================================
// Measures left side → vertical blocks → count → table
// Then horizontal blocks → count → table → confirms commutativity
function rectBothOrientations(rows, cols, cellSize, onDone) {
  // Step 1: Measure BOTH sides first
  measureBothSidesSequential(rows, cols, cellSize, (w, h) => {
    // h = rows (left side), w = cols (bottom side)

    // Step 2: Choose vertical block
    storyHTML(`<div class="speaker">Eliel</div>
      <p>${t('rbo_which_vblock', {h, w})}</p>`);

    function makeBlockChoice(isVertical, targetSize, maxSize, onCorrect) {
      const bcDiv = document.createElement('div');
      bcDiv.style.cssText = `display:flex; gap:8px; justify-content:center; align-items:${isVertical ? 'flex-end' : 'flex-start'}; margin:12px 0; flex-wrap:wrap;`;
      const fbDiv = document.createElement('div');
      fbDiv.style.cssText = 'text-align:center; min-height:24px; font-size:16px; margin-top:6px;';
      const bw = Math.min(cellSize, 30);

      for (let sz = 1; sz <= maxSize; sz++) {
        const bl = document.createElement('div');
        if (isVertical) {
          bl.style.cssText = `width:${bw}px; display:flex; flex-direction:column; border:3px solid #5a8f3d; border-radius:3px; background:#fffef5; cursor:pointer; transition:transform 0.1s;`;
        } else {
          bl.style.cssText = `height:${bw}px; display:flex; flex-direction:row; border:3px solid #5a8f3d; border-radius:3px; background:#fffef5; cursor:pointer; transition:transform 0.1s;`;
        }
        for (let i = 0; i < sz; i++) {
          const sub = document.createElement('div');
          sub.style.cssText = `display:flex; align-items:center; justify-content:center; ${isVertical ? 'border-bottom' : 'border-right'}:1px solid #ddd; font-size:14px; color:#555; width:${bw}px; height:${bw}px; box-sizing:border-box;`;
          sub.textContent = '·';
          bl.appendChild(sub);
        }
        bl.addEventListener('mouseenter', () => { bl.style.transform = 'scale(1.1)'; });
        bl.addEventListener('mouseleave', () => { bl.style.transform = 'scale(1)'; });
        bl.addEventListener('click', () => {
          if (sz === targetSize) {
            bcDiv.remove(); fbDiv.remove();
            onCorrect();
          } else {
            fbDiv.innerHTML = `<span class="incorrect">${t('fb_block_fit', {sz, which: isVertical ? t('lbl_left_side') : t('lbl_bottom_side'), target: targetSize})}</span>`;
          }
        });
        bcDiv.appendChild(bl);
      }
      gameArea.appendChild(bcDiv);
      gameArea.appendChild(fbDiv);
    }

    // Vertical block choice
    makeBlockChoice(true, h, Math.max(h + 2, 6), () => {
      // Cover with vertical blocks
      storyHTML(`<div class="speaker">Eliel</div>
        <p>${t('rbo_ok_vcover', {n:h})}</p>`);
      clearGame();
      buildBlockField(h, w, cellSize, h, 1, () => {
        askInline(t('q_nblocks_used', {n:h}), w, () => {
          storyHTML(`<div class="speaker">Eliel</div>
            <p>${t('rbo_formula', {h, w})}</p>`);
          gameArea.appendChild(showFullMultTable(1, 10, {a:w, b:h}, true));
          askNumber(`${w} × ${h} = ?`, w * h, () => {
            storyHTML(`<div class="speaker">Eliel</div>
              <p>${t('rbo_area_ok', {w, h, p:w*h})}</p>
              <p style="margin-top:8px">${t('rbo_other_dir')}</p>`);
            addButton(t('btn_lets_try'), () => {
              // Step 3: Horizontal blocks — show field with green sides
              clearGame();

              // Show field with green left + bottom sides
              const fc2 = buildEmptyFieldContainer(h, w, cellSize);
              // Green left side
              for (let r = 0; r < h; r++) {
                const seg = document.createElement('div');
                seg.style.cssText = `position:absolute; left:-5px; top:${r*cellSize}px; width:10px; height:${cellSize}px; z-index:5;`;
                seg.innerHTML = `<svg width="10" height="${cellSize}"><line x1="5" y1="0" x2="5" y2="${cellSize}" stroke="#5a8f3d" stroke-width="7"/></svg>`;
                fc2.appendChild(seg);
              }
              // Green bottom side
              for (let c = 0; c < w; c++) {
                const seg = document.createElement('div');
                seg.style.cssText = `position:absolute; left:${c*cellSize}px; top:${h*cellSize - 5}px; width:${cellSize}px; height:10px; z-index:5;`;
                seg.innerHTML = `<svg width="${cellSize}" height="10"><line x1="0" y1="5" x2="${cellSize}" y2="5" stroke="#5a8f3d" stroke-width="7"/></svg>`;
                fc2.appendChild(seg);
              }
              gameArea.appendChild(fc2);

              storyHTML(`<div class="speaker">Eliel</div>
                <p>${t('rbo_which_hblock')}</p>`);

              makeBlockChoice(false, w, Math.max(w + 2, 6), () => {
                storyHTML(`<div class="speaker">Eliel</div>
                  <p>${t('rbo_ok_hcover', {n:w})}</p>`);
                clearGame();
                buildBlockField(h, w, cellSize, 1, w, () => {
                  askInline(t('q_nblocks_used', {n:w}), h, () => {
                    storyHTML(`<div class="speaker">Eliel</div>
                      <p>${t('rbo_check', {h, w})}</p>`);
                    gameArea.appendChild(showFullMultTable(1, 10, {a:h, b:w}, true));
                    askNumber(`${h} × ${w} = ?`, h * w, () => {
                      storyHTML(`<div class="speaker">Eliel</div>
                        <p>${t('rbo_comm', {w, h, p:w*h})}</p>`);
                      addButton(t('btn_continue'), onDone);
                    }, t('hint_find_in_table', {a:h, b:w}));
                  }, t('hint_count_blocks'));
                });
              });
            });
          }, t('hint_find_in_table', {a:w, b:h}));
        }, t('hint_count_blocks'));
      });
    });
  });
}

// ============================================================
// MULTI-FIELD CHALLENGE (all fields at once)
// ============================================================
function buildMultiFieldChallenge(fields, onAllCorrect, skipStory) {
  // fields: [{rows, cols, cellSize, answer}]
  clearGame();
  if (!skipStory) {
    storyHTML(`<div class="speaker">Eliel</div>
      <p>${t('mfc_intro')}</p>
      <p style="margin-top:8px"><em>${t('mfc_hint')}</em></p>`);
  }

  const fieldsRow = document.createElement('div');
  fieldsRow.style.cssText = 'display:flex; flex-wrap:wrap; gap:16px; justify-content:center; align-items:flex-start; margin-bottom:16px;';

  const inputs = [];

  fields.forEach((fd, idx) => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex; flex-direction:column; align-items:center; gap:6px;';

    const fc = buildEmptyFieldContainer(fd.rows, fd.cols, fd.cellSize);
    fc.style.margin = '8px';

    // Add clickable magic lengths on left and bottom
    buildMeasureLeftSide(fd.rows, fd.cols, fd.cellSize, fc, () => {});
    buildMeasureBottomSide(fd.rows, fd.cols, fd.cellSize, fc, () => {});

    wrapper.appendChild(fc);

    // Input for area
    const inputBox = document.createElement('input');
    inputBox.type = 'number';
    inputBox.inputMode = 'numeric';
    inputBox.autocomplete = 'off';
    inputBox.style.cssText = 'font-size:18px; font-family:Georgia,serif; width:60px; text-align:center; padding:6px; border:2px solid #c9b88b; border-radius:6px;';
    inputBox.placeholder = '?';
    inputBox._correctAnswer = fd.answer;
    inputs.push(inputBox);
    wrapper.appendChild(inputBox);

    fieldsRow.appendChild(wrapper);
  });

  gameArea.appendChild(fieldsRow);

  // Multiplication table
  gameArea.appendChild(showFullMultTable(1, 10, null, false, true));

  // "I am finished" button
  const checkBtn = document.createElement('button');
  checkBtn.className = 'btn';
  checkBtn.textContent = t('btn_finished');
  checkBtn.style.marginTop = '16px';
  checkBtn.addEventListener('click', () => {
    let allCorrect = true;
    inputs.forEach(inp => {
      const val = parseInt(inp.value);
      if (val === inp._correctAnswer) {
        inp.style.borderColor = '#5a8f3d';
        inp.style.background = '#d4edda';
      } else {
        inp.style.borderColor = '#c0392b';
        inp.style.background = '#fdd';
        allCorrect = false;
      }
    });
    if (allCorrect) {
      checkBtn.remove();
      storyHTML(`<div class="speaker">Eliel</div>
        <p>${t('mfc_allcorrect')}</p>`);
      addButton(t('btn_continue'), onAllCorrect);
    } else {
      // Show hint
      const hint = document.createElement('div');
      hint.style.cssText = 'text-align:center; margin-top:8px; color:#c0392b; font-size:16px;';
      hint.textContent = t('mfc_notyet');
      if (!gameArea.querySelector('.hint-msg')) {
        hint.className = 'hint-msg';
        gameArea.appendChild(hint);
      }
    }
  });
  buttonArea.appendChild(checkBtn);
}

// ============================================================
// PERIMETER VERIFICATION (count all magic lengths around field)
// ============================================================
function buildPerimeterVerify(rows, cols, cellSize, onComplete) {
  // Shows a filled field with clickable/draggable magic length zones on ALL 4 sides
  // When all covered, calls onComplete(totalPerimeter)
  const totalSegments = 2 * (rows + cols);
  const hitZone = 20, halfHit = hitZone / 2;
  let coveredCount = 0;

  const fieldContainer = document.createElement('div');
  fieldContainer.id = 'field-container';
  const field = document.createElement('div');
  field.id = 'field';
  field.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
  field.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
  field.style.width = `${cols * cellSize}px`;
  field.style.height = `${rows * cellSize}px`;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'field-cell filled';
      cell.style.width = cellSize + 'px';
      cell.style.height = cellSize + 'px';
      field.appendChild(cell);
    }
  }
  fieldContainer.appendChild(field);

  function makeSeg(x, y, w, h, isHoriz) {
    const seg = document.createElement('div');
    seg.className = 'perimeter-zone';
    seg.style.left = x + 'px';
    seg.style.top = y + 'px';
    seg.style.width = w + 'px';
    seg.style.height = h + 'px';
    seg.style.background = 'transparent';
    let covered = false;
    function cover() {
      if (covered) return;
      covered = true;
      const lineW = 7;
      if (isHoriz) {
        seg.innerHTML = `<svg width="${w}" height="${h}" style="position:absolute;left:0;top:0;"><line x1="0" y1="${h/2}" x2="${w}" y2="${h/2}" stroke="#5a8f3d" stroke-width="${lineW}" stroke-linecap="butt"/><line x1="0" y1="${h/2-6}" x2="0" y2="${h/2+6}" stroke="#5a8f3d" stroke-width="2.5"/><line x1="${w}" y1="${h/2-6}" x2="${w}" y2="${h/2+6}" stroke="#5a8f3d" stroke-width="2.5"/></svg>`;
      } else {
        seg.innerHTML = `<svg width="${w}" height="${h}" style="position:absolute;left:0;top:0;"><line x1="${w/2}" y1="0" x2="${w/2}" y2="${h}" stroke="#5a8f3d" stroke-width="${lineW}" stroke-linecap="butt"/><line x1="${w/2-6}" y1="0" x2="${w/2+6}" y2="0" stroke="#5a8f3d" stroke-width="2.5"/><line x1="${w/2-6}" y1="${h}" x2="${w/2+6}" y2="${h}" stroke="#5a8f3d" stroke-width="2.5"/></svg>`;
      }
      coveredCount++;
      if (coveredCount === totalSegments) setTimeout(() => onComplete(totalSegments), 400);
    }
    seg.addEventListener('click', cover);
    seg.addEventListener('dragover', (e) => e.preventDefault());
    seg.addEventListener('drop', (e) => { e.preventDefault(); cover(); if(currentDraggedLength){currentDraggedLength.remove();currentDraggedLength=null;} });
    fieldContainer.appendChild(seg);
  }

  for (let c = 0; c < cols; c++) {
    makeSeg(c * cellSize, -halfHit, cellSize, hitZone, true);
    makeSeg(c * cellSize, rows * cellSize - halfHit, cellSize, hitZone, true);
  }
  for (let r = 0; r < rows; r++) {
    makeSeg(-halfHit, r * cellSize, hitZone, cellSize, false);
    makeSeg(cols * cellSize - halfHit, r * cellSize, hitZone, cellSize, false);
  }

  gameArea.appendChild(fieldContainer);
}

// ============================================================
// STACKED MAGIC LENGTH SUPPLY (grouped segments with ticks)

function makeStackedLengthSVG(n, cellSize, isHoriz) {
  // Creates an SVG showing n magic lengths grouped together with ticks between them
  if (isHoriz) {
    const w = n * cellSize, h = 20;
    let svg = `<svg width="${w}" height="${h}">`;
    svg += `<line x1="2" y1="${h/2}" x2="${w-2}" y2="${h/2}" stroke="#3a3a3a" stroke-width="3" stroke-linecap="round"/>`;
    // End ticks
    svg += `<line x1="2" y1="${h/2-6}" x2="2" y2="${h/2+6}" stroke="#3a3a3a" stroke-width="2.5"/>`;
    svg += `<line x1="${w-2}" y1="${h/2-6}" x2="${w-2}" y2="${h/2+6}" stroke="#3a3a3a" stroke-width="2.5"/>`;
    // Interior ticks
    for (let i = 1; i < n; i++) {
      svg += `<line x1="${i*cellSize}" y1="${h/2-4}" x2="${i*cellSize}" y2="${h/2+4}" stroke="#3a3a3a" stroke-width="1.5"/>`;
    }
    svg += '</svg>';
    return { html: svg, width: w, height: h };
  } else {
    const w = 20, h = n * cellSize;
    let svg = `<svg width="${w}" height="${h}">`;
    svg += `<line x1="${w/2}" y1="2" x2="${w/2}" y2="${h-2}" stroke="#3a3a3a" stroke-width="3" stroke-linecap="round"/>`;
    svg += `<line x1="${w/2-6}" y1="2" x2="${w/2+6}" y2="2" stroke="#3a3a3a" stroke-width="2.5"/>`;
    svg += `<line x1="${w/2-6}" y1="${h-2}" x2="${w/2+6}" y2="${h-2}" stroke="#3a3a3a" stroke-width="2.5"/>`;
    for (let i = 1; i < n; i++) {
      svg += `<line x1="${w/2-4}" y1="${i*cellSize}" x2="${w/2+4}" y2="${i*cellSize}" stroke="#3a3a3a" stroke-width="1.5"/>`;
    }
    svg += '</svg>';
    return { html: svg, width: w, height: h };
  }
}

function addStackedLengthSupply(n, cellSize, horizCount, vertCount) {
  const supplyLabel = document.createElement('div');
  supplyLabel.id = 'supply-label';
  supplyLabel.textContent = t('supply_stacked', {n});
  gameArea.appendChild(supplyLabel);

  const supplyArea = document.createElement('div');
  supplyArea.id = 'supply-area';
  supplyArea.style.alignItems = 'center';

  if (horizCount > 0) {
    const hl = document.createElement('div');
    hl.style.cssText = 'width:100%; text-align:center; font-size:13px; color:#888; margin-bottom:4px;';
    hl.textContent = t('lbl_horizontal');
    supplyArea.appendChild(hl);
    const hSvg = makeStackedLengthSVG(n, cellSize, true);
    for (let i = 0; i < horizCount; i++) {
      const ml = document.createElement('div');
      ml.className = 'magic-length';
      ml.draggable = true;
      ml.style.width = hSvg.width + 'px';
      ml.style.height = hSvg.height + 'px';
      ml.innerHTML = hSvg.html;
      ml.addEventListener('dragstart', (e) => { currentDraggedLength = ml; ml.classList.add('dragging'); e.dataTransfer.setData('text/plain', 'stacked-length'); });
      ml.addEventListener('dragend', () => { ml.classList.remove('dragging'); currentDraggedLength = null; });
      supplyArea.appendChild(ml);
    }
  }
  if (vertCount > 0) {
    const vl = document.createElement('div');
    vl.style.cssText = 'width:100%; text-align:center; font-size:13px; color:#888; margin-top:8px; margin-bottom:4px;';
    vl.textContent = t('lbl_vertical');
    supplyArea.appendChild(vl);
    const vSvg = makeStackedLengthSVG(n, cellSize, false);
    for (let i = 0; i < vertCount; i++) {
      const ml = document.createElement('div');
      ml.className = 'magic-length';
      ml.draggable = true;
      ml.style.width = vSvg.width + 'px';
      ml.style.height = vSvg.height + 'px';
      ml.innerHTML = vSvg.html;
      ml.addEventListener('dragstart', (e) => { currentDraggedLength = ml; ml.classList.add('dragging'); e.dataTransfer.setData('text/plain', 'stacked-length'); });
      ml.addEventListener('dragend', () => { ml.classList.remove('dragging'); currentDraggedLength = null; });
      supplyArea.appendChild(ml);
    }
  }
  gameArea.appendChild(supplyArea);
}

// Build perimeter with stacked magic lengths (n magic lengths per side piece)
// Each side is ONE drop zone that accepts one stacked piece
function buildStackedPerimeter(rows, cols, cellSize, onAllCovered) {
  const fieldContainer = document.createElement('div');
  fieldContainer.id = 'field-container';
  const field = document.createElement('div');
  field.id = 'field';
  field.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
  field.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
  field.style.width = `${cols * cellSize}px`;
  field.style.height = `${rows * cellSize}px`;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'field-cell filled';
      cell.style.width = cellSize + 'px';
      cell.style.height = cellSize + 'px';
      field.appendChild(cell);
    }
  }
  fieldContainer.appendChild(field);

  let coveredCount = 0;
  const totalSides = 4;
  const hitZone = 24;

  function makeSideDrop(x, y, w, h, isHoriz, sideLen) {
    const seg = document.createElement('div');
    seg.className = 'perimeter-zone';
    seg.style.left = x + 'px';
    seg.style.top = y + 'px';
    seg.style.width = w + 'px';
    seg.style.height = h + 'px';
    seg.style.background = 'transparent';
    let covered = false;
    function cover() {
      if (covered) return;
      covered = true;
      // Draw green stacked length
      const lineW = 7;
      if (isHoriz) {
        let svg = `<svg width="${w}" height="${h}" style="position:absolute;left:0;top:0;">`;
        svg += `<line x1="0" y1="${h/2}" x2="${w}" y2="${h/2}" stroke="#5a8f3d" stroke-width="${lineW}" stroke-linecap="butt"/>`;
        svg += `<line x1="0" y1="${h/2-6}" x2="0" y2="${h/2+6}" stroke="#5a8f3d" stroke-width="2.5"/>`;
        svg += `<line x1="${w}" y1="${h/2-6}" x2="${w}" y2="${h/2+6}" stroke="#5a8f3d" stroke-width="2.5"/>`;
        for (let i = 1; i < sideLen; i++) {
          svg += `<line x1="${i*cellSize}" y1="${h/2-4}" x2="${i*cellSize}" y2="${h/2+4}" stroke="#5a8f3d" stroke-width="1.5"/>`;
        }
        svg += '</svg>';
        seg.innerHTML = svg;
      } else {
        let svg = `<svg width="${w}" height="${h}" style="position:absolute;left:0;top:0;">`;
        svg += `<line x1="${w/2}" y1="0" x2="${w/2}" y2="${h}" stroke="#5a8f3d" stroke-width="${lineW}" stroke-linecap="butt"/>`;
        svg += `<line x1="${w/2-6}" y1="0" x2="${w/2+6}" y2="0" stroke="#5a8f3d" stroke-width="2.5"/>`;
        svg += `<line x1="${w/2-6}" y1="${h}" x2="${w/2+6}" y2="${h}" stroke="#5a8f3d" stroke-width="2.5"/>`;
        for (let i = 1; i < sideLen; i++) {
          svg += `<line x1="${w/2-4}" y1="${i*cellSize}" x2="${w/2+4}" y2="${i*cellSize}" stroke="#5a8f3d" stroke-width="1.5"/>`;
        }
        svg += '</svg>';
        seg.innerHTML = svg;
      }
      coveredCount++;
      if (coveredCount === totalSides) setTimeout(() => onAllCovered(), 400);
    }
    seg.addEventListener('click', cover);
    seg.addEventListener('dragover', (e) => e.preventDefault());
    seg.addEventListener('drop', (e) => { e.preventDefault(); cover(); if(currentDraggedLength){currentDraggedLength.remove();currentDraggedLength=null;} });
    fieldContainer.appendChild(seg);
  }

  // Top and bottom (horizontal, width = cols * cellSize)
  makeSideDrop(0, -hitZone/2, cols * cellSize, hitZone, true, cols);
  makeSideDrop(0, rows * cellSize - hitZone/2, cols * cellSize, hitZone, true, cols);
  // Left and right (vertical, height = rows * cellSize)
  makeSideDrop(-hitZone/2, 0, hitZone, rows * cellSize, false, rows);
  makeSideDrop(cols * cellSize - hitZone/2, 0, hitZone, rows * cellSize, false, rows);

  gameArea.appendChild(fieldContainer);
}

// PERIMETER PRACTICE HELPERS
// ============================================================

// Square perimeter practice: measure side → 4×s from table → verify by counting
function perimeterSquarePractice(side, cellSize, onDone, useStacked) {
  clearGame();
  storyHTML(`<div class="speaker">Eliel</div><p>${t('psp_intro')}</p>`);

  const fc = buildEmptyFieldContainer(side, side, cellSize);
  gameArea.appendChild(fc);
  buildMeasureLeftSide(side, side, cellSize, fc, () => {
    askInline(t('q_side_lengths'), side, () => {
      if (useStacked) {
        // Choose stacked segments + place around field
        storyHTML(`<div class="speaker">Eliel</div>
          <p>${t('psp_choose', {side})}</p>`);
        clearGame();
        buildStackedPerimeter(side, side, cellSize, () => {
          askInline(t('q_stacked_total'), 4, () => {
            storyHTML(`<div class="speaker">Eliel</div>
              <p>${t('psp_remind', {side})}</p>`);
            const choiceDiv = document.createElement('div');
            choiceDiv.style.cssText = 'display:flex; gap:16px; justify-content:center; margin:12px 0;';
            const addBtn = document.createElement('button'); addBtn.className = 'btn btn-secondary'; addBtn.textContent = t('lbl_addition');
            const mulBtn = document.createElement('button'); mulBtn.className = 'btn'; mulBtn.textContent = t('lbl_multiplication');
            addBtn.addEventListener('click', () => {
              const fb = document.createElement('div'); fb.style.cssText = 'text-align:center; color:#c0392b; margin-top:8px;';
              fb.textContent = t('fb_not_quite_times', {side}); choiceDiv.after(fb);
            });
            mulBtn.addEventListener('click', () => {
              choiceDiv.remove();
              storyHTML(`<div class="speaker">Eliel</div>
                <p>${t('psp_yes', {side})}</p>`);
              gameArea.appendChild(showFullMultTable(1, 10, {a:4, b:side}, true));
              askNumber(`4 × ${side} = ?`, 4 * side, () => {
                storyHTML(`<div class="speaker">Eliel</div>
                  <p>${t('psp_verify')}</p>`);
                clearGame();
                buildPerimeterVerify(side, side, cellSize, (total) => {
                  askInline(t('q_lengths_total'), total, () => {
                    say('Eliel', `4×${side} = ${4*side}. Correct!`);
                    addButton(t('btn_continue'), onDone);
                  }, t('hint_count_green'));
                });
                addMagicLengthSupply(cellSize, 2 * side + 2, 2 * side + 2);
              }, t('hint_find_in_table', {a:4, b:side}));
            });
            choiceDiv.appendChild(addBtn); choiceDiv.appendChild(mulBtn);
            gameArea.appendChild(choiceDiv);
          }, 'Count: 2 horizontal + 2 vertical');
        });
        addStackedLengthSupply(side, cellSize, 3, 3);
      } else {
        // Quick version: just formula + verify
        storyHTML(`<div class="speaker">Eliel</div>
          <p>${t('psp_direct', {side})}</p>`);
        gameArea.appendChild(showFullMultTable(1, 10, {a:4, b:side}, true));
        askNumber(`4 × ${side} = ?`, 4 * side, () => {
          storyHTML(`<div class="speaker">Eliel</div>
            <p>${t('psp_lets_verify')}</p>`);
          clearGame();
          buildPerimeterVerify(side, side, cellSize, (total) => {
            askInline(t('q_lengths_total'), total, () => {
              say('Eliel', `4×${side} = ${4*side}. Correct!`);
              addButton(t('btn_continue'), onDone);
            }, t('hint_count_green'));
          });
          addMagicLengthSupply(cellSize, 2 * side + 2, 2 * side + 2);
        }, t('hint_find_in_table', {a:4, b:side}));
      }
    }, t('hint_count_lengths'));
  });
  addMagicLengthSupply(cellSize, 0, side + 2);
}

// Rectangle perimeter practice: measure both sides → 2×L + 2×l from table → verify
function perimeterRectPractice(rows, cols, cellSize, onDone) {
  // Measure both sides
  measureBothSidesSequential(rows, cols, cellSize, (w, h) => {
    // h = rows (left side), w = cols (bottom side)
    // Place stacked segments around the field
    storyHTML(`<div class="speaker">Eliel</div>
      <p>${t('prp_place', {h, w})}</p>`);
    clearGame();

    // Build stacked perimeter — need 2 horiz of width w and 2 vert of height h
    // Use separate stacked lengths for horizontal (w) and vertical (h)
    const fc2 = document.createElement('div');
    fc2.id = 'field-container';
    const field2 = document.createElement('div');
    field2.id = 'field';
    field2.style.gridTemplateColumns = `repeat(${w}, ${cellSize}px)`;
    field2.style.gridTemplateRows = `repeat(${h}, ${cellSize}px)`;
    field2.style.width = `${w * cellSize}px`;
    field2.style.height = `${h * cellSize}px`;
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        const cell = document.createElement('div');
        cell.className = 'field-cell filled';
        cell.style.width = cellSize + 'px';
        cell.style.height = cellSize + 'px';
        field2.appendChild(cell);
      }
    }
    fc2.appendChild(field2);

    let coveredSides = 0;
    const hitZone = 24;

    function makeSideDrop(x, y, wd, ht, isHoriz, sideLen) {
      const seg = document.createElement('div');
      seg.className = 'perimeter-zone';
      seg.style.cssText = `position:absolute; left:${x}px; top:${y}px; width:${wd}px; height:${ht}px; background:transparent;`;
      let covered = false;
      function cover() {
        if (covered) return;
        covered = true;
        const lineW = 7;
        let svg;
        if (isHoriz) {
          svg = `<svg width="${wd}" height="${ht}" style="position:absolute;left:0;top:0;"><line x1="0" y1="${ht/2}" x2="${wd}" y2="${ht/2}" stroke="#5a8f3d" stroke-width="${lineW}"/>`;
          svg += `<line x1="0" y1="${ht/2-6}" x2="0" y2="${ht/2+6}" stroke="#5a8f3d" stroke-width="2.5"/>`;
          svg += `<line x1="${wd}" y1="${ht/2-6}" x2="${wd}" y2="${ht/2+6}" stroke="#5a8f3d" stroke-width="2.5"/>`;
          for (let i = 1; i < sideLen; i++) svg += `<line x1="${i*cellSize}" y1="${ht/2-4}" x2="${i*cellSize}" y2="${ht/2+4}" stroke="#5a8f3d" stroke-width="1.5"/>`;
          svg += '</svg>';
        } else {
          svg = `<svg width="${wd}" height="${ht}" style="position:absolute;left:0;top:0;"><line x1="${wd/2}" y1="0" x2="${wd/2}" y2="${ht}" stroke="#5a8f3d" stroke-width="${lineW}"/>`;
          svg += `<line x1="${wd/2-6}" y1="0" x2="${wd/2+6}" y2="0" stroke="#5a8f3d" stroke-width="2.5"/>`;
          svg += `<line x1="${wd/2-6}" y1="${ht}" x2="${wd/2+6}" y2="${ht}" stroke="#5a8f3d" stroke-width="2.5"/>`;
          for (let i = 1; i < sideLen; i++) svg += `<line x1="${wd/2-4}" y1="${i*cellSize}" x2="${wd/2+4}" y2="${i*cellSize}" stroke="#5a8f3d" stroke-width="1.5"/>`;
          svg += '</svg>';
        }
        seg.innerHTML = svg;
        coveredSides++;
        if (coveredSides === 4) setTimeout(afterAllCovered, 400);
      }
      seg.addEventListener('click', cover);
      seg.addEventListener('dragover', (e) => e.preventDefault());
      seg.addEventListener('drop', (e) => { e.preventDefault(); cover(); if(currentDraggedLength){currentDraggedLength.remove();currentDraggedLength=null;} });
      fc2.appendChild(seg);
    }

    makeSideDrop(0, -hitZone/2, w*cellSize, hitZone, true, w);
    makeSideDrop(0, h*cellSize - hitZone/2, w*cellSize, hitZone, true, w);
    makeSideDrop(-hitZone/2, 0, hitZone, h*cellSize, false, h);
    makeSideDrop(w*cellSize - hitZone/2, 0, hitZone, h*cellSize, false, h);

    gameArea.appendChild(fc2);
    addStackedLengthSupply(h, cellSize, 0, 3); // vertical h-stacks
    // Also add horizontal w-stacks
    const supplyArea = document.getElementById('supply-area');
    const hLabel = document.createElement('div');
    hLabel.style.cssText = 'width:100%; text-align:center; font-size:13px; color:#888; margin-top:8px; margin-bottom:4px;';
    hLabel.textContent = t('lbl_horizontal');
    supplyArea.appendChild(hLabel);
    const hSvg = makeStackedLengthSVG(w, cellSize, true);
    for (let i = 0; i < 3; i++) {
      const ml = document.createElement('div');
      ml.className = 'magic-length';
      ml.draggable = true;
      ml.style.width = hSvg.width + 'px';
      ml.style.height = hSvg.height + 'px';
      ml.innerHTML = hSvg.html;
      ml.addEventListener('dragstart', (e) => { currentDraggedLength = ml; ml.classList.add('dragging'); e.dataTransfer.setData('text/plain', 'stacked'); });
      ml.addEventListener('dragend', () => { ml.classList.remove('dragging'); currentDraggedLength = null; });
      supplyArea.appendChild(ml);
    }

    function afterAllCovered() {
      // Compute with multiplication
      storyHTML(`<div class="speaker">Eliel</div>
        <p>${t('prp_total', {h, w})}</p>
        <p style="margin-top:8px">${t('prp_first', {h})}</p>`);
      gameArea.appendChild(showFullMultTable(1, 10, {a:2, b:h}, true));
      askNumber(`2 × ${h} = ?`, 2 * h, () => {
        storyHTML(`<div class="speaker">Eliel</div>
          <p>${t('prp_good', {h, dh:2*h, w})}</p>`);
        gameArea.appendChild(showFullMultTable(1, 10, {a:2, b:w}, true));
        askNumber(`2 × ${w} = ?`, 2 * w, () => {
          const perim = 2 * h + 2 * w;
          storyHTML(`<div class="speaker">Eliel</div>
            <p>${t('prp_sum', {dh:2*h, dw:2*w})}</p>`);
          askNumber(`${2*h} + ${2*w} = ?`, perim, () => {
            storyHTML(`<div class="speaker">Eliel</div>
              <p>${t('psp_verify')}</p>`);
            clearGame();
            buildPerimeterVerify(rows, cols, cellSize, (total) => {
              askInline(t('q_lengths_total'), total, () => {
                say('Eliel', `2×${h} + 2×${w} = ${2*h} + ${2*w} = ${perim}. Correct!`);
                addButton(t('btn_continue'), onDone);
              }, t('hint_count_green'));
            });
            addMagicLengthSupply(cellSize, 2 * cols + 2, 2 * rows + 2);
          }, `${2*h} + ${2*w} = ?`);
        }, t('hint_find_in_table', {a:2, b:w}));
      }, t('hint_find_in_table', {a:2, b:h}));
    }
  });
}

// ============================================================
// PROGRESSIVE GROUPING DISPLAY
// ============================================================
// Shows fields with values, allows grouping identical ones with a green bracket
// groups: [{fields: [{rows,cols}], value, count, label}]
// ungrouped: [{rows,cols, value}]
// Returns the container div for updating

// Group border colors — assigned by nesting depth (outermost = highest level = last color)
// Level 0 (innermost, first created) = green, then blue, orange, purple, pink for outer layers
const groupColors = ['#5a8f3d', '#2a6fb0', '#b05a2a', '#8a2ab0', '#b02a6f'];
const groupBgs = ['#f0f8ed', '#edf3fa', '#faf0ed', '#f3edfa', '#faedF3'];

function getMaxGroupDepth(items, level) {
  let max = level || 0;
  (items || []).forEach(item => {
    if (item.type === 'group') {
      const childMax = item.items ? getMaxGroupDepth(item.items, (level||0) + 1) : (level||0);
      if (childMax > max) max = childMax;
    }
  });
  return max;
}

function buildGroupedFieldsDisplay(items, valueLabel, nestLevel, maxDepth) {
  // Recursive: items can be:
  //   {type:'group', items:[...], total, label} — nested group (can contain groups or singles)
  //   {type:'group', fields:[{rows,cols,side}], total, label} — flat group (legacy, fields only)
  //   {type:'single', rows, cols, side, value} — individual field
  const level = nestLevel || 0;
  // Compute max depth on first call so innermost groups get color 0 (green)
  if (maxDepth === undefined) maxDepth = getMaxGroupDepth(items, 0);
  const container = document.createElement('div');
  const isTopLevel = (level === 0);
  container.style.cssText = 'display:flex; flex-wrap:nowrap; gap:' + (isTopLevel ? '12px' : '6px') + '; justify-content:center; align-items:flex-end; margin-bottom:' + (isTopLevel ? '12px' : '2px') + ';';

  items.forEach(item => {
    if (item.type === 'group') {
      // Use explicit colorIdx if provided, otherwise fall back to depth-based
      const ci = (item.ci !== undefined) ? item.ci : (maxDepth - level);
      const color = groupColors[ci % groupColors.length];
      const bg = groupBgs[ci % groupBgs.length];
      const groupWrapper = document.createElement('div');
      groupWrapper.style.cssText = `display:flex; flex-direction:column; align-items:center; gap:4px; border:3px solid ${color}; border-radius:8px; padding:5px; background:${bg};`;

      if (item.items) {
        // Nested group — recurse
        const inner = buildGroupedFieldsDisplay(item.items, valueLabel, level + 1, maxDepth);
        if (item.vertical) inner.style.flexDirection = 'column';
        inner.style.marginBottom = '2px';
        groupWrapper.appendChild(inner);
      } else if (item.fields) {
        // Flat group (legacy) — render fields directly
        const fieldsInGroup = document.createElement('div');
        fieldsInGroup.style.cssText = 'display:flex; gap:4px; align-items:flex-end; flex-wrap:wrap;';
        item.fields.forEach(fd => {
          const wrapper = document.createElement('div');
          wrapper.style.cssText = 'display:flex; flex-direction:column; align-items:center; gap:2px;';
          const r = fd.rows || fd.side || 2;
          const c = fd.cols || fd.side || 2;
          const maxDim = Math.max(r, c);
          const cs = Math.min(14, 70 / maxDim);
          const f = showFilledField(r, c, cs);
          f.style.margin = '0';
          wrapper.appendChild(f);
          if (fd.value !== undefined) {
            const vl = document.createElement('div');
            vl.style.cssText = 'font-size:10px; color:#888; text-align:center; max-width:60px; word-wrap:break-word;';
            vl.textContent = `${fd.value} ${valueLabel}`;
            wrapper.appendChild(vl);
          }
          fieldsInGroup.appendChild(wrapper);
        });
        groupWrapper.appendChild(fieldsInGroup);
      }

      const label = document.createElement('div');
      label.style.cssText = `font-size:12px; font-weight:bold; color:${color}; text-align:center;`;
      label.textContent = `${item.total} ${valueLabel}`;
      groupWrapper.appendChild(label);
      container.appendChild(groupWrapper);
    } else if (item.type === 'wire-field') {
      // Field with green perimeter segments (for wire totals)
      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'display:flex; flex-direction:column; align-items:center; gap:2px;';
      const wr = item.rows || item.side || 2;
      const wc = item.cols || item.side || 2;
      const maxD = Math.max(wr, wc);
      const cs = Math.min(14, 70 / maxD);
      if (item.aboveValue !== undefined) {
        const aboveLabel = document.createElement('div');
        aboveLabel.style.cssText = 'font-size:11px; font-weight:bold; color:#5a8f3d; text-align:center; max-width:60px; word-wrap:break-word;';
        aboveLabel.textContent = `${item.aboveValue} ${valueLabel}`;
        wrapper.appendChild(aboveLabel);
      }
      const f = showFilledFieldWithPerimeter(wr, wc, cs, item.omit || [], item.segColors);
      f.style.margin = '0';
      wrapper.appendChild(f);
      const label = document.createElement('div');
      label.style.cssText = 'font-size:11px; font-weight:bold; color:#5a8f3d; text-align:center; max-width:60px; word-wrap:break-word;';
      label.textContent = `${item.value} ${valueLabel}`;
      wrapper.appendChild(label);
      container.appendChild(wrapper);
    } else if (item.type === 'detached-wire') {
      // Standalone green segments (detached from a field)
      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'display:flex; flex-direction:column; align-items:center; gap:2px;';
      const cs = Math.min(14, 70 / (item.segSide || 6));
      wrapper.appendChild(showDetachedSegments(item.count, cs, item.horiz));
      const label = document.createElement('div');
      label.style.cssText = 'font-size:11px; font-weight:bold; color:#5a8f3d; text-align:center; max-width:60px; word-wrap:break-word;';
      label.textContent = `${item.value} ${valueLabel}`;
      wrapper.appendChild(label);
      container.appendChild(wrapper);
    } else {
      // Single field with original value
      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'display:flex; flex-direction:column; align-items:center; gap:2px;';
      const r = item.rows || item.side || 2;
      const c = item.cols || item.side || 2;
      const maxDim = Math.max(r, c);
      const cs = Math.min(14, 70 / maxDim);
      const f = showFilledField(r, c, cs);
      f.style.margin = '0';
      wrapper.appendChild(f);
      const label = document.createElement('div');
      label.style.cssText = 'font-size:11px; font-weight:bold; color:#5a8f3d; text-align:center; max-width:60px; word-wrap:break-word;';
      label.textContent = `${item.value} ${valueLabel}`;
      wrapper.appendChild(label);
      container.appendChild(wrapper);
    }
  });

  return container;
}

// ============================================================
// BOOT — chapters call startGame(steps) as their last statement
// ============================================================

function nextStep() {
  currentStep++;
  if (currentStep < STEPS.length) {
    STEPS[currentStep]();
  }
}

function startGame(stepList) {
  STEPS = stepList;

  // Static chrome that lives in the HTML (not built by a step function)
  document.title = t('page_title');
  celebBtn.textContent = t('btn_continue_plain');

  // DEBUG: jump-to-step menu (append ?debug to the URL to enable; off for kids)
  if (DEBUG) {
    const debugBar = document.createElement('div');
    debugBar.style.cssText = 'position:fixed; top:0; left:0; right:0; background:#333; color:#fff; padding:4px 8px; font-size:12px; font-family:monospace; z-index:1000; display:flex; align-items:center; gap:8px; flex-wrap:wrap;';

    const label = document.createElement('span');
    label.textContent = 'Jump to step:';
    debugBar.appendChild(label);

    const select = document.createElement('select');
    select.style.cssText = 'font-size:12px; font-family:monospace; max-width:300px; padding:2px;';
    STEPS.forEach((fn, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      // Extract function name
      const name = fn.name || `step ${i}`;
      opt.textContent = `${i}: ${name}`;
      select.appendChild(opt);
    });
    debugBar.appendChild(select);

    const goBtn = document.createElement('button');
    goBtn.textContent = 'Go';
    goBtn.style.cssText = 'font-size:12px; padding:2px 8px; cursor:pointer;';
    goBtn.addEventListener('click', () => {
      currentStep = parseInt(select.value);
      STEPS[currentStep]();
    });
    debugBar.appendChild(goBtn);

    const stepInfo = document.createElement('span');
    stepInfo.id = 'debug-step-info';
    stepInfo.textContent = `(${STEPS.length} steps total)`;
    debugBar.appendChild(stepInfo);

    document.body.appendChild(debugBar);
    document.getElementById('game-container').style.marginTop = '32px';
  }

  // ?step=N jumps straight to a step on load. Dev affordance — it makes any single
  // step screenshottable and testable in isolation, which ?debug can't do (its menu
  // needs a click). Anything absent or out of range falls back to 0, so a kid who
  // somehow gets a mangled URL still starts at the beginning.
  const startAt = parseInt(new URLSearchParams(location.search).get('step'), 10);
  currentStep = (isFinite(startAt) && startAt >= 0 && startAt < STEPS.length) ? startAt : 0;
  STEPS[currentStep]();
}
