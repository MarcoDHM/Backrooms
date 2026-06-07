/* Datos de entidades extraídos de la Wiki Hispana de los Backrooms (CC-BY-SA)
   https://backrooms.fandom.com/es/wiki/Entidades
   Imágenes y descripciones © sus respectivos autores, ver wiki_url por entrada. */
(function(global){
  function E(id,name,desc,danger,img,wiki){
    return { id:id, name:name, description:desc||'', danger:danger==null?1:danger,
      image:img, wiki_url:wiki };
  }
  var DATA = [
    E('ent-2','Entidad 2 — Ventanas','Las Ventanas son entidades que se manifiestan como ventanas en las paredes de los Backrooms. Cuando una Ventana se activa, muestra una habitación vacía detrás de ella que atrae a los vagabundos hacia adentro. Una vez dentro, la víctima queda atrapada en una dimensión de espejos de la que es muy difícil escapar. Son comunes en el Nivel 2 y otros niveles oscuros.',3,'images/Entidades/entidad_2_ventanas.jpg',
      'https://backrooms.fandom.com/es/wiki/Entidad_2'),

    E('ent-3','Entidad 3 — Smilers','Los Smilers son entidades que se caracterizan por su sonrisa permanente y brillante en la oscuridad. Atacan a cualquier vagabundo que se encuentre en la oscuridad sin fuente de luz. Son extremadamente agresivos y peligrosos, capaces de perseguir víctimas a gran velocidad. Su sonrisa es lo único visible en la penumbra antes del ataque.',5,'images/Entidades/entidad_3_smilers.jpg',
      'https://backrooms.fandom.com/es/wiki/Entidad_3'),

    E('ent-4','Entidad 4 — Polilla de la Muerte','Las Polillas de la Muerte son entidades que se asemejan a polillas gigantes. Son atraídas por las fuentes de luz y pueden ser encontradas en muchos niveles de los Backrooms. Aunque no son agresivas por naturaleza, su picadura puede causar alucinaciones, náuseas y en casos extremos la muerte. Se recomienda mantenerse alejado de ellas.',2,'images/Entidades/entidad_4_polilla_de_la_muerte.jpg',
      'https://backrooms.fandom.com/es/wiki/Entidad_4'),

    E('ent-5','Entidad 5 — Clumps','Los Clumps son entidades que aparecen como masas amorfas de carne y hueso. Se mueven lentamente por los pasillos y habitaciones de los Backrooms. Atacan a los vagabundos que se acercan demasiado, envolviéndolos con sus tentáculos carnosos. Son comunes en niveles oscuros y húmedos como el Nivel 2.',3,'images/Entidades/entidad_5_clumps.jpg',
      'https://backrooms.fandom.com/es/wiki/Entidad_5'),

    E('ent-6','Entidad 6 — Dullers','Los Dullers son entidades que aparecen como humanoides pálidos y sin rasgos distinguibles. Son atraídos por las emociones intensas de los vagabundos, especialmente el miedo y la desesperación. Al acercarse, drenan las emociones de su víctima, dejándola en un estado de apatía total y incapacidad de sentir. No son letales, pero dejan a sus víctimas completamente vacías emocionalmente.',3,'images/Entidades/entidad_6_dullers.jpg',
      'https://backrooms.fandom.com/es/wiki/Entidad_6'),

    E('ent-8','Entidad 8 — Sabuesos','Los Sabuesos son entidades caninas agresivas que cazan en manada por los niveles oscuros de los Backrooms. Tienen un olfato extremadamente desarrollado y pueden detectar a los vagabundos a grandes distancias. Son rápidos y feroces, capaces de derribar puertas y barreras. Se recomienda evitarlos a toda costa, ya que son difíciles de escapar una vez que te persiguen.',3,'images/Entidades/entidad_8_sabuesos.jpg',
      'https://backrooms.fandom.com/es/wiki/Entidad_8'),

    E('ent-9','Entidad 9 — Facelings','Los Facelings son humanoides que carecen de rasgos faciales — no tienen ojos, nariz ni boca. Pueden encontrarse en casi todos los niveles de los Backrooms. Aunque la mayoría son pacíficos y simplemente deambulan sin rumbo, algunos pueden volverse agresivos si se sienten amenazados. Se recomienda no interactuar con ellos.',2,'images/Entidades/entidad_9_facelings.jpg',
      'https://backrooms.fandom.com/es/wiki/Entidad_9'),

    E('ent-10','Entidad 10 — Ladrones de Piel','Los Ladrones de Piel son entidades que pueden imitar la apariencia de humanos perfectamente. Cazan a los vagabundos, los matan y se quedan con su piel para hacerse pasar por humanos. Son extremadamente peligrosos y difíciles de detectar. Se recomienda desconfiar de cualquier persona que muestre comportamientos extraños o no recuerde detalles específicos de su pasado.',4,'images/Entidades/entidad_10_ladrones_de_piel.jpg',
      'https://backrooms.fandom.com/es/wiki/Entidad_10'),

    E('ent-12','Entidad 12 — Howlers','Los Howlers son entidades que emiten aullidos estridentes y perturbadores que resuenan por los pasillos de los Backrooms. Estos aullidos pueden causar pánico, desorientación y dolores de cabeza severos en los vagabundos. Son cazadores nocturnos que usan el sonido para localizar a sus presas. Se recomienda mantenerse en silencio absoluto cuando se escuchen sus aullidos.',3,'images/Entidades/entidad_12_howlers.jpg',
      'https://backrooms.fandom.com/es/wiki/Entidad_12'),

    E('ent-15','Entidad 15 — Insanos','Los Insanos son vagabundos que han perdido completamente la cordura debido al aislamiento y el horror de los Backrooms. Han mutado física y mentalmente, convirtiéndose en seres peligrosos e impredecibles. Atacan a cualquier cosa que se acerque, incluso a otros Insanos. Son el resultado de quedarse demasiado tiempo en los niveles más hostiles.',4,'images/Entidades/entidad_15_insanos.jpg',
      'https://backrooms.fandom.com/es/wiki/Entidad_15'),

    E('ent-17','Entidad 17 — Crawlers','Los Crawlers son entidades que se desplazan Gateando por paredes y techos. Son rápidos y sigilosos, capaces de aparecer sin previo aviso. Atacan a los vagabundos que pasan debajo de ellos, lanzándose desde arriba. Son comunes en niveles con estructuras como el Nivel 2 y el Nivel 8.',2,'images/Entidades/entidad_17_crawlers.jpg',
      'https://backrooms.fandom.com/es/wiki/Entidad_17'),

    E('ent-36','Entidad 36 — Lighters','Los Lighters son entidades benignas que se manifiestan como pequeñas luces flotantes. Pueden ser seguidas para encontrar salidas o niveles más seguros. Algunos vagabundos las comparan con fuegos fatuos. No son peligrosas y en realidad pueden ser útiles para navegar por los niveles oscuros.',1,'images/Entidades/entidad_36_lighters.jpg',
      'https://backrooms.fandom.com/es/wiki/Entidad_36'),

    E('ent-50','Entidad 50 — Las Sombras','Las Sombras son entidades que habitan en la oscuridad más profunda de los Backrooms. Se manifiestan como figuras oscuras y amorfas que se mueven lentamente por los pasillos. Son atraídas por las fuentes de luz y pueden absorber la energía de cualquier cosa que toquen. Son particularmente comunes en niveles oscuros como el Nivel 6.',3,'images/Entidades/entidad_50_las_sombras.jpg',
      'https://backrooms.fandom.com/es/wiki/Entidad_50'),

    E('ent-65','Entidad 65 — Maniquíes','Los Maniquíes son entidades que se asemejan a maniquíes de tienda estáticos. Normalmente permanecen inmóviles, pero cuando un vagabundo no los observa, se mueven lentamente para acercarse. Si logran tocar a su víctima, esta se convierte en otro maniquí. Se recomienda no perderlos de vista nunca.',2,'images/Entidades/entidad_65_maniquies.jpg',
      'https://backrooms.fandom.com/es/wiki/Entidad_65'),

    E('ent-66','Entidad 66 — Fantasmas','Los Fantasmas son entidades incorpóreas que aparecen como figuras translúcidas flotando por los pasillos. Son los restos espirituales de vagabundos que murieron en los Backrooms. No son agresivos, pero su presencia puede causar sensaciones de frío, tristeza y desesperación. Algunos pueden intentar comunicarse con los vivos.',2,'images/Entidades/entidad_66_fantasmas.jpg',
      'https://backrooms.fandom.com/es/wiki/Entidad_66'),

    E('ent-67','Entidad 67 — Partygoers','Los Partygoers son entidades que habitan en el Nivel Fun y otros niveles de fiesta. Se asemejan a humanoides con cabezas de globos y son extremadamente hostiles. Atraen a los vagabundos con música y fiestas, pero una vez dentro, los convierten en uno de ellos mediante un proceso doloroso. Son una de las entidades más peligrosas de los Backrooms.',4,'images/Entidades/entidad_67_partygoers.jpg',
      'https://backrooms.fandom.com/es/wiki/Entidad_67'),

    E('ent-68','Entidad 68 — Partypoopers','Los Partypoopers son entidades que habitan en el Nivel Fun como rivales de los Partygoers. A diferencia de estos, los Partypoopers son entidades depresivas y apáticas que no participan en las fiestas. Son pacíficos pero pueden ser peligrosos si se provocan. Se dice que alguna vez fueron Partygoers que perdieron la alegría.',1,'images/Entidades/entidad_68_partypoopers.jpg',
      'https://backrooms.fandom.com/es/wiki/Entidad_68'),

    E('ent-94','Entidad 94 — Clickers','Los Clickers son entidades que emiten sonidos de clic repetitivos. Son atraídos por los sonidos que producen los vagabundos. Si detectan movimiento o sonido, se vuelven extremadamente agresivos y rápidos. Se recomienda mantenerse completamente en silencio y movimiento mínimo cuando se esté cerca de ellos.',3,'images/Entidades/entidad_94_clickers.jpg',
      'https://backrooms.fandom.com/es/wiki/Entidad_94'),

    E('ent-111','Entidad 111 — Ætinerrabú','Ætinerrabú es una entidad antigua y poderosa que habita en los niveles más profundos de los Backrooms. Es descrita como una masa oscura y cambiante que puede manipular la realidad a su alrededor. Es extremadamente peligrosa y se cree que es una de las entidades más antiguas de los Backrooms. Su origen es completamente desconocido.',4,'images/Entidades/entidad_111_aetinerrabu.jpg',
      'https://backrooms.fandom.com/es/wiki/Entidad_111'),

    E('ent-3a','Entidad 3-A — Frowners','Los Frowners son una variante de los Smilers pero con expresiones tristes en lugar de sonrientes. Son igualmente peligrosos que los Smilers regulares, pero su presencia causa una sensación intensa de tristeza y desesperación en los vagabundos. Se encuentran principalmente en niveles oscuros y melancólicos.',3,'images/Entidades/entidad_3a_frowners.jpg',
      'https://backrooms.fandom.com/es/wiki/Entidad_3-A')
  ];
  global.WIKI_ENTITIES_WIKI = DATA;
})(typeof window !== 'undefined' ? window : this);
