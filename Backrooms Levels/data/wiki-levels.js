/* Datos de niveles extraídos de la Wiki Hispana de los Backrooms (CC-BY-SA)
   https://backrooms.fandom.com/es/wiki/Niveles
   Imágenes y descripciones © sus respectivos autores, ver wiki_url por entrada. */
(function(global){
  function makeTech(c){
    var temps=['21°C','19°C','48°C','14°C','22°C','17°C','-2°C','4°C','11°C'];
    var toxics=['0.04 ppm','0.02 ppm','3.2 ppm NH\u2083','0.6 ppm Ozono','0.01 ppm','0.8 ppm','0.4 ppm','0.03 ppm','0.02 ppm'];
    var hums=['78%','52%','18%','64%','40%','65%','95%','88%','70%'];
    var rads=['0.02 \u00b5Sv/h','0.03 \u00b5Sv/h','0.08 \u00b5Sv/h','0.21 \u00b5Sv/h','0.05 \u00b5Sv/h','0.10 \u00b5Sv/h','0.04 \u00b5Sv/h','0.06 \u00b5Sv/h','0.03 \u00b5Sv/h'];
    var gravs=['1.00 G','0.99 G','1.02 G','1.01 G','1.00 G','1.01 G','1.00 G','1.00 G','1.00 G'];
    var o2s=['20.4%','20.1%','17.8%','20.0%','20.5%','19.8%','20.2%','20.3%','20.4%'];
    var habs=['Alta','Media','Baja','Baja','Alta','Media','Media','Media','Alta'];
    var t=temps[c]||'20\u00b0C', tx=toxics[c]||'0.05 ppm', hm=hums[c]||'55%', rd=rads[c]||'0.05 \u00b5Sv/h', gv=gravs[c]||'1.00 G', ox=o2s[c]||'20.0%', hb=habs[c]||'Media';
    return { temp:t, toxic:tx, humidity:hm, radiation:rd, gravity:gv, oxygen:ox, habitability:hb };
  }
  function deriveConns(exits){
    if(!exits||!exits.length) return [];
    return exits.map(function(e){
      var t='NO-CLIP';
      var m='Acceso documentado por la wiki';
      if(/nivel|level|hub|the end/i.test(e)) t='SALIDA';
      return { type:t, from:'', to:e, method:m };
    });
  }
  function L(id,slug,name,alias,cls,diff,img,wiki,desc,ents,exits,tags){
    return { id:id, slug:slug, name:name, alias:alias||'', class:cls==null?0:cls, difficulty:diff==null?0:diff,
      image:img, wiki_url:wiki, description:desc||'', entities:ents||'Ninguna',
      entities_list:[], exits:exits||[], tags:tags||[], technical:makeTech(cls||0), connections:deriveConns(exits) };
  }
  var DATA = [
    /* === NUEVE PRINCIPALES === */
    L('wiki-0','level_0','Nivel 0 \u2014 El Lobby','El Lobby',0,0,'level_0.jpg',
      'https://backrooms.fandom.com/es/wiki/Nivel_0',
      'El Nivel 0, tambi\u00e9n conocido como "El Lobby", es el primer nivel de Los Backrooms. Un espacio expansivo no euclidiano que se asemeja a la trastienda de un antiguo comercio, con papel mono-amarillento, alfombras desgastadas y luces fluorescentes que zumban constantemente. El zumbido puede provocar migra\u00f1as y los vagabundos pueden caer en locura total por el aislamiento.',
      'Ninguna',
      ['Nivel 1','Nivel 27','Nivel -1','Nivel 2','The Hub'],
      ['No lineal','Estable','H\u00fameda']),

    L('wiki-1','level_1','Nivel 1 \u2014 Zona Habitable','Zona Habitable',1,1,'level_1.jpg',
      'https://backrooms.fandom.com/es/wiki/Nivel_1',
      'El Nivel 1 es un almac\u00e9n com\u00fan con pisos y paredes de concreto. Tiene suministro constante de agua y electricidad, y cajas de suministros dispersas con comida, Agua de almendras, bater\u00edas, armamento, suministros m\u00e9dicos y objetos aleatorios. Ocurren apagones aleatorios que traen entidades. Incluye sub-\u00e1reas: Los Pasillos, Los Estacionamientos.',
      'Dullers, Facelings, Sabuesos, Ladrones de Piel',
      ['Nivel 2','Nivel 19','Nivel 188','The Hub','Nivel 92','Nivel 94','Nivel 10'],
      ['Lineal','Suministros','Templado']),

    L('wiki-2','level_2','Nivel 2 \u2014 Sistema de Tuber\u00edas','Sistema de Tuber\u00edas',3,2,'level_2.jpg',
      'https://backrooms.fandom.com/es/wiki/Nivel_2',
      'El Nivel 2 es un sistema de alcantarillado subterr\u00e1neo con pasillos y habitaciones estrechas de concreto pr\u00e1cticamente indestructible. Ocasionalmente es posible encontrar ca\u00edos de agua, tuber\u00edas oxidadas y maquinaria abandonada. Es el \u00faltimo nivel al que se puede llegar directamente desde la realidad mediante no-clip.',
      'Entidad 2 (Ventanas), Entidad 17 (Crawlers), Entidad 5 (Clumps)',
      ['Nivel 0','Nivel 1','Nivel 3','Nivel 4','Nivel 8','Nivel 10','Nivel 11','Nivel 22','Nivel 27','Nivel -1'],
      ['Alta temp.','Estrecho','Ruidoso']),

    L('wiki-3','level_3','Nivel 3 \u2014 Estaci\u00f3n El\u00e9ctrica','Estaci\u00f3n El\u00e9ctrica',3,2,'level_3.jpg',
      'https://backrooms.fandom.com/es/wiki/Nivel_3',
      'El Nivel 3 se asemeja a un complejo de habitaciones y pasillos equipados con maquinaria compleja y artefactos el\u00e9ctricos. Su arquitectura sugiere una estaci\u00f3n el\u00e9ctrica en abandono pero a\u00fan operativa, con zonas oscuras y peligro constante de electrocutaci\u00f3n.',
      'Entidad 11 (Hormigas de Memoria), varias sin documentar',
      ['Nivel 1','Nivel 5','Nivel 9','Nivel 22'],
      ['Electricidad','Oscuridad','Maquinaria']),

    L('wiki-4','level_4','Nivel 4 \u2014 Oficinas Abandonadas','Oficinas Abandonadas',2,2,'level_4.jpg',
      'https://backrooms.fandom.com/es/wiki/Nivel_4',
      'El Nivel 4 es un complejo infinito de habitaciones y pasillos que hacen recordar a una oficina con paredes blancas y alfombra gris, con ventanas que dan al exterior. Las zonas principales carecen de muebles, en contraste con algunas \u00e1reas que a\u00fan presentan mobilier\u00eda de oficina intacta.',
      'Entidad 9 (Facelings), Entidad 67 (Partygoers)',
      ['Nivel 2','Nivel 3','Nivel 5','Nivel 6','Nivel 7','Nivel 16','Nivel 153','Nivel 188','The Hub'],
      ['Tranquilo','Recursos','Est\u00e1tico']),

    L('wiki-5','level_5','Nivel 5 \u2014 Hotel del Terror','Hotel del Terror',5,4,'level_5.jpg',
      'https://backrooms.fandom.com/es/wiki/Nivel_5',
      'El Nivel 5 es un complejo hotelero infinito con todas las secciones que un hotel podr\u00eda tener: salones, salones de baile, habitaciones para hu\u00e9spedes, restaurantes, pasillos y salas de mantenimiento. Arquitectura que sugiere ser de principios del siglo XX. Es extremadamente peligroso y aislado.',
      'Entidad 67 (Partygoers), La Bestia del Nivel 5',
      ['Nivel 4','Nivel 6','Nivel 7','Nivel 9','Nivel 22','Nivel 117'],
      ['Hotel','Infinito','Aislado']),

    L('wiki-6','level_6','Nivel 6 \u2014 Luces Fuera','Luces Fuera',4,3,'level_6.jpg',
      'https://backrooms.fandom.com/es/wiki/Nivel_6',
      'El Nivel 6 es el s\u00e9ptimo nivel de Los Backrooms. Es una zona extremadamente oscura donde la iluminaci\u00f3n es pr\u00e1cticamente inexistente y los vagabundos deben confiar en su propio equipamiento lum\u00ednico. Cualquier fuente de luz atrae entidades.',
      'M\u00faltiples entidades agresivas',
      ['Nivel 5','Nivel 4','Nivel 7','Nivel 22'],
      ['Oscuridad','Peligroso','Sin luz']),

    L('wiki-7','level_7','Nivel 7 \u2014 Talasofobia','Talasofobia',3,3,'level_7.jpg',
      'https://backrooms.fandom.com/es/wiki/Nivel_7',
      'El Nivel 7 es un oc\u00e9ano completamente infinito que se extiende en todas las direcciones. Es una combinaci\u00f3n entre una edificaci\u00f3n inundada de la que apenas se ven los pisos superiores y agua marina. Supone un obst\u00e1culo importante para la exploraci\u00f3n del Nivel 8 y niveles posteriores.',
      'Entidad 20 (El Pez), Entidad 21 (Cimmerios), Entidad 59 (Gatos Marinos)',
      ['Nivel 6','Nivel 8'],
      ['Océano','Infinito','Inundado']),

    L('wiki-8','level_8','Nivel 8 \u2014 Sistema de Cuevas','Sistema de Cuevas',5,4,'level_8.jpg',
      'https://backrooms.fandom.com/es/wiki/Nivel_8',
      'El Nivel 8 es el noveno y \u00faltimo de Los Nueve Principales. Se caracteriza por grandes cuevas con una gran variedad de ambientes y ecosistemas. Sistema de enormes cavernas y peque\u00f1os sistemas de cuevas que se retuercen como en cualquier sistema subterr\u00e1neo colectivo.',
      'Entidad 2 (Ventanas), Entidad 7 (Challketrewas), Entidad 39 (Ar\u00e1cnidos de Cueva)',
      ['Nivel 7','Nivel 9'],
      ['Cuevas','Subterr\u00e1neo','H\u00fameda']),

    /* === NEGATIVOS === */
    L('wiki-neg0','level_neg0','Nivel -0 \u2014 Sin Textura','Sin Textura',0,1,'level_neg0.jpg',
      'https://backrooms.fandom.com/es/wiki/Nivel_-0',
      'El Nivel -0 es una amalgama de estructuras estilo Maurits Cornelis Escher, con un entorno abstracto e inconexo, con texturas similares a un modelo carente de texturas dentro de un videojuego. Primer nivel negativo de Los Backrooms.',
      'Ninguna',
      ['Nivel 0','Nivel 1','Nivel 11','Nivel 71','Nivel -1'],
      ['Abstracto','Inconexo','No-textura']),

    L('wiki-neg1','level_neg1','Nivel -1 \u2014 Pasillos a Escala de Grises','Pasillos a Escala de Grises',2,1,'level_neg1.jpg',
      'https://backrooms.fandom.com/es/wiki/Nivel_-1',
      'El Nivel -1, tambi\u00e9n conocido como "Pasillos a Escala de Grises", es el segundo nivel negativo de Los Backrooms por debajo del Nivel 0. Pasillos en escala de grises con una atm\u00f3sfera opresiva y silenciosa.',
      'Entidad 9 (Facelings)',
      ['Nivel 0','Nivel 2'],
      ['Grises','Opresivo','Silencioso']),

    L('wiki-neg2','level_neg2','Nivel -2 \u2014 Desbordamiento','Desbordamiento',4,4,'level_neg2.jpg',
      'https://backrooms.fandom.com/es/wiki/Nivel_-2',
      'El Nivel -2 es el tercer nivel negativo de los Backrooms, con cuatro sub\u00e1reas diferentes. Alberga varias entidades indocumentadas y hostiles, algunas de las m\u00e1s siniestras. La ca\u00edda de ejes gravitacionales y los patrones impredecibles lo convierten en un lugar extremadamente peligroso.',
      'Entidades hostiles no documentadas',
      ['Nivel -1','Nivel -3','Nivel 0'],
      ['Peligroso','Inestable','Hostil']),

    L('wiki-neg3','level_neg3','Nivel -3 \u2014 Reflexiones','Reflexiones',3,3,'level_neg3.jpg',
      'https://backrooms.fandom.com/es/wiki/Nivel_-3',
      'El Nivel -3, mejor conocido como "Reflexiones", es el cuarto nivel negativo. Descrito como una versi\u00f3n m\u00e1s deforme de un laberinto de espejos. Los espejos no muestran tu propio reflejo, creando una enorme sensaci\u00f3n de desorientaci\u00f3n.',
      'Entidad 26 (Samantha)',
      ['Nivel -2'],
      ['Espejos','Deforme','Desorientaci\u00f3n']),

    /* === ENIGMÁTICOS === */
    L('wiki-the_end','level_the_end','The End','El Fin',4,3,'level_the_end.jpg',
      'https://backrooms.fandom.com/es/wiki/The_End',
      'The End es una trampa que tiene como objetivo atraer a los vagabundos a una falsa sensaci\u00f3n de seguridad, haci\u00e9ndoles creer que finalmente han escapado. La estructura consiste en una biblioteca de los a\u00f1os 2000 completamente vac\u00eda y silenciosa. Cualquier intento de salir revela que sigues dentro.',
      'Ninguna',
      ['Nivel 0','Nivel 444'],
      ['Trampa','Biblioteca','Engaño']),

    L('wiki-l4_s0mbr4_gr1s','level_l4_s0mbr4_gr1s','L4 S0MBR4 GR1S','La Sombra Gris',5,4,'level_l4_s0mbr4_gr1s.jpg',
      'https://backrooms.fandom.com/es/wiki/L4_S0MBR4_GR1S',
      'Los Backrooms como un purgatorio donde las almas desdichadas est\u00e1n condenadas a vivir una serie de sucesos tortuosos. Lugares inimaginables de la tierra son transportados a un revoltijo de espacios liminales en una dimensi\u00f3n desconocida.',
      'Entidad 50 (Las Sombras)',
      ['Nivel 4'],
      ['Purgatorio','Sombra','Liminal']),

    L('wiki-corre','level_corre_por_tu_vida','\u00a1Corre por tu vida!','Nivel !',0,5,'level_corre_por_tu_vida.jpg',
      'https://backrooms.fandom.com/es/wiki/%C2%A1Corre_por_tu_vida!',
      'Durante horas, llevas huyendo en este pasillo interminable. Est\u00e1s cansado, hambriento y sediento. La adrenalina corre por tu cuerpo, pero tus piernas est\u00e1n agotadas. Con sus rugidos, gru\u00f1idos y gritos, acompa\u00f1ado con el estruendo de la alarma, comienzas a disociar de la realidad. Nivel cronol\u00f3gico: el tiempo se acelera para agotarte.',
      'Entidades cazadoras',
      ['Nivel 0'],
      ['Perseguci\u00f3n','Alarma','Infinito']),

    L('wiki-tierra_prometida','level_la_tierra_prometida','La Tierra Prometida','Tierra Prometida',0,0,'level_la_tierra_prometida.jpg',
      'https://backrooms.fandom.com/es/wiki/La_Tierra_Prometida',
      'La Tierra Prometida es un nivel enigm\u00e1tico de Los Backrooms y uno de los pocos en los que puedes volver a la realidad. Un oasis de paz dentro del caos liminal.',
      'Ninguna',
      ['REAL'],
      ['Oasis','Escape','Paz']),

    L('wiki-the_hub','level_the_hub','The Hub','El Centro',0,0,'level_the_hub.jpg',
      'https://backrooms.fandom.com/es/wiki/The_Hub',
      'The Hub, tambi\u00e9n conocido como "El Centro" o "La Encrucijada", es un extenso complejo subterr\u00e1neo de t\u00faneles de ladrillo que sirve de nexo entre los niveles. Contiene entradas a la gran mayor\u00eda de niveles, cerradas tras puertas de acero dispersas en posiciones inestables y cambiantes.',
      'Vagabundos de todos los niveles',
      ['Nivel 1','Nivel 2','Nivel 4','Nivel 37','Nivel 154','Nivel 188'],
      ['Nexo','T\u00faneles','Puertas'])
  ];
  /* Inyectar slug para retrocompatibilidad con buildLevelCardHTML */
  DATA.forEach(function(d){
    if(!d.id) d.id = d.slug;
    if(!d.survival) d.survival = d.class;
    if(!d.visual) d.visual = 'lv-visual-' + d.class;
    d.image = 'images/Niveles/' + d.image;
    d.connections.forEach(function(c){ if(!c.from) c.from = d.name.replace(/\s*\u2014\s*/,' \u2192 '); });
  });
  global.WIKI_LEVELS_WIKI = DATA;
})(typeof window !== 'undefined' ? window : this);
