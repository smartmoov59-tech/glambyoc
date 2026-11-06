/* ==========================================================
   GLAMBYOC — comportements & animations
   GSAP + ScrollTrigger + Lenis (hébergés dans /js/vendor)
   ========================================================== */
(() => {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;

  const FRESHA = 'https://www.fresha.com/book-now/glambyoc-wxa9vv0m/all-offer?share=true&pId=2553105';
  const TEL = '+33658847561';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduced) root.classList.add('reduced');

  /* ---------------------------------------------------------
     DONNÉES — carte (source : fiche Fresha de Glambyoc)
     chaque ligne : [nom, durée, prix, drapeau] ; 'from' = « dès »
     --------------------------------------------------------- */
  const MENU = [
    { id: 'poses', label: 'Poses complètes', desc: "Rallongement de l'ongle avec demi-capsule et gel, de la taille XS à XL.", groups: [
      { t: 'Taille XS', o: [['Pose complète XS', '1 h 45', 40], ['Pose complète XS + French', '1 h 45', 45]] },
      { t: 'Taille S',  o: [['Pose complète S', '1 h 45', 45], ['Pose complète S + French', '1 h 45', 50], ['Pose complète S + semi', '1 h 45', 50]] },
      { t: 'Taille M',  o: [['Pose complète M', '1 h 45', 50], ['Pose complète M + French', '2 h', 55], ['Pose complète M + semi', '1 h 55', 45]] },
      { t: 'Taille L',  o: [['Pose complète L', '3 h', 55], ['Pose complète L + French', '3 h', 60], ['Pose complète L + semi', '2 h 30', 55]] },
      { t: 'Taille XL', o: [['Pose complète XL', '3 h', 60]] }
    ]},
    { id: 'remplissages', label: 'Remplissages', desc: "Uniquement sur une pose réalisée par Océane. Le remplissage reprend ta pose précédente dans la même taille.", groups: [
      { t: 'Taille S', o: [['Remplissage S', '1 h 45', 40], ['Remplissage S + French', '2 h', 50]] },
      { t: 'Taille M', o: [['Remplissage M', '1 h 55', 50], ['Remplissage M + French', '2 h 15', 55]] },
      { t: 'Taille L', o: [['Remplissage L', '3 h', 50], ['Remplissage L + French', '3 h', 60]] }
    ]},
    { id: 'gainage', label: 'Gainage', desc: "Du gel pour renforcer ton ongle naturel, sans le rallonger. Avec French ou nail art en option.", groups: [
      { t: 'Gainage XS-S', o: [['Gainage XS-S', '1 h 35', 45], ['Gainage XS-S + French', '2 h 45', 50], ['Gainage XS-S + nail art 1', '2 h 45', 55], ['Gainage XS-S + nail art 2', '2 h 45', 60], ['Gainage XS-S + nail art 3', '3 h', 65]] },
      { t: 'Gainage M', o: [['Gainage M', '1 h 45', 45], ['Gainage M + French', '1 h 50', 55], ['Gainage M + nail art 1', '2 h 45', 60], ['Gainage M + nail art 2', '3 h', 65], ['Gainage M + nail art 3', '3 h', 70]] },
      { t: 'Gainage L', o: [['Gainage L', '2 h', 50], ['Gainage L + French', '2 h 45', 60], ['Gainage L + nail art 1', '2 h 45', 65], ['Gainage L + nail art 2', '2 h 45', 70], ['Gainage L + nail art 3', '4 h', 75]] }
    ]},
    { id: 'semi', label: 'Semi renforcé', desc: "Semi-permanent + gel. Attention : à réserver sur ongles naturels.", groups: [
      { t: '', o: [['Semi renforcé (semi-permanent + gel)', '1 h 45', 45]] }
    ]},
    { id: 'nailart', label: 'Nail art', desc: "À ajouter à ta pose. Du design fin au 3D avec strass en illimité.", groups: [
      { t: '', o: [['Nail art niveau 1 🪩', '1 h', 10], ['Nail art niveau 2 🎀', '1 h 15', 15], ['Nail art niveau 3', '1 h 30', 20]] }
    ]},
    { id: 'soins', label: 'Mains & pieds', desc: "Manucure, pédicure et packs complets.", groups: [
      { t: 'Manucure', o: [['Manucure japonaise 🇯🇵', '1 h 30', 25]] },
      { t: 'Pédicure', o: [['Pédicure : pose semi ou gel', '1 h', 30], ['Pédicure : pose gel + French', '1 h', 35], ['Pédicure : dépose', '35 min', 10]] },
      { t: 'Packs mains & pieds', note: 'Durée : 2 h 45', o: [['Semi renforcé ou gel mains (XS-S) + pieds', '2 h 45', 75], ['Pack mains (XS-S) + pieds French', '2 h 45', 80], ['Semi ou gel mains (M) + pieds', '2 h 45', 80], ['Pack mains (M) + pieds + French', '2 h 45', 85]] }
    ]},
    { id: 'depose', label: 'Dépose', desc: "Pour repartir sur de bonnes bases, en douceur.", groups: [
      { t: '', o: [['Dépose semi-permanent', '20 min', 5], ['Ongle cassé', '1 h', 0, 'free'], ['Dépose extérieur (pose d\'une autre prothésiste)', '45 min', 25, 'from'], ['Dépose', '1 h', 20]] }
    ]}
  ];

  const REVIEWS = [
    { n: 'Clélia G.', s: 'Remplissage M', src: 'Fresha', t: "Océane est tellement douée et appliquée ! Elle est douce et à l'écoute, ça fait 6 mois qu'elle me fait les ongles mes ongles tiennent jusqu'à 6sem sans aucun problème." },
    { n: 'Justine D.', s: 'Avis Google', src: 'Google', t: "Océane est une personne très professionnelle. Elle a beaucoup de talent et elle est très minutieuse. Je la recommande à 100%. Mes ongles sont vraiment incroyables." },
    { n: 'Bruna F.', s: 'Remplissage M', src: 'Fresha', t: "Toujours au top, c'est la meilleure pas de débat la dessus je lui demande a chaque fois des poses de plus en plus loufoques et elle accepte je l'adore ❤️" },
    { n: 'Ornella D.', s: '2 prestations', src: 'Fresha', t: "Océane est incroyable ! La meilleure prothésiste ongulaire que j'ai pu connaître jusqu'à present. Son travail est magnifique et Océane est une personne humaine et très professionnelle." },
    { n: 'Laetitia B.', s: 'Gainage XS-S', src: 'Fresha', t: "Parfait, prothesiste douce, accueillante et chaleureuse. Je recommande a 100%" },
    { n: 'Coraline T.', s: 'Pédicure gel + French', src: 'Fresha', t: "Très méticuleuse et douce. Océane fait un travail très sérieux et prend réellement soin de la personne" },
    { n: 'Leya B.', s: 'Pose complète S', src: 'Fresha', t: "Une super découverte ! elle est très douce et attentive. Les poses sont magnifiques, et tiennent super bien ! Je recommande à 100% !" },
    { n: 'Fanny D.', s: 'Remplissage S', src: 'Fresha', t: "Je vais chez Océane depuis maintenant 6 mois et jamais déçus ! Toujours un moment agréable, elle est très douée et passionné par son métier !" },
    { n: 'Jessie R.', s: 'Pose complète L', src: 'Fresha', t: "littéralement la meilleure po, la seule que je laisse toucher mes ongles et absolument aucun regret. on se revoit le mois prochain 🤭" },
    { n: 'Mathilde P.', s: 'Avis Google', src: 'Google', t: "Ça fait déjà ma deuxième pose avec Océane, qui est vraiment très douce et minutieuse dans son travail. Elle a vraiment respecté chacune de mes demandes, et le résultat tient dans le temps." },
    { n: 'Aurélia F.', s: 'Pose complète M', src: 'Fresha', t: "Une personne magnifique un travail de qualité je recommande à 1000% enfin une vrai pro dans ce domaine très belle rencontre" },
    { n: 'Joy L.', s: '2 prestations', src: 'Fresha', t: "Je recommande les yeux fermés très appliquée dans son travail douce un vrai moment de détente. 🥰" }
  ];

  const priceLabel = (p, flag) => flag === 'free' ? 'Offert' : (flag === 'from' ? `dès ${p} €` : `${p} €`);
  const flat = c => c.groups.flatMap(g => g.o.map(([name, dur, price, flag]) => ({ name, dur, price, flag, label: priceLabel(price, flag) })));
  const esc = s => String(s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));

  let lenis = null;
  let menuOpen = false;

  /* ---------------------------------------------------------
     UTILITAIRES
     --------------------------------------------------------- */
  function split(el, mode = 'words') {
    if (el._parts) return el._parts;
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    const parts = [];
    const frag = document.createDocumentFragment();
    text.split(/\s+/).forEach((w, wi, arr) => {
      const word = document.createElement('span');
      word.className = 'w';
      word.setAttribute('aria-hidden', 'true');
      const chunks = mode === 'chars' ? [...w] : [w];
      chunks.forEach(ch => {
        const m = document.createElement('span'); m.className = 'c';
        const i = document.createElement('span'); i.className = 'ci'; i.textContent = ch;
        m.appendChild(i); word.appendChild(m); parts.push(i);
      });
      frag.appendChild(word);
      if (wi < arr.length - 1) frag.appendChild(document.createTextNode(' '));
    });
    el.textContent = '';
    el.appendChild(frag);
    el._parts = parts;
    return parts;
  }

  function scrollToEl(target, offset = 0) {
    if (lenis) lenis.scrollTo(target, { offset, duration: 1.7, easing: t => 1 - Math.pow(1 - t, 4) });
    else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }

  /* ---------------------------------------------------------
     RENDUS (carte, avis, réservation, horaires, FAQ, galerie)
     --------------------------------------------------------- */
  function renderCarte() {
    const tabs = $('#tabs'), panel = $('#carte-panel');
    tabs.innerHTML = MENU.map((c, i) => `<button class="tab" role="tab" id="tab-${c.id}" aria-selected="${i === 0}" aria-controls="carte-panel" tabindex="${i === 0 ? 0 : -1}" data-id="${c.id}">${esc(c.label)}</button>`).join('');
    const show = (id, animate = true) => {
      const c = MENU.find(x => x.id === id);
      let k = 0;
      panel.setAttribute('aria-labelledby', 'tab-' + id);
      panel.innerHTML = `<p class="sub-d">${esc(c.desc)}</p>` + c.groups.map(g => {
        const head = (g.t ? `<h3 class="sub-t">${esc(g.t)}</h3>` : '') + (g.note ? `<p class="sub-d">${esc(g.note)}</p>` : '');
        const rows = g.o.map(([name, dur, price, flag]) => {
          const idx = k++;
          return `<div class="row"><span class="row__n">${esc(name)}</span><span class="row__d">${esc(dur)}</span><span class="row__p">${priceLabel(price, flag)}</span><button type="button" class="row__go" data-cat="${c.id}" data-idx="${idx}" aria-label="Choisir : ${esc(name)}"><svg aria-hidden="true"><use href="#i-arrow"/></svg></button></div>`;
        }).join('');
        return head + rows;
      }).join('');
      if (animate && !reduced && window.gsap) gsap.fromTo(panel.children, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .7, ease: 'expo.out', stagger: .035, clearProps: 'all' });
    };
    show(MENU[0].id, false);
    const select = btn => {
      $$('.tab', tabs).forEach(b => { const on = b === btn; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
      show(btn.dataset.id);
    };
    tabs.addEventListener('click', e => { const b = e.target.closest('.tab'); if (b) select(b); });
    tabs.addEventListener('keydown', e => {
      const list = $$('.tab', tabs); const i = list.indexOf(document.activeElement);
      if (i < 0) return;
      let n = -1;
      if (e.key === 'ArrowRight') n = (i + 1) % list.length;
      if (e.key === 'ArrowLeft') n = (i - 1 + list.length) % list.length;
      if (e.key === 'Home') n = 0;
      if (e.key === 'End') n = list.length - 1;
      if (n >= 0) { e.preventDefault(); list[n].focus(); select(list[n]); }
    });
  }

  function renderReviews() {
    const rail = $('#rail');
    rail.innerHTML = REVIEWS.map(r => `<article class="rev"><div class="rev__q" aria-hidden="true">“</div><p class="rev__t">${esc(r.t)}</p><div class="rev__s" role="img" aria-label="5 étoiles sur 5">★★★★★</div><div class="rev__f"><div><b>${esc(r.n)}</b><br><span>${esc(r.s)}</span></div><span class="rev__src">${r.src}</span></div></article>`).join('');
    const bar = $('#rBar');
    const upd = () => { const max = rail.scrollWidth; bar.style.transform = `scaleX(${Math.min(1, (rail.scrollLeft + rail.clientWidth) / max)})`; };
    rail.addEventListener('scroll', upd, { passive: true });
    upd(); addEventListener('resize', upd);
    const step = () => Math.min(rail.clientWidth * .85, 460);
    $('#rPrev').addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: reduced ? 'auto' : 'smooth' }));
    $('#rNext').addEventListener('click', () => rail.scrollBy({ left: step(), behavior: reduced ? 'auto' : 'smooth' }));
    // glisser à la souris
    let down = false, sx = 0, sl = 0, moved = 0;
    rail.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = 0; sx = e.clientX; sl = rail.scrollLeft; });
    addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx)); if (moved > 5) { rail.classList.add('is-drag'); rail.scrollLeft = sl - dx; } });
    addEventListener('pointerup', () => { down = false; rail.classList.remove('is-drag'); });
  }

  /* Menu déroulant sur mesure : le <select> natif reste la source de vérité (caché),
     l'interface est un listbox ARIA stylé, utilisable au clavier. */
  function enhanceSelect(sel) {
    const wrap = document.createElement('div'); wrap.className = 'dd';
    sel.before(wrap); wrap.appendChild(sel);
    sel.classList.add('dd__native'); sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true');
    const label = document.querySelector(`label[for="${sel.id}"]`);
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'dd__btn'; btn.id = sel.id + 'Btn';
    btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false');
    if (label) label.htmlFor = btn.id;
    btn.innerHTML = '<span class="dd__txt"></span><span class="dd__meta" hidden></span><span class="dd__chev" aria-hidden="true"><svg><use href="#i-chev"/></svg></span>';
    const list = document.createElement('ul');
    list.className = 'dd__list'; list.setAttribute('role', 'listbox'); list.tabIndex = -1;
    list.id = sel.id + 'List'; list.setAttribute('data-lenis-prevent', '');
    if (label) list.setAttribute('aria-label', label.textContent);
    btn.setAttribute('aria-controls', list.id);
    wrap.append(btn, list);
    let active = 0, typed = '', typedT = 0;
    const items = () => [...list.children];
    const parts = o => o.textContent.split(' · ');

    function sync() {
      const i = sel.selectedIndex;
      items().forEach((li, k) => li.setAttribute('aria-selected', k === i));
      const o = sel.options[i]; if (!o) return;
      const [n, d, p] = parts(o);
      $('.dd__txt', btn).textContent = n;
      const meta = $('.dd__meta', btn);
      meta.hidden = !p; meta.textContent = p || '';
    }
    function build() {
      list.innerHTML = '';
      [...sel.options].forEach((o, i) => {
        const [n, d, p] = parts(o);
        const li = document.createElement('li');
        li.className = 'dd__opt'; li.setAttribute('role', 'option'); li.id = `${sel.id}-o${i}`;
        li.dataset.i = i; li.style.setProperty('--i', Math.min(i, 12));
        li.innerHTML = `<span class="o-n">${esc(n)}${d ? `<small>${esc(d)}</small>` : ''}</span>${p ? `<span class="o-p">${esc(p)}</span>` : ''}`;
        list.appendChild(li);
      });
      sync();
    }
    function highlight(i, scroll) {
      const els = items(); if (!els.length) return;
      active = Math.max(0, Math.min(els.length - 1, i));
      els.forEach((li, k) => li.classList.toggle('is-active', k === active));
      const li = els[active]; list.setAttribute('aria-activedescendant', li.id);
      if (scroll) {
        const top = li.offsetTop, bot = top + li.offsetHeight;
        if (top < list.scrollTop) list.scrollTop = top - 8;
        else if (bot > list.scrollTop + list.clientHeight) list.scrollTop = bot - list.clientHeight + 8;
      }
    }
    const isOpen = () => wrap.classList.contains('is-open');
    function setOpen(v) {
      if (v === isOpen()) return;
      if (v) {
        const r = btn.getBoundingClientRect();
        const space = innerHeight - r.bottom;
        wrap.classList.toggle('dd--up', space < 330 && r.top > space);
        wrap.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true');
        highlight(sel.selectedIndex, true);
        list.focus({ preventScroll: true });
      } else {
        wrap.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false');
        list.removeAttribute('aria-activedescendant');
      }
    }
    function choose(i) {
      sel.selectedIndex = i; sync();
      sel.dispatchEvent(new Event('change', { bubbles: true }));
      setOpen(false); btn.focus({ preventScroll: true });
    }
    btn.addEventListener('click', () => setOpen(!isOpen()));
    btn.addEventListener('keydown', e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setOpen(true); } });
    list.addEventListener('keydown', e => {
      const k = e.key;
      if (k === 'ArrowDown') { e.preventDefault(); highlight(active + 1, true); }
      else if (k === 'ArrowUp') { e.preventDefault(); highlight(active - 1, true); }
      else if (k === 'Home') { e.preventDefault(); highlight(0, true); }
      else if (k === 'End') { e.preventDefault(); highlight(items().length - 1, true); }
      else if (k === 'Enter' || k === ' ') { e.preventDefault(); choose(active); }
      else if (k === 'Escape') { e.preventDefault(); setOpen(false); btn.focus({ preventScroll: true }); }
      else if (k === 'Tab') setOpen(false);
      else if (k.length === 1) { // saisie rapide : première lettre
        clearTimeout(typedT); typed += k.toLowerCase(); typedT = setTimeout(() => typed = '', 600);
        const idx = [...sel.options].findIndex(o => o.textContent.toLowerCase().startsWith(typed));
        if (idx >= 0) highlight(idx, true);
      }
    });
    list.addEventListener('click', e => { const li = e.target.closest('.dd__opt'); if (li) choose(+li.dataset.i); });
    list.addEventListener('pointermove', e => { const li = e.target.closest('.dd__opt'); if (li && +li.dataset.i !== active) highlight(+li.dataset.i); });
    document.addEventListener('pointerdown', e => { if (!wrap.contains(e.target)) setOpen(false); });
    build();
    return { refresh: build };
  }

  function initPlanner() {
    const cat = $('#pCat'), svc = $('#pSvc'), days = $('#pDays'), times = $('#pHours'),
          name = $('#pName'), sum = $('#pSum'), price = $('#pPrice'), sms = $('#pSms');
    cat.innerHTML = MENU.map(c => `<option value="${c.id}">${esc(c.label)}</option>`).join('');

    const fill = (keepIdx = 0) => {
      const c = MENU.find(x => x.id === cat.value);
      svc.innerHTML = flat(c).map((o, i) => `<option value="${i}">${esc(o.name)} · ${esc(o.dur)} · ${o.label}</option>`).join('');
      svc.value = String(keepIdx);
      if (svcDD) svcDD.refresh();
      update();
    };
    let catDD = null, svcDD = null;

    // jours : 14 prochains jours d'ouverture (lundi → samedi)
    const now = new Date();
    const start = new Date(now); if (now.getHours() >= 16) start.setDate(start.getDate() + 1);
    const wd = new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }), mo = new Intl.DateTimeFormat('fr-FR', { month: 'short' });
    const dayList = [];
    for (let i = 0; dayList.length < 12 && i < 30; i++) { const d = new Date(start); d.setDate(start.getDate() + i); if (d.getDay() !== 0) dayList.push(d); }
    days.innerHTML = dayList.map((d, i) => `<label class="opt"><input type="radio" name="day" value="${i}"><span><small>${wd.format(d).replace('.', '')}</small><b>${d.getDate()}</b><small>${mo.format(d).replace('.', '')}</small></span></label>`).join('');
    times.innerHTML = [10, 11, 12, 13, 14, 15, 16, 17].map(h => `<label class="opt"><input type="radio" name="time" value="${h}"><span>${h} h</span></label>`).join('');

    function update() {
      const c = MENU.find(x => x.id === cat.value);
      const o = flat(c)[+svc.value || 0];
      const dIdx = (document.querySelector('input[name=day]:checked') || {}).value;
      const hVal = (document.querySelector('input[name=time]:checked') || {}).value;
      const dFull = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
      const when = dIdx !== undefined ? dFull.format(dayList[+dIdx]) + (hVal ? ` vers ${hVal} h` : '') : '';
      sum.textContent = `${o.name} · ${o.dur}${when ? ' · ' + when : ' · choisis un jour et un horaire'}`;
      price.textContent = o.label;
      const who = name.value.trim();
      const body = `Bonjour Océane, ${who ? "c'est " + who + '. ' : ''}Je souhaiterais réserver : ${o.name} (${o.dur}, ${o.label}). ` + (when ? `Créneau souhaité : ${when}. ` : 'Quelles sont vos prochaines disponibilités ? ') + 'Merci !';
      sms.href = `sms:${TEL}?&body=${encodeURIComponent(body)}`;
    }
    cat.addEventListener('change', () => fill(0));
    svc.addEventListener('change', update);
    name.addEventListener('input', update);
    $('#planner').addEventListener('change', update);
    $('#planner').addEventListener('submit', e => e.preventDefault());
    fill(0);
    catDD = enhanceSelect(cat); svcDD = enhanceSelect(svc);

    // pré-sélection depuis les cartes / la carte complète
    const pick = (id, idx = 0) => { cat.value = id; catDD.refresh(); fill(idx); scrollToEl($('#reserver')); };
    document.addEventListener('click', e => {
      const p = e.target.closest('[data-pick]'); if (p) { pick(p.dataset.pick, 0); return; }
      const r = e.target.closest('.row__go'); if (r) pick(r.dataset.cat, +r.dataset.idx);
    });
  }

  // heure de Paris, indépendamment du fuseau du visiteur
  function parisNow() {
    const f = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', weekday: 'long', hour: 'numeric', minute: 'numeric', hour12: false });
    const p = Object.fromEntries(f.formatToParts(new Date()).map(x => [x.type, x.value]));
    const map = { dimanche: 0, lundi: 1, mardi: 2, mercredi: 3, jeudi: 4, vendredi: 5, samedi: 6 };
    return { d: map[p.weekday.toLowerCase()], h: (+p.hour) % 24, m: +p.minute };
  }
  function initHours() {
    const { d, h } = parisNow();
    const row = $(`#hoursTable tr[data-d="${d}"]`); if (row) row.classList.add('is-today');
    const st = $('#status');
    const openDay = d >= 1 && d <= 6;
    if (openDay && h >= 10 && h < 19) { st.textContent = "Ouvert maintenant · jusqu'à 19 h"; st.classList.add('is-open'); }
    else if (openDay && h < 10) st.textContent = "Fermé · ouvre aujourd'hui à 10 h";
    else if (d === 6) st.textContent = 'Fermé · ouvre lundi à 10 h';
    else st.textContent = 'Fermé · ouvre demain à 10 h';
  }

  function initFaq() {
    $$('#faq .qa').forEach(q => {
      const b = $('button', q);
      b.addEventListener('click', () => { const open = q.classList.toggle('is-open'); b.setAttribute('aria-expanded', open); });
    });
  }

  function initLightbox() {
    const lb = $('#lb'), img = $('#lbImg'), cap = $('#lbCap');
    const items = $$('#grid .g'); let i = 0;
    const show = n => { i = (n + items.length) % items.length; const it = items[i]; img.src = it.dataset.full; img.alt = $('img', it).alt; cap.textContent = it.dataset.cap || ''; };
    items.forEach((it, n) => it.addEventListener('click', () => { show(n); lb.showModal(); if (lenis) lenis.stop(); }));
    $('.lb__x', lb).addEventListener('click', () => lb.close());
    $('.lb__prev', lb).addEventListener('click', () => show(i - 1));
    $('.lb__next', lb).addEventListener('click', () => show(i + 1));
    lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
    lb.addEventListener('close', () => { if (lenis && !menuOpen) lenis.start(); });
    lb.addEventListener('keydown', e => { if (e.key === 'ArrowRight') show(i + 1); if (e.key === 'ArrowLeft') show(i - 1); });
  }

  /* ---------------------------------------------------------
     MENU MOBILE
     --------------------------------------------------------- */
  const burger = $('#burger'), menu = $('#menu');
  const CLIP0 = 'circle(0% at calc(100% - 50px) 50px)', CLIP1 = 'circle(150% at calc(100% - 50px) 50px)';
  function openMenu() {
    menuOpen = true; menu.hidden = false;
    burger.setAttribute('aria-expanded', 'true'); burger.setAttribute('aria-label', 'Fermer le menu');
    if (lenis) lenis.stop(); document.body.style.overflow = 'hidden';
    if (reduced || !window.gsap) { menu.style.clipPath = 'none'; return; }
    gsap.fromTo(menu, { clipPath: CLIP0 }, { clipPath: CLIP1, duration: .9, ease: 'expo.inOut' });
    gsap.fromTo('.menu a span', { yPercent: 110 }, { yPercent: 0, duration: .9, ease: 'expo.out', stagger: .06, delay: .25 });
    gsap.fromTo('.menu__foot a', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .7, delay: .6, stagger: .08, ease: 'power3.out' });
    $('a', menu).focus({ preventScroll: true });
  }
  function closeMenu(instant) {
    if (!menuOpen) return;
    menuOpen = false;
    burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Ouvrir le menu');
    const done = () => { menu.hidden = true; document.body.style.overflow = ''; if (lenis) lenis.start(); };
    if (reduced || instant || !window.gsap) { done(); return; }
    gsap.to(menu, { clipPath: CLIP0, duration: .7, ease: 'expo.inOut', onComplete: done });
  }
  burger.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
  addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  // liens d'ancre
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const id = a.getAttribute('href'); if (id.length < 2) { if (id === '#') e.preventDefault(); return; }
    const t = document.querySelector(id); if (!t) return;
    e.preventDefault();
    const go = () => { scrollToEl(t); history.replaceState(null, '', id); };
    if (menuOpen) { closeMenu(); setTimeout(go, 800); } else go();
  });

  /* ---------------------------------------------------------
     ANIMATIONS
     --------------------------------------------------------- */
  function initSmooth() {
    if (reduced || typeof Lenis === 'undefined') return;
    lenis = new Lenis({ lerp: .085, wheelMultiplier: .95, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  function magnetic(el) {
    const t = $('.btn__t', el) || el.firstElementChild;
    const o = { duration: .6, ease: 'power3' };
    const mx = gsap.quickTo(el, 'x', o), my = gsap.quickTo(el, 'y', o);
    const tx = t ? gsap.quickTo(t, 'x', o) : () => {}, ty = t ? gsap.quickTo(t, 'y', o) : () => {};
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      mx(dx * .25); my(dy * .35); tx(dx * .12); ty(dy * .18);
    });
    el.addEventListener('pointerleave', () => { mx(0); my(0); tx(0); ty(0); });
  }

  function tilt(el, max = 7) {
    gsap.set(el, { transformPerspective: 900 });
    const rx = gsap.quickTo(el, 'rotationX', { duration: .7, ease: 'power3' }), ry = gsap.quickTo(el, 'rotationY', { duration: .7, ease: 'power3' });
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      ry((px - .5) * max * 2); rx(-(py - .5) * max * 2);
      el.style.setProperty('--mx', (px * 100) + '%'); el.style.setProperty('--my', (py * 100) + '%');
    });
    el.addEventListener('pointerleave', () => { rx(0); ry(0); });
  }

  function initPointerFx() {
    if (!fine || reduced) return;
    $$('.magnetic').forEach(magnetic);
    $$('[data-tilt], .g').forEach(el => tilt(el, el.classList.contains('g') ? 5 : 7));
    const cur = $('.cursor');
    const cx = gsap.quickTo(cur, 'x', { duration: .4, ease: 'power3' }), cy = gsap.quickTo(cur, 'y', { duration: .4, ease: 'power3' });
    addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; cur.classList.add('is-on'); cx(e.clientX); cy(e.clientY); });
    document.addEventListener('pointerover', e => cur.classList.toggle('is-hover', !!e.target.closest('a,button,select,label,.g,[data-tilt]')));
    root.addEventListener('mouseleave', () => cur.classList.remove('is-on'));
  }

  function marquees() {
    if (reduced) return;
    let vel = 0, sdir = 1;
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: self => { vel = Math.abs(self.getVelocity()); sdir = self.direction || sdir; } });
    $$('.marquee').forEach(m => {
      const track = $('.marquee__track', m), group = $('.marquee__group', m);
      let w = 0, x = 0;
      const build = () => {
        $$('.marquee__group', track).slice(1).forEach(g => g.remove());
        w = group.getBoundingClientRect().width;
        const need = Math.ceil((m.getBoundingClientRect().width * 1.3) / Math.max(w, 1)) + 1;
        for (let i = 0; i < need; i++) track.appendChild(group.cloneNode(true));
      };
      build();
      (document.fonts ? document.fonts.ready : Promise.resolve()).then(build);
      addEventListener('resize', build);
      const base = (parseFloat(m.dataset.speed) || 1) * 70, dir0 = parseInt(m.dataset.dir, 10) || 1;
      const set = gsap.quickSetter(track, 'x', 'px');
      gsap.ticker.add((time, dt) => {
        const speed = base + Math.min(vel * .22, 900);
        x -= dir0 * sdir * speed * (dt / 1000);
        if (x <= -w) x += w; if (x > 0) x -= w;
        set(x);
      });
    });
  }

  function loader() {
    return new Promise(resolve => {
      const el = $('#loader');
      if (!el) return resolve();
      const finish = () => { el.remove(); document.body.classList.remove('is-loading'); if (lenis) lenis.start(); resolve(); };
      document.body.classList.add('is-loading');
      if (lenis) lenis.stop();
      if (reduced) { finish(); return; }
      const letters = $$('.loader__word span'), pct = $('#pct');
      gsap.from(letters, { yPercent: 130, rotate: 12, duration: 1, stagger: .06, ease: 'expo.out', delay: .1 });
      gsap.from('.loader__star', { scale: 0, rotate: -180, duration: 1.4, ease: 'back.out(1.7)' });
      gsap.to('.loader__star', { rotate: 360, duration: 6, ease: 'none', repeat: -1, delay: 1.4 });
      gsap.from('.loader__sub, .loader__pct', { opacity: 0, y: 16, duration: .8, delay: .5, ease: 'power3.out' });
      const o = { v: 0 };
      const counter = new Promise(r => gsap.to(o, { v: 100, duration: 1.7, ease: 'power2.inOut', onUpdate: () => { pct.textContent = Math.round(o.v); }, onComplete: r }));
      const loaded = new Promise(r => document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true }));
      const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
      const timeout = new Promise(r => setTimeout(r, 3600));
      Promise.race([Promise.all([loaded, fonts, counter]), timeout]).then(() => {
        pct.textContent = '100';
        const tl = gsap.timeline({ onComplete: finish });
        tl.to('.loader__inner', { opacity: 0, y: -40, scale: .92, duration: .55, ease: 'power3.in' })
          .to('.loader__panels i', { yPercent: -102, duration: 1.25, ease: 'expo.inOut', stagger: { each: .08, from: 'center' } }, '-=.1')
          .add(heroIntro, '-=.95');
      });
      setTimeout(() => { if (document.body.contains(el)) { finish(); heroIntro(); } }, 9000);
    });
  }

  let heroPlayed = false;
  function heroIntro() {
    if (heroPlayed) return; heroPlayed = true;
    const v = $('#heroVideo'); if (v) { v.playbackRate = .9; v.play().catch(() => {}); }
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.fromTo('.hero__video', { scale: 1.4 }, { scale: 1, duration: 2.6 }, 0)
      .fromTo('.hero__title .ci', { yPercent: 125, rotate: 9 }, { yPercent: 0, rotate: 0, duration: 1.5, stagger: .07 }, .05)
      .fromTo('.hero .eyebrow', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1 }, .5)
      .fromTo('.hero__lead', { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 1.1 }, .65)
      .fromTo('.hero__actions .btn', { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 1.1, stagger: .1 }, .8)
      .fromTo('.hero__float', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.6, stagger: .1, ease: 'elastic.out(1,.6)' }, .5)
      .fromTo('.badge', { scale: 0, rotate: -120 }, { scale: 1, rotate: 0, duration: 1.5, ease: 'back.out(1.6)' }, .9)
      .fromTo('.nav', { yPercent: -140 }, { yPercent: 0, duration: 1.1 }, 1);
  }

  function scrollAnimations() {
    const mm = gsap.matchMedia();
    mm.add({
      desk: '(min-width: 1001px) and (prefers-reduced-motion: no-preference)',
      mob: '(max-width: 1000px) and (prefers-reduced-motion: no-preference)',
      calm: '(prefers-reduced-motion: reduce)'
    }, ctx => {
      const { desk, calm } = ctx.conditions;
      const native = !desk;
      $('.services').classList.toggle('is-native', native);
      $('.story').classList.toggle('is-stacked', native);

      /* progression de lecture */
      if (!calm) gsap.to('.progress span', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .2 } });

      /* nav : se cache en descendant, réapparaît en remontant */
      const nav = $('#nav'); let hidden = false;
      ScrollTrigger.create({ start: 0, end: 'max', onUpdate: self => {
        if (menuOpen) return;
        const y = self.scroll();
        if (self.direction === 1 && y > 240 && !hidden) { hidden = true; gsap.to(nav, { yPercent: -140, duration: .6, ease: 'power3.inOut', overwrite: 'auto' }); }
        else if ((self.direction === -1 || y <= 240) && hidden) { hidden = false; gsap.to(nav, { yPercent: 0, duration: .6, ease: 'power3.out', overwrite: 'auto' }); }
      }});

      /* bouton flottant mobile */
      gsap.set('#fab', { y: 140 });
      ScrollTrigger.create({ trigger: '.hero', start: 'bottom 70%', onEnter: () => gsap.to('#fab', { y: 0, duration: .7, ease: 'expo.out' }), onLeaveBack: () => gsap.to('#fab', { y: 140, duration: .5, ease: 'power3.in' }) });

      /* mobile / mouvement réduit : l'histoire s'affiche à plat, chaque étape avec sa photo */
      const steps = $$('.story__step'), imgs = $$('.story__img'), dots = $$('.story__dots i');
      if (native) {
        steps.forEach((s, k) => {
          const fig = document.createElement('figure'); fig.className = 'story__inline';
          const im = $('img', imgs[k]).cloneNode(); im.loading = 'lazy'; fig.appendChild(im); s.prepend(fig);
          if (!calm) gsap.from(s, { opacity: 0, y: 50, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 85%', once: true } });
        });
      }
      const cleanup = () => $$('.story__inline').forEach(f => f.remove());

      if (calm) return cleanup;

      /* titres : mots qui montent derrière un masque */
      $$('[data-split]').forEach(el => {
        const parts = split(el, el.dataset.split);
        gsap.fromTo(parts, { yPercent: 118, rotate: 5 }, { yPercent: 0, rotate: 0, duration: 1.2, ease: 'expo.out', stagger: .07, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      });

      /* apparitions douces */
      $$('[data-reveal]').forEach(el => gsap.to(el, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));
      $$('[data-reveal-group]').forEach(g => gsap.from(g.children, { opacity: 0, y: 24, duration: .9, ease: 'expo.out', stagger: .08, scrollTrigger: { trigger: g, start: 'top 90%', once: true } }));

      /* HERO : parallax multicouche */
      const heroST = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('.hero__media', { yPercent: 14, ease: 'none', scrollTrigger: heroST });
      gsap.to('.hero__stars', { yPercent: -26, ease: 'none', scrollTrigger: heroST });
      gsap.to('.hero__content', { yPercent: -12, opacity: .1, ease: 'none', scrollTrigger: { ...heroST, end: 'bottom 25%' } });
      $$('.hero__card').forEach(c => gsap.to(c, { yPercent: -parseFloat(c.dataset.depth) * 40, ease: 'none', scrollTrigger: heroST }));
      if (fine && desk) {
        const hero = $('.hero');
        const fx = $$('.hero__float').map(f => { const i = f.firstElementChild, d = parseFloat(f.dataset.depth) || 1; return { d, x: gsap.quickTo(i, 'x', { duration: 1.4, ease: 'power3' }), y: gsap.quickTo(i, 'y', { duration: 1.4, ease: 'power3' }) }; });
        hero.addEventListener('pointermove', e => { const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5; fx.forEach(f => { f.x(nx * 70 * f.d); f.y(ny * 60 * f.d); }); });
      }

      /* STORY : section pinnée, 4 temps */
      let cur = 0, z = 1;
      if (desk) {
        const setStep = i => {
          if (i === cur) return; const prev = cur; cur = i;
          steps.forEach((s, k) => {
            if (k === i) { s.classList.add('is-active'); gsap.fromTo(s.children, { y: 44, opacity: 0 }, { y: 0, opacity: 1, duration: .95, ease: 'expo.out', stagger: .08, overwrite: true }); }
            else if (k === prev) gsap.to(s.children, { y: -34, opacity: 0, duration: .35, ease: 'power2.in', overwrite: true, onComplete: () => s.classList.remove('is-active') });
          });
          imgs.forEach((im, k) => {
            if (k === i) { im.style.zIndex = ++z; im.classList.add('is-active'); gsap.fromTo(im, { opacity: 0, scale: 1.18, rotate: 4 }, { opacity: 1, scale: 1, rotate: 0, duration: 1.2, ease: 'expo.out', overwrite: true }); }
            else if (k === prev) gsap.to(im, { opacity: 0, scale: .9, duration: .8, ease: 'power3.in', overwrite: true, onComplete: () => im.classList.remove('is-active') });
          });
          dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
        };
        gsap.set(imgs.slice(1), { opacity: 0 });
        ScrollTrigger.create({ trigger: '.story__pin', start: 'top top', end: '+=330%', pin: true, anticipatePin: 1, onUpdate: self => setStep(Math.min(3, Math.floor(self.progress * 4))) });
        gsap.to('.story__arch', { rotate: 5, ease: 'none', scrollTrigger: { trigger: '.story__pin', start: 'top top', end: '+=330%', scrub: true } });
      }

      /* SERVICES : défilement horizontal piloté par le scroll vertical */
      if (desk) {
        const track = $('#track');
        const dist = () => Math.max(0, track.scrollWidth - innerWidth + 20);
        const tween = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: {
          trigger: '.services__pin', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: .8, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: s => gsap.set('.services__bar span', { scaleX: s.progress })
        }});
        $$('.card').forEach(card => gsap.from(card, { rotate: 6, y: 70, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 100%', end: 'left 45%', scrub: true } }));
      } else {
        gsap.from('.card', { opacity: 0, x: 60, duration: 1, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.services__viewport', start: 'top 85%', once: true } });
      }

      /* CHIFFRES : compteurs */
      $$('[data-count]').forEach(el => {
        const end = parseFloat(el.dataset.count), dec = +(el.dataset.decimals || 0), o = { v: 0 };
        const fmt = n => n.toFixed(dec).replace('.', ',');
        el.textContent = fmt(0);
        ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => gsap.to(o, { v: end, duration: 2.4, ease: 'power3.out', onUpdate: () => { el.textContent = fmt(o.v); } }) });
      });
      gsap.to('.numbers__bg', { yPercent: -20, ease: 'none', scrollTrigger: { trigger: '.numbers', start: 'top bottom', end: 'bottom top', scrub: true } });

      /* GALERIE : révélations par masque, sens différent à chaque photo */
      const masks = ['inset(100% 0 0 0)', 'inset(0 100% 0 0)', 'inset(0 0 100% 0)', 'inset(0 0 0 100%)'];
      $$('.g').forEach((g, i) => {
        gsap.fromTo(g, { clipPath: masks[i % 4] }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.out', clearProps: 'clipPath', scrollTrigger: { trigger: g, start: 'top 92%', once: true } });
        gsap.from($('img', g), { scale: 1.5, duration: 2, ease: 'expo.out', scrollTrigger: { trigger: g, start: 'top 92%', once: true } });
      });

      /* À PROPOS : cercle qui s'agrandit + image parallax */
      const frame = $('[data-circle]');
      gsap.fromTo(frame, { clipPath: 'circle(0% at 50% 62%)' }, { clipPath: 'circle(78% at 50% 50%)', ease: 'power2.out', clearProps: 'clipPath', scrollTrigger: { trigger: frame, start: 'top 88%', end: 'top 30%', scrub: true } });
      $$('[data-parallax-img]').forEach(im => gsap.fromTo(im, { yPercent: -9, scale: 1.22 }, { yPercent: 9, scale: 1.22, ease: 'none', scrollTrigger: { trigger: im.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));
      gsap.from('.about__sticker', { scale: 0, rotate: -90, duration: 1.4, ease: 'back.out(1.8)', scrollTrigger: { trigger: '.about__visual', start: 'top 70%', once: true } });
      gsap.from('.about__mini', { y: 120, opacity: 0, rotate: -20, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.about__visual', start: 'top 60%', once: true } });

      /* AVIS : entrée des cartes */
      gsap.from('.rev', { x: 160, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: .08, clearProps: 'opacity', scrollTrigger: { trigger: '#rail', start: 'top 88%', once: true } });

      /* RÉSERVATION */
      gsap.from('.planner', { y: 80, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.planner', start: 'top 88%', once: true } });

      /* CTA */
      gsap.fromTo('.cta__title span', { xPercent: i => i ? 45 : -45, opacity: 0 }, { xPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top 80%', end: 'top 15%', scrub: true } });
      gsap.fromTo('.cta__bg', { yPercent: -10 }, { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.from('.cta__row .btn', { y: 50, opacity: 0, duration: 1.1, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.cta__row', start: 'top 92%', once: true } });

      /* CONTACT + FOOTER */
      gsap.from('.find__map', { y: 70, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.find__map', start: 'top 88%', once: true } });
      const big = split($('#footBig'), 'chars');
      gsap.fromTo(big, { yPercent: 105, rotate: 12 }, { yPercent: 0, rotate: 0, duration: 1.6, ease: 'expo.out', stagger: .08, scrollTrigger: { trigger: '.footer', start: 'top 85%', once: true } });
      return cleanup;
    });
  }

  /* ---------------------------------------------------------
     DÉMARRAGE
     --------------------------------------------------------- */
  function boot() {
    renderCarte(); renderReviews(); initPlanner(); initHours(); initFaq(); initLightbox();
    $$('.card img').forEach(i => { i.loading = 'eager'; });

    const v = $('#heroVideo');
    if (v && (reduced || (navigator.connection && navigator.connection.saveData))) { v.pause(); v.removeAttribute('autoplay'); }

    if (!window.gsap || !window.ScrollTrigger) { root.classList.add('js-failed'); const l = $('#loader'); if (l) l.remove(); document.body.classList.remove('is-loading'); return; }
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    initSmooth();
    split($('.hero__title'), 'chars');
    if (!reduced) { gsap.set('.hero__title .ci', { yPercent: 125 }); gsap.set('.hero__float, .badge', { opacity: 0 }); }
    scrollAnimations();
    marquees();
    initPointerFx();
    loader().then(() => { if (reduced) { heroPlayed = true; } ScrollTrigger.refresh(); });
    addEventListener('load', () => ScrollTrigger.refresh());
    if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  try { boot(); } catch (err) {
    console.error(err);
    root.classList.add('js-failed');
    const l = $('#loader'); if (l) l.remove();
    document.body.classList.remove('is-loading');
  }
})();
