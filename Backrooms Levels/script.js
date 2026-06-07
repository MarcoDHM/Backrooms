/* ============================================================
   ARCHIVO BACKROOMS — LÓGICA COMPARTIDA v2.1 (API + LocalStorage)
   ============================================================ */
(function() {
  'use strict';

  // ===================== DATA =====================
  var SURVIVAL_LABELS = ['', 'Seguro', 'Bajo', 'Moderado', 'Alto', 'Extremo'];
  var SURVIVAL_COLORS = ['', '#30c460', '#88b830', '#c8a415', '#c87020', '#c43030'];

  // ===================== I18N — MULTI-LANGUAGE TRANSLATOR =====================
  var SUPPORTED_LANGS = [
    { code: 'es', name: 'Español',  short: 'ESP', flag: 'ES' },
    { code: 'en', name: 'English',  short: 'ENG', flag: 'EN' },
    { code: 'pt', name: 'Português', short: 'PT',  flag: 'PT' }
  ];

  var I18N = {
    es: {
      // Nav
      'nav.inicio':     'Inicio',
      'nav.niveles':    'Niveles',
      'nav.entidades':  'Entidades',
      'nav.crear':      'Crear Nivel',
      'nav.comunidad':  'Comunidad',
      'nav.videos':     'Vídeos',
      // Auth & header
      'auth.login':     'Iniciar Sesión',
      'auth.logout':    'Salir',
      'auth.backup':    '■ BACKUP',
      'auth.game':      '■ SUPERVIVENCIA',
      'auth.lang':      'IDIOMA',
      // Modal auth
      'auth.title.login':  'Iniciar Sesión',
      'auth.title.signup': 'Registrar Agente',
      'auth.user':         'Nombre de Agente',
      'auth.user.ph':      'Tu nombre en el archivo...',
      'auth.pass':         'Clave de Acceso',
      'auth.pass.ph':      'Contraseña...',
      'auth.submit.login': 'ACCEDER AL ARCHIVO',
      'auth.submit.signup':'REGISTRARSE',
      'auth.toggle.ask':   '¿No tienes cuenta?',
      'auth.toggle.go':    'Regístrate aquí',
      'auth.toggle.has':   '¿Ya tienes cuenta?',
      'auth.toggle.back':  'Inicia sesión',
      // Form crear-nivel
      'form.notLogged':     'Debes iniciar sesión para registrar un nuevo nivel.',
      'form.notLogged.hint':'Haz clic en Iniciar Sesión en la barra superior.',
      'form.info':          'Todos los campos son obligatorios. El nombre debe ser único en el archivo.',
      'form.name':          'Nombre del Nivel / Sitio Liminal',
      'form.name.ph':       'Ej: Nivel 11 — Las Urbanizaciones Infinitas',
      'form.desc':          'Descripción del Entorno',
      'form.desc.ph':       'Describe el espacio, la atmósfera, las sensaciones...',
      'form.anom':          'Anomalías Detectadas',
      'form.anom.ph':       'Bucles espaciales, distorsión temporal, sonidos inexplicables...',
      'form.danger':        'Nivel de Peligro',
      'form.danger.placeholder': 'Selecciona un nivel',
      'form.video':         'Enlace de Video (YouTube) si existe grabación del nivel',
      'form.video.ph':      'https://www.youtube.com/watch?v=...',
      'form.submit':        'REGISTRAR EN EL ARCHIVO',
      // Levels
      'levels.title':        'Niveles Principales',
      'levels.sub':          'Los 5 niveles fundacionales documentados por el archivo.',
      'levels.tag':          '[ REGISTRO DE NIVEL ]',
      'levels.reading':      '> LECTURA DE ANOMALÍA',
      'levels.props':        '> PROPIEDADES DEL ENTORNO',
      'levels.tech':         '> DATOS TÉCNICOS',
      'levels.conn':         '> CONEXIONES / RELACIONES',
      'levels.conn.empty':   'Sin conexiones documentadas.',
      'levels.entities':     '> ENTIDADES ENCONTRADAS',
      'levels.entities.empty': 'Sin entidades documentadas en este nivel.',
      'levels.modal.status': 'STATUS: ',
      'levels.modal.close':  'CERRAR: ESC o [X]',
      'levels.modal.footer': 'ARCHIVO BACKROOMS — ACCESO RESTRINGIDO',
      'levels.frame.cap':    'FRAME 001 — STILL CAPTURE',
      'levels.video.btn':    '▶ VER GRABACIÓN',
      'levels.video.none':   '✖ SIN VIDEO',
      'levels.vhs.play':     'PLAY',
      'levels.vhs.splp':     'SP / LP',
      'levels.vhs.ntsc':     'NTSC',
      // Survival classes
      'surv.1': 'Seguro — Habitable',
      'surv.2': 'Bajo — Precaución',
      'surv.3': 'Moderado — Peligro',
      'surv.4': 'Alto — Muy Peligroso',
      'surv.5': 'Extremo — Mortal',
      // Entities
      'entities.title':  'Entidades Catalogadas',
      'entities.sub':    'Seres y anomalías detectadas en los niveles documentados.',
      'entities.warn':   'No te acerques.',
      // Comunidad
      'community.title':    'Niveles de la Comunidad',
      'community.sub':      'Exploraciones documentadas por agentes de campo.',
      'community.empty':    'No hay niveles comunitarios registrados aún.',
      'community.empty.hint':'¿Te atreves a documentar uno?',
      // Crear nivel
      'create.title':   'Registrar Nuevo Nivel',
      'create.sub':     'Colabora con el archivo documentando tus exploraciones.',
      // Videos page
      'videos.title':     'Vídeos Desclasificados',
      'videos.sub':       'Catálogo de grabaciones recuperadas de los niveles.',
      'videos.restricted':'Material de uso restringido.',
      'videos.tape.label':'CINTA',
      'videos.tape.id':   'ID',
      'videos.tape.class':'CLASIF',
      'videos.tape.runtime':'TIEMPO',
      'videos.tape.ep':   'EP',
      'videos.card.creator':'POR',
      // Video modal
      'vm.title':          'TRANSMISIÓN EN VIVO',
      'vm.rec':            'REC',
      'vm.channel':        'CANAL',
      'vm.meta1':          '0x4F-2A1F',
      'vm.meta2':          'BACKROOMS',
      'vm.status.secure':  'STATUS: SECURE',
      'vm.info.metadata':  '> METADATOS DE LA GRABACIÓN',
      'vm.info.analysis':  '> ANÁLISIS DEL ARCHIVO',
      'vm.info.next':      '> PRÓXIMAS TRANSMISIONES',
      'vm.k.title':        'TÍTULO',
      'vm.k.author':       'AUTOR',
      'vm.k.year':         'AÑO',
      'vm.k.duration':     'DURACIÓN',
      'vm.k.resolution':   'RESOLUCIÓN',
      'vm.k.code':         'CÓDIGO DE ARCHIVO',
      'vm.k.lvl':          'NIVEL',
      'vm.k.cat':          'CATEGORÍA',
      'vm.k.danger':       'PELIGRO ESTIMADO',
      'vm.analysis.class': 'Clasificado como',
      'vm.analysis.cat':   'Categoría',
      'vm.analysis.danger':'Peligro estimado',
      'vm.bottom.bat':     'BATERÍA',
      'vm.bottom.channel': 'CANAL: 01 · AUDIO: 48kHz',
      'vm.bottom.brand':   'BLOODHOUND CCTV',
      'vm.close':          '✕ CERRAR',
      'vm.vhs.play':       'PLAY',
      'vm.vhs.vhsc':       'VHS-C',
      'vm.vhs.splp':       'SP / LP',
      'vm.vhs.ntsc':       'NTSC',
      // Hero / index
      'index.rec':          '● REC',
      'index.sanity':       '■ Cordura del Explorador',
      'index.clock':        '■ Reloj de Pared Inmutable',
      'index.hero.cmd1':    '> noclip.exe --init backrooms.db',
      'index.hero.cmd2':    '> establecer_conexion --nivel 0',
      'index.hero.out1':    '[CONEXIÓN ESTABLECIDA] Señal débil. Estabilizando...',
      'index.hero.out2':    '[NIVEL 0] "El Aula de Transición" — Moqueta húmeda, fluorescentes eternos.',
      'index.hero.count':   '[ARCHIVO] Niveles documentados: 5 principales · 0 comunitarios',
      'index.hero.cursor':  '[SISTEMA] Listo. Bienvenido, explorador.',
      'index.stats.1':      'Niveles Fundacionales',
      'index.stats.2':      'Entidades Catalogadas',
      'index.stats.3':      'Aportes de la Comunidad',
      'index.console':      '■ Consola de Logs del Sistema',
      'index.sg.title':     '■ PROTOCOLO DE EXTRACCIÓN LIMINAL v3.1',
      'index.sg.start':     '[ INICIAR PROTOCOLO ]',
      'index.sg.restart':   '[ REINICIAR ]',
      'index.sg.close':     '[ CERRAR ]',
      'index.sg.heart':     'CORAZÓN DEL ARCHIVO — MÓDULO DE SUPERVIVENCIA',
      // VHS minigame tile (home)
      'index.cdb.title':    'THE BACKROOMS',
      'index.vhs.header':   'PROTOCOLO DE EXTRACCIÓN — MINIJUEGO · NIVEL DE AMENAZA: ROJO',
      'index.vhs.headline': 'NO CLIP · HAS ENTRADO',
      'index.vhs.camera':   'CAM-07 / LIMINAL',
      'index.vhs.q1':       '"Has cruzado el umbral. Dos entidades te observan desde el pasillo. Elige con quién interactuar — o huye mientras puedas."',
      'index.vhs.q2':       'Cada decisión altera tu cordura. Sobrevive a 9 niveles. Documenta todo. No vayas solo.',
      'index.vhs.q3':       'Se han reportado incursiones en niveles secretos. Procede bajo tu propio riesgo.',
      'index.vhs.src':      '— Archivo Backrooms · Módulo de Supervivencia v3.1',
      'index.vhs.stamp':    'JUGAR',
      // Survival minigame steps
      'sg.step.system.started': 'SISTEMA INICIADO',
      // Footer
      'footer.quote': 'Este archivo no es ficción. Si estás aquí, ya has cruzado el umbral.',
      'footer.attr': '⧖ Contenido de niveles y entidades extraído de la Wiki Hispana de los Backrooms (CC-BY-SA). Imágenes y textos © sus respectivos autores.',
      // Death
      'death.title': 'CONEXIÓN CON EL SUJETO PERDIDA',
      'death.body': 'SIGNOS VITALES SENSADOS: 0%',
      'music.toggle': 'MÚSICA'
    },
    en: {
      'nav.inicio':     'Home',
      'nav.niveles':    'Levels',
      'nav.entidades':  'Entities',
      'nav.crear':      'Create Level',
      'nav.comunidad':  'Community',
      'nav.videos':     'Videos',
      'auth.login':     'Sign In',
      'auth.logout':    'Log Out',
      'auth.backup':    '■ BACKUP',
      'auth.game':      '■ SURVIVAL',
      'auth.lang':      'LANG',
      'auth.title.login':  'Sign In',
      'auth.title.signup': 'Register Agent',
      'auth.user':         'Agent Name',
      'auth.user.ph':      'Your name in the archive...',
      'auth.pass':         'Access Key',
      'auth.pass.ph':      'Password...',
      'auth.submit.login': 'ENTER THE ARCHIVE',
      'auth.submit.signup':'REGISTER',
      'auth.toggle.ask':   'No account yet?',
      'auth.toggle.go':    'Register here',
      'auth.toggle.has':   'Already have an account?',
      'auth.toggle.back':  'Sign in',
      'form.notLogged':     'You must sign in to register a new level.',
      'form.notLogged.hint':'Click Sign In in the top bar.',
      'form.info':          'All fields are required. The name must be unique in the archive.',
      'form.name':          'Level / Liminal Site Name',
      'form.name.ph':       'E.g.: Level 11 — The Infinite Suburbs',
      'form.desc':          'Environment Description',
      'form.desc.ph':       'Describe the space, the atmosphere, the sensations...',
      'form.anom':          'Detected Anomalies',
      'form.anom.ph':       'Spatial loops, time distortion, unexplained sounds...',
      'form.danger':        'Danger Level',
      'form.danger.placeholder': 'Select a level',
      'form.video':         'Video Link (YouTube) if a recording exists',
      'form.video.ph':      'https://www.youtube.com/watch?v=...',
      'form.submit':        'REGISTER IN ARCHIVE',
      'levels.title':        'Main Levels',
      'levels.sub':          'The 5 foundational levels documented by the archive.',
      'levels.tag':          '[ LEVEL RECORD ]',
      'levels.reading':      '> ANOMALY READING',
      'levels.props':        '> ENVIRONMENT PROPERTIES',
      'levels.tech':         '> TECHNICAL DATA',
      'levels.conn':         '> CONNECTIONS / RELATIONS',
      'levels.conn.empty':   'No connections documented.',
      'levels.entities':     '> ENTITIES FOUND',
      'levels.entities.empty': 'No entities documented at this level.',
      'levels.modal.status': 'STATUS: ',
      'levels.modal.close':  'CLOSE: ESC or [X]',
      'levels.modal.footer': 'BACKROOMS ARCHIVE — RESTRICTED ACCESS',
      'levels.frame.cap':    'FRAME 001 — STILL CAPTURE',
      'levels.video.btn':    '▶ WATCH RECORDING',
      'levels.video.none':   '✖ NO VIDEO',
      'levels.vhs.play':     'PLAY',
      'levels.vhs.splp':     'SP / LP',
      'levels.vhs.ntsc':     'NTSC',
      'surv.1': 'Safe — Habitable',
      'surv.2': 'Low — Caution',
      'surv.3': 'Moderate — Danger',
      'surv.4': 'High — Very Dangerous',
      'surv.5': 'Extreme — Lethal',
      'entities.title':  'Cataloged Entities',
      'entities.sub':    'Beings and anomalies detected in the documented levels.',
      'entities.warn':   'Do not approach.',
      'community.title':    'Community Levels',
      'community.sub':      'Field agent-documented explorations.',
      'community.empty':    'No community levels registered yet.',
      'community.empty.hint':'Dare to document one?',
      'create.title':   'Register New Level',
      'create.sub':     'Collaborate with the archive by documenting your explorations.',
      'videos.title':     'Declassified Videos',
      'videos.sub':       'Catalog of recovered recordings from the levels.',
      'videos.restricted':'Restricted-use material.',
      'videos.tape.label':'TAPE',
      'videos.tape.id':   'ID',
      'videos.tape.class':'CLASS',
      'videos.tape.runtime':'RUNTIME',
      'videos.tape.ep':   'EP',
      'videos.card.creator':'BY',
      'vm.title':          'LIVE TRANSMISSION',
      'vm.rec':            'REC',
      'vm.channel':        'CHANNEL',
      'vm.meta1':          '0x4F-2A1F',
      'vm.meta2':          'BACKROOMS',
      'vm.status.secure':  'STATUS: SECURE',
      'vm.info.metadata':  '> RECORDING METADATA',
      'vm.info.analysis':  '> ARCHIVE ANALYSIS',
      'vm.info.next':      '> NEXT TRANSMISSIONS',
      'vm.k.title':        'TITLE',
      'vm.k.author':       'AUTHOR',
      'vm.k.year':         'YEAR',
      'vm.k.duration':     'DURATION',
      'vm.k.resolution':   'RESOLUTION',
      'vm.k.code':         'ARCHIVE CODE',
      'vm.k.lvl':          'LEVEL',
      'vm.k.cat':          'CATEGORY',
      'vm.k.danger':       'EST. DANGER',
      'vm.analysis.class': 'Classified as',
      'vm.analysis.cat':   'Category',
      'vm.analysis.danger':'Estimated danger',
      'vm.bottom.bat':     'BATTERY',
      'vm.bottom.channel': 'CHANNEL: 01 · AUDIO: 48kHz',
      'vm.bottom.brand':   'BLOODHOUND CCTV',
      'vm.close':          '✕ CLOSE',
      'vm.vhs.play':       'PLAY',
      'vm.vhs.vhsc':       'VHS-C',
      'vm.vhs.splp':       'SP / LP',
      'vm.vhs.ntsc':       'NTSC',
      'index.rec':          '● REC',
      'index.sanity':       '■ Explorer Sanity',
      'index.clock':        '■ Immutable Wall Clock',
      'index.hero.cmd1':    '> noclip.exe --init backrooms.db',
      'index.hero.cmd2':    '> establish_connection --level 0',
      'index.hero.out1':    '[CONNECTION ESTABLISHED] Weak signal. Stabilizing...',
      'index.hero.out2':    '[LEVEL 0] "The Lobby" — Damp carpet, eternal fluorescents.',
      'index.hero.count':   '[ARCHIVE] Documented levels: 5 main · 0 community',
      'index.hero.cursor':  '[SYSTEM] Ready. Welcome, explorer.',
      'index.stats.1':      'Foundational Levels',
      'index.stats.2':      'Cataloged Entities',
      'index.stats.3':      'Community Contributions',
      'index.console':      '■ System Logs Console',
      'index.sg.title':     '■ LIMINAL EXTRACTION PROTOCOL v3.1',
      'index.sg.start':     '[ START PROTOCOL ]',
      'index.sg.restart':   '[ RESTART ]',
      'index.sg.close':     '[ CLOSE ]',
      'index.sg.heart':     'ARCHIVE HEART — SURVIVAL MODULE',
      // VHS minigame tile (home)
      'index.cdb.title':    'THE BACKROOMS',
      'index.vhs.header':   'EXTRACTION PROTOCOL — MINIGAME · THREAT LEVEL: RED',
      'index.vhs.headline': 'NO CLIP · YOU ARE IN',
      'index.vhs.camera':   'CAM-07 / LIMINAL',
      'index.vhs.q1':       '"You crossed the threshold. Two entities watch you from the hallway. Choose whom to interact with — or flee while you still can."',
      'index.vhs.q2':       'Every decision alters your sanity. Survive 9 levels. Document everything. Do not go alone.',
      'index.vhs.q3':       'Incursions into secret levels have been reported. Proceed at your own risk.',
      'index.vhs.src':      '— Backrooms Archive · Survival Module v3.1',
      'index.vhs.stamp':    'PLAY',
      'sg.step.system.started': 'SYSTEM STARTED',
      'footer.quote': 'This archive is not fiction. If you are here, you have already crossed the threshold.',
      'footer.attr': '⧖ Level and entity content extracted from the Backrooms Spanish Wiki (CC-BY-SA). Images and texts © their respective authors.',
      'death.title': 'CONNECTION WITH SUBJECT LOST',
      'death.body':  'VITAL SIGNS SENSED: 0%',
      'music.toggle': 'MUSIC'
    },
    pt: {
      'nav.inicio':     'Início',
      'nav.niveles':    'Níveis',
      'nav.entidades':  'Entidades',
      'nav.crear':      'Criar Nível',
      'nav.comunidad':  'Comunidade',
      'nav.videos':     'Vídeos',
      'auth.login':     'Entrar',
      'auth.logout':    'Sair',
      'auth.backup':    '■ BACKUP',
      'auth.game':      '■ SOBREVIVÊNCIA',
      'auth.lang':      'IDIOMA',
      'auth.title.login':  'Entrar',
      'auth.title.signup': 'Registrar Agente',
      'auth.user':         'Nome do Agente',
      'auth.user.ph':      'Seu nome no arquivo...',
      'auth.pass':         'Chave de Acesso',
      'auth.pass.ph':      'Senha...',
      'auth.submit.login': 'ACESSAR O ARQUIVO',
      'auth.submit.signup':'REGISTRAR-SE',
      'auth.toggle.ask':   'Não tem conta?',
      'auth.toggle.go':    'Registre-se aqui',
      'auth.toggle.has':   'Já tem conta?',
      'auth.toggle.back':  'Entrar',
      'form.notLogged':     'Você precisa entrar para registrar um novo nível.',
      'form.notLogged.hint':'Clique em Entrar na barra superior.',
      'form.info':          'Todos os campos são obrigatórios. O nome deve ser único no arquivo.',
      'form.name':          'Nome do Nível / Sítio Liminal',
      'form.name.ph':       'Ex: Nível 11 — Os Subúrbios Infinitos',
      'form.desc':          'Descrição do Ambiente',
      'form.desc.ph':       'Descreva o espaço, a atmosfera, as sensações...',
      'form.anom':          'Anomalias Detectadas',
      'form.anom.ph':       'Loops espaciais, distorção temporal, sons inexplicáveis...',
      'form.danger':        'Nível de Perigo',
      'form.danger.placeholder': 'Selecione um nível',
      'form.video':         'Link do Vídeo (YouTube) se existir gravação',
      'form.video.ph':      'https://www.youtube.com/watch?v=...',
      'form.submit':        'REGISTRAR NO ARQUIVO',
      'levels.title':        'Níveis Principais',
      'levels.sub':          'Os 5 níveis fundamentais documentados pelo arquivo.',
      'levels.tag':          '[ REGISTRO DE NÍVEL ]',
      'levels.reading':      '> LEITURA DE ANOMALIA',
      'levels.props':        '> PROPRIEDADES DO AMBIENTE',
      'levels.tech':         '> DADOS TÉCNICOS',
      'levels.conn':         '> CONEXÕES / RELAÇÕES',
      'levels.conn.empty':   'Sem conexões documentadas.',
      'levels.entities':     '> ENTIDADES ENCONTRADAS',
      'levels.entities.empty': 'Nenhuma entidade documentada neste nível.',
      'levels.modal.status': 'STATUS: ',
      'levels.modal.close':  'FECHAR: ESC ou [X]',
      'levels.modal.footer': 'ARQUIVO BACKROOMS — ACESSO RESTRITO',
      'levels.frame.cap':    'FRAME 001 — CAPTURA FIXA',
      'levels.video.btn':    '▶ VER GRAVAÇÃO',
      'levels.video.none':   '✖ SEM VÍDEO',
      'levels.vhs.play':     'PLAY',
      'levels.vhs.splp':     'SP / LP',
      'levels.vhs.ntsc':     'NTSC',
      'surv.1': 'Seguro — Habitável',
      'surv.2': 'Baixo — Precaução',
      'surv.3': 'Moderado — Perigo',
      'surv.4': 'Alto — Muito Perigroso',
      'surv.5': 'Extremo — Mortal',
      'entities.title':  'Entidades Catalogadas',
      'entities.sub':    'Seres e anomalias detectadas nos níveis documentados.',
      'entities.warn':   'Não se aproxime.',
      'community.title':    'Níveis da Comunidade',
      'community.sub':      'Explorações documentadas por agentes de campo.',
      'community.empty':    'Ainda não há níveis comunitários registrados.',
      'community.empty.hint':'Atreve-se a documentar um?',
      'create.title':   'Registrar Novo Nível',
      'create.sub':     'Colabore com o arquivo documentando suas explorações.',
      'videos.title':     'Vídeos Desclassificados',
      'videos.sub':       'Catálogo de gravações recuperadas dos níveis.',
      'videos.restricted':'Material de uso restrito.',
      'videos.tape.label':'FITA',
      'videos.tape.id':   'ID',
      'videos.tape.class':'CLASSE',
      'videos.tape.runtime':'DURAÇÃO',
      'videos.tape.ep':   'EP',
      'videos.card.creator':'POR',
      'vm.title':          'TRANSMISSÃO AO VIVO',
      'vm.rec':            'REC',
      'vm.channel':        'CANAL',
      'vm.meta1':          '0x4F-2A1F',
      'vm.meta2':          'BACKROOMS',
      'vm.status.secure':  'STATUS: SEGURO',
      'vm.info.metadata':  '> METADADOS DA GRAVAÇÃO',
      'vm.info.analysis':  '> ANÁLISE DO ARQUIVO',
      'vm.info.next':      '> PRÓXIMAS TRANSMISSÕES',
      'vm.k.title':        'TÍTULO',
      'vm.k.author':       'AUTOR',
      'vm.k.year':         'ANO',
      'vm.k.duration':     'DURAÇÃO',
      'vm.k.resolution':   'RESOLUÇÃO',
      'vm.k.code':         'CÓDIGO DE ARQUIVO',
      'vm.k.lvl':          'NÍVEL',
      'vm.k.cat':          'CATEGORIA',
      'vm.k.danger':       'PERIGO ESTIMADO',
      'vm.analysis.class': 'Classificado como',
      'vm.analysis.cat':   'Categoria',
      'vm.analysis.danger':'Perigo estimado',
      'vm.bottom.bat':     'BATERIA',
      'vm.bottom.channel': 'CANAL: 01 · ÁUDIO: 48kHz',
      'vm.bottom.brand':   'BLOODHOUND CCTV',
      'vm.close':          '✕ FECHAR',
      'vm.vhs.play':       'PLAY',
      'vm.vhs.vhsc':       'VHS-C',
      'vm.vhs.splp':       'SP / LP',
      'vm.vhs.ntsc':       'NTSC',
      'index.rec':          '● REC',
      'index.sanity':       '■ Sanidade do Explorador',
      'index.clock':        '■ Relógio de Parede Imutável',
      'index.hero.cmd1':    '> noclip.exe --init backrooms.db',
      'index.hero.cmd2':    '> estabelecer_conexao --nivel 0',
      'index.hero.out1':    '[CONEXÃO ESTABELECIDA] Sinal fraco. Estabilizando...',
      'index.hero.out2':    '[NÍVEL 0] "O Salão" — Carpete úmido, fluorescentes eternos.',
      'index.hero.count':   '[ARQUIVO] Níveis documentados: 5 principais · 0 comunitários',
      'index.hero.cursor':  '[SISTEMA] Pronto. Bem-vindo, explorador.',
      'index.stats.1':      'Níveis Fundacionais',
      'index.stats.2':      'Entidades Catalogadas',
      'index.stats.3':      'Contribuições da Comunidade',
      'index.console':      '■ Console de Logs do Sistema',
      'index.sg.title':     '■ PROTOCOLO DE EXTRAÇÃO LIMINAL v3.1',
      'index.sg.start':     '[ INICIAR PROTOCOLO ]',
      'index.sg.restart':   '[ REINICIAR ]',
      'index.sg.close':     '[ FECHAR ]',
      'index.sg.heart':     'CORAÇÃO DO ARQUIVO — MÓDULO DE SOBREVIVÊNCIA',
      // VHS minigame tile (home)
      'index.cdb.title':    'THE BACKROOMS',
      'index.vhs.header':   'PROTOCOLO DE EXTRAÇÃO — MINIJOGO · NÍVEL DE AMEAÇA: VERMELHO',
      'index.vhs.headline': 'NO CLIP · VOCÊ ENTROU',
      'index.vhs.camera':   'CAM-07 / LIMINAL',
      'index.vhs.q1':       '"Você cruzou o limiar. Duas entidades te observam pelo corredor. Escolha com quem interagir — ou fuja enquanto ainda pode."',
      'index.vhs.q2':       'Cada decisão altera sua sanidade. Sobreviva a 9 níveis. Documente tudo. Não vá sozinho.',
      'index.vhs.q3':       'Incursões em níveis secretos foram relatadas. Prossiga por sua conta e risco.',
      'index.vhs.src':      '— Arquivo Backrooms · Módulo de Sobrevivência v3.1',
      'index.vhs.stamp':    'JOGAR',
      'sg.step.system.started': 'SISTEMA INICIADO',
      'footer.quote': 'Este arquivo não é ficção. Se você está aqui, já cruzou o limiar.',
      'footer.attr': '⧖ Conteúdo de níveis e entidades extraído da Wiki Hispânica dos Backrooms (CC-BY-SA). Imagens e textos © seus respectivos autores.',
      'death.title': 'CONEXÃO COM O SUJEITO PERDIDA',
      'death.body':  'SINAIS VITAIS SENSORIADOS: 0%',
      'music.toggle': 'MÚSICA'
    }
  };

  var currentLang = (function() {
    try {
      var stored = localStorage.getItem('br_lang');
      if (stored && I18N[stored]) return stored;
    } catch(e) {}
    return 'es';
  })();

  function t(key) {
    return (I18N[currentLang] && I18N[currentLang][key]) || (I18N.es[key]) || key;
  }

  function applyTranslations() {
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var key = node.getAttribute('data-i18n');
      var txt = t(key);
      if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
        if (node.type !== 'submit' && node.type !== 'button') {
          node.placeholder = txt;
          continue;
        }
      }
      if (node.tagName === 'OPTION' && node.value === '') {
        node.textContent = txt;
        continue;
      }
      node.textContent = txt;
    }
    // Translate by [data-i18n-ph] for placeholders
    var phNodes = document.querySelectorAll('[data-i18n-ph]');
    for (var j = 0; j < phNodes.length; j++) {
      var n = phNodes[j];
      var k = n.getAttribute('data-i18n-ph');
      n.placeholder = t(k);
    }
    // Translate by [data-i18n-title] for title attributes
    var ttlNodes = document.querySelectorAll('[data-i18n-title]');
    for (var m = 0; m < ttlNodes.length; m++) {
      var tn = ttlNodes[m];
      var tk = tn.getAttribute('data-i18n-title');
      tn.title = t(tk);
    }
    // Translate document title
    var page = document.body.getAttribute('data-page') || '';
    var titleMap = {
      inicio:        'ARCHIVO BACKROOMS — Inicio',
      niveles:       'ARCHIVO BACKROOMS — Niveles',
      entidades:     'ARCHIVO BACKROOMS — Entidades',
      'crear-nivel': 'ARCHIVO BACKROOMS — Crear Nivel',
      comunidad:     'ARCHIVO BACKROOMS — Comunidad',
      videos:        'ARCHIVO BACKROOMS — Vídeos Desclasificados'
    };
    var titleMapEn = {
      inicio:        'BACKROOMS ARCHIVE — Home',
      niveles:       'BACKROOMS ARCHIVE — Levels',
      entidades:     'BACKROOMS ARCHIVE — Entities',
      'crear-nivel': 'BACKROOMS ARCHIVE — Create Level',
      comunidad:     'BACKROOMS ARCHIVE — Community',
      videos:        'BACKROOMS ARCHIVE — Declassified Videos'
    };
    var titleMapPt = {
      inicio:        'ARQUIVO BACKROOMS — Início',
      niveles:       'ARQUIVO BACKROOMS — Níveis',
      entidades:     'ARQUIVO BACKROOMS — Entidades',
      'crear-nivel': 'ARQUIVO BACKROOMS — Criar Nível',
      comunidad:     'ARQUIVO BACKROOMS — Comunidade',
      videos:        'ARQUIVO BACKROOMS — Vídeos Desclassificados'
    };
    var titleSet = currentLang === 'en' ? titleMapEn : currentLang === 'pt' ? titleMapPt : titleMap;
    if (titleSet[page]) document.title = titleSet[page];

    // Update HTML lang attribute
    document.documentElement.setAttribute('lang', currentLang);

    // Update language selector display
    var cur = document.querySelector('.lang-current .lang-code');
    if (cur) {
      var langObj = SUPPORTED_LANGS.filter(function(x) { return x.code === currentLang; })[0];
      cur.textContent = langObj ? langObj.short : 'ESP';
    }
    // Mark active option in dropdown
    var opts = document.querySelectorAll('.lang-option');
    for (var o = 0; o < opts.length; o++) {
      if (opts[o].getAttribute('data-lang') === currentLang) opts[o].classList.add('active');
      else opts[o].classList.remove('active');
    }
  }

  function setLanguage(code) {
    if (!I18N[code]) return;
    currentLang = code;
    try { localStorage.setItem('br_lang', code); } catch(e) {}
    applyTranslations();
    // Trigger custom event for rerender of dynamic content
    try { document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: code } })); } catch(e) {}
  }

  function initLanguageSelector() {
    var selector = document.getElementById('lang-selector');
    if (!selector) return;
    var btn = selector.querySelector('.lang-current');
    var dropdown = selector.querySelector('.lang-dropdown');
    if (btn && dropdown) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        selector.classList.toggle('open');
      });
      document.addEventListener('click', function(e) {
        if (!selector.contains(e.target)) selector.classList.remove('open');
      });
    }
    var opts = document.querySelectorAll('.lang-option');
    for (var i = 0; i < opts.length; i++) {
      (function(opt) {
        opt.addEventListener('click', function(e) {
          e.stopPropagation();
          var code = opt.getAttribute('data-lang');
          setLanguage(code);
          selector.classList.remove('open');
        });
      })(opts[i]);
    }
    applyTranslations();
  }

  var WIKI_LEVELS = [
    {
      id:'wiki-0',
      name:'Nivel 0 — El Aula de Transición',
      survival:1,
      entities:'—',
      tags:['No lineal','Estable','Húmedo'],
      visual:'lv-visual-0',
      video_url:'https://www.youtube.com/watch?v=H_kQtmVqKvA',
      image:'nivel0.jpg',
      technical: { temp:'21°C', toxic:'0.04 ppm', humidity:'78%', radiation:'0.02 µSv/h', gravity:'1.00 G', oxygen:'20.4%', habitability:'Alta' },
      connections: [
        { type:'NO-CLIP', from:'Nivel 0', to:'Nivel 1', method:'Pasillo 9, esquina noreste (moqueta desgastada)' },
        { type:'NO-CLIP', from:'Nivel 0', to:'Nivel 2', method:'Sumidero en sala trasera, requiere colisión específica' },
        { type:'SALIDA', from:'Nivel 0', to:'REAL', method:'NO-CLIP inverso en pared fluorescente' }
      ]
    },
    {
      id:'wiki-1',
      name:'Nivel 1 — Zona de Habitación',
      survival:2,
      entities:'Entity-12 "Hounds"',
      tags:['Lineal','Suministros','Templado'],
      visual:'lv-visual-1',
      video_url:null,
      image:'nivel1.jpg',
      technical: { temp:'19°C', toxic:'0.02 ppm', humidity:'52%', radiation:'0.03 µSv/h', gravity:'0.99 G', oxygen:'20.1%', habitability:'Media' },
      connections: [
        { type:'NO-CLIP', from:'Nivel 1', to:'Nivel 0', method:'Cualquier pared del pasillo principal' },
        { type:'NO-CLIP', from:'Nivel 1', to:'Nivel 4', method:'Agujero en el techo de la sala común' },
        { type:'PORTAL', from:'Nivel 1', to:'Nivel 3', method:'Cuadro eléctrico defectuoso al final del corredor' }
      ]
    },
    {
      id:'wiki-2',
      name:'Nivel 2 — Tuberías de la Desolación',
      survival:4,
      entities:'Entity-3 "Dullers", Entity-7 "Insanities"',
      tags:['Alta temp.','Estrecho','Ruidoso'],
      visual:'lv-visual-2',
      video_url:null,
      image:'nivel2.jpg',
      technical: { temp:'48°C', toxic:'3.2 ppm NH₃', humidity:'18%', radiation:'0.08 µSv/h', gravity:'1.02 G', oxygen:'17.8%', habitability:'Baja' },
      connections: [
        { type:'NO-CLIP', from:'Nivel 2', to:'Nivel 0', method:'Tubería central, segmento oxidado' },
        { type:'SALIDA', from:'Nivel 2', to:'Nivel 6', method:'Caída por conducto vertical con vapor' }
      ]
    },
    {
      id:'wiki-3',
      name:'Nivel 3 — Estación Eléctrica',
      survival:4,
      entities:'Entity-11 "Electrics"',
      tags:['Electricidad','Oscuridad','Maquinaria'],
      visual:'lv-visual-3',
      video_url:null,
      image:'nivel3.jpg',
      technical: { temp:'14°C', toxic:'0.6 ppm Ozono', humidity:'64%', radiation:'0.21 µSv/h', gravity:'1.01 G', oxygen:'20.0%', habitability:'Baja' },
      connections: [
        { type:'NO-CLIP', from:'Nivel 3', to:'Nivel 1', method:'Subestación al fondo de la sala de transformadores' },
        { type:'NO-CLIP', from:'Nivel 3', to:'Nivel 5', method:'Cable a tierra con corriente residual' }
      ]
    },
    {
      id:'wiki-4',
      name:'Nivel 4 — Oficina Abandonada',
      survival:2,
      entities:'Entity-2 "Facelings"',
      tags:['Tranquilo','Recursos','Estático'],
      visual:'lv-visual-4',
      video_url:null,
      image:'nivel4.jpg',
      technical: { temp:'22°C', toxic:'0.01 ppm', humidity:'40%', radiation:'0.05 µSv/h', gravity:'1.00 G', oxygen:'20.5%', habitability:'Alta' },
      connections: [
        { type:'NO-CLIP', from:'Nivel 4', to:'Nivel 0', method:'Despacho de la esquina, al otro lado del escritorio' },
        { type:'NO-CLIP', from:'Nivel 4', to:'Nivel 1', method:'Pasillo iluminado al final del ala oeste' }
      ]
    }
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
    var color = SURVIVAL_COLORS[l.survival] || SURVIVAL_COLORS[0];
    var nameHtml = l.name.replace(' \u2014 ', '<br>');
    var tagsHtml = (l.tags || []).join(' &middot; ');
    var videoUrl = l.video_url || '';
    var imgSrc = l.image || 'images/Niveles/level_0.jpg';
    var technicalJson = JSON.stringify(l.technical || {}).replace(/'/g, '&#39;').replace(/"/g, '&quot;');
    var connectionsJson = JSON.stringify(l.connections || []).replace(/'/g, '&#39;').replace(/"/g, '&quot;');
    var descJson = JSON.stringify(l.description || '').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
    var exitsJson = JSON.stringify(l.exits || []).replace(/'/g, '&#39;').replace(/"/g, '&quot;');
    var wikiUrl = l.wiki_url || '';
    var alias = l.alias || '';
    var survivalLabels = { 1:'SEGURO', 2:'BAJO', 3:'MODERADO', 4:'PELIGROSO', 5:'MORTAL' };
    var diffLabel = survivalLabels[l.survival] || 'CLASE ' + l.survival;
    return '<div class="level-card" data-level-id="' + l.id + '" data-level-name="' + l.name.replace(/"/g,'&quot;') + '" data-level-tags="' + tagsHtml.replace(/"/g,'&quot;') + '" data-level-video="' + videoUrl + '" data-level-survival="' + l.survival + '" data-level-color="' + color + '" data-level-image="' + imgSrc + '" data-level-technical="' + technicalJson + '" data-level-connections="' + connectionsJson + '" data-level-description="' + descJson + '" data-level-exits="' + exitsJson + '" data-level-wiki="' + wikiUrl.replace(/"/g,'&quot;') + '" data-level-alias="' + alias.replace(/"/g,'&quot;') + '" data-level-entities="' + (l.entities || 'Ninguna').replace(/"/g,'&quot;') + '">'
      + '<div class="level-visual">'
        + '<img src="' + imgSrc + '" alt="' + l.name + '" class="level-img" loading="lazy" onerror="this.src=\'images/Niveles/level_0.jpg\'">'
        + '<span class="level-badge">' + (l.tags && l.tags[0] || 'Nivel') + '</span>'
      + '</div>'
      + '<div class="level-info">'
        + '<div class="li-text">'
          + '<span class="li-name">' + nameHtml + '</span>'
          + (alias ? '<span class="li-alias">' + alias + '</span>' : '')
        + '</div>'
        + '<div class="li-difficulty" style="border-color:' + color + ';color:' + color + ';">'
          + '<span class="li-diff-num">' + (l.survival || 0) + '</span>'
          + '<span class="li-diff-label">' + diffLabel + '</span>'
        + '</div>'
      + '</div>'
    + '</div>';
  }

  // ===================== RENDER: Entities =====================
  function renderEntities(containerId) {
    var grid = document.getElementById(containerId);
    if (!grid) return;
    grid.innerHTML = ENTITIES.map(function(e) {
      var color = SURVIVAL_COLORS[e.danger] || SURVIVAL_COLORS[1];
      var label = t('surv.' + e.danger) || '';
      var imgSrc = e.image || 'images/Entidades/entidad_9_facelings.jpg';
      var desc = e.description || '';
      var wikiUrl = e.wiki_url || '';
      var shortDesc = desc.length > 80 ? desc.substring(0, 80) + '...' : desc;
      // Level badges (linked to niveles.html?openLevel=...)
      var levelsArr = Array.isArray(e.levels) ? e.levels : [];
      var levelsHtml = levelsArr.length
        ? '<div class="entity-levels">' + levelsArr.map(function(lv) {
            var lvKey = levelKeyForName(lv);
            return '<a class="entity-level-badge" href="niveles.html?openLevel=' + lvKey + '" data-lv-key="' + lvKey + '" title="Ver nivel">' + lv + '</a>';
          }).join('') + '</div>'
        : '<div class="entity-levels"><span class="entity-level-badge entity-level-badge-none">MULTI</span></div>';
      return '<div class="entity-card" data-entity-id="' + e.id + '" data-entity-name="' + (e.name || '').replace(/"/g,'&quot;') + '" data-entity-desc="' + desc.replace(/"/g,'&quot;').replace(/'/g,'&#39;') + '" data-entity-danger="' + e.danger + '" data-entity-image="' + imgSrc + '" data-entity-wiki="' + wikiUrl.replace(/"/g,'&quot;') + '">'
        + '<div class="entity-visual">'
          + '<img src="' + imgSrc + '" alt="' + (e.name || '') + '" class="entity-img" loading="lazy" onerror="this.style.display=\'none\'">'
          + '<span class="entity-badge" style="color:' + color + ';border-color:' + color + '">' + e.id + '</span>'
          + '<span class="entity-danger-overlay" style="color:' + color + '">PELIGRO ' + e.danger + '/5</span>'
        + '</div>'
        + '<div class="entity-info">'
          + '<span class="ei-name">' + (e.name || '') + '</span>'
          + '<span class="ei-tag" style="color:' + color + '">' + label + '</span>'
        + '</div>'
        + levelsHtml
      + '</div>';
    }).join('');
    bindEntityCardClicks();
    bindEntityLevelBadges();
  }

  // Build the wiki-level key for a level name extracted from an entity
  // description (e.g. "2" -> "wiki-2", "Fun" -> "wiki-corre", etc.).
  function levelKeyForName(name) {
    if (!name) return '';
    var n = String(name).trim();
    // Negative levels: -0, -1, -2, -3
    if (/^-\d+$/.test(n)) return 'wiki-neg' + n.replace('-','');
    if (/^\d+$/.test(n)) return 'wiki-' + n;
    if (/^\d+-[A-Za-z]$/.test(n)) return 'wiki-' + n.toLowerCase();
    if (/^!$/.test(n)) return 'wiki-corre';
    if (/^\?$/.test(n)) return 'wiki-corre';
    if (/^Fun$/i.test(n)) return 'wiki-corre';
    if (/^The\s*End$/i.test(n)) return 'wiki-the_end';
    if (/^The\s*Hub$/i.test(n)) return 'wiki-the_hub';
    if (/Tierra\s*Prometida/i.test(n)) return 'wiki-tierra_prometida';
    if (/L4.*S0MBR4.*GR1S/i.test(n)) return 'wiki-l4_s0mbr4_gr1s';
    return '';
  }

  // Prevent the entity-card click from firing when the user clicks a
  // level-badge (which navigates to niveles.html?openLevel=...).
  function bindEntityLevelBadges() {
    var badges = document.querySelectorAll('.entity-level-badge[data-lv-key]');
    for (var i = 0; i < badges.length; i++) {
      if (badges[i]._bound) continue;
      badges[i]._bound = true;
      badges[i].addEventListener('click', function(e) {
        e.stopPropagation();
      });
    }
  }

  function bindEntityCardClicks() {
    var cards = document.querySelectorAll('.entity-card[data-entity-id]');
    for (var i = 0; i < cards.length; i++) {
      (function(card) {
        if (card._emClickBound) return;
        card._emClickBound = true;
        card.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          if (typeof openEntityModal === 'function') {
            openEntityModal(card);
          }
        });
      })(cards[i]);
    }
  }

  // ===================== DATA: Videos =====================
  var VIDEOS = [
    {
      id: 'kp-found-footage',
      title: 'The Backrooms (Found Footage)',
      creator: 'Kane Pixels',
      youtubeId: 'H4dGpz6cnHo',
      date: '2022-01-30',
      duration: '14:23',
      resolution: '1920\u00d71080',
      code: 'BR-VID-001',
      channel: 'Kane Pixels',
      description: 'Esta grabaci\u00f3n es considerada el <strong>punto de partida oficial</strong> del fen\u00f3meno Backrooms en la red. Las im\u00e1genes muestran los pasillos caracter\u00edsticos del Nivel 0, con moqueta h\u00fameda y luces fluorescentes defectuosas. Se documenta tambi\u00e9n el <em>fen\u00f3meno de no-clip</em> que permite la entrada a este nivel desde el mundo real.',
      classification: { level: 'Nivel 0', category: '1', danger: 'BAJO' },
      next: [
        { ep: 'EP. 02', name: '"The Backrooms - Escape"' },
        { ep: 'EP. 03', name: '"The Backrooms - Partygoers"' },
        { ep: 'EP. 04', name: '"The Backrooms - Poolrooms"' }
      ]
    }
  ];

  // ===================== RENDER: Videos =====================
  function buildVideoCardHTML(v) {
    var thumb = 'https://img.youtube.com/vi/' + v.youtubeId + '/maxresdefault.jpg';
    var epNum = (v.next && v.next.length > 0)
      ? 'EP. 0' + (Math.floor(Math.random()*0)+1)
      : 'EP. 01';
    return '<div class="video-card" data-video-id="' + v.id + '">'
      + '<div class="vc-stamp vc-stamp-class">'
        +   '<span class="vc-stamp-text">' + (v.classification ? v.classification.level : 'N/A') + '</span>'
      + '</div>'
      + '<div class="vc-cover">'
        +   '<img src="' + thumb + '" alt="' + v.title + '" class="vc-thumb" loading="lazy" onerror="this.src=\'https://img.youtube.com/vi/' + v.youtubeId + '/hqdefault.jpg\';this.onerror=null;">'
        +   '<div class="vc-cover-scan"></div>'
        +   '<div class="vc-play-overlay">'
        +     '<span class="vc-play-icon">&#x25B6;</span>'
        +   '</div>'
        +   '<span class="vc-runtime">' + v.duration + '</span>'
      + '</div>'
      + '<div class="vc-label">'
        +   '<div class="vc-tape">'
        +     '<div class="vc-tape-reel vc-tape-reel-l"><span></span></div>'
        +     '<div class="vc-tape-window">'
        +       '<div class="vc-tape-line">'
        +         '<span class="vc-tape-k" data-i18n="videos.tape.label">' + t('videos.tape.label') + '</span>'
        +         '<span class="vc-tape-id">' + v.id + '</span>'
        +       '</div>'
        +       '<div class="vc-tape-title">' + v.title + '</div>'
        +       '<div class="vc-tape-line vc-tape-line-bot">'
        +         '<span class="vc-tape-meta"><span data-i18n="videos.tape.runtime">' + t('videos.tape.runtime') + '</span>: ' + v.duration + '</span>'
        +         '<span class="vc-tape-meta"><span data-i18n="videos.tape.class">' + t('videos.tape.class') + '</span>: ' + (v.classification ? v.classification.level : '—') + '</span>'
        +       '</div>'
        +     '</div>'
        +     '<div class="vc-tape-reel vc-tape-reel-r"><span></span></div>'
        +   '</div>'
        +   '<div class="vc-creator">'
        +     '<span class="vc-creator-k" data-i18n="videos.card.creator">' + t('videos.card.creator') + '</span> '
        +     '<span class="vc-creator-v">' + v.creator + '</span>'
        +     '<span class="vc-date">· ' + v.date + '</span>'
        +   '</div>'
      + '</div>'
    + '</div>';
  }

  function renderVideos(containerId) {
    var grid = document.getElementById(containerId);
    if (!grid) return;
    grid.innerHTML = VIDEOS.map(function(v) { return buildVideoCardHTML(v); }).join('');
  }

  // ===================== MODAL: Video Player =====================
  function initVideoModal() {
    var modal = document.getElementById('video-modal-overlay');
    if (!modal) return;

    var closeBtn = document.getElementById('video-modal-close');
    var iframe = document.getElementById('video-modal-iframe');
    var timestampEl = document.getElementById('vm-timestamp-modal');
    var timeEl = document.getElementById('vm-time-modal');
    var tcRAF = null;
    var timeInterval = null;
    var opening = false;

    function clearTimers() {
      if (tcRAF) { cancelAnimationFrame(tcRAF); tcRAF = null; }
      if (timeInterval) { clearInterval(timeInterval); timeInterval = null; }
    }

    function openModal(video) {
      if (opening) return;
      if (modal.classList.contains('active')) return;
      opening = true;
      clearTimers();

      var src = 'https://www.youtube.com/embed/' + video.youtubeId + '?rel=0&modestbranding=1&autoplay=1';
      if (iframe) iframe.src = src;

      modal.querySelector('.vm-modal-title').textContent = video.title;
      modal.querySelector('.vm-modal-creator').textContent = 'BY ' + video.creator.toUpperCase();
      modal.querySelector('.vm-modal-date').textContent = video.date;
      modal.querySelector('.vm-modal-duration').textContent = video.duration;
      modal.querySelector('.vm-modal-resolution').textContent = video.resolution;
      modal.querySelector('.vm-modal-code').textContent = video.code;
      modal.querySelector('.vm-modal-channel').textContent = video.channel;
      modal.querySelector('.vm-modal-desc').innerHTML = video.description;

      var lvlTag = modal.querySelector('.vm-modal-lvl');
      if (lvlTag) lvlTag.textContent = video.classification.level;
      var catTag = modal.querySelector('.vm-modal-cat');
      if (catTag) catTag.textContent = video.classification.category;
      var dangerTag = modal.querySelector('.vm-modal-danger');
      if (dangerTag) dangerTag.textContent = video.classification.danger;

      var nextContainer = modal.querySelector('.vm-modal-next');
      if (nextContainer) {
        nextContainer.innerHTML = video.next.map(function(n) {
          return '<li><span class="vm-info-k">' + n.ep + '</span><span class="vm-info-v">' + n.name + '</span></li>';
        }).join('');
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      if (timestampEl) {
        var baseT = Math.floor(Date.now() / 1000);
        function tickTC() {
          if (!modal.classList.contains('active')) return;
          var secs = Math.floor(Date.now() / 1000) - baseT;
          var hh = String(Math.floor(secs / 3600)).padStart(2, '0');
          var mm = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
          var ss = String(secs % 60).padStart(2, '0');
          var ff = String(Math.floor((Date.now() % 1000) / 41)).padStart(2, '0');
          timestampEl.textContent = 'TCR ' + hh + ':' + mm + ':' + ss + ':' + ff;
          tcRAF = requestAnimationFrame(tickTC);
        }
        tcRAF = requestAnimationFrame(tickTC);
      }

      if (timeEl) {
        var baseSec = Math.floor(Math.random() * 800) + 60;
        function tickTime() {
          if (!modal.classList.contains('active')) return;
          baseSec++;
          var hh = String(Math.floor(baseSec / 3600)).padStart(2, '0');
          var mm = String(Math.floor((baseSec % 3600) / 60)).padStart(2, '0');
          var ss = String(baseSec % 60).padStart(2, '0');
          timeEl.textContent = hh + ':' + mm + ':' + ss;
        }
        timeInterval = setInterval(tickTime, 1000);
      }

      setTimeout(function() { opening = false; }, 300);
    }

    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      clearTimers();
      if (iframe) iframe.src = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    var closeBtnSide = document.getElementById('video-modal-close-side');
    if (closeBtnSide) closeBtnSide.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
      if (e.target === modal || e.target.classList.contains('video-modal-wrap')) closeModal();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });

    var cards = document.querySelectorAll('.video-card[data-video-id]');
    for (var i = 0; i < cards.length; i++) {
      (function(card) {
        card.addEventListener('click', function() {
          var id = card.getAttribute('data-video-id');
          var video = null;
          for (var j = 0; j < VIDEOS.length; j++) {
            if (VIDEOS[j].id === id) { video = VIDEOS[j]; break; }
          }
          if (video) openModal(video);
        });
      })(cards[i]);
    }
  }

  // ===================== ENTITY MODAL =====================
  var entityModalInited = false;
  var entityLabels = {
    status: { 1:'SEGURO \u2014 INOFENSIVO', 2:'BAJO \u2014 CAUTELOSO', 3:'MODERADO \u2014 PELIGROSO', 4:'ALTO \u2014 MUY PELIGROSO', 5:'EXTREMO \u2014 MORTAL' },
    behavior: { 1:'Pasivo \u2014 No ataca a no ser que sea provocado', 2:'Pasivo \u2014 Territorial, evita confrontaci\u00f3n', 3:'Reactivo \u2014 Ataca si detecta presencia', 4:'Agresivo \u2014 Caza activamente', 5:'Letal \u2014 Caza y elimina todo a su paso' },
    classL: { 1:'CLASE I \u2014 Inofensiva', 2:'CLASE II \u2014 Baja amenaza', 3:'CLASE III \u2014 Amenaza media', 4:'CLASE IV \u2014 Alta amenaza', 5:'CLASE V \u2014 Amenaza letal' },
    speed: { 1:'NULA', 2:'BAJA', 3:'MEDIA', 4:'ALTA', 5:'EXTREMA' },
    senses: { 1:'Vis\u00f3n b\u00e1sica', 2:'Olfato / O\u00eddo', 3:'Vibraciones', 4:'Multisensorial', 5:'Omnisciente' },
    origin: { 1:'Desconocido', 2:'Humanoide mutado', 3:'Anomal\u00eda dimensional', 4:'H\u00edbrido', 5:'Origen incierto' }
  };
  function getEntityStatus(s) { return t('surv.' + s) || entityLabels.status[s] || 'NO CLASIFICADO'; }
  function pickEntityWeak(name) {
    var n = (name || '').toLowerCase();
    if (n.indexOf('part') >= 0) return 'Luz brillante';
    if (n.indexOf('skin') >= 0 || n.indexOf('piel') >= 0) return 'Exposici\u00f3n a agua';
    if (n.indexOf('hounds') >= 0 || n.indexOf('sabueso') >= 0) return 'Distracciones sonoras';
    if (n.indexOf('clumps') >= 0) return 'Velocidad de huida';
    if (n.indexOf('dullers') >= 0) return 'Silencio emocional';
    if (n.indexOf('facelings') >= 0) return 'No interactuar';
    if (n.indexOf('smilers') >= 0) return 'Luz constante';
    if (n.indexOf('insan') >= 0) return 'Distancia extrema';
    if (n.indexOf('moth') >= 0 || n.indexOf('polilla') >= 0) return 'Repelente';
    if (n.indexOf('howler') >= 0) return 'Protegerse los o\u00eddos';
    if (n.indexOf('crawler') >= 0) return 'Iluminar zonas altas';
    if (n.indexOf('lighter') >= 0) return 'Inofensiva';
    if (n.indexOf('sombra') >= 0) return 'Luz directa';
    if (n.indexOf('maniqu') >= 0) return 'Observaci\u00f3n directa';
    if (n.indexOf('fantasma') >= 0) return 'No mirarlos';
    if (n.indexOf('clicker') >= 0) return 'Aislar el sonido';
    if (n.indexOf('frowners') >= 0) return 'Evitarlos';
    if (n.indexOf('ventana') >= 0) return 'No mirar adentro';
    return 'Ver documentaci\u00f3n wiki';
  }

  function getEntitySurvivalHint(name, danger) {
    var n = (name || '').toLowerCase();
    if (n.indexOf('maniqu') >= 0) return 'No soportan movimiento. No le hagas caso.';
    if (n.indexOf('ventana') >= 0) return 'Miran de vuelta. Obedece su advertencia.';
    if (n.indexOf('smiler') >= 0 || n.indexOf('sonrisa') >= 0) return 'Te quiere a oscuras. No le obedezcas. Mant\u00e9n la luz.';
    if (n.indexOf('partygoer') >= 0) return 'Su fiesta es una trampa. No le obedezcas.';
    if (n.indexOf('faceling') >= 0) return 'Te imita si lo miras. Obedece su advertencia, no mires.';
    if (n.indexOf('lighter') >= 0) return 'Entidad benigna. Obed\u00e9cela, te guiar\u00e1.';
    if (n.indexOf('piel') >= 0 || n.indexOf('ladrone') >= 0) return 'Quiere tu piel. No le obedezcas.';
    if (n.indexOf('sabueso') >= 0 || n.indexOf('hound') >= 0) return 'Quiere que huyas para cazarte. No le obedezcas.';
    if (n.indexOf('duller') >= 0) return 'Se alimenta de tu mirada. No le obedezcas.';
    if (n.indexOf('insano') >= 0) return 'Quiere que te acerques. No le obedezcas.';
    if (n.indexOf('crawler') >= 0) return 'Quiere que mires arriba. No le obedezcas.';
    if (n.indexOf('howler') >= 0) return 'Quiere que grites. No le obedezcas.';
    if (n.indexOf('polilla') >= 0 || n.indexOf('death') >= 0) return 'Te avisa del peligro. Obedece su advertencia.';
    if (n.indexOf('clump') >= 0) return 'Quiere que te acerques. No le obedezcas.';
    if (n.indexOf('fantasma') >= 0) return 'No agresivos. Obed\u00e9celos y vete.';
    if (n.indexOf('partypooper') >= 0) return 'Pac\u00edficos. Obed\u00e9celos.';
    if (n.indexOf('clicker') >= 0) return 'Quiere que hables. No le obedezcas.';
    if (n.indexOf('sombra') >= 0) return 'Absorben energ\u00eda. Obedece su orden.';
    if (n.indexOf('frowner') >= 0) return 'Quiere que sonr\u00edas. No le obedezcas.';
    if (n.indexOf('bacteria') >= 0) return 'Quiere que respires profundo. No le obedezcas.';
    if (n.indexOf('neutrino') >= 0) return 'Quiere que te quedes. No le obedezcas.';
    if (n.indexOf('cazador') >= 0) return 'Quiere que te escondas. Obed\u00e9celo.';
    if (n.indexOf('aetinerrabu') >= 0) return 'Entidad antigua y poderosa. Obed\u00e9cela.';
    if (danger >= 5) return 'MORTAL. No le obedezcas bajo ning\u00fan concepto.';
    if (danger >= 4) return 'Extremadamente peligrosa. No le obedezcas.';
    if (danger >= 3) return 'Peligrosa. Posiblemente miente. No le obedezcas.';
    if (danger >= 2) return 'Poco peligrosa. Obedecer puede ser seguro.';
    return 'Entidad benigna. Obed\u00e9cela sin miedo.';
  }

  function getEntityCommand(name) {
    var n = (name || '').toLowerCase();
    if (n.indexOf('ventana') >= 0) return 'No mires.';
    if (n.indexOf('smiler') >= 0 || n.indexOf('sonrisa') >= 0) return 'Apaga la linterna.';
    if (n.indexOf('partygoer') >= 0) return '\u00danete a la fiesta.';
    if (n.indexOf('faceling') >= 0) return 'No mires.';
    if (n.indexOf('lighter') >= 0) return 'S\u00edgueme.';
    if (n.indexOf('piel') >= 0 || n.indexOf('ladrone') >= 0) return 'Ponte esta piel.';
    if (n.indexOf('sabueso') >= 0 || n.indexOf('hound') >= 0) return 'Corre.';
    if (n.indexOf('duller') >= 0) return 'M\u00edrame a los ojos.';
    if (n.indexOf('insano') >= 0) return 'Ac\u00e9rcate.';
    if (n.indexOf('crawler') >= 0) return 'Mira arriba.';
    if (n.indexOf('howler') >= 0) return 'Grita.';
    if (n.indexOf('polilla') >= 0 || n.indexOf('moth') >= 0) return 'Apaga la luz.';
    if (n.indexOf('clump') >= 0) return 'Ven aqu\u00ed.';
    if (n.indexOf('fantasma') >= 0) return 'Vete.';
    if (n.indexOf('partypooper') >= 0) return 'Al\u00e9grate.';
    if (n.indexOf('clicker') >= 0) return 'Habla.';
    if (n.indexOf('maniqu') >= 0) return 'No parpadees.';
    if (n.indexOf('sombra') >= 0) return 'Enciende la luz.';
    if (n.indexOf('frowner') >= 0) return 'Sonr\u00ede.';
    if (n.indexOf('bacteria') >= 0) return 'Respira profundo.';
    if (n.indexOf('neutrino') >= 0) return 'Qu\u00e9date.';
    if (n.indexOf('cazador') >= 0) return 'Esc\u00f3ndete.';
    if (n.indexOf('aetinerrabu') >= 0) return 'R\u00edndete.';
    return '';
  }

  function openEntityModal(card) {
    var overlay = document.getElementById('entity-modal-overlay');
    var modal = document.getElementById('entity-modal');
    if (!overlay || !modal || !card) return;
    if (overlay.classList.contains('active')) return;

    var name = card.getAttribute('data-entity-name') || '';
    var desc = card.getAttribute('data-entity-desc') || '';
    var danger = parseInt(card.getAttribute('data-entity-danger')) || 1;
    var imgSrc = card.getAttribute('data-entity-image') || '';
    var wikiUrl = card.getAttribute('data-entity-wiki') || '';
    var entIdAttr = card.getAttribute('data-entity-id') || '';

    var statusText = getEntityStatus(danger);
    var color = SURVIVAL_COLORS[danger] || SURVIVAL_COLORS[1];
    var nameParts = name.split(' \u2014 ');
    var mainTitle = nameParts[0] || name;
    var subtitle = nameParts[1] || '';

    function setText(id, val) { var el = document.getElementById(id); if (el) el.textContent = val; }
    function setColor(id, c) { var el = document.getElementById(id); if (el) el.style.color = c; }

    setText('entity-modal-title', subtitle || mainTitle);
    setText('entity-modal-id', mainTitle);
    var stEl = document.getElementById('entity-modal-status');
    if (stEl) { stEl.textContent = t('levels.modal.status') + statusText; stEl.style.color = color; }
    setText('em-diff-num', danger); setColor('em-diff-num', color);
    setText('em-diff-label', statusText.split(' \u2014 ')[0]); setColor('em-diff-label', color);
    var diffBox = document.getElementById('entity-modal-difficulty');
    if (diffBox) { diffBox.style.borderColor = color; diffBox.style.boxShadow = '0 0 12px ' + color + '33'; }

    var img = document.getElementById('em-modal-image');
    if (img) {
      if (imgSrc) { img.src = imgSrc; img.alt = name; img.style.display = ''; }
      else { img.src = ''; img.style.display = 'none'; }
    }
    var posterFrame = document.querySelector('.em-poster-frame');
    if (posterFrame) {
      posterFrame.style.display = imgSrc ? '' : 'none';
    }
    setText('em-class', entityLabels.classL[danger] || ('CLASE ' + danger));
    setText('em-behavior', entityLabels.behavior[danger] || 'Comportamiento desconocido.');
    // Levels: look up by id in ENTITIES / WIKI_ENTITIES_WIKI
    var levelsEl = document.getElementById('em-levels');
    if (levelsEl) {
      var entRec = null;
      try { entRec = (ENTITIES || []).filter(function(en){ return en && en.id === entIdAttr; })[0] || null; } catch (e1) {}
      if (!entRec && typeof WIKI_ENTITIES_WIKI !== 'undefined') {
        try { entRec = WIKI_ENTITIES_WIKI.filter(function(en){ return en && en.id === entIdAttr; })[0] || null; } catch (e2) {}
      }
      var lvArr = (entRec && Array.isArray(entRec.levels)) ? entRec.levels : [];
      if (lvArr.length) {
        levelsEl.innerHTML = lvArr.map(function(lv){
          var k = levelKeyForName(lv);
          if (k) {
            return '<a class="em-level-link" href="niveles.html?openLevel=' + k + '" title="Abrir nivel">' + lv + ' \u25B6</a>';
          }
          return '<span class="em-level-link em-level-link-plain">' + lv + '</span>';
        }).join(' ');
      } else {
        levelsEl.textContent = 'M\u00faltiples niveles \u2014 Ver wiki para detalles.';
      }
    }
    setText('em-threat', statusText); setColor('em-threat', color);
    setText('em-desc-text', desc || 'Sin descripci\u00f3n disponible en la wiki.');
    setText('em-survival-hint', getEntitySurvivalHint(name, danger));

    var wLink = document.getElementById('em-wiki-link');
    if (wLink) { if (wikiUrl) { wLink.href = wikiUrl; wLink.style.display = 'inline'; } else { wLink.style.display = 'none'; } }

    setText('em-t-class', danger + '/5');
    setText('em-t-danger', statusText.split(' \u2014 ')[0]);
    setText('em-t-speed', entityLabels.speed[danger] || 'NULA');
    setText('em-t-senses', entityLabels.senses[danger] || 'Visi\u00f3n');
    setText('em-t-weak', pickEntityWeak(subtitle || mainTitle));
    setText('em-t-origin', entityLabels.origin[danger] || 'Desconocido');
    setText('em-t-status', 'ACTIVA'); setColor('em-t-status', '#30c460');

    var border = document.getElementById('entity-modal-border');
    if (border) { border.style.borderColor = color; border.style.boxShadow = '0 0 30px ' + color + ', inset 0 0 30px ' + color; }

    overlay.classList.add('active');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeEntityModal() {
    var overlay = document.getElementById('entity-modal-overlay');
    var modal = document.getElementById('entity-modal');
    if (overlay) overlay.classList.remove('active');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function initEntityModal() {
    if (entityModalInited) return;
    var overlay = document.getElementById('entity-modal-overlay');
    if (!overlay) return;
    entityModalInited = true;

    var statusLabels = { 1:'SEGURO \u2014 INOFENSIVO', 2:'BAJO \u2014 CAUTELOSO', 3:'MODERADO \u2014 PELIGROSO', 4:'ALTO \u2014 MUY PELIGROSO', 5:'EXTREMO \u2014 MORTAL' };
    var behaviorLabels = { 1:'Pasivo \u2014 No ataca a no ser que sea provocado', 2:'Pasivo \u2014 Territorial, evita confrontaci\u00f3n', 3:'Reactivo \u2014 Ataca si detecta presencia', 4:'Agresivo \u2014 Caza activamente', 5:'Letal \u2014 Caza y elimina todo a su paso' };
    var classLabels = { 1:'CLASE I \u2014 Inofensiva', 2:'CLASE II \u2014 Baja amenaza', 3:'CLASE III \u2014 Amenaza media', 4:'CLASE IV \u2014 Alta amenaza', 5:'CLASE V \u2014 Amenaza letal' };
    var speedLabels = { 1:'NULA', 2:'BAJA', 3:'MEDIA', 4:'ALTA', 5:'EXTREMA' };
    var sensesLabels = { 1:'Vis\u00f3on b\u00e1sica', 2:'Olfato / O\u00eddo', 3:'Vibraciones', 4:'Multisensorial', 5:'Omnisciente' };
    var originLabels = { 1:'Desconocido', 2:'Humanoide mutado', 3:'Anomal\u00eda dimensional', 4:'H\u00edbrido', 5:'Origen incierto' };
    function getStatusLabel(s) { return t('surv.' + s) || statusLabels[s] || 'NO CLASIFICADO'; }
    function pickWeakness(name) {
      var n = (name || '').toLowerCase();
      if (n.indexOf('part') >= 0 || n.indexOf('party') >= 0) return 'Luz brillante';
      if (n.indexOf('skin') >= 0 || n.indexOf('piel') >= 0) return 'Exposici\u00f3n a agua';
      if (n.indexOf('hounds') >= 0 || n.indexOf('sabueso') >= 0) return 'Distracciones sonoras';
      if (n.indexOf('clumps') >= 0) return 'Velocidad de huida';
      if (n.indexOf('dullers') >= 0) return 'Silencio emocional';
      if (n.indexOf('facelings') >= 0) return 'No interactuar';
      if (n.indexOf('smilers') >= 0) return 'Luz constante';
      if (n.indexOf('insan') >= 0) return 'Distancia extrema';
      if (n.indexOf('moth') >= 0 || n.indexOf('polilla') >= 0) return 'Repelente';
      if (n.indexOf('howler') >= 0) return 'Protegi\u00e9ndose los o\u00eddos';
      if (n.indexOf('crawler') >= 0) return 'Iluminar zonas altas';
      if (n.indexOf('lighter') >= 0) return 'Inofensiva';
      if (n.indexOf('sombra') >= 0 || n.indexOf('shadow') >= 0) return 'Luz directa';
      if (n.indexOf('maniqu') >= 0 || n.indexOf('mannequin') >= 0) return 'Observaci\u00f3n directa';
      if (n.indexOf('fantasma') >= 0 || n.indexOf('ghost') >= 0) return 'No mirarlos';
      if (n.indexOf('clicker') >= 0) return 'Aislar el sonido';
      if (n.indexOf('frowners') >= 0) return 'Evitarlos';
      if (n.indexOf('ventana') >= 0 || n.indexOf('window') >= 0) return 'No mirar adentro';
      return 'Ver documentaci\u00f3n wiki';
    }

    function openEntityModal(card) {
      if (overlay.classList.contains('active')) return;
      var name = card.getAttribute('data-entity-name') || '';
      var desc = card.getAttribute('data-entity-desc') || '';
      var danger = parseInt(card.getAttribute('data-entity-danger')) || 1;
      var imgSrc = card.getAttribute('data-entity-image') || '';
      var wikiUrl = card.getAttribute('data-entity-wiki') || '';
      var entIdAttr = card.getAttribute('data-entity-id') || '';

      var statusText = getStatusLabel(danger);
      var color = SURVIVAL_COLORS[danger] || SURVIVAL_COLORS[1];

      var nameParts = name.split(' \u2014 ');
      var mainTitle = nameParts[0] || name;
      var subtitle = nameParts[1] || '';

      var titleEl = document.getElementById('entity-modal-title');
      if (titleEl) titleEl.textContent = subtitle || mainTitle;
      var idEl = document.getElementById('entity-modal-id');
      if (idEl) idEl.textContent = mainTitle;

      var statusEl = document.getElementById('entity-modal-status');
      if (statusEl) { statusEl.textContent = t('levels.modal.status') + statusText; statusEl.style.color = color; }

      var diffNum = document.getElementById('em-diff-num');
      var diffLabel = document.getElementById('em-diff-label');
      var diffBox = document.getElementById('entity-modal-difficulty');
      if (diffNum) { diffNum.textContent = danger; diffNum.style.color = color; }
      if (diffLabel) { diffLabel.textContent = statusText.split(' \u2014 ')[0]; diffLabel.style.color = color; }
      if (diffBox) { diffBox.style.borderColor = color; diffBox.style.boxShadow = '0 0 12px ' + color + '33'; }

      var modalImg = document.getElementById('em-modal-image');
      if (modalImg) {
        if (imgSrc) { modalImg.src = imgSrc; modalImg.alt = name; modalImg.style.display = ''; }
        else { modalImg.src = ''; modalImg.style.display = 'none'; }
      }
      var posterFrame = document.querySelector('.em-poster-frame');
      if (posterFrame) posterFrame.style.display = imgSrc ? '' : 'none';

      var classEl = document.getElementById('em-class');
      if (classEl) classEl.textContent = classLabels[danger] || ('CLASE ' + danger);

      var behaviorEl = document.getElementById('em-behavior');
      if (behaviorEl) behaviorEl.textContent = behaviorLabels[danger] || 'Comportamiento desconocido.';

      var levelsEl = document.getElementById('em-levels');
      if (levelsEl) {
        var entRec = null;
        try { entRec = (ENTITIES || []).filter(function(en){ return en && en.id === entIdAttr; })[0] || null; } catch (e2) {}
        if (!entRec && typeof WIKI_ENTITIES_WIKI !== 'undefined') {
          try { entRec = WIKI_ENTITIES_WIKI.filter(function(en){ return en && en.id === entIdAttr; })[0] || null; } catch (e3) {}
        }
        var lvArr = (entRec && Array.isArray(entRec.levels)) ? entRec.levels : [];
        if (lvArr.length) {
          levelsEl.innerHTML = lvArr.map(function(lv){
            var k = levelKeyForName(lv);
            if (k) {
              return '<a class="em-level-link" href="niveles.html?openLevel=' + k + '" title="Abrir nivel">' + lv + ' \u25B6</a>';
            }
            return '<span class="em-level-link em-level-link-plain">' + lv + '</span>';
          }).join(' ');
        } else {
          levelsEl.textContent = 'M\u00faltiples niveles \u2014 Ver wiki para detalles.';
        }
      }

      var threatEl = document.getElementById('em-threat');
      if (threatEl) { threatEl.textContent = statusText; threatEl.style.color = color; }

      var descEl = document.getElementById('em-desc-text');
      if (descEl) descEl.textContent = desc || 'Sin descripci\u00f3n disponible en la wiki.';
      var hintEl = document.getElementById('em-survival-hint');
      if (hintEl) hintEl.textContent = getEntitySurvivalHint(name, danger);

      var wikiLink = document.getElementById('em-wiki-link');
      if (wikiLink) {
        if (wikiUrl) { wikiLink.href = wikiUrl; wikiLink.style.display = 'inline'; }
        else { wikiLink.style.display = 'none'; }
      }

      var tClass = document.getElementById('em-t-class');
      if (tClass) tClass.textContent = danger + '/5';
      var tDanger = document.getElementById('em-t-danger');
      if (tDanger) tDanger.textContent = statusText.split(' \u2014 ')[0];
      var tSpeed = document.getElementById('em-t-speed');
      if (tSpeed) tSpeed.textContent = speedLabels[danger] || 'NULA';
      var tSenses = document.getElementById('em-t-senses');
      if (tSenses) tSenses.textContent = sensesLabels[danger] || 'Vis\u00f3n';
      var tWeak = document.getElementById('em-t-weak');
      if (tWeak) tWeak.textContent = pickWeakness(subtitle || mainTitle);
      var tOrigin = document.getElementById('em-t-origin');
      if (tOrigin) tOrigin.textContent = originLabels[danger] || 'Desconocido';
      var tStatus = document.getElementById('em-t-status');
      if (tStatus) { tStatus.textContent = 'ACTIVA'; tStatus.style.color = '#30c460'; }

      var border = document.getElementById('entity-modal-border');
      if (border) { border.style.borderColor = color; border.style.boxShadow = '0 0 30px ' + color + ', inset 0 0 30px ' + color; }

      overlay.classList.add('active');
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    var closeBtn = document.getElementById('entity-modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeEntityModal);
    overlay.addEventListener('click', function(e) { if (e.target === overlay) closeEntityModal(); });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && overlay.classList.contains('active')) closeEntityModal(); });
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
      var label = t('surv.' + (l.danger || 1));
      var videoBtn = l.video_url ? '<div class="c-actions"><a href="' + l.video_url + '" target="_blank" class="btn-video-link" data-i18n="levels.video.btn">VER GRABACI\u00d3N</a></div>' : '';
      return '<div class="community-card">'
        + '<div class="c-meta">' + (l.date || '') + ' \u2014 por ' + l.author + '</div>'
        + '<div class="c-name">' + l.name + '</div>'
        + '<div class="c-desc">' + l.desc + '</div>'
        + '<div class="c-anomalies"><strong>> ' + (l.anomalies_label || t('form.anom')) + ':</strong> ' + l.anomalies + '</div>'
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

   // Outcomes narrativos fijos por entidad. NO usan RNG: cada nivel elige
   // uno de los outcomes disponibles en orden (rotaci\u00f3n determin\u00edstica).
   // Formato: { obey: [outcomes], disobey: [outcomes] }.
   //   outcome = { txt:'...', fate:'advance'|'death' }
   //   - 'advance' = pasa al siguiente nivel
   //   - 'death'   = muestra la pantalla de muerte
   //   - Tambi\u00e9n puede incluir 'levelIdx' para saltar a un nivel espec\u00edfico.
   var ENTITY_OUTCOMES = {
      'smilers': {
        obey: [
          { fate:'death',   txt:'Apagas la linterna como te ordena. En la oscuridad, una sonrisa aparece justo frente a tu cara. El flash blanco de tu c\u00e1mara te delata. Los flashes se multiplican.' },
          { fate:'advance', txt:'Ignoras la luz que parpadea al fondo del pasillo. Smilers no te detecta. Cruzas la siguiente puerta sin mirar atr\u00e1s.' },
          { fate:'advance', txt:'Cierras los ojos y dejas que el sonido te gu\u00ede. Terminas en el Nivel 1 \u2014 el pasillo de servicio. Sigues avanzando.' }
        ],
        disobey: [
          { fate:'advance', txt:'Sales corriendo en direcci\u00f3n opuesta. La entidad te persigue un tramo, pero te internas en un conducto donde no cabe. Escuchas su risa a lo lejos, amortiguada.' },
          { fate:'death',   txt:'Decides no hacerle caso a la sonrisa. La observas de frente. La sonrisa se ensancha. Tu c\u00e1mara se apaga sola. El \u00faltimo frame muestra 47 sonrisas rode\u00e1ndote.' },
          { fate:'death',   txt:'Iluminas a la entidad con tu linterna. Pensabas que la luz la ahuyentar\u00eda. Sonr\u00ede m\u00e1s. Tus o\u00eddos empiezan a zumbar.' }
        ]
      },
      'hounds': {
        obey: [
          { fate:'death',   txt:'Sales corriendo porque te lo orden\u00f3. Hounds detecta el movimiento y a\u00falla. Lo \u00faltico que escuchas antes del final son tus propios pasos.' },
          { fate:'advance', txt:'Te quedas quieto cuando el hocico pasa junto a tu cuello. El aliento es fr\u00edo. Los pasos se alejan. Hounds no te detect\u00f3.' },
          { fate:'death',   txt:'Encuentras un hueco para esconderte. Hounds no cabe, pero hay otra cosa dentro que lleva mucho tiempo esperando.' }
        ],
        disobey: [
          { fate:'advance', txt:'No corres. Hounds pasa a tu lado sin detectarte. Sigues caminando en silencio.' },
          { fate:'death',   txt:'Sales corriendo. Hounds ya te vio. Las garras encuentran tu espalda antes de llegar al final del pasillo.' },
          { fate:'advance', txt:'Hounds te persigue, pero conoces un atajo por las tuber\u00edas. El aullido se pierde detr\u00e1s del conducto.' }
        ]
      },
      'skin stealers': {
        obey: [
          { fate:'death',   txt:'Te pones la piel que encontraste colgada, como te orden\u00f3. Es perfecta. Demasiado perfecta. Ya no puedes quit\u00e1rtela.' },
          { fate:'advance', txt:'No miras la piel colgada en las paredes. Sigues tu camino. Cuando sales, los maniqu\u00edes siguen en su sitio. Quietos.' },
          { fate:'death',   txt:'Estiras la piel de la pared. Est\u00e1 caliente. Cuando te das cuenta, la pared ya tiene tu forma exacta. Vac\u00eda.' }
        ],
        disobey: [
          { fate:'advance', txt:'Ignoras su orden. Los Skin Stealers se confunden. Te dejan ir sin problemas.' },
          { fate:'death',   txt:'Aceptas la advertencia silenciosa: la entidad no quiere que la veas. Mantienes la mirada baja. Demasiado tarde. La pared tiene tu forma.' },
          { fate:'advance', txt:'Sales caminando como si nada. Los Skin Stealers ni te registran.' }
        ]
      },
      'facelings': {
        obey: [
          { fate:'advance', txt:'Apartas la mirada. Facelings no puede copiar lo que no ve. Sigues tu camino sin incidentes.' },
          { fate:'death',   txt:'Apartas la mirada, pero Facelings se ha adherido a tu espalda. Cuando finalmente lo notas, ya tiene tu forma exacta.' },
          { fate:'advance', txt:'Cierras los ojos y avanzas. La imitaci\u00f3n se detiene. Pierde inter\u00e9s cuando no hay nada que copiar.' }
        ],
        disobey: [
          { fate:'death',   txt:'Miras directamente a la pared. Facelings sonr\u00ede. Tu cara cambia. Ya no eres t\u00fa.' },
          { fate:'advance', txt:'Observas a Facelings con curiosidad cient\u00edfica. Se confunde. Cree que t\u00fa eres el original. Te deja.' },
          { fate:'death',   txt:'Intentas hablar con la cara de la pared. Te responde con tu propia voz. Te acercas. Tu reflejo camina hacia ti.' }
        ]
      },
      'partygoers': {
        obey: [
          { fate:'death',   txt:'Aceptas la fiesta. Una m\u00e1scara se ajusta a tu cara. Ya no recuerdas tu nombre, pero todos te llaman por uno nuevo.' },
          { fate:'advance', txt:'Aceptas la fiesta desde la distancia, sin unirte. Los Partygoers te confunden con un mueble m\u00e1s. Sigues caminando.' },
          { fate:'death',   txt:'Los m\u00fasicos te invitan a bailar. Es el \u00faltico baile que tendr\u00e1s en tu vida. La m\u00fasica no se detiene nunca.' }
        ],
        disobey: [
          { fate:'advance', txt:'Rechazas la invitaci\u00f3n. Los Partygoers se ofenden, pero contin\u00faan su ruta. Sales por una ventana lateral.' },
          { fate:'death',   txt:'Cierras la puerta de la fiesta. Los m\u00fasicos dejan de tocar uno a uno. Cuando se hace el silencio, la puerta ya no existe detr\u00e1s de ti.' },
          { fate:'advance', txt:'Ignoras la m\u00fasica. Sigues el camino contrario. Los Partygoers no pueden salir del sal\u00f3n. Est\u00e1s a salvo, por ahora.' }
        ]
      },
      'death moths': {
        obey: [
          { fate:'advance', txt:'Apagas la luz como advierten. Las polillas no tienen referencia. Pasan de largo sin detectarte.' },
          { fate:'death',   txt:'Te quedas quieto, pero una polilla se posa en tu mano. No la ahuyentas. Despiertan a las dem\u00e1s.' },
          { fate:'advance', txt:'Sigues la corriente de aire contrario. Las polillas no pueden seguirte. Encuentras una salida lateral.' }
        ],
        disobey: [
          { fate:'death',   txt:'Enciendes la linterna. Las polillas se sienten atra\u00eddas. Un enjambre te cubre por completo.' },
          { fate:'advance', txt:'Intentas espantarlas con las manos. Milagrosamente, se alejan hacia la luz de otra habitaci\u00f3n.' },
          { fate:'death',   txt:'Corres hacia el ruido. Las polillas te siguen. El fuego de la siguiente sala no es suficiente.' }
        ]
      },
      'cameras': {
        obey: [
          { fate:'death',   txt:'Miras al lente como te ordena. El flash es instant\u00e1neo. Tu imagen queda atrapada. Tu cuerpo se desvanece.' },
          { fate:'advance', txt:'No miras directamente a la lente. Pasas desapercibido. Las C\u00e1maras registran un pasillo vac\u00edo.' },
          { fate:'advance', txt:'Cubres tu cara con la manga. La C\u00e1mara pierde tu rastro. Sigues avanzando.' }
        ],
        disobey: [
          { fate:'advance', txt:'Rompes la c\u00e1mara con un extintor. El sistema pierde tu posici\u00f3n. Tienes unos minutos antes de que env\u00eden otras.' },
          { fate:'death',   txt:'Saludas a la c\u00e1mara. El flash es instant\u00e1neo. El siguiente nivel ya tiene tu foto pegada en todas las paredes.' },
          { fate:'death',   txt:'Le sacas una foto a la c\u00e1mara. Te devuelve la foto. En la imagen, t\u00fa no est\u00e1s sonriendo.' }
        ]
      },
      'bacteria': {
        obey: [
          { fate:'death',   txt:'Respiras profundo como te ordena. El aire sabe dulce. La Bacteria ya ha colonizado tus alv\u00e9olos.' },
          { fate:'advance', txt:'Te tapas la nariz y la boca. Sales del \u00e1rea antes de que el hongo eche ra\u00edces en tus pulmones.' },
          { fate:'advance', txt:'Cubres los filtros de tu m\u00e1scara. La Bacteria no puede instalarse. Respiras tranquilo.' }
        ],
        disobey: [
          { fate:'advance', txt:'Contienes la respiraci\u00f3n. La Bacteria no encuentra entrada. Cruzas la zona contaminada a salvo.' },
          { fate:'death',   txt:'Quitas la m\u00e1scara. La Bacteria te estaba esperando. Crece en tu garganta. En tus ojos. En todo.' },
          { fate:'death',   txt:'Sales corriendo sin protecci\u00f3n. La colonia estaba en el lado opuesto del conducto. Llega a tus pulmones.' }
        ]
      },
      'dullers': {
        obey: [
          { fate:'death',   txt:'Lo miras a los ojos como exige. Duller sonr\u00ede. Tu cuerpo no responde. Te arrastra a la oscuridad.' },
          { fate:'advance', txt:'No estableces contacto visual. Duller sigue su patr\u00f3n habitual sin notarte.' },
          { fate:'advance', txt:'Te escondes detr\u00e1s de una columna. Duller pasa a tu lado. No te ha olido. Sigues adelante.' }
        ],
        disobey: [
          { fate:'advance', txt:'Desv\u00edas la mirada. Duller se confunde. Las Dullers no entienden por qu\u00e9 no las miras. Pasan de largo.' },
          { fate:'death',   txt:'Le gritas a Duller. Acelera. Su grito perfora tus o\u00eddos.' },
          { fate:'death',   txt:'Le haces un gesto obsceno. Duller se enfurece. No te da tiempo a reaccionar.' }
        ]
      },
     'generic': {
       obey: [
         { fate:'advance', txt:'Haces lo que la entidad sugiere. El camino se despeja. Encuentras una salida lateral.' },
         { fate:'death',   txt:'La entidad te gui\u00f3 directo a una trampa. Los sensores registran tu \u00faltima se\u00f1al de calor.' },
         { fate:'advance', txt:'Sigues sus indicaciones al pie de la letra. El siguiente nivel se abre frente a ti.' }
       ],
       disobey: [
         { fate:'death',   txt:'Ignoras la advertencia. La entidad te encuentra. Tu cuerpo aparece en un pasillo tres niveles m\u00e1s abajo.' },
         { fate:'advance', txt:'Haces caso omiso. La entidad no puede seguirte hasta el siguiente corredor. Est\u00e1s a salvo por ahora.' },
         { fate:'death',   txt:'Vas por tu cuenta. La entidad no estaba mintiendo. El conducto lleva a una trampa que lleva a otra trampa.' }
       ]
     }
   };

   // Mapeo nombre-llave de outcomes. Si la entidad no tiene key, usa 'generic'.
   function outcomeKeyForEntity(name) {
     if (!name) return 'generic';
     var n = name.toLowerCase();
     if (n.indexOf('smiler') >= 0) return 'smilers';
     if (n.indexOf('hound') >= 0) return 'hounds';
     if (n.indexOf('skin') >= 0 || n.indexOf('stealer') >= 0) return 'skin stealers';
     if (n.indexOf('face') >= 0 || n.indexOf('faceling') >= 0) return 'facelings';
     if (n.indexOf('party') >= 0 || n.indexOf('fiesta') >= 0) return 'partygoers';
     if (n.indexOf('moth') >= 0 || n.indexOf('polilla') >= 0) return 'death moths';
     if (n.indexOf('c\u00e1mara') >= 0 || n.indexOf('camera') >= 0) return 'cameras';
     if (n.indexOf('bacteria') >= 0 || n.indexOf('hongo') >= 0) return 'bacteria';
     if (n.indexOf('duller') >= 0) return 'dullers';
     return 'generic';
   }

   function pickOutcome(entity, obey, levelIdx) {
     var key = outcomeKeyForEntity(entity && entity.name);
     var set = ENTITY_OUTCOMES[key] || ENTITY_OUTCOMES['generic'];
     var list = obey ? set.obey : set.disobey;
     if (!list || !list.length) return { fate:'advance', txt:'El camino se abre frente a ti.' };
     return list[levelIdx % list.length];
   }

   // Stubs de compatibilidad - se usan antes de initSurvivalGame
   window.SURVIVAL_GAME = window.SURVIVAL_GAME || {};
   window.SURVIVAL_GAME.start = function() {};
   window.SURVIVAL_GAME.close = function() {};

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
    var btnStart = document.getElementById('sg-btn-start');
    if (btnStart) btnStart.addEventListener('click', function() { startGame(); });
    var btnRestart = document.getElementById('sg-btn-restart');
    if (btnRestart) btnRestart.addEventListener('click', function() { startGame(); });
    var btnClose = document.getElementById('sg-btn-close');
    if (btnClose) btnClose.addEventListener('click', function() { closeGame(); });
    var vhsTile = document.getElementById('vhs-tile');
    if (vhsTile) {
      vhsTile.addEventListener('click', function() {
        if (typeof playClick === 'function') playClick();
        startGame();
      });
      vhsTile.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (typeof playClick === 'function') playClick();
          startGame();
        }
      });
    }
    var ts = document.getElementById('vhs-timestamp');
    if (ts) {
      var _vhsT0 = Date.now();
      setInterval(function() {
        var ms = Date.now() - _vhsT0;
        var totalCs = Math.floor(ms / 10);
        var hh = String(Math.floor(totalCs / 360000)).padStart(2, '0');
        var mm = String(Math.floor((totalCs / 6000) % 60)).padStart(2, '0');
        var ss = String(Math.floor((totalCs / 100) % 60)).padStart(2, '0');
        var ff = String(totalCs % 100).padStart(2, '0');
        ts.textContent = hh + ':' + mm + ':' + ss + ':' + ff;
      }, 33);
    }
  }

  // Expose game control on window for the nivelesSurvivalBoost IIFE
  window.SURVIVAL_GAME = window.SURVIVAL_GAME || {};
  window.SURVIVAL_GAME.start = startGame;
  window.SURVIVAL_GAME.close = closeGame;

  // ----- ENTITY LOOKUP -----
  // Parse level.entities text ("Entidad 2 (Ventanas), Entidad 17 (Crawlers)")
  // and resolve to WIKI_ENTITIES_WIKI entries by id ('ent-2', 'ent-17' ...).
  // Falls back to name matching for levels that list entities by alias only
  // (e.g. "Dullers, Facelings, Sabuesos, Ladrones de Piel").
  function lookupEntitiesForLevel(level) {
    var ents = [];
    if (!level) return ents;
    var src = (level.entities || '').toString();
    if (!src || /ninguna|desconocidas?|none/i.test(src)) return ents;
    var list = (window.WIKI_ENTITIES_WIKI || (typeof WIKI_ENTITIES_WIKI !== 'undefined' ? WIKI_ENTITIES_WIKI : []));
    var seen = {};

    // Pass 1: explicit "Entidad N" / "Entidad N-A" tokens — skip if not in local wiki
    var re = /Entidad\s*([0-9]+(?:\s*-\s*[A-Za-z])?)/gi;
    var m;
    while ((m = re.exec(src)) !== null) {
      var raw = m[1].replace(/\s+/g, '').toLowerCase();
      var key = 'ent-' + raw;
      if (seen[key]) continue;
      seen[key] = true;
      for (var i = 0; i < list.length; i++) {
        if (list[i].id && list[i].id.toLowerCase() === key) { ents.push(list[i]); break; }
      }
      if (ents.length >= 3) break;
    }

    // Pass 2: match by alias name (e.g. "Dullers" → ent-6)
    if (ents.length < 3) {
      for (var j = 0; j < list.length; j++) {
        var ent = list[j];
        if (!ent || !ent.name || seen[ent.id]) continue;
        var alias = ent.name.split('\u2014')[1] || ent.name;
        alias = alias.trim();
        if (alias.length < 3) continue;
        var wordRe = new RegExp('(^|[^A-Za-z\\u00C0-\\u017F])' + alias.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + '($|[^A-Za-z\\u00C0-\\u017F])', 'i');
        if (wordRe.test(src)) {
          seen[ent.id] = true;
          ents.push(ent);
          if (ents.length >= 3) break;
        }
      }
    }

    // Pass 3: extract any capitalized entity-like names from comma/sep lists
    if (ents.length < 3) {
      var parts = src.split(/[,;]/).map(function(s){ return s.trim(); }).filter(function(s){ return s.length > 3 && !/entidad|entidades|varias?|sin|ninguna|documentad[ao]/i.test(s); });
      for (var p = 0; p < parts.length && ents.length < 3; p++) {
        var clean = parts[p].replace(/\s*\([^)]*\)/g, '').trim();
        if (clean.length < 3) continue;
        var fuzzy = false;
        for (var k = 0; k < list.length; k++) {
          var eName = (list[k].name || '').toLowerCase();
          var search = clean.toLowerCase();
          if (eName.indexOf(search) >= 0 || (eName.split('\u2014')[1]||'').trim().toLowerCase().indexOf(search) >= 0) {
            if (!seen[list[k].id]) { ents.push(list[k]); seen[list[k].id] = true; fuzzy = true; break; }
          }
        }
        // skip unmatched names — the pool will fill real entities later
      }
    }

    return ents;
  }

  // Map difficulty (0..4) to a label + color used by both card and modal.
  function difficultyInfo(diff) {
    var d = diff == null ? 0 : diff;
    var map = [
      { label:'SEGURO',      color:'#30c460' },
      { label:'PRECAUCION',  color:'#9bc830' },
      { label:'PELIGRO',     color:'#c8a415' },
      { label:'MUY PELIGROSO', color:'#c87015' },
      { label:'MORTAL',      color:'#c43030' }
    ];
    return map[Math.max(0, Math.min(4, d))] || map[0];
  }

  function startGame() {
    if (typeof BACKROOMS_AUDIO !== 'undefined' && BACKROOMS_AUDIO.playClick) BACKROOMS_AUDIO.playClick();
    GAME = { state:'playing', level:0, history:[], sanity:100 };
    var sm = document.getElementById('survival-minigame');
    if (sm) sm.style.display = 'flex';
    var bs = document.getElementById('sg-btn-start');
    var br = document.getElementById('sg-btn-restart');
    var bc = document.getElementById('sg-btn-close');
    if (bs) bs.style.display = 'none';
    if (br) br.style.display = 'none';
    if (bc) bc.style.display = 'none';
    var g = document.getElementById('sg-glitch');
    var f = document.getElementById('sg-flash');
    if (g) g.className = 'sg-glitch-overlay';
    if (f) f.className = 'sg-flash';
    document.body.style.overflow = 'hidden';
    renderGameLevel(0);
  }

  function closeGame() {
    if (typeof BACKROOMS_AUDIO !== 'undefined' && BACKROOMS_AUDIO.playClick) BACKROOMS_AUDIO.playClick();
    var sm = document.getElementById('survival-minigame');
    if (sm) sm.style.display = 'none';
    document.body.style.overflow = '';
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

    // Probability: scaled by the level's class (0..4) so the level alone
    // determines the base odds — and choices tilt them up or down.
    var baseSurv = Math.max(10, 100 - (level.class * 18) - (level.difficulty * 6));
    var survColor = baseSurv > 60 ? '#30c460' : baseSurv > 35 ? '#c8a415' : '#c43030';
    var diff = difficultyInfo(level.difficulty != null ? level.difficulty : level.class);

    // Resolve entity records (photo + danger) from the wiki data.
    var ents = lookupEntitiesForLevel(level);
    var mainEntity = ents[0] || null;
    var extraEntities = ents.slice(1);

    // Build image source — fall back gracefully if the file is missing.
    var imgSrc = level.image || '';
    var imgBlock = imgSrc
      ? '<div class="sg-level-image-wrap">' +
          '<img class="sg-level-image" src="' + imgSrc + '" alt="' + (level.alias || level.name) + '" ' +
            'onerror="this.parentNode.classList.add(\'sg-level-image-missing\');this.remove();" />' +
          '<div class="sg-level-image-scan"></div>' +
          '<div class="sg-level-image-caption">FRAME ' + String(idx + 1).padStart(3, '0') + ' \u2014 STILL CAPTURE</div>' +
        '</div>'
      : '';

    // Right column: compact info card with arrows (per the user's mock-up).
    // Shows a small photo of the active entity (or a discreet "none" state).
    var entityBlock = '';
    if (mainEntity) {
      var entImageSrc = mainEntity.image || mainEntity.visual || '';
      if (entImageSrc && !/\.(jpe?g|png|gif|webp|svg|bmp)(\?|$)/i.test(entImageSrc)) entImageSrc = '';
      var eHasImg = !!entImageSrc;
      var eImg = eHasImg
        ? '<img class="sg-entity-photo" src="' + entImageSrc + '" alt="' + mainEntity.name + '" ' +
          'onerror="this.parentNode.classList.add(\'sg-entity-photo-missing\');this.remove();" />'
        : '<span class="pick-row-photo-icon">\u25C8</span>';
      var more = extraEntities.length
        ? '<div class="sg-entity-more">+ ' + extraEntities.length + ': ' +
            extraEntities.map(function(e){ return e.name; }).join(', ') + '</div>'
        : '';
      var entNameEsc = (mainEntity.name || '').replace(/"/g,'&quot;');
      var entDescEsc = (mainEntity.description || '').replace(/"/g,'&quot;');
      var entImg = mainEntity.image || mainEntity.visual || '';
      if (entImg && !/\.(jpe?g|png|gif|webp|svg|bmp)(\?|$)/i.test(entImg)) entImg = '';
      entityBlock =
        '<div class="sg-entity-block sg-entity-block-compact" ' +
          'data-entity-id="' + (mainEntity.id || '') + '" ' +
          'data-entity-name="' + entNameEsc + '" ' +
          'data-entity-desc="' + entDescEsc + '" ' +
          'data-entity-danger="' + (mainEntity.danger != null ? mainEntity.danger : 3) + '" ' +
          'data-entity-image="' + entImg + '" ' +
          'data-entity-wiki="' + (mainEntity.wiki_url || '') + '">' +
          '<div class="sg-entity-photo-wrap' + (eHasImg ? '' : ' sg-entity-photo-noimg') + '">' + eImg + (eHasImg ? '<div class="sg-entity-photo-tag">FOTO</div>' : '') + '</div>' +
          '<div class="sg-entity-info">' +
            '<div class="sg-entity-label">&gt; ENTIDAD ACTIVA</div>' +
            '<div class="sg-entity-name">' + mainEntity.name + '</div>' +
            '<div class="sg-entity-danger">' +
              '<span class="sg-entity-danger-stars">' +
                Array.from({length:5}).map(function(_,i){
                  return '<span class="sg-star ' + (i < mainEntity.danger ? 'on' : 'off') + '">\u25C6</span>';
                }).join('') +
              '</span>' +
              '<span class="sg-entity-danger-v">' + mainEntity.danger + '/5</span>' +
            '</div>' +
            more +
          '</div>' +
        '</div>';
    } else {
      entityBlock =
        '<div class="sg-entity-block sg-entity-block-compact sg-entity-block-none">' +
          '<div class="sg-entity-info sg-entity-info-full">' +
            '<div class="sg-entity-label">&gt; ENTIDAD ACTIVA</div>' +
            '<div class="sg-entity-name">SIN FIRMAS BIOL\u00d3GICAS DETECTADAS</div>' +
            '<div class="sg-entity-desc">Los sensores de proximidad no reportan actividad an\u00f3mala.</div>' +
          '</div>' +
        '</div>';
    }

    // Difficulty arrow indicator (compact, sits next to the level name)
    var arrow = '\u25B6';

    // Build level content
    var content = document.getElementById('sg-content');
    content.innerHTML =
      '<div class="sg-level-top">' +
        '<div class="sg-level-head">' +
          '<div class="sg-level-head-left">' +
            '<div class="sg-level-sub">\u25A0 NIVEL ' + idx + ' / ' + (WIKI_LEVELS.length - 1) + ' \u2014 PROFUNDIDAD ' + (level.class + 1) + '/5</div>' +
            '<div class="sg-level-title">' + level.name + ' ' + arrow + '</div>' +
            (level.alias ? '<div class="sg-level-alias">' + level.alias + '</div>' : '') +
          '</div>' +
          '<div class="sg-level-head-right">' +
            '<div class="sg-level-difficulty" style="color:' + diff.color + ';border-color:' + diff.color + '">' +
              '<span class="sg-level-difficulty-num">' + (level.difficulty != null ? level.difficulty : level.class) + '</span>' +
              '<span class="sg-level-difficulty-label">' + diff.label + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="sg-level-main">' +
          imgBlock +
          entityBlock +
        '</div>' +
        '<div class="sg-desc-line" id="sg-type-line-0"></div>' +
        '<div class="sg-desc-line" id="sg-type-line-1"></div>' +
        '<div class="sg-desc-line" id="sg-type-line-2"></div>' +
      '</div>';

    var optGrid = document.getElementById('sg-opt-grid');
    optGrid.innerHTML = '';

    // Reset picked entity at start of every level
    GAME.pickedEntity = null;

    // TikTok-style entity picker: choose 1 of 2 entities (or "no entity" option).
    // Once chosen, the entity's profile determines the escape odds and flavor text.
    // If the level has no matched entities, pull from the full entity pool so
    // the player always faces real entities from the wiki/community.
    var allEnts = (ents && ents.length) ? ents.slice() : [];
    var options = [];
    var poolEnts = (typeof ENTITIES !== 'undefined' && ENTITIES.length) ? ENTITIES : [];
    function pickFromPool(exclude) {
      var pool = poolEnts.filter(function(e){ return e.id !== (exclude || ''); });
      if (!pool.length) return null;
      return pool[Math.floor(Math.random() * pool.length)];
    }
    if (allEnts.length >= 2) {
      options.push(allEnts[0]);
      options.push(allEnts[1]);
    } else if (allEnts.length === 1) {
      var second = pickFromPool(allEnts[0].id);
      options.push(allEnts[0]);
      options.push(second || { __none:true, name:'SECTOR DESPEJADO', hint:'Sin firmas biol\u00f3gicas. Avanza con precauci\u00f3n.', danger:0 });
    } else {
      var e1 = pickFromPool('');
      var e2 = e1 ? pickFromPool(e1.id) : null;
      if (e1 && e2) { options.push(e1); options.push(e2); }
      else {
        options.push({ __none:true, name:'SECTOR DESPEJADO', hint:'Los sensores no reportan amenazas activas.', danger:0 });
        options.push({ __none:true, name:'AVANCE SILENCIOSO', hint:'Mant\u00e9n el ruido al m\u00ednimo. No enciendas la linterna.', danger:0 });
      }
    }

    // Render pick cards
    var FALLBACK_IMG = 'images/Entidades/entidad_9_facelings.jpg';
    function isImgPath(v) { return v && /\.(jpe?g|png|gif|webp|svg|bmp)(\?|$)/i.test(v); }
    var pickHtml = '<div class="sg-pick-stage">' +
      '<div class="sg-pick-prompt">Elige una entidad para el protocolo de extracci\u00f3n</div>' +
      '<div class="sg-pick-entity-grid" id="sg-pick-grid">';
    for (var pi = 0; pi < options.length; pi++) {
      var opt = options[pi];
      var isNone = opt.__none;
      if (isNone) continue;
      var imgSrc = (opt && (opt.image || opt.visual)) ? (opt.image || opt.visual) : '';
      if (!isImgPath(imgSrc)) imgSrc = FALLBACK_IMG;
      var entId = (opt && opt.id) ? opt.id : (isNone ? 'sector-despejado' : '');
      var entName = (opt && opt.name) ? opt.name : (isNone ? 'Sector despejado' : 'Entidad');
      var entDesc = (opt && (opt.description || opt.desc)) ? (opt.description || opt.desc) : (isNone ? 'Los sensores de proximidad no reportan actividad biol\u00f3gica. Sector despejado para avance.' : '');
      var entDanger = (opt && opt.danger != null) ? opt.danger : (isNone ? 1 : 2);
      var entImg = (opt && (opt.image || opt.visual)) ? (opt.image || opt.visual) : '';
      if (!isImgPath(entImg)) entImg = FALLBACK_IMG;
      var entWiki = (opt && opt.wiki_url) ? opt.wiki_url : '';
      var levelsHtml = '';
      if (!isNone) {
        var lvArr = Array.isArray(opt.levels) ? opt.levels : [];
        levelsHtml = lvArr.length
          ? '<div class="sg-pick-lv-badges">' + lvArr.slice(0, 3).map(function(lv) {
              return '<span class="sg-pick-lv-badge">' + lv + '</span>';
            }).join('') + '</div>'
          : '<div class="sg-pick-lv-badges"><span class="sg-pick-lv-badge sg-pick-lv-badge-multi">MULTI</span></div>';
      }
      pickHtml +=
        '<div class="sg-pick-entity-card" data-idx="' + pi + '" data-none="' + (isNone ? '1' : '0') + '" ' +
          'data-entity-id="' + entId + '" data-entity-name="' + entName.replace(/"/g,'&quot;') + '" ' +
          'data-entity-desc="' + entDesc.replace(/"/g,'&quot;') + '" ' +
          'data-entity-danger="' + entDanger + '" data-entity-image="' + entImg + '" ' +
          'data-entity-wiki="' + entWiki + '">' +
          '<div class="sg-pick-card-visual' + (isNone ? ' sg-pick-card-visual-none' : '') + '">' +
            '<img src="' + imgSrc + '" alt="' + entName.replace(/"/g,'&quot;') + '" class="sg-pick-card-img" onerror="this.style.display=\'none\'">' +
          '</div>' +
          '<div class="sg-pick-card-info">' +
            '<span class="sg-pick-card-name">' + entName + '</span>' +
          '</div>' +
          levelsHtml +
        '</div>';
    }
    pickHtml += '</div><div class="sg-pick-actions">' +
      '<button class="sg-btn-primary" id="sg-btn-confirm-pick">\u25B6 CONFIRMAR SELECCI\u00d3N</button>' +
      '</div></div>';
    optGrid.innerHTML = pickHtml;

    // Typewriter description lines (pick stage)
    var tagStr = Array.isArray(level.tags) && level.tags.length
      ? level.tags.join('</span> \u2022 <span class="hl">')
      : 'sin clasificar';
    var descLines = [
      'Sistema de detecci\u00f3n de anomal\u00edas activo. Escaneando entorno...',
      'Tags: <span class="hl">' + tagStr + '</span>.',
      'Selecciona una entidad y pulsa CONFIRMAR para iniciar el protocolo.'
    ];
    typeWriterLines(descLines, 0, function() {});

    // Bind entity card clicks: click selects the card and shows info modal.
    var pickCards = optGrid.querySelectorAll('.sg-pick-entity-card');
    var selectedCard = null;
    var confirmBtn = document.getElementById('sg-btn-confirm-pick');
    for (var ci = 0; ci < pickCards.length; ci++) {
      pickCards[ci].addEventListener('click', function(e) {
        if (GAME.state !== 'playing') return;
        pickCards.forEach(function(c){ c.classList.remove('sg-pick-card-selected'); });
        this.classList.add('sg-pick-card-selected');
        selectedCard = this;
        if (typeof openEntityModal === 'function') {
          openEntityModal(this);
        }
      });
    }
    // Confirm button locks in the pick and shows the entity info confirmation
    if (confirmBtn) {
      confirmBtn.addEventListener('click', function() {
        if (!selectedCard) return;
        var idx = parseInt(selectedCard.getAttribute('data-idx'));
        onEntityPicked(idx, options, level, idx);
      });
    }

    // Click on the entity photo in the sidebar opens the modal too.
    var entityWrap = document.querySelector('.sg-entity-block-compact');
    if (entityWrap) {
      entityWrap.addEventListener('click', function(e) {
        if (GAME.state !== 'playing') return;
        if (e.target && e.target.closest && e.target.closest('.sg-entity-photo-wrap')) {
          if (typeof openEntityModal === 'function') {
            e.stopPropagation();
            e.preventDefault();
            openEntityModal(this);
            return;
          }
        }
      });
    }

    // Swipeable mobile: detect horizontal swipe on the picker and choose
    var pickGrid = document.getElementById('sg-pick-grid');
    if (pickGrid) {
      var sx = 0, sy = 0;
      pickGrid.addEventListener('touchstart', function(e) {
        if (!e.touches || !e.touches[0]) return;
        sx = e.touches[0].clientX; sy = e.touches[0].clientY;
      }, { passive:true });
      pickGrid.addEventListener('touchend', function(e) {
        if (!e.changedTouches || !e.changedTouches[0]) return;
        var dx = e.changedTouches[0].clientX - sx;
        var dy = e.changedTouches[0].clientY - sy;
        if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
        if (GAME.state !== 'playing') return;
        var cards = pickGrid.querySelectorAll('.sg-pick-row');
        if (dx < 0) { var last = cards[cards.length - 1]; if (last) last.click(); }
        else { var first = cards[0]; if (first) first.click(); }
      }, { passive:true });
    }
  }

  // After the user picks an entity, render the decision stage with the
  // entity's portrait and TWO options: "obey" and "disobey". The outcome
  // is narrative, not probabilistic: every entity has a fixed list of
  // 3 outcomes that rotates with the level number.
  function onEntityPicked(pickIdx, options, level, baseSurv, survColor) {
    if (GAME.state !== 'playing') return;
    var opt = options[pickIdx];
    if (!opt) return;
    GAME.pickedEntity = opt;
    GAME.state = 'animating';

    var isNone = !!opt.__none;
    var danger = opt.danger != null ? opt.danger : (isNone ? 0 : 2);
    var photo = isNone ? '' : (opt.image || opt.visual || '');
    if (photo && !/\.(jpe?g|png|gif|webp|svg|bmp)(\?|$)/i.test(photo)) photo = '';

    // What the entity "says" — context-aware advice that the user can obey
    // or ignore. Generated from the entity's wiki description when possible.
    var says;
    if (isNone) {
      says = 'El sector est\u00e1 vac\u00edo. Mant\u00e9n el paso firme, sin forzar puertas.';
    } else {
      // Pull a short phrase from the entity description, or fall back.
      var descr = (opt.description || '').replace(/[\r\n]+/g, ' ').trim();
      if (descr.length > 90) descr = descr.substring(0, 87) + '...';
      says = descr || 'Firma an\u00f3mala detectada. Procede con precauci\u00f3n.';
    }

    // Entity direct command
    var entCommand = isNone ? '' : getEntityCommand(opt.name);

    // Build the two decision labels dynamically.
    var obeyText, obeyHint, disobeyText, disobeyHint;
    if (isNone) {
      obeyText = 'Seguir la corriente de aire';
      obeyHint = 'Avanza por donde sopla el aire. Sin sorpresas.';
      disobeyText = 'Forzar una puerta lateral';
      disobeyHint = 'Tomar una ruta que nadie ha verificado.';
    } else {
      var cmd = entCommand || 'lo que ordena';
      obeyText = 'Obedecer: ' + cmd;
      obeyHint = 'Hacer exactamente lo que la entidad te ordena.';
      disobeyText = 'Desobedecer: ignorar la orden';
      disobeyHint = 'No hacer lo que la entidad te pide. Ir por tu cuenta.';
    }
    var survHint = isNone ? 'Sector despejado. Avanza sin miedo.' : getEntitySurvivalHint(opt.name, danger);
    var fullDesc = opt.description || 'Sin descripci\u00f3n disponible.';
    var dangerColor = SURVIVAL_COLORS[danger] || SURVIVAL_COLORS[1];
    var stars = '';
    for (var si = 0; si < 5; si++) {
      stars += '<span class="sg-star ' + (si < danger ? 'on' : 'off') + '" style="color:' + (si < danger ? dangerColor : 'rgba(200,164,21,0.2)') + '">\u25C6</span>';
    }

    var photoStyle = photo ? ' style="background-image:url(\'' + photo + '\');"' : '';
    var photoBlock = isNone
      ? '<div class="eis-photo eis-photo-empty">\u2205</div>'
      : '<div class="eis-photo"' + photoStyle + '>' +
          '<img src="' + photo + '" alt="' + opt.name + '" ' +
            'onerror="this.parentNode.classList.add(\'sg-entity-photo-missing\');this.remove();" />' +
        '</div>';

    // Build a virtual card with the same data-entity-* attributes
    var entId = (opt && opt.id) ? opt.id : (isNone ? 'sector-despejado' : '');
    var entName = (opt && opt.name) ? opt.name : (isNone ? 'Sector despejado' : 'Entidad');
    var entDesc = (opt && opt.description) ? opt.description : (isNone ? 'Los sensores de proximidad no reportan actividad biol\u00f3gica. Sector despejado para avance.' : '');
    var entDanger = (opt && opt.danger != null) ? opt.danger : (isNone ? 1 : 2);
    var entImg = (opt && (opt.image || opt.visual)) ? (opt.image || opt.visual) : '';
    var entWiki = (opt && opt.wiki_url) ? opt.wiki_url : '';
    var entityCardAttrs =
      ' data-entity-id="' + entId + '" data-entity-name="' + entName + '" ' +
      'data-entity-desc="' + entDesc.replace(/"/g,'&quot;') + '" ' +
      'data-entity-danger="' + entDanger + '" data-entity-image="' + entImg + '" ' +
      'data-entity-wiki="' + entWiki + '"';

    var entNameShort = (opt.name || '').split(' \u2014 ')[1] || opt.name || '';

    sgGlitch('active');
    setTimeout(function(){ sgGlitch(''); sgFlash(); }, 120);

    var optGrid = document.getElementById('sg-opt-grid');
    optGrid.innerHTML =
      '<div class="sg-entity-info-stage"' + entityCardAttrs + '>' +
        '<div class="eis-head">' +
          '<span class="eis-head-arrow">\u25B6</span>' +
          'SE\u00d1AL DETECTADA' +
        '</div>' +
        '<div class="eis-card">' +
          photoBlock +
          '<div class="eis-command-box" id="eis-command-box">' +
            '<span class="eis-cmd-label">LA ENTIDAD ORDENA:</span>' +
            '<span class="eis-cmd-text" id="eis-cmd-text">' + entCommand + '</span>' +
          '</div>' +
          '<div class="eis-data">' +
            '<div class="eis-name" style="color:' + dangerColor + '">' + (opt.name || '') + '</div>' +
            '<div class="eis-danger">' +
              '<span class="eis-stars">' + stars + '</span>' +
              '<span class="eis-danger-val" style="color:' + dangerColor + '">' + danger + '/5</span>' +
            '</div>' +
            '<div class="eis-hint">' +
              '<span class="eis-hint-label">\u25B6 SUPERVIVENCIA:</span>' +
              '<span class="eis-hint-text">' + survHint + '</span>' +
            '</div>' +
            '<div class="eis-desc" id="eis-desc">' + fullDesc + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="eis-actions" id="eis-actions">' +
          '<button class="eis-btn eis-btn-obey" id="sg-card-safe" data-pick="obey">' +
            '<span class="eis-btn-text">' +
              '<span class="eis-btn-name">' + obeyText + '</span>' +
              '<span class="eis-btn-hint">' + obeyHint + '</span>' +
            '</span>' +
          '</button>' +
          '<button class="eis-btn eis-btn-disobey" id="sg-card-risky" data-pick="disobey">' +
            '<span class="eis-btn-text">' +
              '<span class="eis-btn-name">' + disobeyText + '</span>' +
              '<span class="eis-btn-hint">' + disobeyHint + '</span>' +
            '</span>' +
          '</button>' +
        '</div>' +
      '</div>';

    // Bind clicks on the new obey/disobey buttons
    var obeyBtn = document.getElementById('sg-card-safe');
    var disobeyBtn = document.getElementById('sg-card-risky');
    if (obeyBtn) obeyBtn.addEventListener('click', function() { chooseOption('obey', opt, level, 0); });
    if (disobeyBtn) disobeyBtn.addEventListener('click', function() { chooseOption('disobey', opt, level, 0); });

    // Click on the entity photo (in the info card on the right) opens the
    // full entity modal — same as clicking a card on entidades.html.
    var eisPhoto = optGrid.querySelector('.eis-photo');
    var eisStage = optGrid.querySelector('.sg-entity-info-stage');
    if (eisPhoto && eisStage && typeof openEntityModal === 'function') {
      eisPhoto.addEventListener('click', function(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        openEntityModal(eisStage);
      });
    }

    // Swipeable on the action grid
    var agrid = document.getElementById('eis-actions');
    if (agrid) {
      var sx2 = 0, sy2 = 0;
      agrid.addEventListener('touchstart', function(e) {
        if (!e.touches || !e.touches[0]) return;
        sx2 = e.touches[0].clientX; sy2 = e.touches[0].clientY;
      }, { passive:true });
      agrid.addEventListener('touchend', function(e) {
        if (!e.changedTouches || !e.changedTouches[0]) return;
        var dx = e.changedTouches[0].clientX - sx2;
        var dy = e.changedTouches[0].clientY - sy2;
        if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
        if (dx < 0) { if (disobeyBtn) disobeyBtn.click(); }
        else { if (obeyBtn) obeyBtn.click(); }
      }, { passive:true });
    }

    // Resume input
    GAME.state = 'playing';
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

  // Choose option: 'obey' or 'disobey' the picked entity.
  // The outcome is a fixed narrative beat (no RNG). The user reads a short
  // scene describing what happened, then either advances to the next level
  // or dies.
  function chooseOption(pick, entity, level, skip) {
    GAME.state = 'animating';
    var obey = (pick === 'obey');
    var outcome = pickOutcome(entity, obey, GAME.level);

    // Disable buttons
    var safeBtn = document.getElementById('sg-card-safe');
    var riskyBtn = document.getElementById('sg-card-risky');
    if (safeBtn) safeBtn.disabled = true;
    if (riskyBtn) riskyBtn.disabled = true;

    // Render the outcome scene in the OPT grid (replaces the decision UI).
    var optGrid = document.getElementById('sg-opt-grid');
    var entityName = entity && entity.name ? entity.name : 'Entidad';
    var verdictColor = outcome.fate === 'death' ? '#c43030' : '#30c460';
    var verdictLabel = outcome.fate === 'death' ? 'FIN DE LA EXTRACCI\u00d3N' : 'EXTRACCI\u00d3N CONTIN\u00daA';
    var verdictIcon = outcome.fate === 'death' ? '\u2620' : '\u2713';
    var obeyLabel = obey ? 'LE HICISTE CASO A ' + entityName.split(' ')[0].toUpperCase()
                        : 'NO LE HICISTE CASO A ' + entityName.split(' ')[0].toUpperCase();
    var continueLabel = outcome.fate === 'death' ? 'ACEPTAR EL FINAL' : 'CONTINUAR \u25B6';

    optGrid.innerHTML =
      '<div class="sg-outcome-stage">' +
        '<div class="sg-outcome-verdict" style="color:' + verdictColor + ';border-color:' + verdictColor + '">' +
          '<span class="sg-outcome-icon">' + verdictIcon + '</span>' +
          '<span class="sg-outcome-label">' + verdictLabel + '</span>' +
        '</div>' +
        '<div class="sg-outcome-choice">' + obeyLabel + '</div>' +
        '<div class="sg-outcome-narrative" id="sg-outcome-narr"></div>' +
        '<button class="sg-pick-row sg-outcome-continue" id="sg-outcome-continue">' +
          '<div class="pick-row-photo pick-row-photo-empty">' + (outcome.fate === 'death' ? '\u2620' : '\u25B6') + '</div>' +
          '<div class="pick-row-text"><div class="pick-row-name">' + continueLabel + '</div></div>' +
          '<div class="pick-row-arrow">\u25B6</div>' +
        '</button>' +
      '</div>';

    // Typewriter the narrative
    var narrEl = document.getElementById('sg-outcome-narr');
    if (narrEl) {
      var txt = outcome.txt;
      var pos = 0;
      narrEl.textContent = '';
      function tick() {
        if (pos < txt.length) {
          narrEl.textContent = txt.substring(0, pos + 1);
          pos++;
          setTimeout(tick, 18 + Math.random() * 10);
        }
      }
      tick();
    }

    // Brief visual effects tied to the outcome
    if (outcome.fate === 'death') {
      sgFlash();
      sgGlitch('severe');
    } else {
      sgFlash();
      sgGlitch('active');
    }

    // Bind continue button
    var contBtn = document.getElementById('sg-outcome-continue');
    if (contBtn) {
      contBtn.addEventListener('click', function() { advanceFromOutcome(outcome, level); });
    }
  }

  // After the outcome scene, either show the death screen or render the next
  // level. Optionally, a 3% chance per advance to trigger the secret level
  // (the only random element in the game, kept low for narrative surprise).
  function advanceFromOutcome(outcome, level) {
    if (outcome.fate === 'death') {
      showDeathScreen();
      return;
    }
    var nextIdx = GAME.level + 1;
    if (Math.random() < 0.04) {
      triggerSecretLevel();
      return;
    }
    sgStopGlitch();
    GAME.state = 'playing';
    if (nextIdx >= WIKI_LEVELS.length) { showVictoryScreen(); }
    else {
      try { renderGameLevel(nextIdx); }
      catch(e) {
        console.error('Error al renderizar nivel', nextIdx, e);
        var c = document.getElementById('sg-content');
        if (c) c.innerHTML = '<div class="sg-level-title" style="padding:40px;text-align:center;color:#c43030">ERROR DE CARGA — NIVEL ' + nextIdx + '</div><div style="padding:10px 40px;color:var(--text-dim);font-size:0.75rem">' + (e.message || '') + '</div>';
        document.getElementById('sg-btn-restart').style.display = 'inline-block';
        document.getElementById('sg-btn-close').style.display = 'inline-block';
      }
    }
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
    var readings = {};
    readings['wiki-0'] = 'Frecuencia de 4.7 Hz detectada. Eco de voz no identificado en submural.';
    readings['wiki-1'] = 'Rastros de Entity-12. Nivel de humedad: 34%. Se\u00f1al Wi-Fi residual.';
    readings['wiki-2'] = 'Presi\u00f3n de vapor: 4.2 bar. Part\u00edculas de amon\u00edaco en suspensi\u00f3n.';
    readings['wiki-3'] = 'Campo electromagn\u00e9tico: 2.4 \u00b5T. Descargas residuales cada 3s.';
    readings['wiki-4'] = 'Gravedad local: 0.98 G. Se detectan firmas biol\u00f3gicas d\u00e9biles.';

    var modal = document.getElementById('level-modal');
    var overlay = document.getElementById('level-modal-overlay');
    var closeBtn = document.getElementById('level-modal-close');
    if (!modal || !overlay) return;

    function closeModal() {
      overlay.classList.remove('active');
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
    });

    var statusLabels = { 1:'SEGURO — HABITABLE', 2:'BAJO — PRECAUCI\u00d3N', 3:'MODERADO — PELIGRO', 4:'ALTO — MUY PELIGROSO', 5:'EXTREMO — MORTAL' };
    function getStatusLabel(s) { return t('surv.' + s) || statusLabels[s] || 'NO CLASIFICADO'; }

    var cards = document.querySelectorAll('.level-card[data-level-id]');
    for (var i = 0; i < cards.length; i++) {
      (function(card) {
        var opening = false;
        card.addEventListener('click', function(e) {
          if (e.target.closest('a')) return;
          if (opening) return;
          if (overlay.classList.contains('active')) return;
          opening = true;

          var id = card.getAttribute('data-level-id');
          var name = card.getAttribute('data-level-name');
          var tags = card.getAttribute('data-level-tags');
          var videoUrl = card.getAttribute('data-level-video');
          var color = card.getAttribute('data-level-color');
          var survival = card.getAttribute('data-level-survival') || '0';
          var reading = readings[id] || 'Anomal\u00eda no clasificada. Se recomienda precauci\u00f3n.';

          var statusText = getStatusLabel(parseInt(survival));
          var statusColor = color;

          // Split title into "Nivel X" and alias
          var nameParts = (name || '').split(' \u2014 ');
          var mainTitle = nameParts[0] || name;
          var aliasText = nameParts[1] || '';
          modal.querySelector('.level-modal-title').textContent = mainTitle;
          var aliasEl = modal.querySelector('#level-modal-alias');
          if (aliasEl) aliasEl.textContent = aliasText;
          modal.querySelector('.level-modal-status').textContent = t('levels.modal.status') + statusText;
          modal.querySelector('.level-modal-status').style.color = statusColor;
          modal.querySelector('.level-modal-border').style.borderColor = statusColor;
          modal.querySelector('.level-modal-border').style.boxShadow = '0 0 30px ' + statusColor + ', inset 0 0 30px ' + statusColor;

          // Difficulty badge
          var survInt = parseInt(survival) || 0;
          var diffNumEl = document.getElementById('lm-diff-num');
          var diffLabelEl = document.getElementById('lm-diff-label');
          var diffBox = document.getElementById('level-modal-difficulty');
          if (diffNumEl) { diffNumEl.textContent = survInt; diffNumEl.style.color = statusColor; }
          if (diffLabelEl) { diffLabelEl.textContent = statusText; diffLabelEl.style.color = statusColor; }
          if (diffBox) { diffBox.style.borderColor = statusColor; diffBox.style.boxShadow = '0 0 12px ' + statusColor + '33'; }

          modal.querySelector('.lm-props').innerHTML = tags;
          modal.querySelector('.lm-reading').textContent = reading;

          var videoBox = modal.querySelector('.lm-video');
          if (videoBox) {
            if (videoUrl) {
              videoBox.innerHTML = '<a href="' + videoUrl + '" target="_blank" class="btn-video-link">\u25B6 VER GRABACI\u00d3N</a>';
            } else {
              videoBox.innerHTML = '<span class="btn-video-link disabled">\u2716 SIN VIDEO</span>';
            }
          }

          var imgSrc = card.getAttribute('data-level-image') || 'images/Niveles/nivel0.jpg';
          var modalImg = modal.querySelector('.lm-modal-image');
          if (modalImg) {
            modalImg.src = imgSrc;
            modalImg.alt = name;
          }

          var techRaw = card.getAttribute('data-level-technical') || '{}';
          var tech = {};
          try { tech = JSON.parse(techRaw.replace(/&quot;/g, '"').replace(/&#39;/g, "'")); } catch(err) { tech = {}; }
          var techBox = modal.querySelector('.lm-tech-grid');
          if (techBox) {
            var labels = {
              temp: 'TEMP', toxic: 'GASES', humidity: 'HUM', radiation: 'RAD',
              gravity: 'GRAV', oxygen: 'O\u2082', habitability: 'HAB'
            };
            var html = '';
            for (var k in labels) {
              if (tech[k] !== undefined) {
                html += '<div class="lm-tech-cell">'
                      +   '<span class="lm-tech-k">' + labels[k] + '</span>'
                      +   '<span class="lm-tech-v">' + tech[k] + '</span>'
                      + '</div>';
              }
            }
            techBox.innerHTML = html;
          }

          var connRaw = card.getAttribute('data-level-connections') || '[]';
          var conn = [];
          try { conn = JSON.parse(connRaw.replace(/&quot;/g, '"').replace(/&#39;/g, "'")); } catch(err) { conn = []; }
          var connBox = modal.querySelector('.lm-conn-list');
          if (connBox) {
            if (conn.length === 0) {
              connBox.innerHTML = '<div class="lm-conn-empty">Sin conexiones documentadas.</div>';
            } else {
              var connHtml = '';
              for (var c = 0; c < conn.length; c++) {
                var co = conn[c];
                connHtml += '<div class="lm-conn-item">'
                          +   '<span class="lm-conn-type lm-conn-' + (co.type || '').toLowerCase() + '">' + (co.type || '') + '</span>'
                          +   '<span class="lm-conn-flow">' + (co.from || '') + ' <span class="lm-conn-arrow">\u2192</span> ' + (co.to || '') + '</span>'
                          +   '<span class="lm-conn-method">' + (co.method || '') + '</span>'
                          + '</div>';
              }
              connBox.innerHTML = connHtml;
            }
          }

          var descRaw = card.getAttribute('data-level-description') || '""';
          var desc = '';
          try { desc = JSON.parse(descRaw.replace(/&quot;/g, '"').replace(/&#39;/g, "'")); } catch(err) { desc = ''; }
          var descEl = modal.querySelector('.lm-desc-text');
          if (descEl) descEl.textContent = desc || 'Sin descripci\u00f3n disponible en la wiki.';

          var exitsRaw = card.getAttribute('data-level-exits') || '[]';
          var exits = [];
          try { exits = JSON.parse(exitsRaw.replace(/&quot;/g, '"').replace(/&#39;/g, "'")); } catch(err) { exits = []; }
          var exitsEl = modal.querySelector('.lm-exits-list');
          if (exitsEl) {
            if (exits.length === 0) {
              exitsEl.innerHTML = '<span style="font-size:11px;color:rgba(255,234,0,0.4);font-family:\'Courier New\',monospace;">Sin salidas documentadas</span>';
            } else {
              var exHtml = '';
              for (var e = 0; e < Math.min(exits.length, 20); e++) {
                exHtml += '<span class="lm-exit-tag" style="font-family:\'Courier New\',monospace;font-size:10px;padding:3px 7px;border:1px solid rgba(255,234,0,0.4);color:#ffea00;background:rgba(0,0,0,0.4);">' + exits[e] + '</span>';
              }
              if (exits.length > 20) exHtml += '<span style="font-size:10px;color:rgba(255,234,0,0.5);">+' + (exits.length - 20) + ' m&aacute;s</span>';
              exitsEl.innerHTML = exHtml;
            }
          }

          // Resolve linked entities (with photos) for this level and render them.
          var entitiesRaw = card.getAttribute('data-level-entities') || 'Ninguna';
          var entsList = [];
          try { entsList = lookupEntitiesForLevel({ entities: entitiesRaw }); } catch(err) { entsList = []; }
          var entsBox = modal.querySelector('.lm-entities-list');
          var entsBlock = modal.querySelector('.lm-entities-block');
          if (entsBox && entsBlock) {
            if (!entsList || entsList.length === 0) {
              entsBlock.style.display = 'none';
            } else {
              entsBlock.style.display = '';
              var entsHtml = '';
              var dangerLabels = { 0:'NULA', 1:'BAJA', 2:'MODERADA', 3:'ALTA', 4:'EXTREMA' };
              var dangerColors = { 0:'#5b8a3a', 1:'#9bc830', 2:'#ffae00', 3:'#ff5a14', 4:'#ff2a2a' };
              for (var en = 0; en < entsList.length; en++) {
                var ent = entsList[en] || {};
                var entName = ent.name || ('Entidad ' + (ent.id || '').replace(/^ent-/i,''));
                var entAlias = entName.split('\u2014')[1] ? entName.split('\u2014')[1].trim() : (ent.name || '');
                var entImg = ent.image || ('images/Entidades/' + (ent.id || 'entidad_0') + '.jpg');
                var danger = (ent.danger != null) ? ent.danger : (ent.class != null ? ent.class : 2);
                var dColor = dangerColors[Math.max(0, Math.min(4, danger))] || dangerColors[2];
                var dLabel = dangerLabels[Math.max(0, Math.min(4, danger))] || dangerLabels[2];
                var entId = (ent.id || '').replace(/[^A-Za-z0-9_\-]/g,'');
                var entFallback = 'images/Entidades/entidad_0.jpg';
                entsHtml += '<a href="entidades.html?openEntity=' + entId + '" class="lm-entity-card" data-entity-id="' + entId + '">'
                          +   '<div class="lm-entity-photo" style="background-image:url(\'' + entImg + '\')" onerror="this.style.backgroundImage=\'url(' + entFallback + ')\';"></div>'
                          +   '<div class="lm-entity-info">'
                          +     '<span class="lm-entity-name">' + entAlias + '</span>'
                          +     '<span class="lm-entity-id">' + (ent.id || '').toUpperCase() + '</span>'
                          +     '<span class="lm-entity-danger" style="color:' + dColor + ';border-color:' + dColor + ';">' + dLabel + '</span>'
                          +   '</div>'
                          + '</a>';
              }
              entsBox.innerHTML = entsHtml;
              // Bind click → navigate to entidades.html and auto-open the entity modal
              var entLinks = entsBox.querySelectorAll('.lm-entity-card');
              for (var k = 0; k < entLinks.length; k++) {
                entLinks[k].addEventListener('click', function(e) {
                  e.preventDefault();
                  e.stopPropagation();
                  var eid = this.getAttribute('data-entity-id');
                  window.location.href = 'entidades.html?openEntity=' + encodeURIComponent(eid);
                });
              }
            }
          }

          var wikiUrl = card.getAttribute('data-level-wiki') || '';
          var wikiLink = modal.querySelector('.lm-wiki-link');
          if (wikiLink) {
            if (wikiUrl) { wikiLink.href = wikiUrl; wikiLink.textContent = 'Wiki Hispana Backrooms (CC-BY-SA)'; wikiLink.style.display = 'inline'; }
            else { wikiLink.style.display = 'none'; }
          }

          overlay.classList.add('active');
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';

          setTimeout(function() { opening = false; }, 300);
        });
      })(cards[i]);
    }

    // Expose a public helper so other pages (or a ?openLevel= query string)
    // can open the level modal by id without needing the card on screen.
    window.__openLevelModalById = function(id) {
      var sel = '.level-card[data-level-id="' + (id || '').replace(/[^A-Za-z0-9_\-]/g,'') + '"]';
      var card = document.querySelector(sel);
      if (card) { card.click(); return true; }
      return false;
    };

    // Expose a public helper to open the entity modal by id.
    // Tries the real card first; falls back to a virtual card built from
    // the WIKI_ENTITIES_WIKI entry so it works from cross-page navigation.
    window.__openEntityModalById = function(id) {
      var safeId = (id || '').replace(/[^A-Za-z0-9_\-]/g,'');
      var card = document.querySelector('.entity-card[data-entity-id="' + safeId + '"]');
      if (card && typeof openEntityModal === 'function') { openEntityModal(card); return true; }
      if (typeof openEntityModal !== 'function') return false;
      var list = window.WIKI_ENTITIES_WIKI || (typeof WIKI_ENTITIES_WIKI !== 'undefined' ? WIKI_ENTITIES_WIKI : []);
      var entry = null;
      for (var i = 0; i < list.length; i++) {
        if (list[i] && list[i].id === safeId) { entry = list[i]; break; }
      }
      if (!entry) return false;
      var v = document.createElement('div');
      v.setAttribute('data-entity-id', entry.id || '');
      v.setAttribute('data-entity-name', entry.name || '');
      v.setAttribute('data-entity-desc', entry.description || entry.desc || '');
      v.setAttribute('data-entity-danger', String(entry.danger != null ? entry.danger : (entry.class || 2)));
      v.setAttribute('data-entity-image', entry.image || ('images/Entidades/' + (entry.id || 'entidad_0') + '.jpg'));
      v.setAttribute('data-entity-wiki', entry.wiki_url || '');
      v.style.display = 'none';
      document.body.appendChild(v);
      try { openEntityModal(v); } finally { v.remove(); }
      return true;
    };
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

  // ===================== MUSIC PLAYER =====================
  // ===================== AMBIENT AUDIO (unified) =====================
  var AMBIENT_AUDIO = (function() {
    var active = false;
    var muted = false;
    var userActivated = false;
    var clickSoundsBound = false;
    var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Estado persistido del audio: si el usuario lo dejó silenciado, respetarlo
    var STORAGE_KEY = 'br_ambient_state';
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        var s = JSON.parse(saved);
        if (s && typeof s.muted === 'boolean') muted = s.muted;
      }
    } catch(e) {}

    function saveState() {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ muted: muted, ts: Date.now() })); } catch(e) {}
    }

    function updateUI() {
      var btn = document.getElementById('mute-toggle');
      var icon = document.getElementById('mute-icon');
      var label = document.getElementById('mute-label');
      if (!btn) return;
      if (active && !muted) {
        btn.classList.add('active');
        if (icon) icon.innerHTML = '&#x1F50A;';
        if (label) label.textContent = 'AUDIO ON';
      } else {
        btn.classList.remove('active');
        if (icon) icon.innerHTML = '&#x1F507;';
        if (label) label.textContent = muted ? 'MUDO' : 'AUDIO';
      }
    }

    // Inicia el audio sin esperar gesto. Si el navegador bloquea
    // (política de autoplay), se reagenda para el primer gesto del usuario.
    function tryActivate(silent) {
      if (userActivated) { resumeLoop(); return; }
      userActivated = true;
      try { BACKROOMS_AUDIO.init(); } catch(e) { console.warn('[AUDIO] init fail', e); }
      try { BACKROOMS_AUDIO.resume(); } catch(e) {}
      if (!muted && !prefersReduced) {
        try { BACKROOMS_AUDIO.playHum(); } catch(e) { console.warn('[AUDIO] hum fail', e); }
      }
      active = true;
      updateUI();
    }

    function resumeLoop() {
      if (!userActivated || muted || prefersReduced) return;
      try { BACKROOMS_AUDIO.resume(); } catch(e) {}
      try { BACKROOMS_AUDIO.playHum(); } catch(e) {}
    }

    function toggle() {
      if (!userActivated) { tryActivate(); return; }
      muted = !muted;
      if (muted) {
        try { BACKROOMS_AUDIO.stopAll(); } catch(e) {}
      } else {
        try { BACKROOMS_AUDIO.resume(); } catch(e) {}
        if (!prefersReduced) {
          try { BACKROOMS_AUDIO.playHum(); } catch(e) {}
        }
      }
      saveState();
      updateUI();
    }

    function bindClickSounds() {
      if (clickSoundsBound) return;
      clickSoundsBound = true;
      var lastClick = 0;
      // Click sound en TODO el documento, silencioso si el usuario lo pidió
      document.addEventListener('click', function(e) {
        if (muted) return;
        var now = Date.now();
        if (now - lastClick < 50) return;
        lastClick = now;
        try {
          if (BACKROOMS_AUDIO._ctx && BACKROOMS_AUDIO._ctx.state === 'suspended') {
            BACKROOMS_AUDIO._ctx.resume();
          }
          BACKROOMS_AUDIO.playClick();
        } catch(err) {}
      }, true);
      // Pasos al pasar sobre cards (con throttle)
      var hoverTimer = null;
      document.addEventListener('mouseover', function(e) {
        if (muted || prefersReduced) return;
        var tgt = e.target;
        if (tgt.closest && tgt.closest('.level-card, .entity-card, .db-card')) {
          if (hoverTimer) return;
          hoverTimer = setTimeout(function() { hoverTimer = null; }, 800);
          try { BACKROOMS_AUDIO.playSteps(); } catch(e) {}
        }
      });
      // Reanudar hum al volver a la pestaña
      document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
          try { BACKROOMS_AUDIO.stopAll(); } catch(e) {}
        } else {
          resumeLoop();
        }
      });
    }

    return {
      init: function() {
        var btn = document.getElementById('mute-toggle');
        if (btn) {
          btn.addEventListener('click', function(e) { e.preventDefault(); e.stopPropagation(); toggle(); });
        }
        // Activar el hum lo antes posible.
        // La política de autoplay puede bloquear el AudioContext, por eso
        // reagendamos al primer gesto. El click sound sigue funcionando
        // porque solo necesita el contexto creado (no resucitado).
        tryActivate();
        // Fallback: primer gesto reactiva el contexto si estaba suspendido
        var resumeOnGesture = function() {
          try {
            if (BACKROOMS_AUDIO._ctx && BACKROOMS_AUDIO._ctx.state === 'suspended') {
              BACKROOMS_AUDIO._ctx.resume();
            }
            if (!userActivated) tryActivate();
            else resumeLoop();
          } catch(e) {}
        };
        document.addEventListener('click', resumeOnGesture, true);
        document.addEventListener('keydown', resumeOnGesture, true);
        document.addEventListener('touchstart', resumeOnGesture, true);
        document.addEventListener('mousemove', resumeOnGesture, { passive: true, once: true });
        bindClickSounds();
        updateUI();
      },
      isActive: function() { return active && !muted; },
      unmute: function() { if (muted) toggle(); },
      mute: function() { if (!muted) toggle(); }
    };
  })();

  var BACKROOMS_MUSIC = (function() {
    var player = null;
    var playing = false;
    var ready = false;
    var loading = false;
    var STORAGE_KEY = 'br_music_playing';
    var VIDEO_ID = 'HbOWkd71uE4';

    function updateButton() {
      var btn = document.getElementById('btn-music');
      if (!btn) return;
      var label = t('music.toggle');
      var icon = loading ? '\u22EF ' : (playing ? '\u25A0 ' : '\u25B6 ');
      btn.textContent = icon + label;
      if (loading) { btn.style.opacity = '0.6'; btn.style.cursor = 'wait'; }
      else { btn.style.opacity = ''; btn.style.cursor = 'pointer'; }
    }

    function loadYTAPI() {
      if (window.YT && window.YT.Player) return Promise.resolve();
      if (loading) return new Promise(function(r) { setTimeout(function() { r(loadYTAPI()); }, 200); });
      loading = true;
      updateButton();
      return new Promise(function(resolve, reject) {
        var resolved = false;
        var prev = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = function() { if (prev) prev(); resolved = true; resolve(); };
        var tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.onerror = function() { if (!resolved) { resolved = true; reject(new Error('YT_API_LOAD_FAIL')); } };
        document.head.appendChild(tag);
        setTimeout(function() { if (!resolved) { resolved = true; reject(new Error('YT_API_TIMEOUT')); } }, 8000);
      });
    }

    function saveState() {
      try { localStorage.setItem(STORAGE_KEY, playing ? '1' : '0'); } catch(e) {}
    }

    function loadSavedState() {
      try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch(e) {}
      return false;
    }

    function createPlayer() {
      if (document.getElementById('yt-dreamcore-player')) return;
      var div = document.createElement('div');
      div.id = 'yt-dreamcore-player';
      div.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;z-index:-1;';
      document.body.appendChild(div);

      try {
        player = new YT.Player('yt-dreamcore-player', {
          videoId: VIDEO_ID,
          playerVars: { autoplay: 0, controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3, modestbranding: 1, rel: 0 },
          events: {
            onReady: function() {
              ready = true;
              loading = false;
              try { player.setVolume(50); } catch(e) {}
              if (loadSavedState()) {
                var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                if (!prefersReduced) {
                  try { player.playVideo(); playing = true; saveState(); } catch(e) {}
                }
              }
              updateButton();
            },
            onStateChange: function(e) {
              if (e.data === YT.PlayerState.PLAYING) { playing = true; }
              else if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) { playing = false; }
              saveState();
              updateButton();
            },
            onError: function() { playing = false; updateButton(); }
          }
        });
      } catch(err) {
        console.warn('[BACKROOMS_MUSIC] Player init failed:', err);
        ready = false; loading = false; updateButton();
      }
    }

    function handleClick() {
      if (loading) return;
      if (!player || !ready) {
        loading = true; updateButton();
        showNotification('Cargando reproductor...', 'info');
        loadYTAPI().then(function() { createPlayer(); }).catch(function(err) {
          console.warn('[BACKROOMS_MUSIC] API load failed:', err);
          loading = false; updateButton();
          showNotification('No se pudo cargar YouTube. Desactiva el bloqueador de anuncios o recarga la página.', 'error');
        });
        return;
      }
      if (playing) { try { player.pauseVideo(); } catch(e) {} playing = false; }
      else { try { player.playVideo(); } catch(e) {} playing = true; }
      saveState();
      updateButton();
    }

    return {
      init: function() {
        var btn = document.getElementById('btn-music');
        if (btn) {
          btn.addEventListener('click', function(e) { e.preventDefault(); e.stopPropagation(); handleClick(); });
        }
        updateButton();
        loadYTAPI().then(function() { createPlayer(); }).catch(function() { loading = false; updateButton(); });
      },
      play: function() {
        if (player && ready) { try { player.playVideo(); } catch(e) {} return; }
        if (!player) {
          loading = true; updateButton();
          loadYTAPI().then(function() {
            createPlayer();
            var wait = setInterval(function() {
              if (ready) { clearInterval(wait); try { player.playVideo(); } catch(e) {} }
            }, 200);
            setTimeout(function() { clearInterval(wait); }, 8000);
          }).catch(function() { loading = false; updateButton(); });
        }
      },
      pause: function() { if (player && ready) { try { player.pauseVideo(); } catch(e) {} } },
      toggle: function() { handleClick(); },
      isPlaying: function() { return playing; },
      setVolume: function(vol) { if (player && ready) { try { player.setVolume(Math.max(0, Math.min(100, vol))); } catch(e) {} } }
    };
  })();

  // ===================== INIT =====================
  async function init() {
    loadState();

    // Cargar niveles de la wiki local (CC-BY-SA) como fuente de verdad
    if (typeof WIKI_LEVELS_WIKI !== 'undefined' && Array.isArray(WIKI_LEVELS_WIKI) && WIKI_LEVELS_WIKI.length) {
      WIKI_LEVELS = WIKI_LEVELS_WIKI;
    }

    // Cargar entidades de la wiki local (CC-BY-SA)
    if (typeof WIKI_ENTITIES_WIKI !== 'undefined' && Array.isArray(WIKI_ENTITIES_WIKI) && WIKI_ENTITIES_WIKI.length) {
      ENTITIES = WIKI_ENTITIES_WIKI;
    }

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
    initLanguageSelector();
    applyTranslations();
    renderLevels('wiki-grid');
    renderEntities('entities-grid');
    renderCommunity('community-grid', 'community-sub');
    renderVideos('videos-grid');
    renderAuthUI();
    renderSubmitSection();
    initModal();
    initLevelForm();
    initWidgets();
    initTerminalLogs();
    initLevelScan();
    initVideoModal();
    if (document.getElementById('entity-modal-overlay')) initEntityModal();

    initSurvivalGame();
    BACKROOMS_MUSIC.init();
    AMBIENT_AUDIO.init();

    // Open a level modal if the URL contains ?openLevel=ID
    // (e.g. when arriving from entidades.html via a level badge).
    try {
      var openLv = null;
      if (typeof URLSearchParams !== 'undefined') {
        openLv = new URLSearchParams(window.location.search).get('openLevel');
      } else {
        var m = window.location.search.match(/[?&]openLevel=([^&]+)/);
        if (m) openLv = decodeURIComponent(m[1]);
      }
      if (openLv) {
        // Wait a tick for the grid to render
        setTimeout(function() {
          if (window.__openLevelModalById && !window.__openLevelModalById(openLv)) {
            // Fallback: try matching by name (e.g. "Nivel 2")
            var byName = false;
            var wanted = openLv.toLowerCase();
            var nameMap = {
              'wiki-0':0,'wiki-1':1,'wiki-2':2,'wiki-3':3,'wiki-4':4,'wiki-5':5,'wiki-6':6,'wiki-7':7,'wiki-8':8,
              'wiki-neg0':9,'wiki-neg1':10,'wiki-neg2':11,'wiki-neg3':12,
              'wiki-the_end':13,'wiki-l4_s0mbr4_gr1s':14,'wiki-corre':15,'wiki-tierra_prometida':16,'wiki-the_hub':17
            };
            if (nameMap[openLv] != null) window.__openLevelModalById(openLv);
          }
        }, 250);
      }
    } catch(eO) { console.warn('[openLevel]', eO); }

    // Open an entity modal if the URL contains ?openEntity=ID
    // (e.g. when arriving from niveles.html via a linked entity card).
    try {
      var openEnt = null;
      if (typeof URLSearchParams !== 'undefined') {
        openEnt = new URLSearchParams(window.location.search).get('openEntity');
      } else {
        var mE = window.location.search.match(/[?&]openEntity=([^&]+)/);
        if (mE) openEnt = decodeURIComponent(mE[1]);
      }
      if (openEnt) {
        setTimeout(function() {
          if (window.__openEntityModalById) window.__openEntityModalById(openEnt);
        }, 350);
      }
    } catch(eEnt) { console.warn('[openEntity]', eEnt); }

    // Re-render dynamic content on language change
    document.addEventListener('langchange', function() {
      try {
        var wg = document.getElementById('wiki-grid');
        if (wg) renderLevels('wiki-grid');
        var vg = document.getElementById('videos-grid');
        if (vg) renderVideos('videos-grid');
        var eg = document.getElementById('entities-grid');
        if (eg) { renderEntities('entities-grid'); initEntityModal(); }
        var cg = document.getElementById('community-grid');
        if (cg) renderCommunity('community-grid', 'community-sub');
        // Re-bind modal handlers
        initLevelScan();
    initVideoModal();
    initEntityModal();
      } catch(e) { console.error('langchange re-render', e); }
    });

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

  var BACKROOMS_AUDIO = {
    _ctx: null,
    _masterGain: null,
    _humNodes: null,
    _volume: 0.6,
    _initialized: false,

    isInitialized: function() {
      return this._initialized;
    },

    init: function() {
      if (this._ctx) {
        if (this._ctx.state === 'suspended') { try { this._ctx.resume(); } catch(e) {} }
        return;
      }
      try {
        this._ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch(e) { console.warn('[AUDIO] AudioContext fail', e); return; }
      this._masterGain = this._ctx.createGain();
      this._masterGain.gain.value = this._volume;
      this._masterGain.connect(this._ctx.destination);
      this._initialized = true;
      if (this._ctx.state === 'suspended') { try { this._ctx.resume(); } catch(e) {} }
    },

    resume: function() {
      if (this._ctx && this._ctx.state === 'suspended') {
        try { this._ctx.resume(); } catch(e) {}
      }
    },

    setVolume: function(v) {
      this._volume = Math.max(0, Math.min(1, v));
      if (this._masterGain) this._masterGain.gain.value = this._volume;
    },

    _createNoise: function(duration) {
      var ctx = this._ctx;
      var len = Math.floor(ctx.sampleRate * duration);
      var buf = ctx.createBuffer(1, len, ctx.sampleRate);
      var ch = buf.getChannelData(0);
      for (var i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
      var src = ctx.createBufferSource();
      src.buffer = buf;
      return src;
    },

    playHum: function() {
      if (!this._ctx) return;
      this.stopHum();
      var ctx = this._ctx;
      var now = ctx.currentTime;

      var noise = this._createNoise(2);
      noise.loop = true;
      var noiseFilt = ctx.createBiquadFilter();
      noiseFilt.type = 'lowpass';
      noiseFilt.frequency.value = 200;
      var noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.08;
      noise.connect(noiseFilt);
      noiseFilt.connect(noiseGain);
      noiseGain.connect(this._masterGain);
      noise.start(now);

      var osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 60;
      var oscGain = ctx.createGain();
      oscGain.gain.value = 0.06;
      osc.connect(oscGain);
      oscGain.connect(this._masterGain);
      osc.start(now);

      this._humNodes = {
        noise: noise, osc: osc,
        noiseGain: noiseGain, oscGain: oscGain,
        noiseFilt: noiseFilt
      };
    },

    stopHum: function() {
      if (!this._humNodes) return;
      var n = this._humNodes;
      try { n.noise.stop(); } catch(e) {}
      try { n.osc.stop(); } catch(e) {}
      try {
        n.noise.disconnect(); n.osc.disconnect();
        n.noiseGain.disconnect(); n.oscGain.disconnect();
        n.noiseFilt.disconnect();
      } catch(e) {}
      this._humNodes = null;
    },

    playSteps: function() {
      if (!this._ctx) return;
      var ctx = this._ctx;
      var count = 3 + Math.floor(Math.random() * 2);
      var self = this;
      for (var i = 0; i < count; i++) {
        (function(idx) {
          setTimeout(function() {
            if (!self._ctx) return;
            var now = ctx.currentTime;
            var n = self._createNoise(0.1);
            var f = ctx.createBiquadFilter();
            f.type = 'bandpass';
            f.frequency.value = 300 + Math.random() * 200;
            f.Q.value = 2;
            var g = ctx.createGain();
            g.gain.setValueAtTime(0.35, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            n.connect(f); f.connect(g); g.connect(self._masterGain);
            n.start(now); n.stop(now + 0.12);
            setTimeout(function() {
              try { n.disconnect(); f.disconnect(); g.disconnect(); } catch(e) {}
            }, 200);
          }, idx * 280);
        })(i);
      }
    },

    playNoClip: function() {
      if (!this._ctx) return;
      var ctx = this._ctx;
      var now = ctx.currentTime;
      var self = this;

      var osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 1.5);
      var oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.2, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      var filt = ctx.createBiquadFilter();
      filt.type = 'lowpass';
      filt.frequency.setValueAtTime(2000, now);
      filt.frequency.exponentialRampToValueAtTime(200, now + 1.5);
      osc.connect(filt); filt.connect(oscGain); oscGain.connect(self._masterGain);
      osc.start(now); osc.stop(now + 1.6);

      var n = this._createNoise(1.5);
      var nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.05, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      var nFilt = ctx.createBiquadFilter();
      nFilt.type = 'highpass';
      nFilt.frequency.value = 1000;
      n.connect(nFilt); nFilt.connect(nGain); nGain.connect(self._masterGain);
      n.start(now); n.stop(now + 1.6);

      setTimeout(function() {
        try {
          osc.disconnect(); oscGain.disconnect(); filt.disconnect();
          n.disconnect(); nGain.disconnect(); nFilt.disconnect();
        } catch(e) {}
      }, 1700);
    },

    playHeartbeat: function() {
      if (!this._ctx) return;
      var ctx = this._ctx;
      var self = this;
      var beats = 4;
      for (var i = 0; i < beats; i++) {
        (function(idx) {
          setTimeout(function() {
            if (!self._ctx) return;
            var now = ctx.currentTime;
            var osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = 50;
            var g = ctx.createGain();
            g.gain.setValueAtTime(0, now);
            g.gain.linearRampToValueAtTime(0.25, now + 0.05);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.connect(g); g.connect(self._masterGain);
            osc.start(now); osc.stop(now + 0.35);
            setTimeout(function() {
              try { osc.disconnect(); g.disconnect(); } catch(e) {}
            }, 400);
          }, idx * 600);
        })(i);
      }
    },

    playDeath: function() {
      if (!this._ctx) return;
      var ctx = this._ctx;
      var now = ctx.currentTime;
      var self = this;

      var rumble = ctx.createOscillator();
      rumble.type = 'sawtooth';
      rumble.frequency.value = 30;
      var rGain = ctx.createGain();
      rGain.gain.setValueAtTime(0.2, now);
      rGain.gain.exponentialRampToValueAtTime(0.001, now + 3);
      var rFilt = ctx.createBiquadFilter();
      rFilt.type = 'lowpass';
      rFilt.frequency.value = 100;
      rumble.connect(rFilt); rFilt.connect(rGain); rGain.connect(self._masterGain);
      rumble.start(now); rumble.stop(now + 3.1);

      var tone = ctx.createOscillator();
      tone.type = 'sine';
      tone.frequency.value = 1200;
      var tGain = ctx.createGain();
      tGain.gain.setValueAtTime(0.1, now);
      tGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
      tone.connect(tGain); tGain.connect(self._masterGain);
      tone.start(now); tone.stop(now + 2.6);

      setTimeout(function() {
        try {
          rumble.disconnect(); rGain.disconnect(); rFilt.disconnect();
          tone.disconnect(); tGain.disconnect();
        } catch(e) {}
      }, 3200);
    },

    playStatic: function() {
      if (!this._ctx) return;
      var ctx = this._ctx;
      var now = ctx.currentTime;
      var self = this;
      var n = this._createNoise(0.5);
      var f = ctx.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = 3000;
      f.Q.value = 0.5;
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.25, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      n.connect(f); f.connect(g); g.connect(self._masterGain);
      n.start(now); n.stop(now + 0.55);
      setTimeout(function() {
        try { n.disconnect(); f.disconnect(); g.disconnect(); } catch(e) {}
      }, 600);
    },

    playClick: function() {
      if (!this._ctx) { this.init(); if (!this._ctx) return; }
      if (this._ctx.state === 'suspended') { try { this._ctx.resume(); } catch(e) {} }
      var ctx = this._ctx;
      var now = ctx.currentTime;
      var self = this;
      var n = this._createNoise(0.05);
      var f = ctx.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = 1800;
      f.Q.value = 4;
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.5, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      n.connect(f); f.connect(g); g.connect(self._masterGain);
      n.start(now); n.stop(now + 0.06);
      setTimeout(function() {
        try { n.disconnect(); f.disconnect(); g.disconnect(); } catch(e) {}
      }, 100);
    },

    stopAll: function() {
      this.stopHum();
    }
  };

  document.addEventListener('DOMContentLoaded', init);
})();

(function globalLiveUI() {
  if (typeof document === 'undefined') return;
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  function hex() {
    return Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0');
  }
  function injectLiveOnCards() {
    var map = [
      { sel: '.level-card',     cls: 'live-pill-ok',     label: 'ONLINE' },
      { sel: '.entity-card',    cls: 'live-pill-warn',   label: 'THREAT' },
      { sel: '.video-card',     cls: 'live-pill-secure', label: 'SECURE' },
      { sel: '.community-card', cls: 'live-pill-scan',   label: 'LIVE' }
    ];
    map.forEach(function(cfg) {
      document.querySelectorAll(cfg.sel).forEach(function(card) {
        if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
        if (!card.querySelector('.live-pill')) {
          var p = document.createElement('span');
          p.className = 'live-pill ' + cfg.cls;
          p.textContent = cfg.label;
          card.appendChild(p);
        }
        if (!card.querySelector('.live-scanline')) {
          var s = document.createElement('div');
          s.className = 'live-scanline';
          s.style.animationDuration = (3 + Math.random() * 3) + 's';
          s.style.animationDelay = (-Math.random() * 4) + 's';
          card.appendChild(s);
        }
      });
    });
    document.querySelectorAll('.db-card').forEach(function(card) {
      if (card.querySelector('.live-scanline')) return;
      var s = document.createElement('div');
      s.className = 'live-scanline';
      s.style.animationDuration = (4 + Math.random() * 3) + 's';
      s.style.animationDelay = (-Math.random() * 4) + 's';
      card.appendChild(s);
    });
  }
  function injectTechBars() {
    var cells = document.querySelectorAll('#level-modal-overlay .lm-tech-cell');
    cells.forEach(function(cell) {
      if (cell.querySelector('.lm-tech-bar')) return;
      var bar = document.createElement('div');
      bar.className = 'lm-tech-bar';
      cell.appendChild(bar);
    });
  }
  function tickDbCounters() {
    document.querySelectorAll('.db-card-count').forEach(function(el) {
      if (!el.dataset.liveBase) el.dataset.liveBase = el.textContent;
      var base = parseInt(el.dataset.liveBase, 10);
      if (isNaN(base)) return;
      if (Math.random() < 0.1 && !el._liveT) {
        var v = base + (Math.random() < 0.5 ? -1 : 1);
        if (v < 0) v = 0;
        el.textContent = (v < 10 ? '0' : '') + v;
        el.style.color = '#00ff7f';
        el.style.textShadow = '0 0 8px #00ff7f';
        el._liveT = setTimeout(function() {
          el.textContent = el.dataset.liveBase;
          el.style.color = '';
          el.style.textShadow = '';
          el._liveT = null;
        }, 300);
      }
    });
  }
  function tickLevelStatus() {
    var overlay = document.getElementById('level-modal-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    var statusEl = document.getElementById('level-modal-status');
    if (!statusEl) return;
    if (!statusEl.dataset.liveBase) statusEl.dataset.liveBase = statusEl.textContent;
    statusEl.textContent = statusEl.dataset.liveBase + ' \u00B7 SCAN 0x' + hex() + ' \u00B7 ' + (85 + Math.floor(Math.random() * 15)) + '%';
  }
  function tickLevelTech() {
    var overlay = document.getElementById('level-modal-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    var cells = overlay.querySelectorAll('.lm-tech-v');
    cells.forEach(function(cell) {
      if (Math.random() < 0.05 && !cell._liveT) {
        cell.classList.add('live-flick');
        cell._liveT = setTimeout(function() {
          cell.classList.remove('live-flick');
          cell._liveT = null;
        }, 180);
      }
    });
  }
  function tickVideo() {
    var overlay = document.getElementById('video-modal-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    var code = overlay.querySelector('.vm-modal-code');
    if (code) {
      if (!code.dataset.liveBase) code.dataset.liveBase = code.textContent;
      if (Math.random() < 0.12 && !code._liveT) {
        code.textContent = code.dataset.liveBase + ' \u00B7 0x' + hex();
        code._liveT = setTimeout(function() {
          code.textContent = code.dataset.liveBase;
          code._liveT = null;
        }, 350);
      }
    }
  }
  function tickHud() {
    var hud = document.querySelector('.hud-monitor');
    if (!hud) return;
    var rows = hud.querySelectorAll('.hud-data-value');
    if (rows.length < 4) return;
    if (Math.random() < 0.08) {
      rows[0].textContent = (Math.random() < 0.92) ? 'EN L\u00CDNEA' : 'RECONECTANDO';
    }
    rows[1].textContent = (92 + Math.floor(Math.random() * 8)) + '%';
    if (Math.random() < 0.15) {
      rows[2].textContent = '0x' + hex() + '\u00B7' + hex();
    }
    var estados = ['TRANSMITIENDO', 'ESCANEANDO', 'CODIFICANDO', 'ANALIZANDO', 'SINCRONIZANDO'];
    if (Math.random() < 0.2) {
      rows[3].textContent = estados[Math.floor(Math.random() * estados.length)];
    }
    rows.forEach(function(r) {
      r.classList.add('live-flick');
      clearTimeout(r._liveT);
      r._liveT = setTimeout(function() { r.classList.remove('live-flick'); }, 200);
    });
    var status = hud.querySelector('.hud-status');
    if (status && Math.random() < 0.1) {
      var states = ['EN L\u00CDNEA', 'TRANSMITIENDO', 'ESCANEANDO', 'B\u00DASQUEDA ACTIVA'];
      status.textContent = states[Math.floor(Math.random() * states.length)];
    }
    var img = hud.querySelector('.hud-image');
    if (img && Math.random() < 0.1) {
      img.classList.add('live-radar');
      clearTimeout(img._liveT);
      img._liveT = setTimeout(function() { img.classList.remove('live-radar'); }, 800);
    }
  }
  function hookModals() {
    var lm = document.getElementById('level-modal-overlay');
    if (!lm) return;
    new MutationObserver(function() {
      if (lm.classList.contains('active')) injectTechBars();
    }).observe(lm, { attributes: true, attributeFilter: ['class'] });
  }
  function initHeaderStatus() {
    function h4() { return Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0'); }
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    var sid = document.getElementById('hs-session-id');
    if (sid) sid.textContent = '0x' + h4() + '-' + h4();
    var clock = document.getElementById('hs-clock');
    var start = Date.now();
    function tickClock() {
      if (!clock) return;
      var s = Math.floor((Date.now() - start) / 1000);
      var h = Math.floor(s / 3600);
      var m = Math.floor((s % 3600) / 60);
      var sec = s % 60;
      clock.textContent = pad(h) + ':' + pad(m) + ':' + pad(sec);
    }
    tickClock();
    setInterval(tickClock, 1000);
    var sync = document.getElementById('hs-sync');
    var lat = document.getElementById('hs-latency');
    var ping = document.getElementById('hs-ping');
    setInterval(function() {
      if (sync) sync.textContent = (94 + Math.floor(Math.random() * 6)) + '%';
      if (lat) lat.textContent = (40 + Math.floor(Math.random() * 30)) + 'ms';
      if (ping) ping.textContent = (8 + Math.floor(Math.random() * 20)) + 'ms';
    }, 1500);
  }
  ready(function() {
    injectLiveOnCards();
    initHeaderStatus();
    hookModals();
    setInterval(tickDbCounters, 1200);
    setInterval(tickLevelStatus, 800);
    setInterval(tickLevelTech, 220);
    setInterval(tickVideo, 600);
    setInterval(tickHud, 1500);
  });
})();

(function homeGlitchBoost() {
  if (!document.body || document.body.dataset.page !== 'inicio') return;
  const cards = document.querySelectorAll('.db-card');
  cards.forEach((card) => {
    const title = card.querySelector('.db-card-title');
    const originalText = title ? title.textContent : '';
    const chars = originalText.split('');
    let scrambleTimer = null;
    card.addEventListener('mouseenter', () => {
      if (!title || scrambleTimer) return;
      let frame = 0;
      scrambleTimer = setInterval(() => {
        const scrambled = chars.map((c) => {
          if (c === ' ' || c === '\n') return c;
          if (Math.random() < 0.35) {
            const glitchChars = '█▓▒░<>/\\!?#*%$@';
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          }
          return c;
        }).join('');
        title.textContent = scrambled;
        frame++;
        if (frame > 10) {
          clearInterval(scrambleTimer);
          scrambleTimer = null;
          title.textContent = originalText;
        }
      }, 60);
    });
    card.addEventListener('mouseleave', () => {
      if (scrambleTimer) { clearInterval(scrambleTimer); scrambleTimer = null; }
      if (title) title.textContent = originalText;
    });
  });
})();

