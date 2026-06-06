/* ============================================================
   ARCHIVO BACKROOMS — LÓGICA COMPARTIDA v2.1 (API + LocalStorage)
   ============================================================ */
(function() {
  'use strict';

  // ===================== DATA =====================
  var SURVIVAL_LABELS = ['', 'Seguro', 'Bajo', 'Moderado', 'Alto', 'Extremo'];
  var SURVIVAL_COLORS = ['', '#30c460', '#88b830', '#c8a415', '#c87020', '#c43030'];

  var WIKI_LEVELS = [
    { id:'wiki-0', name:'Nivel 0 — El Aula de Transici\u00f3n', survival:1, entities:'\u2014', tags:['No lineal','Estable','H\u00famedo'], visual:'lv-visual-0', video_url:'https://www.youtube.com/watch?v=H_kQtmVqKvA' },
    { id:'wiki-1', name:'Nivel 1 — Zona de Habitaci\u00f3n', survival:2, entities:'Entity-12 "Hounds"', tags:['Lineal','Suministros','Templado'], visual:'lv-visual-1', video_url:null },
    { id:'wiki-2', name:'Nivel 2 — Tuber\u00edas de la Desolaci\u00f3n', survival:4, entities:'Entity-3 "Dullers", Entity-7 "Insanities"', tags:['Alta temp.','Estrecho','Ruidoso'], visual:'lv-visual-2', video_url:null },
    { id:'wiki-3', name:'Nivel 3 — Estaci\u00f3n El\u00e9ctrica', survival:4, entities:'Entity-11 "Electrics"', tags:['Electricidad','Oscuridad','Maquinaria'], visual:'lv-visual-3', video_url:null },
    { id:'wiki-4', name:'Nivel 4 — Oficina Abandonada', survival:2, entities:'Entity-2 "Facelings"', tags:['Tranquilo','Recursos','Est\u00e1tico'], visual:'lv-visual-4', video_url:null }
  ];

  var ENTITIES = [
    { id:'E-2', name:'Facelings', desc:'Humanoides de rostro liso y p\u00e1lido. Pasivos si no se les confronta.', danger:2, visual:'ent-visual-2' },
    { id:'E-3', name:'Dullers', desc:'Humanoides grises ciegos. Detectan vibraciones. Agresivos al contacto.', danger:3, visual:'ent-visual-3' },
    { id:'E-7', name:'Insanities', desc:'Figuras distorsionadas. Su presencia induce paranoia y n\u00e1useas.', danger:4, visual:'ent-visual-7' },
    { id:'E-9', name:'Smilers', desc:'Sonrisas eternas llenas de dientes. Cazan por sonido. Mortales.', danger:5, visual:'ent-visual-9' },
    { id:'E-11', name:'Electrics', desc:'Seres de electricidad est\u00e1tica. Atra\u00eddos por luz y movimiento.', danger:4, visual:'ent-visual-11' },
    { id:'E-12', name:'Hounds', desc:'Entidades caninas que cazan en manada. Extremadamente r\u00e1pidas.', danger:3, visual:'ent-visual-12' }
  ];

  // Flag para saber si los datos vienen de la nube
  var DATA_FROM_CLOUD = false;

  async function fetchWikiLevelsFromAPI() {
    try {
      var res = await fetch(API_BASE + '/wiki-levels');
      var data = await res.json();
      if (data.ok && Array.isArray(data.levels) && data.levels.length > 0) {
        WIKI_LEVELS = data.levels.map(function(l) { return { id:l.wikiId, name:l.name, survival:l.survival, entities:l.entities, tags:l.tags, visual:l.visual, video_url:l.video_url }; });
        return true;
      }
    } catch(e) {}
    return false;
  }

  async function fetchEntitiesFromAPI() {
    try {
      var res = await fetch(API_BASE + '/entities');
      var data = await res.json();
      if (data.ok && Array.isArray(data.entities) && data.entities.length > 0) {
        ENTITIES = data.entities.map(function(e) { return { id:e.entityId, name:e.name, desc:e.desc, danger:e.danger, visual:e.visual }; });
        return true;
      }
    } catch(e) {}
    return false;
  }

  // ===================== API CONFIG =====================
  var API_BASE = '/api';
  var useAPI = false;
  var API_TOKEN = null;

  // Token store keys (separados de localStorage normal)
  var TOKEN_KEY = 'br_api_token';
  var API_USER_KEY = 'br_api_user';

  // ===================== LOCALSTORAGE STATE =====================
  var STORE_KEYS = { users:'br_users', levels:'br_community_levels', currentUser:'br_current_user' };
  var state = { users:[], communityLevels:[], currentUser:null };

  // ===================== API HELPERS =====================
  async function checkAPIAvailable() {
    try {
      var res = await fetch(API_BASE + '/health');
      var data = await res.json();
      useAPI = data.ok === true;
    } catch(e) {
      useAPI = false;
    }
    // Si hay token guardado, restaurarlo
    var savedToken = localStorage.getItem(TOKEN_KEY);
    var savedUser = localStorage.getItem(API_USER_KEY);
    if (useAPI && savedToken && savedUser) {
      API_TOKEN = savedToken;
      state.currentUser = savedUser;
    }
    return useAPI;
  }

  async function apiCall(method, path, body) {
    var opts = {
      method: method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (body) opts.body = JSON.stringify(body);
    if (API_TOKEN) opts.headers['Authorization'] = 'Bearer ' + API_TOKEN;
    var res = await fetch(API_BASE + path, opts);
    return await res.json();
  }

  // ===================== LOCALSTORAGE STATE FUNCTIONS =====================
  function loadState() {
    try {
      state.users = JSON.parse(localStorage.getItem(STORE_KEYS.users)) || [];
      state.communityLevels = JSON.parse(localStorage.getItem(STORE_KEYS.levels)) || [];
      state.currentUser = localStorage.getItem(STORE_KEYS.currentUser) || null;
    } catch(e) { state = { users:[], communityLevels:[], currentUser:null }; }
  }
  function saveUsers() { localStorage.setItem(STORE_KEYS.users, JSON.stringify(state.users)); }
  function saveLevels() { localStorage.setItem(STORE_KEYS.levels, JSON.stringify(state.communityLevels)); }
  function saveCurrentUser() {
    if (state.currentUser) localStorage.setItem(STORE_KEYS.currentUser, state.currentUser);
    else localStorage.removeItem(STORE_KEYS.currentUser);
  }

  // ===================== AUTH (LOCALSTORAGE FALLBACK) =====================
  function registerLocal(username, password) {
    if (!username || !password) return { ok:false, msg:'Completa todos los campos.' };
    if (username.length < 3) return { ok:false, msg:'M\u00ednimo 3 caracteres.' };
    if (password.length < 4) return { ok:false, msg:'M\u00ednimo 4 caracteres.' };
    if (state.users.some(function(u) { return u.username.toLowerCase() === username.toLowerCase(); }))
      return { ok:false, msg:'Ese nombre ya est\u00e1 registrado.' };
    state.users.push({ username:username, password:password });
    saveUsers();
    return { ok:true, msg:'Registro exitoso. Ya puedes iniciar sesi\u00f3n.' };
  }

  function loginLocal(username, password) {
    var user = null;
    for (var i = 0; i < state.users.length; i++) {
      if (state.users[i].username.toLowerCase() === username.toLowerCase() && state.users[i].password === password) { user = state.users[i]; break; }
    }
    if (!user) return { ok:false, msg:'Nombre o clave incorrectos.' };
    state.currentUser = user.username;
    saveCurrentUser();
    return { ok:true, msg:'Bienvenido, ' + user.username + '.' };
  }

  // ===================== AUTH (API) =====================
  async function registerAPI(username, password) {
    if (!username || !password) return { ok:false, msg:'Completa todos los campos.' };
    if (username.length < 3) return { ok:false, msg:'M\u00ednimo 3 caracteres.' };
    if (password.length < 4) return { ok:false, msg:'M\u00ednimo 4 caracteres.' };
    return await apiCall('POST', '/auth/register', { username, password });
  }

  async function loginAPI(username, password) {
    if (!username || !password) return { ok:false, msg:'Completa todos los campos.' };
    var result = await apiCall('POST', '/auth/login', { username, password });
    if (result.ok && result.token) {
      API_TOKEN = result.token;
      state.currentUser = result.username;
      localStorage.setItem(TOKEN_KEY, result.token);
      localStorage.setItem(API_USER_KEY, result.username);
    }
    return result;
  }

  // ===================== AUTH WRAPPER =====================
  async function doRegister(username, password) {
    if (useAPI) return await registerAPI(username, password);
    return registerLocal(username, password);
  }

  async function doLogin(username, password) {
    if (useAPI) return await loginAPI(username, password);
    return loginLocal(username, password);
  }

  function logout() {
    state.currentUser = null;
    saveCurrentUser();
    // Limpiar API token si existe
    if (API_TOKEN) {
      API_TOKEN = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(API_USER_KEY);
    }
    renderAuthUI();
    renderSubmitSection();
  }

  function isLoggedIn() { return !!state.currentUser; }
  function getCurrentUsername() { return state.currentUser; }

  // ===================== LEVELS (LOCALSTORAGE) =====================
  function isLevelNameTakenLocal(name) {
    if (!name || !name.trim()) return false;
    var cleaned = name.trim().toLowerCase();
    for (var i = 0; i < WIKI_LEVELS.length; i++) { if (WIKI_LEVELS[i].name.toLowerCase() === cleaned) return true; }
    for (var j = 0; j < state.communityLevels.length; j++) { if (state.communityLevels[j].name.toLowerCase() === cleaned) return true; }
    return false;
  }

  function addCommunityLevelLocal(name, desc, anomalies, danger, video_url) {
    var level = {
      id:'com-' + Date.now() + '-' + Math.random().toString(36).slice(2,6),
      name:name.trim(), desc:desc.trim(), anomalies:anomalies.trim(),
      danger:parseInt(danger,10),
      video_url:video_url ? video_url.trim() : null,
      author:state.currentUser,
      date:new Date().toLocaleDateString('es-ES',{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})
    };
    state.communityLevels.push(level);
    saveLevels();
    return level;
  }

  // ===================== LEVELS (API) =====================
  async function isLevelNameTakenAPI(name) {
    if (!name || !name.trim()) return false;
    // Primero wiki
    var cleaned = name.trim().toLowerCase();
    for (var i = 0; i < WIKI_LEVELS.length; i++) { if (WIKI_LEVELS[i].name.toLowerCase() === cleaned) return true; }
    // Luego API
    try {
      var result = await apiCall('POST', '/levels/validate-name', { name: name.trim() });
      return result.available === false;
    } catch(e) { return false; }
  }

  async function addCommunityLevelAPI(name, desc, anomalies, danger, video_url) {
    var result = await apiCall('POST', '/levels/community', { name, desc, anomalies, danger, video_url });
    if (result.ok && result.level) {
      // Añadir a state local también para render inmediato
      var l = result.level;
      l.date = new Date(l.createdAt).toLocaleDateString('es-ES',{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) || '';
      state.communityLevels.push(l);
      return l;
    }
    return null;
  }

  async function fetchCommunityLevelsAPI() {
    try {
      var result = await apiCall('GET', '/levels/community');
      if (result.ok && Array.isArray(result.levels)) {
        state.communityLevels = result.levels.map(function(l) {
          l.date = new Date(l.createdAt).toLocaleDateString('es-ES',{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) || '';
          return l;
        });
        return true;
      }
    } catch(e) {}
    return false;
  }

  // ===================== LEVELS WRAPPER =====================
  var isLevelNameTaken = isLevelNameTakenLocal; // por defecto sync
  var addCommunityLevel = addCommunityLevelLocal;
  var levelValidationAsync = false; // flag para saber si validate es async

  // ===================== RENDER: Levels =====================
  function renderLevels(containerId) {
    var grid = document.getElementById(containerId);
    if (!grid) return;
    grid.innerHTML = WIKI_LEVELS.map(function(l) { return buildLevelCardHTML(l); }).join('');
  }

  function buildLevelCardHTML(l) {
    var color = SURVIVAL_COLORS[l.survival];
    var nameHtml = l.name.replace(' \u2014 ', '<br>');
    var tagsHtml = l.tags.join(' &middot; ');
    var videoBtn = l.video_url ? '<a href="' + l.video_url + '" target="_blank" class="btn-video-link">VER GRABACI\u00d3N</a>' : '<span class="btn-video-link disabled">SIN VIDEO</span>';
    return '<div class="level-card" data-level-id="' + l.id + '">'
      + '<div class="level-visual ' + l.visual + '">'
        + '<span class="level-badge">' + l.tags[0] + '</span>'
        + '<span class="level-entities-overlay">' + l.entities + '</span>'
        + '<div class="scan-overlay"><div class="scan-line"></div></div>'
        + '<button class="btn-scan" data-scan-level="' + l.id + '">\u25A0 ESCANEAR</button>'
      + '</div>'
      + '<div class="level-info">'
        + '<span class="li-name">' + nameHtml + '</span>'
        + '<span class="li-survival"><span class="s-dot" style="background:' + color + '"></span> ' + l.survival + '/5</span>'
      + '</div>'
      + '<div class="level-reveal" id="reveal-' + l.id + '">'
        + '<div class="reveal-section"><span class="reveal-label">> ENTIDADES</span><span class="reveal-value">' + l.entities + '</span></div>'
        + '<div class="reveal-section"><span class="reveal-label">> PROPIEDADES</span><span class="reveal-value">' + tagsHtml + '</span></div>'
        + '<div class="reveal-section"><span class="reveal-label">> LECTURA DE ANOMAL\u00cdA</span><span class="reveal-value anomaly-reading" data-level="' + l.id + '">\u2014</span></div>'
        + '<div class="reveal-actions">' + videoBtn + '</div>'
      + '</div>'
    + '</div>';
  }

  // ===================== RENDER: Entities =====================
  function renderEntities(containerId) {
    var grid = document.getElementById(containerId);
    if (!grid) return;
    grid.innerHTML = ENTITIES.map(function(e) {
      var color = SURVIVAL_COLORS[e.danger];
      var label = SURVIVAL_LABELS[e.danger];
      return '<div class="entity-card">'
        + '<div class="entity-visual ' + e.visual + '">'
          + '<span class="entity-badge" style="color:' + color + ';border-color:' + color + '">' + e.id + '</span>'
          + '<span class="entity-danger-overlay" style="color:' + color + '">PELIGRO ' + e.danger + '/5</span>'
        + '</div>'
        + '<div class="entity-info">'
          + '<span class="ei-name">' + e.name + '</span>'
          + '<span class="ei-tag" style="color:' + color + '">' + label + '</span>'
        + '</div>'
      + '</div>';
    }).join('');
  }

  // ===================== RENDER: Community =====================
  function renderCommunity(containerId, subId) {
    var grid = document.getElementById(containerId);
    var sub = document.getElementById(subId);
    if (!grid) return;

    if (state.communityLevels.length === 0) {
      grid.innerHTML = '<div class="empty-state"><p>No hay niveles comunitarios registrados a\u00fan.</p><p class="empty-hint">\u00bfTe atreves a documentar uno?</p></div>';
      if (sub) sub.textContent = 'A\u00fan no hay exploraciones documentadas.';
      return;
    }
    if (sub) sub.textContent = state.communityLevels.length + ' nivel(es) registrado(s) por agentes de campo.';
    var levels = state.communityLevels.slice().reverse();
    grid.innerHTML = levels.map(function(l) {
      var color = SURVIVAL_COLORS[l.danger] || SURVIVAL_COLORS[1];
      var label = SURVIVAL_LABELS[l.danger] || 'Desconocido';
      var videoBtn = l.video_url ? '<div class="c-actions"><a href="' + l.video_url + '" target="_blank" class="btn-video-link">VER GRABACI\u00d3N</a></div>' : '';
      return '<div class="community-card">'
        + '<div class="c-meta">' + (l.date || '') + ' \u2014 por ' + l.author + '</div>'
        + '<div class="c-name">' + l.name + '</div>'
        + '<div class="c-desc">' + l.desc + '</div>'
        + '<div class="c-anomalies"><strong>> Anomal\u00edas:</strong> ' + l.anomalies + '</div>'
        + '<span class="c-danger" style="border-color:' + color + ';color:' + color + ';">Peligro: ' + l.danger + '/5 \u2014 ' + label + '</span>'
        + videoBtn
      + '</div>';
    }).join('');
  }

  // ===================== AUTH UI =====================
  function renderAuthUI() {
    var loginBtn = document.getElementById('btn-login');
    var userBadge = document.getElementById('user-badge');
    var logoutBtn = document.getElementById('btn-logout');
    if (isLoggedIn()) {
      if (loginBtn) loginBtn.style.display = 'none';
      if (userBadge) { userBadge.style.display = 'inline-block'; userBadge.textContent = getCurrentUsername(); userBadge.className = 'btn-user'; }
      if (logoutBtn) logoutBtn.style.display = 'inline-block';
    } else {
      if (loginBtn) loginBtn.style.display = 'inline-block';
      if (userBadge) { userBadge.style.display = 'none'; userBadge.className = 'btn-user'; }
      if (logoutBtn) logoutBtn.style.display = 'none';
    }
  }

  // ===================== BACKUP =====================
  async function triggerBackup() {
    if (!useAPI) { showNotification('Backup solo disponible con conexi\u00f3n a la nube.', 'error'); return; }
    try {
      var res = await fetch(API_BASE + '/backup');
      if (!res.ok) {
        var errData;
        try { errData = await res.json(); } catch(e) {}
        throw new Error((errData && errData.msg) || 'Error del servidor (' + res.status + ')');
      }
      var data = await res.json();
      var jsonStr = JSON.stringify(data, null, 2);
      var blob = new Blob([jsonStr], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'backrooms-backup-' + new Date().toISOString().slice(0,10) + '.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showNotification('Backup descargado (' + (data.stats ? data.stats.wikiLevels + ' wikis, ' + data.stats.entities + ' entidades, ' + data.stats.communityLevels + ' comunitarios, ' + data.stats.users + ' usuarios' : '') + ').', 'success');
    } catch(e) {
      showNotification('Error: ' + e.message, 'error');
    }
  }

  function renderSubmitSection() {
    var notLogged = document.getElementById('not-logged-msg');
    var form = document.getElementById('level-form');
    if (!notLogged || !form) return;
    if (isLoggedIn()) { notLogged.style.display = 'none'; form.style.display = 'block'; }
    else { notLogged.style.display = 'block'; form.style.display = 'none'; }
  }

  // ===================== HAMBURGER =====================
  function initHamburger() {
    var h = document.getElementById('hamburger');
    var n = document.getElementById('nav-menu');
    if (!h || !n) return;
    h.addEventListener('click', function() { h.classList.toggle('active'); n.classList.toggle('open'); });
    var links = n.querySelectorAll('.nav-link');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function() { h.classList.remove('active'); n.classList.remove('open'); });
    }
  }

  // ===================== MODAL =====================
  function initModal() {
    var modal = document.getElementById('auth-modal');
    var modalTitle = document.getElementById('modal-title');
    var authForm = document.getElementById('auth-form');
    var authError = document.getElementById('auth-error');
    var authSuccess = document.getElementById('auth-success');
    var btnAuth = document.getElementById('btn-auth');
    var authUser = document.getElementById('auth-user');
    var authPass = document.getElementById('auth-pass');
    if (!modal) return;

    var authMode = 'login';

    function openModal(mode) { authMode = mode || 'login'; modal.classList.add('active'); resetForm(); updateMode(); }
    function closeModal() { modal.classList.remove('active'); }
    function resetForm() {
      if (authUser) authUser.value = '';
      if (authPass) authPass.value = '';
      if (authError) { authError.classList.remove('show'); authError.textContent = ''; }
      if (authSuccess) { authSuccess.classList.remove('show'); authSuccess.textContent = ''; }
      if (btnAuth) btnAuth.disabled = false;
    }
    function updateMode() {
      if (authMode === 'login') {
        if (modalTitle) modalTitle.textContent = 'Iniciar Sesi\u00f3n';
        if (btnAuth) btnAuth.textContent = 'ACCEDER AL ARCHIVO';
        var tc = document.getElementById('auth-toggle');
        if (tc) tc.innerHTML = '\u00bfNo tienes cuenta? <a id="auth-toggle-link">Reg\u00edstrate aqu\u00ed</a>';
      } else {
        if (modalTitle) modalTitle.textContent = 'Registro de Nuevo Agente';
        if (btnAuth) btnAuth.textContent = 'REGISTRARSE';
        var tc2 = document.getElementById('auth-toggle');
        if (tc2) tc2.innerHTML = '\u00bfYa tienes cuenta? <a id="auth-toggle-link">Inicia sesi\u00f3n aqu\u00ed</a>';
      }
      bindToggleLink();
    }
    function bindToggleLink() {
      var link = document.getElementById('auth-toggle-link');
      if (link) link.addEventListener('click', function(e) { e.preventDefault(); authMode = authMode === 'login' ? 'register' : 'login'; updateMode(); resetForm(); });
    }

    bindToggleLink();
    var mc = document.getElementById('modal-close');
    if (mc) mc.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) { if (e.target === modal) closeModal(); });

    var loginBtn = document.getElementById('btn-login');
    if (loginBtn) loginBtn.addEventListener('click', function(e) { e.preventDefault(); openModal('login'); });

    var logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function() {
        var name = getCurrentUsername();
        logout();
        var notif = document.getElementById('notification');
        if (notif) showNotification('Sesi\u00f3n cerrada. Hasta pronto, ' + name + '.', 'success');
        updateHeroCount();
        var sc = document.getElementById('stat-community');
        if (sc) sc.textContent = state.communityLevels.length;
      });
    }

    if (authForm) {
      authForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        if (authError) authError.classList.remove('show');
        if (authSuccess) authSuccess.classList.remove('show');
        if (btnAuth) btnAuth.disabled = true;

        var username = authUser ? authUser.value.trim() : '';
        var password = authPass ? authPass.value : '';
        var result;

        if (authMode === 'login') result = await doLogin(username, password);
        else result = await doRegister(username, password);

        if (result && result.ok) {
          if (authMode === 'register') {
            if (authSuccess) { authSuccess.textContent = result.msg; authSuccess.classList.add('show'); }
            if (btnAuth) btnAuth.disabled = false;
            setTimeout(function() { authMode = 'login'; updateMode(); resetForm(); }, 1500);
          } else {
            if (authSuccess) { authSuccess.textContent = result.msg; authSuccess.classList.add('show'); }
            setTimeout(function() {
              closeModal();
              renderAuthUI();
              renderSubmitSection();
              showNotification('Sesi\u00f3n iniciada como ' + state.currentUser, 'success');
            }, 800);
          }
        } else {
          if (authError) { authError.textContent = (result && result.msg) || 'Error del servidor.'; authError.classList.add('show'); }
          if (btnAuth) btnAuth.disabled = false;
        }
      });
    }
  }

  // ===================== NOTIFICATION =====================
  var notifTimeout = null;
  function showNotification(msg, type) {
    var el = document.getElementById('notification');
    if (!el) return;
    el.textContent = '> ' + msg;
    el.className = 'notification';
    if (type === 'error') el.classList.add('error');
    requestAnimationFrame(function() { el.classList.add('show'); });
    clearTimeout(notifTimeout);
    notifTimeout = setTimeout(function() { el.classList.remove('show'); }, 3500);
  }

  function updateHeroCount() {
    var hc = document.getElementById('hero-count');
    if (hc) hc.textContent = '[ARCHIVO] Niveles documentados: 5 principales \u00b7 ' + state.communityLevels.length + ' comunitarios';
  }

  // ===================== LEVEL FORM =====================
  function initLevelForm() {
    var nameInput = document.getElementById('level-name');
    var nameStatus = document.getElementById('name-status');
    var btnSubmit = document.getElementById('btn-submit-level');
    var levelForm = document.getElementById('level-form');
    var descInput = document.getElementById('level-desc');
    var anomaliesInput = document.getElementById('level-anomalies');
    var dangerSelect = document.getElementById('level-danger');
    var videoUrlInput = document.getElementById('level-video-url');
    var formSuccess = document.getElementById('form-success');
    if (!levelForm) return;

    var validateTimer = null;

    async function validateName() {
      if (!nameInput || !nameStatus) return false;
      var val = nameInput.value.trim();
      if (!val) { nameStatus.className = 'name-status'; nameStatus.textContent = ''; return false; }
      var taken;
      if (useAPI) {
        taken = await isLevelNameTakenAPI(val);
      } else {
        taken = isLevelNameTakenLocal(val);
      }
      if (taken) { nameStatus.className = 'name-status unavailable'; nameStatus.textContent = '\u2716 Este sitio liminal ya est\u00e1 registrado.'; return false; }
      else { nameStatus.className = 'name-status available'; nameStatus.textContent = '\u2714 Nombre disponible.'; return true; }
    }

    function checkComplete() {
      var nOk = nameInput && nameInput.value.trim().length > 0;
      var dOk = descInput && descInput.value.trim().length > 0;
      var aOk = anomaliesInput && anomaliesInput.value.trim().length > 0;
      var dangerOk = dangerSelect && dangerSelect.value !== '';
      return nOk && dOk && aOk && dangerOk;
    }
    function updateBtn() { if (btnSubmit) btnSubmit.disabled = !checkComplete(); }

    if (nameInput) {
      nameInput.addEventListener('input', function() {
        clearTimeout(validateTimer);
        validateTimer = setTimeout(function() {
          validateName().then(function() { updateBtn(); });
        }, 300);
      });
    }
    if (descInput) descInput.addEventListener('input', updateBtn);
    if (anomaliesInput) anomaliesInput.addEventListener('input', updateBtn);
    if (dangerSelect) dangerSelect.addEventListener('change', updateBtn);

    levelForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      if (!isLoggedIn()) { showNotification('Debes iniciar sesi\u00f3n.', 'error'); return; }
      var name = nameInput ? nameInput.value.trim() : '';
      var desc = descInput ? descInput.value.trim() : '';
      var anomalies = anomaliesInput ? anomaliesInput.value.trim() : '';
      var danger = dangerSelect ? dangerSelect.value : '';
      var video_url = videoUrlInput ? videoUrlInput.value.trim() || null : null;
      if (!name || !desc || !anomalies || !danger) return;

      // Validar nombre duplicado
      var taken;
      if (useAPI) taken = await isLevelNameTakenAPI(name);
      else taken = isLevelNameTakenLocal(name);
      if (taken) { showNotification('El nombre ya est\u00e1 registrado.', 'error'); return; }

      var level;
      if (useAPI) {
        level = await addCommunityLevelAPI(name, desc, anomalies, danger, video_url);
      } else {
        level = addCommunityLevelLocal(name, desc, anomalies, danger, video_url);
      }

      if (!level) { showNotification('Error al guardar el nivel.', 'error'); return; }

      if (formSuccess) { formSuccess.textContent = 'Nivel "' + level.name + '" registrado.'; formSuccess.classList.add('show'); }
      showNotification('"' + level.name + '" registrado.', 'success');
      if (nameInput) nameInput.value = '';
      if (descInput) descInput.value = '';
      if (anomaliesInput) anomaliesInput.value = '';
      if (dangerSelect) dangerSelect.value = '';
      if (videoUrlInput) videoUrlInput.value = '';
      if (nameStatus) { nameStatus.className = 'name-status'; nameStatus.textContent = ''; }
      if (btnSubmit) btnSubmit.disabled = true;
      renderCommunity('community-grid', 'community-sub');
      updateBtn();
      updateHeroCount();
      var sc = document.getElementById('stat-community');
      if (sc) sc.textContent = state.communityLevels.length;
      setTimeout(function() { if (formSuccess) formSuccess.classList.remove('show'); }, 4000);
    });
  }

  // ===================== WIDGETS =====================
  function initWidgets() {
    var sanityVal = document.getElementById('sanity-value');
    var sanityFill = document.getElementById('sanity-fill');
    var wallClock = document.getElementById('wall-clock');
    if (!sanityVal && !sanityFill && !wallClock) return;

    if (sanityVal && sanityFill) {
      var sanity = 85;
      setInterval(function() {
        var delta = (Math.random() * 4) - 2;
        sanity = Math.max(10, Math.min(100, sanity + delta));
        sanity = Math.round(sanity);
        sanityVal.textContent = sanity + '%';
        sanityFill.style.width = sanity + '%';
        if (sanity < 40) sanityFill.classList.add('alert-critical');
        else sanityFill.classList.remove('alert-critical');
      }, 4000);
    }

    if (wallClock) {
      function updateClock() {
        var now = new Date();
        wallClock.textContent =
          String(now.getHours()).padStart(2,'0') + ':' +
          String(now.getMinutes()).padStart(2,'0') + ':' +
          String(now.getSeconds()).padStart(2,'0');
      }
      updateClock();
      setInterval(updateClock, 1000);
    }
  }

  // ===================== TERMINAL LOGS =====================
  function initTerminalLogs() {
    var consoleEl = document.getElementById('terminal-logs-console');
    if (!consoleEl) return;
    var lines = [
      'CONECTANDO CON EL N\u00daCLEO MATRIZ ASYNC...',
      'CONFIGURANDO PROTOCOLO DE EXTRACCI\u00d3N DE DATOS LIMINALES...',
      'ADVERTENCIA: DISTORSI\u00d3N ESPACIAL DETECTADA EN EL ENTORNO PR\u00d3XIMO.'
    ];
    var delays = [800, 2200, 3800];
    for (var i = 0; i < lines.length; i++) {
      (function(index) {
        setTimeout(function() {
          var p = document.createElement('p');
          p.className = 'console-line';
          p.innerHTML = '<span class="c-prefix">\u258C</span> ' + lines[index];
          consoleEl.appendChild(p);
          requestAnimationFrame(function() { p.classList.add('visible'); });
        }, delays[index]);
      })(i);
    }

    // Añadir estado de conexión a la DB
    setTimeout(function() {
      var p = document.createElement('p');
      p.className = 'console-line';
      var status = useAPI ? '<span style="color:#30c460">● CONECTADO</span>' : '<span style="color:#c43030">● DESCONECTADO</span>';
      p.innerHTML = '<span class="c-prefix">\u258C</span> [DB] MongoDB Atlas ' + status;
      consoleEl.appendChild(p);
      requestAnimationFrame(function() { p.classList.add('visible'); });
    }, 4800);
  }

  // ===================== MINIJUEGO DE SUPERVIVENCIA — REDISEÑO =====================
  var GAME = { state:'idle', level:0, history:[], sanity:0 };
  var SECRET_LEVEL = { name:'Nivel \u2588\u2588\u2588\u2588 \u2014 Corrupci\u00f3n de Realidad', desc:'El c\u00f3digo fuente del universo est\u00e1 corrupto. Las leyes de la f\u00edsica no aplican. Has atravesado un fallo cr\u00edtico en la matriz y ahora est\u00e1s en un lugar que no deber\u00eda existir. Las entidades aqu\u00ed no siguen patrones conocidos. Tu cordura se desmorona.' };

  var ESCAPE_ACTIONS = [
    { safe:{ text:'Hacer no-clip a trav\u00e9s de la pared deste\u00f1ida', detail:'Avance lento pero estable. Las entidades rara vez cruzan el umbral.', bonus:20, skip:0 },
      risky:{ text:'Forzar una grieta en el suelo con un extintor', detail:'Puedes saltar niveles, pero el ruido atrae a las entidades.', bonus:-30, skip:2 } },
    { safe:{ text:'Cruzar la puerta de servicio entreabierta', detail:'Camino verificado por exploradores previos. Baja exposici\u00f3n.', bonus:20, skip:0 },
      risky:{ text:'Seguir el sonido de los fluorescentes', detail:'El zumbido te alejar\u00e1 de las zonas seguras r\u00e1pidamente.', bonus:-30, skip:2 } },
    { safe:{ text:'Gatear por el conducto de ventilaci\u00f3n', detail:'Oscuridad total pero sin encuentros directos.', bonus:20, skip:0 },
      risky:{ text:'Correr a ciegas por el pasillo principal', detail:'Alta velocidad de avance, m\u00ednima precauci\u00f3n.', bonus:-35, skip:3 } },
    { safe:{ text:'Esconderse tras los paneles del techo ca\u00eddos', detail:'Esperas paciente a que el peligro se disipe.', bonus:20, skip:0 },
      risky:{ text:'Manipular el cuadro el\u00e9ctrico', detail:'Una brecha energ\u00e9tica puede abrir paso a niveles profundos.', bonus:-25, skip:2 } },
    { safe:{ text:'Seguir marcas de otros exploradores', detail:'Ruta se\u00f1alizada. Baja incidencia de anomal\u00edas.', bonus:20, skip:0 },
      risky:{ text:'Tomar el ascensor averiado', detail:'Podr\u00eda caer al vac\u00edo o llevarte muy lejos. Sin garant\u00edas.', bonus:-40, skip:3 } }
  ];

  var ASCII_BANNER =
    '\u2588\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2588\n' +
    '\u2588  SISTEMA DE EXTRACCI\u00d3N LIMINAL ACTIVO  \u2588\n' +
    '\u2588\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2588\n';

  function initSurvivalGame() {
    document.getElementById('sg-btn-start').addEventListener('click', function() { startGame(); });
    document.getElementById('sg-btn-restart').addEventListener('click', function() { startGame(); });
    document.getElementById('sg-btn-close').addEventListener('click', function() { closeGame(); });
  }

  function startGame() {
    GAME = { state:'playing', level:0, history:[], sanity:100 };
    document.getElementById('survival-minigame').style.display = 'flex';
    document.getElementById('sg-btn-start').style.display = 'none';
    document.getElementById('sg-btn-restart').style.display = 'none';
    document.getElementById('sg-btn-close').style.display = 'none';
    document.getElementById('sg-glitch').className = 'sg-glitch-overlay';
    document.getElementById('sg-flash').className = 'sg-flash';
    renderGameLevel(0);
  }

  function closeGame() {
    document.getElementById('survival-minigame').style.display = 'none';
    GAME.state = 'idle';
  }

  function sgFlash() {
    var f = document.getElementById('sg-flash');
    f.className = 'sg-flash active';
    setTimeout(function() { f.className = 'sg-flash'; }, 120);
  }

  function sgGlitch(mode) {
    var g = document.getElementById('sg-glitch');
    g.className = 'sg-glitch-overlay ' + mode;
  }

  function sgStopGlitch() {
    document.getElementById('sg-glitch').className = 'sg-glitch-overlay';
  }

  function renderGameLevel(idx) {
    GAME.level = idx;
    GAME.history.push(idx);
    var viewport = document.getElementById('sg-viewport');
    var glitch = document.getElementById('sg-glitch');
    glitch.className = 'sg-glitch-overlay';

    var level = WIKI_LEVELS[idx];
    if (!level) { showVictoryScreen(); return; }

    var bannerEl = document.getElementById('sg-ascii-banner');
    bannerEl.textContent = ASCII_BANNER;
    document.getElementById('sg-status').textContent = 'NIVEL ' + idx + ' | INTENTO ' + GAME.history.length;

    var baseSurv = Math.max(10, 100 - (level.survival * 15));
    var survColor = baseSurv > 60 ? '#30c460' : baseSurv > 35 ? '#c8a415' : '#c43030';

    // Construir HTML del nivel
    var content = document.getElementById('sg-content');
    content.innerHTML =
      '<div class="sg-level-sub">\u25A0 PELIGRO: ' + level.survival + '/5 &mdash; ' + level.entities + '</div>' +
      '<div class="sg-level-title">' + level.name + '</div>' +
      '<div class="sg-desc-line" id="sg-type-line-0"></div>' +
      '<div class="sg-desc-line" id="sg-type-line-1"></div>' +
      '<div class="sg-desc-line" id="sg-type-line-2"></div>' +
      '<div class="sg-bar-section">' +
        '<span class="sg-bar-label">PROBABILIDAD BASE DE SUPERVIVENCIA</span>' +
        '<div class="sg-bar-row">' +
          '<div class="sg-bar-track-big"><div class="sg-bar-fill-big" id="sg-bar-fill-big" style="width:0%;background:' + survColor + '"></div></div>' +
          '<span class="sg-bar-pct-big" id="sg-bar-pct-big" style="color:' + survColor + '">0%</span>' +
        '</div>' +
      '</div>';

    var optGrid = document.getElementById('sg-opt-grid');
    var actions = shuffleArray(ESCAPE_ACTIONS).slice(0, 2);
    optGrid.innerHTML = actions.map(function(a) {
      var safeSurv = Math.min(99, baseSurv + a.safe.bonus);
      var riskySurv = Math.min(99, Math.max(5, baseSurv + a.risky.bonus));
      var safeColor = safeSurv > 60 ? '#30c460' : safeSurv > 35 ? '#c8a415' : '#c43030';
      var riskyColor = riskySurv > 60 ? '#30c460' : riskySurv > 35 ? '#c8a415' : '#c43030';
      return '' +
        '<button class="sg-card" id="sg-card-safe" data-bonus="' + a.safe.bonus + '" data-skip="' + a.safe.skip + '">' +
          '<div class="sg-card-label">[ \u25D4 ' + a.safe.text + ' ]</div>' +
          '<div class="sg-card-detail">' + a.safe.detail + '</div>' +
          '<div class="sg-card-bar">' +
            '<div class="sg-card-bar-track"><div class="sg-card-bar-fill" style="width:0%;background:' + safeColor + '"></div></div>' +
            '<span class="sg-card-bar-pct" style="color:' + safeColor + '">0%</span>' +
          '</div>' +
        '</button>' +
        '<button class="sg-card" id="sg-card-risky" data-bonus="' + a.risky.bonus + '" data-skip="' + a.risky.skip + '">' +
          '<div class="sg-card-label">[ \u26A1 ' + a.risky.text + ' ]</div>' +
          '<div class="sg-card-detail">' + a.risky.detail + '</div>' +
          '<div class="sg-card-bar">' +
            '<div class="sg-card-bar-track"><div class="sg-card-bar-fill" style="width:0%;background:' + riskyColor + '"></div></div>' +
            '<span class="sg-card-bar-pct" style="color:' + riskyColor + '">0%</span>' +
          '</div>' +
        '</button>';
    }).join('');

    // Escribir descripciones con typewriter
    var descLines = [
      'Sistema de detecci\u00f3n de anomal\u00edas activo.',
      'Tags de nivel: <span class="hl">' + level.tags.join('</span> \u2022 <span class="hl">') + '</span>.',
      'Firma entidad: <span class="hl">' + level.entities + '</span>. Peligro <span class="hl-danger">' + level.survival + '/5</span>.'
    ];
    typeWriterLines(descLines, 0, function() {
      // Una vez escritas las descripciones, animar las barras
      animateBars(baseSurv, safeSurv, riskySurv, safeColor, riskyColor);
    });

    // Bind option clicks
    document.getElementById('sg-card-safe').addEventListener('click', function() { if (GAME.state !== 'playing') return; chooseOption(parseInt(this.getAttribute('data-bonus')), parseInt(this.getAttribute('data-skip'))); });
    document.getElementById('sg-card-risky').addEventListener('click', function() { if (GAME.state !== 'playing') return; chooseOption(parseInt(this.getAttribute('data-bonus')), parseInt(this.getAttribute('data-skip'))); });
  }

  function typeWriterLines(lines, idx, callback) {
    if (idx >= lines.length) { if (callback) callback(); return; }
    var el = document.getElementById('sg-type-line-' + idx);
    if (!el) { typeWriterLines(lines, idx + 1, callback); return; }
    var raw = lines[idx];
    // Separar texto plano de etiquetas HTML (<span>, etc.)
    var parts = [];
    var last = 0;
    var tagRe = /<[^>]+>/g;
    var match;
    while ((match = tagRe.exec(raw)) !== null) {
      if (match.index > last) parts.push({ t:'text', v:raw.substring(last, match.index) });
      parts.push({ t:'tag', v:match[0] });
      last = tagRe.lastIndex;
    }
    if (last < raw.length) parts.push({ t:'text', v:raw.substring(last) });

    var fullPlain = parts.filter(function(p) { return p.t === 'text'; }).map(function(p) { return p.v; }).join('');
    var pos = 0;
    el.innerHTML = '';
    var cursor = document.createElement('span');
    cursor.className = 'sg-cursor';

    function tick() {
      if (pos < fullPlain.length) {
        var remaining = fullPlain.substring(0, pos + 1);
        var result = '';
        var ri = 0;
        for (var pi = 0; pi < parts.length; pi++) {
          if (parts[pi].t === 'tag') { result += parts[pi].v; }
          else {
            var take = Math.min(remaining.length - ri, parts[pi].v.length);
            if (take > 0) { result += parts[pi].v.substring(0, take); ri += take; }
          }
        }
        el.innerHTML = result;
        el.appendChild(cursor.cloneNode(true));
        pos++;
        setTimeout(tick, 12 + Math.random() * 8);
      } else {
        el.innerHTML = raw;
        setTimeout(function() { typeWriterLines(lines, idx + 1, callback); }, 120);
      }
    }
    tick();
  }

  function animateBars(baseSurv, safeSurv, riskySurv, safeColor, riskyColor) {
    var bigFill = document.getElementById('sg-bar-fill-big');
    var bigPct = document.getElementById('sg-bar-pct-big');
    if (bigFill && bigPct) {
      bigFill.style.width = baseSurv + '%';
      bigPct.textContent = baseSurv + '%';
    }
    // Animar barras de las tarjetas
    setTimeout(function() {
      var safeFill = document.querySelector('#sg-card-safe .sg-card-bar-fill');
      var safePct = document.querySelector('#sg-card-safe .sg-card-bar-pct');
      var riskyFill = document.querySelector('#sg-card-risky .sg-card-bar-fill');
      var riskyPct = document.querySelector('#sg-card-risky .sg-card-bar-pct');
      if (safeFill) safeFill.style.width = safeSurv + '%';
      if (safePct) safePct.textContent = safeSurv + '%';
      if (riskyFill) riskyFill.style.width = riskySurv + '%';
      if (riskyPct) riskyPct.textContent = riskySurv + '%';
    }, 300);
  }

  function chooseOption(bonus, skip) {
    GAME.state = 'animating';
    var level = WIKI_LEVELS[GAME.level];
    var baseSurv = Math.max(10, 100 - (level.survival * 15));
    var prob = Math.min(99, Math.max(5, baseSurv + bonus));
    var probColor = prob > 60 ? '#30c460' : prob > 35 ? '#c8a415' : '#c43030';

    // Deshabilitar botones y animar barra final
    document.getElementById('sg-card-safe').disabled = true;
    document.getElementById('sg-card-risky').disabled = true;

    var bigFill = document.getElementById('sg-bar-fill-big');
    var bigPct = document.getElementById('sg-bar-pct-big');
    if (bigFill) { bigFill.style.width = prob + '%'; bigFill.style.background = probColor; }
    if (bigPct) { bigPct.textContent = prob + '%'; bigPct.style.color = probColor; }

    setTimeout(function() {
      var roll = Math.random() * 100;
      if (roll <= prob) {
        // SOBREVIVE — glitch rápido
        sgFlash();
        sgGlitch('active');
        var nextIdx = GAME.level + 1 + skip;
        if (Math.random() < 0.03) {
          setTimeout(function() { triggerSecretLevel(); }, 400);
          return;
        }
        setTimeout(function() {
          sgStopGlitch();
          GAME.state = 'playing';
          if (nextIdx >= WIKI_LEVELS.length) { showVictoryScreen(); }
          else { renderGameLevel(nextIdx); }
        }, 500);
      } else {
        // MUERE
        sgFlash();
        sgGlitch('severe');
        setTimeout(function() { showDeathScreen(); }, 800);
      }
    }, 900);
  }

  function triggerSecretLevel() {
    // EFECTO NO-CLIP: distorsión de la página completa
    document.body.classList.add('sg-no-clip-distort');
    sgFlash();
    sgGlitch('severe');
    setTimeout(function() {
      document.body.classList.remove('sg-no-clip-distort');
      sgStopGlitch();
      var content = document.getElementById('sg-content');
      content.innerHTML =
        '<div class="sg-secret-screen">' +
          '<div class="sg-secret-icon">\u26A1</div>' +
          '<div class="sg-secret-title">FALLO DE REALIDAD CR\u00cdTICO</div>' +
          '<div class="sg-secret-sub">' + SECRET_LEVEL.name + '</div>' +
          '<div class="sg-secret-desc">' + SECRET_LEVEL.desc + '</div>' +
          '<div class="sg-bar-section" style="width:100%;max-width:400px">' +
            '<span class="sg-bar-label">PROBABILIDAD DE SALIR CON VIDA</span>' +
            '<div class="sg-bar-row">' +
              '<div class="sg-bar-track-big"><div class="sg-bar-fill-big" id="sg-secret-bar" style="width:0%;background:#c830c4"></div></div>' +
              '<span class="sg-bar-pct-big" style="color:#c830c4">0%</span>' +
            '</div>' +
          '</div>' +
        '</div>';
      var optGrid = document.getElementById('sg-opt-grid');
      optGrid.innerHTML =
        '<button class="sg-card" id="sg-btn-secret-escape" style="grid-column:1/-1;text-align:center">' +
          '<div class="sg-card-label">[ INTENTAR ESCAPAR DE LA REALIDAD CORRUPTA ]</div>' +
          '<div class="sg-card-detail">No hay garant\u00edas. Solo una probabilidad del 8% de salir con vida.</div>' +
        '</button>';
      document.getElementById('sg-btn-secret-escape').addEventListener('click', function() {
        var secretBar = document.getElementById('sg-secret-bar');
        if (secretBar) { secretBar.style.width = '8%'; }
        setTimeout(function() {
          var secretRoll = Math.random() * 100;
          if (secretRoll <= 8) {
            sgFlash();
            GAME.state = 'playing';
            renderGameLevel(Math.min(WIKI_LEVELS.length - 1, GAME.level + 2));
          } else {
            sgGlitch('severe');
            setTimeout(function() { showDeathScreen(); }, 500);
          }
        }, 600);
      });
      document.getElementById('sg-status').textContent = 'NIVEL \u2588\u2588\u2588\u2588 | REALIDAD CORRUPTA';
      var banner = document.getElementById('sg-ascii-banner');
      banner.textContent = '\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\n\u2588  SISTEMA CORRUPTO — PROTOCOLO ANULADO  \u2588\n\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584';
      GAME.state = 'playing';
    }, 1200);
  }

  function showDeathScreen() {
    sgStopGlitch();
    GAME.state = 'dead';
    // Cinemática: fundido a negro con texto rojo difuminado
    var fade = document.getElementById('sg-death-fade');
    var text = document.getElementById('sg-death-text');
    if (fade) { fade.className = 'sg-death-fade active'; }
    setTimeout(function() {
      if (text) { text.className = 'sg-death-text active'; }
    }, 400);
    // Tras 2.2s, mostrar el panel interno del juego con detalles
    setTimeout(function() {
      var content = document.getElementById('sg-content');
      content.innerHTML =
        '<div class="sg-death-screen">' +
          '<div class="sg-death-icon">\u2620</div>' +
          '<div class="sg-death-title">CONEXI\u00d3N PERDIDA</div>' +
          '<div class="sg-death-sub">SIGNOS VITALES SENSADOS: 0%</div>' +
          '<div class="sg-death-info">Has sobrevivido a <span class="hl">' + GAME.history.length + '</span> nivel(es). \u00daltima ubicaci\u00f3n: <span class="hl">' + WIKI_LEVELS[GAME.level].name + '</span>.</div>' +
        '</div>';
      var optGrid = document.getElementById('sg-opt-grid');
      optGrid.innerHTML = '';
      document.getElementById('sg-btn-restart').style.display = 'inline-block';
      document.getElementById('sg-btn-close').style.display = 'inline-block';
      document.getElementById('sg-status').textContent = 'EXPLORADOR CA\u00cdDO';
      var banner = document.getElementById('sg-ascii-banner');
      banner.textContent = '\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\n\u2588  SE\u00d1AL PERDIDA \u2014 EXPLORADOR NO RESPONDE  \u2588\n\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584';
      // Desvanecer el fundido para ver el panel interno
      setTimeout(function() {
        if (fade) { fade.className = 'sg-death-fade'; }
        if (text) { text.className = 'sg-death-text'; }
      }, 100);
    }, 2200);

    var sanityFill = document.getElementById('sanity-fill');
    var sanityVal = document.getElementById('sanity-value');
    if (sanityFill) { sanityFill.style.width = '0%'; sanityFill.classList.add('alert-critical'); }
    if (sanityVal) sanityVal.textContent = '0%';
  }

  function showVictoryScreen() {
    GAME.state = 'idle';
    document.getElementById('sg-status').textContent = 'EXTRACCI\u00d3N EXITOSA';
    var content = document.getElementById('sg-content');
    content.innerHTML =
      '<div class="sg-victory-screen">' +
        '<div class="sg-victory-icon">\u2728</div>' +
        '<div class="sg-victory-title">HAS ATRAVESADO TODOS LOS NIVELES CONOCIDOS</div>' +
        '<div class="sg-victory-sub">Has documentado <span class="hl">' + GAME.history.length + '</span> niveles. Tu informe ha sido archivado en el n\u00facleo central.</div>' +
      '</div>';
    document.getElementById('sg-opt-grid').innerHTML = '';
    document.getElementById('sg-btn-restart').style.display = 'inline-block';
    document.getElementById('sg-btn-close').style.display = 'inline-block';
    var banner = document.getElementById('sg-ascii-banner');
    banner.textContent = '\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\n\u2588  EXTRACCI\u00d3N COMPLETADA — INFORME ARCHIVADO  \u2588\n\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584';
  }

  function shuffleArray(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }
  function initLevelScan() {
    var cards = document.querySelectorAll('.level-card[data-level-id]');
    for (var i = 0; i < cards.length; i++) {
      (function(card) {
        var btn = card.querySelector('.btn-scan');
        var reveal = card.querySelector('.level-reveal');
        var overlay = card.querySelector('.scan-overlay');
        if (!btn || !reveal) return;

        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          if (btn.classList.contains('scanning') || reveal.classList.contains('open')) return;

          btn.classList.add('scanning');
          btn.textContent = '\u25A0 ESCANEANDO...';
          if (overlay) overlay.classList.add('active');

          var readings = {};
          readings['wiki-0'] = 'Frecuencia de 4.7 Hz detectada. Eco de voz no identificado en submural.';
          readings['wiki-1'] = 'Rastros de Entity-12. Nivel de humedad: 34%. Se\u00f1al Wi-Fi residual.';
          readings['wiki-2'] = 'Presi\u00f3n de vapor: 4.2 bar. Part\u00edculas de amon\u00edaco en suspensi\u00f3n.';
          readings['wiki-3'] = 'Campo electromagn\u00e9tico: 2.4 \u00b5T. Descargas residuales cada 3s.';
          readings['wiki-4'] = 'Gravedad local: 0.98 G. Se detectan firmas biol\u00f3gicas d\u00e9biles.';

          var levelId = card.getAttribute('data-level-id');
          var reading = readings[levelId] || 'Anomal\u00eda no clasificada. Se recomienda precauci\u00f3n.';

          setTimeout(function() {
            btn.classList.remove('scanning');
            btn.textContent = '\u25A0 ESCANEAR';
            if (overlay) overlay.classList.remove('active');
            var readingEl = reveal.querySelector('.anomaly-reading');
            if (readingEl) readingEl.textContent = reading;
            reveal.classList.add('open');
            btn.textContent = '\u25BC CONTRAER';
            btn.classList.add('revealed');
          }, 1800);
        });

        btn.addEventListener('click', function(e) {
          if (reveal.classList.contains('open') && !btn.classList.contains('scanning')) {
            if (btn.classList.contains('revealed')) {
              reveal.classList.remove('open');
              btn.textContent = '\u25A0 ESCANEAR';
              btn.classList.remove('revealed');
            }
          }
        });
      })(cards[i]);
    }
  }

  // ===================== MIGRACIÓN DESDE LOCALSTORAGE =====================
  async function migrateExistingData() {
    if (!useAPI) return false;
    var localUsers = [];
    try { localUsers = JSON.parse(localStorage.getItem('br_users')) || []; } catch(e) {}
    var localLevels = [];
    try { localLevels = JSON.parse(localStorage.getItem('br_community_levels')) || []; } catch(e) {}

    if (localUsers.length === 0 && localLevels.length === 0) return false;

    try {
      var res = await fetch(API_BASE + '/migrate/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users: localUsers, communityLevels: localLevels })
      });
      var result = await res.json();
      if (result.ok) {
        if (localUsers.length > 0) localStorage.removeItem('br_users');
        if (localLevels.length > 0) localStorage.removeItem('br_community_levels');
        console.log('Migración completada:', result.msg);
        return true;
      }
    } catch(e) {
      console.log('Error en migración automática:', e);
    }
    return false;
  }

  // ===================== INIT =====================
  async function init() {
    loadState();

    // Detectar si el backend API está disponible
    await checkAPIAvailable();

    // Si API disponible, cargar todo desde la nube
    if (useAPI) {
      await fetchCommunityLevelsAPI();
      var wikiOk = await fetchWikiLevelsFromAPI();
      var entOk = await fetchEntitiesFromAPI();
      if (wikiOk && entOk) DATA_FROM_CLOUD = true;
      isLevelNameTaken = isLevelNameTakenAPI;
      addCommunityLevel = addCommunityLevelAPI;
      levelValidationAsync = true;

      // Migrar datos existentes de localStorage a MongoDB
      await migrateExistingData();
    }

    initHamburger();
    renderLevels('wiki-grid');
    renderEntities('entities-grid');
    renderCommunity('community-grid', 'community-sub');
    renderAuthUI();
    renderSubmitSection();
    initModal();
    initLevelForm();
    initWidgets();
    initTerminalLogs();
    initLevelScan();

    initSurvivalGame();

    // Botón de backup
    var backupBtn = document.getElementById('btn-backup');
    if (backupBtn) backupBtn.addEventListener('click', triggerBackup);

    // Botón de supervivencia
    var gameBtn = document.getElementById('btn-game');
    if (gameBtn) gameBtn.addEventListener('click', function() {
      var el = document.getElementById('survival-minigame');
      if (!el) { window.location.href = 'index.html'; return; }
      if (el.style.display === 'none') { startGame(); }
      else { closeGame(); }
    });

    updateHeroCount();

    var sc = document.getElementById('stat-community');
    if (sc) sc.textContent = state.communityLevels.length;

    if (state.currentUser) {
      showNotification('Sesi\u00f3n reanudada. Bienvenido, ' + state.currentUser + '.', 'success');
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
