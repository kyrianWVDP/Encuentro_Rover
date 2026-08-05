import type { Question, Rng } from "./types";

export const QUESTIONS: Question[] = [
  {
    id: 1,
    texto: "¿Qué es el Roverismo?",
    respuestaCorrecta: "Es el método scout aplicado a los jóvenes de la Rama Rover, orientado a su formación personal, ciudadana y de servicio.",
  },
  {
    id: 2,
    texto: "¿Entre qué edades se aplica el método Rover según Roverismo Práctico?",
    respuestaCorrecta: "Entre los 18 y los 22 años.",
  },
  {
    id: 3,
    texto: "¿Qué lugar ocupa la Rama Rover dentro del Escultismo?",
    respuestaCorrecta: "Constituye la Rama Mayor del Escultismo.",
  },
  {
    id: 4,
    texto: "¿Cuál es el lema de los Rovers?",
    respuestaCorrecta: "Servir.",
  },
  {
    id: 5,
    texto: "¿Cuál es la finalidad fundamental de la Rama Rover?",
    respuestaCorrecta: "Ayudar al joven a desarrollar su vida personal y comunitaria, preparándolo para actuar responsablemente como adulto y ciudadano.",
  },
  {
    id: 6,
    texto: "¿Cuál es la unidad metodológica del Roverismo?",
    respuestaCorrecta: "El individuo.",
  },
  {
    id: 7,
    texto: "¿Qué significa “remar la propia canoa”?",
    respuestaCorrecta: "Dirigir responsablemente la propia vida, elegir un camino y no esperar que otras personas tomen todas las decisiones.",
  },
  {
    id: 8,
    texto: "¿Cómo debe entenderse el servicio dentro del Roverismo?",
    respuestaCorrecta: "Como una actitud permanente y una forma de vida, no solamente como una actividad ocasional.",
  },
  {
    id: 9,
    texto: "¿Cómo se denomina la unidad de la Rama Rover?",
    respuestaCorrecta: "Clan de Rovers.",
  },
  {
    id: 10,
    texto: "¿Quién dirige educativamente el Clan?",
    respuestaCorrecta: "El Jefe de Clan, acompañado por sus Subjefes.",
  },
  {
    id: 11,
    texto: "¿Cuál es la función principal del Jefe de Clan?",
    respuestaCorrecta: "Orientar, acompañar y facilitar el desarrollo personal de los Rovers.",
  },
  {
    id: 12,
    texto: "¿Debe el Jefe de Clan tomar todas las decisiones por los Rovers?",
    respuestaCorrecta: "No. Debe ayudarlos a desarrollar autonomía y capacidad para decidir responsablemente.",
  },
  {
    id: 13,
    texto: "¿Cuál es la función de los Subjefes de Clan?",
    respuestaCorrecta: "Colaborar con el Jefe de Clan en la orientación, organización y acompañamiento de los Rovers.",
  },
  {
    id: 14,
    texto: "¿Qué son los equipos del Clan?",
    respuestaCorrecta: "Grupos de Rovers organizados para desarrollar un proyecto, servicio o actividad concreta. Generalmente son temporales y funcionan mientras dure la tarea que les dio origen.",
  },
  {
    id: 15,
    texto: "¿Qué es el Consejo de Clan?",
    respuestaCorrecta: "Es el organismo de deliberación, participación y decisión del Clan.",
  },
  {
    id: 16,
    texto: "¿Quiénes forman el Consejo de Clan?",
    respuestaCorrecta: "El Consejo de Clan está conformado por el Jefe de Clan, los Subjefes y los RBS. Los Rovers Escuderos podrán participar como oyentes, teniendo derecho a expresar sus opiniones y aportar ideas, pero sin derecho a voto.",
  },
  {
    id: 17,
    texto: "¿Qué es el Piloto Rover?",
    respuestaCorrecta: "Es un Rover elegido para ayudar en la coordinación, comunicación y dinamización del Clan.",
  },
  {
    id: 18,
    texto: "¿Quién propone al Piloto Rover?",
    respuestaCorrecta: "El Consejo de Clan.",
  },
  {
    id: 19,
    texto: "¿Por qué se le llama Piloto a la cabeza del Clan Rover?",
    respuestaCorrecta: "Porque antiguamente el grupo Rover era concebido como una tripulación (crew), y el Piloto Rover era quien asumía el liderazgo y guiaba al grupo en su rumbo.",
  },
  {
    id: 20,
    texto: "¿Qué cualidades debe poseer el Piloto Rover?",
    respuestaCorrecta: "Responsabilidad, liderazgo, participación activa, capacidad de comunicación y espíritu de servicio.",
  },
  {
    id: 21,
    texto: "¿Qué es el Plan de Adelanto Rover?",
    respuestaCorrecta: "Es el instrumento que orienta y ayuda al Rover a vivir su progresión personal.",
  },
  {
    id: 22,
    texto: "¿Quién es el principal responsable del adelanto de un Rover?",
    respuestaCorrecta: "El propio Rover.",
  },
  {
    id: 23,
    texto: "¿Cuáles son las etapas de progresión Rover mencionadas en el manual?",
    respuestaCorrecta: "Escudero Rover, Rover Boy Scout y Rover de Baden-Powell.",
  },
  {
    id: 24,
    texto: "¿Qué es un Escudero Rover?",
    respuestaCorrecta: "Es el joven que se encuentra en la etapa inicial de conocimiento, integración y preparación dentro del Clan.",
  },
  {
    id: 25,
    texto: "¿Qué debe conocer el Escudero Rover?",
    respuestaCorrecta: "La vida del Clan, la Ley y la Promesa, las técnicas scouts, el campismo y las responsabilidades propias de la Rama Rover.",
  },
  {
    id: 26,
    texto: "¿Qué es el Padrino Rover?",
    respuestaCorrecta: "Es un Rover Boy Scout que acompaña y orienta al Escudero durante su preparación.",
  },
  {
    id: 27,
    texto: "¿Cuál es la función del Padrino Rover?",
    respuestaCorrecta: "Acompañar, enseñar, orientar, dar ejemplo y ayudar al Escudero a prepararse para asumir su compromiso Rover.",
  },
  {
    id: 28,
    texto: "¿Qué es un Rover Boy Scout?",
    respuestaCorrecta: "Es el Rover investido que asumió conscientemente la Promesa, la Ley Scout y el compromiso de servir.",
  },
  {
    id: 29,
    texto: "¿Qué caracteriza a la etapa de Rover Boy Scout?",
    respuestaCorrecta: "Una vida activa en el Clan, el servicio, la progresión personal y la participación responsable en proyectos.",
  },
  {
    id: 30,
    texto: "¿Qué son las especialidades Rovers?",
    respuestaCorrecta: "Son desafíos de formación práctica que permiten al Rover profundizar en diferentes áreas y aplicar sus capacidades.",
  },
  {
    id: 31,
    texto: "¿Cuáles son las especialidades Rovers mencionadas en el manual?",
    respuestaCorrecta: "Técnica Scout, Expediciones, Proyectos y Servicio.",
  },
  {
    id: 32,
    texto: "¿Qué busca la Especialidad de Técnica Scout?",
    respuestaCorrecta: "Desarrollar y demostrar conocimientos y habilidades scouts aplicables a actividades reales.",
  },
  {
    id: 33,
    texto: "¿Qué busca la Especialidad de Expediciones?",
    respuestaCorrecta: "Capacitar al Rover para preparar y realizar recorridos, viajes o experiencias de exploración con responsabilidad.",
  },
  {
    id: 34,
    texto: "¿Qué es el Rover de Baden-Powell?",
    respuestaCorrecta: "Es el Rover que alcanzó la máxima etapa de progresión establecida en el Plan de Adelanto Rover.",
  },
  {
    id: 35,
    texto: "¿Puede un Rover usar una insignia que todavía no obtuvo?",
    respuestaCorrecta: "No. Las insignias deben representar etapas, funciones o logros oficialmente reconocidos.",
  },
  {
    id: 36,
    texto: "¿Cuál es el color del kepí de los Rovers según el manual?",
    respuestaCorrecta: "Rojo, con la insignia oficial correspondiente.",
  },
  {
    id: 37,
    texto: "¿Cómo es la insignia de la especialidad de Técnicas?",
    respuestaCorrecta: "Está representada por una estrella de 6 puntas. Colocada en la paletera izquierda",
  },
  {
    id: 38,
    texto: "¿Cuál es el dibujo de la insignia de la Especialidad de Expedición y en qué paletera se coloca?",
    respuestaCorrecta: "El dibujo de la insignia es una hoja de roble con una bellota y se coloca en la paletera izquierda.",
  },
  {
    id: 39,
    texto: "¿Qué insignia reemplaza a la de Escudero después de la investidura?",
    respuestaCorrecta: "La insignia de Rover Boy Scout.",
  },
  {
    id: 40,
    texto: "¿Qué representan las insignias de especialidad Rover?",
    respuestaCorrecta: "Los conocimientos, servicios, proyectos o desafíos concretos superados por el Rover.",
  },
  {
    id: 41,
    texto: "¿Qué representa la insignia de Rover de Baden-Powell?",
    respuestaCorrecta: "La máxima graduación dentro del Plan de Adelanto Rover.",
  },
  {
    id: 42,
    texto: "¿Por qué son importantes las ceremonias del Clan?",
    respuestaCorrecta: "Porque expresan compromisos, cambios de etapa y reconocimientos significativos en la vida del Rover.",
  },
  {
    id: 43,
    texto: "¿Ingresar al Clan convierte automáticamente al joven en Rover Boy Scout?",
    respuestaCorrecta: "No. Primero debe vivir su periodo de integración y preparación como Escudero Rover.",
  },
  {
    id: 44,
    texto: "¿Qué es la Vigilia Rover?",
    respuestaCorrecta: "Es una ceremonia individual de reflexión previa a la investidura de Rover Boy Scout.",
  },
  {
    id: 45,
    texto: "¿Cuál es la finalidad de la Vigilia Rover?",
    respuestaCorrecta: "Permitir que el Escudero examine su vida, sus valores, sus decisiones y el compromiso que desea asumir.",
  },
  {
    id: 46,
    texto: "¿La Vigilia consiste solamente en permanecer despierto?",
    respuestaCorrecta: "No. Su parte esencial es la reflexión personal, sincera y consciente.",
  },
  {
    id: 47,
    texto: "¿Debe obligarse a un Escudero a realizar la Vigilia?",
    respuestaCorrecta: "No. La preparación y el compromiso Rover deben ser asumidos voluntariamente.",
  },
  {
    id: 48,
    texto: "¿Qué es la investidura de Rover Boy Scout?",
    respuestaCorrecta: "Es la ceremonia en la que el Escudero asume públicamente su compromiso con la Ley, la Promesa y el servicio.",
  },
  {
    id: 49,
    texto: "¿Qué debe haber realizado el Escudero antes de ser investido?",
    respuestaCorrecta: "Debe haber completado su preparación, realizado su Vigilia y recibido la aprobación correspondiente.",
  },
  {
    id: 50,
    texto: "¿Qué simboliza el lavado de manos durante la investidura?",
    respuestaCorrecta: "La voluntad de purificarse, renovarse y comenzar una nueva etapa.",
  },
  {
    id: 51,
    texto: "¿Qué representa el lavatorio simbólico?",
    respuestaCorrecta: "La preparación interior del candidato antes de formular su compromiso.",
  },
  {
    id: 52,
    texto: "¿Qué hace el candidato durante la investidura?",
    respuestaCorrecta: "Manifiesta su decisión, responde a las preguntas correspondientes y formula o renueva su Promesa Scout.",
  },
  {
    id: 53,
    texto: "¿Qué compromiso central asume el candidato?",
    respuestaCorrecta: "Vivir conforme a la Ley Scout, cumplir su Promesa y servir a los demás.",
  },
  {
    id: 54,
    texto: "¿Qué insignia recibe después de la investidura?",
    respuestaCorrecta: "La insignia de Rover Boy Scout.",
  },
  {
    id: 55,
    texto: "¿Qué debe hacer el nuevo Rover Boy Scout con los Rovers más jóvenes?",
    respuestaCorrecta: "Acompañarlos, darles ejemplo y ayudarlos en su progresión.",
  },
  {
    id: 56,
    texto: "¿Qué es la ceremonia de partida del Clan?",
    respuestaCorrecta: "Es la ceremonia de despedida de un Rover que concluye su etapa dentro de la unidad.",
  },
  {
    id: 57,
    texto: "¿La partida significa abandonar el Escultismo?",
    respuestaCorrecta: "No. Significa continuar viviendo sus valores y el servicio en la vida adulta.",
  },
  {
    id: 58,
    texto: "¿Qué compromiso debe conservar el Rover después de su partida?",
    respuestaCorrecta: "Continuar sirviendo y vivir de acuerdo con la Ley y la Promesa Scout.",
  },
  {
    id: 59,
    texto: "¿La Ley Scout cambia para los Rovers?",
    respuestaCorrecta: "No. Es la misma Ley Scout, pero debe ser comprendida y vivida con mayor madurez.",
  },
  {
    id: 60,
    texto: "¿Qué significa para un Rover cifrar su honor en ser digno de confianza?",
    respuestaCorrecta: "Ser honesto, cumplir su palabra y actuar correctamente incluso cuando nadie lo vigila.",
  },
  {
    id: 61,
    texto: "¿Cómo vive un Rover la lealtad?",
    respuestaCorrecta: "Siendo fiel a sus principios, a sus compromisos, a su patria, a su familia y a sus compañeros.",
  },
  {
    id: 62,
    texto: "¿Cómo debe practicar el Rover el servicio?",
    respuestaCorrecta: "Ayudando de manera útil y desinteresada, sin esperar premios ni reconocimiento.",
  },
  {
    id: 63,
    texto: "¿Qué significa ser amigo de todos y hermano de todo Scout?",
    respuestaCorrecta: "Respetar la dignidad de cada persona y vivir la fraternidad más allá de las diferencias.",
  },
  {
    id: 64,
    texto: "¿Qué es la mística Rover?",
    respuestaCorrecta: "Es el conjunto de símbolos, tradiciones, ceremonias e ideales que fortalecen la identidad del Clan.",
  },
  {
    id: 65,
    texto: "¿La mística debe ser solamente decorativa?",
    respuestaCorrecta: "No. Debe poseer un significado educativo y estar relacionada con los valores Rovers.",
  },
  {
    id: 66,
    texto: "¿Qué simboliza el fuego dentro del Clan?",
    respuestaCorrecta: "La vida, la fraternidad, la reflexión y la permanencia de los ideales.",
  },
  {
    id: 67,
    texto: "¿Qué simboliza el color rojo en el Roverismo?",
    respuestaCorrecta: "El servicio, la entrega, la fuerza y el compromiso.",
  },
  {
    id: 68,
    texto: "¿Qué representa la horquilla Rover?",
    respuestaCorrecta: "Las decisiones, alternativas y caminos que se presentan en la vida.",
  },
  {
    id: 69,
    texto: "¿Por qué se le dice Kraal al lugar de reuniones Rover?",
    respuestaCorrecta: "Porque significa recinto o lugar de reunión de una comunidad, representando el espacio propio donde el Clan se reúne, convive y toma decisiones.",
  },
  {
    id: 70,
    texto: "¿Quién debe elegir el camino del Rover?",
    respuestaCorrecta: "El propio Rover, guiado por su conciencia, la Ley y la Promesa Scout.",
  },
  {
    id: 71,
    texto: "¿Qué representa el Kraal Rover?",
    respuestaCorrecta: "El lugar propio de encuentro, identidad, trabajo y convivencia del Clan.",
  },
  {
    id: 72,
    texto: "¿Quién es mencionado como patrono de los Rovers en el manual?",
    respuestaCorrecta: "San Pablo.",
  },
  {
    id: 73,
    texto: "¿Por qué San Pablo es presentado como ejemplo Rover?",
    respuestaCorrecta: "Por su transformación personal, sus viajes, su fortaleza y su entrega a una misión.",
  },
  {
    id: 74,
    texto: "¿Qué enseñanza representa la transformación de San Pablo?",
    respuestaCorrecta: "Que una persona puede reconocer sus errores, cambiar profundamente y dedicar su vida a una causa.",
  },
  {
    id: 75,
    texto: "¿Qué representa el Escudo de San Jorge dentro de la mística descrita?",
    respuestaCorrecta: "La lucha valiente contra el mal, las dificultades y las propias debilidades.",
  },
  {
    id: 76,
    texto: "¿Qué representa San Jorge frente al dragón?",
    respuestaCorrecta: "Al Rover que enfrenta los problemas.",
  },
  {
    id: 77,
    texto: "¿Quién iba a ser sacrificada al dragón?",
    respuestaCorrecta: "La hija del rey.",
  },
  {
    id: 78,
    texto: "¿Qué representa la espada en un Clan Rover?",
    respuestaCorrecta: "Honor, rectitud y compromiso.",
  },
  {
    id: 79,
    texto: "¿Qué representa la responsabilidad de la espada?",
    respuestaCorrecta: "Saber cuándo y cómo actuar.",
  },
  {
    id: 80,
    texto: "¿Qué recuerda la espada dentro del Clan?",
    respuestaCorrecta: "Que el Rover es un caballero moderno.",
  },
  {
    id: 81,
    texto: "¿Cuál es la diferencia entre horqueta y horquilla?",
    respuestaCorrecta: "La horqueta representa al Clan; la horquilla representa al Rover.",
  },
  {
    id: 82,
    texto: "¿Cuál es el origen del turú?",
    respuestaCorrecta: "Baden-Powell adaptó una antigua forma de comunicación.",
  },
  {
    id: 83,
    texto: "¿Qué significa la palabra \"Kraal\"?",
    respuestaCorrecta: "Lugar de reunión de los más viejos y sabios.",
  },
  {
    id: 84,
    texto: "¿Quién es el Mortero Rover?",
    respuestaCorrecta: "Es el símbolo del Rover que construye su vida sobre valores.",
  },
  {
    id: 85,
    texto: "¿Qué enseña el Mortero Rover?",
    respuestaCorrecta: "Que el crecimiento personal se logra con esfuerzo y constancia.",
  },
  {
    id: 86,
    texto: "¿Cuál es el principal mensaje del Mortero Rover?",
    respuestaCorrecta: "Que un Rover debe construir su vida y dejar un legado de servicio.",
  },
  {
    id: 87,
    texto: "¿Por qué surgió el Roverismo?",
    respuestaCorrecta: "Para continuar la formación de los jóvenes que superaban la edad de la Tropa Scout.",
  },
  {
    id: 88,
    texto: "¿Qué observó Baden-Powell respecto a los scouts mayores?",
    respuestaCorrecta: "Que muchos abandonaban el Movimiento al crecer y perdían la oportunidad de continuar su formación.",
  },
  {
    id: 89,
    texto: "¿Qué organización fue creada en 1914 para mantener unidos a antiguos scouts?",
    respuestaCorrecta: "La Sociedad Amiga de los Scouts.",
  },
  {
    id: 90,
    texto: "¿Qué acontecimiento retrasó el desarrollo inicial del Roverismo?",
    respuestaCorrecta: "La Primera Guerra Mundial.",
  },
  {
    id: 91,
    texto: "¿Entre qué años se desarrolló la Primera Guerra Mundial?",
    respuestaCorrecta: "Entre 1914 y 1918.",
  },
  {
    id: 92,
    texto: "¿En qué año Baden-Powell retomó con mayor claridad el desarrollo del Roverismo?",
    respuestaCorrecta: "En 1918.",
  },
  {
    id: 93,
    texto: "¿Cómo se llamaba el documento publicado en septiembre de 1918?",
    respuestaCorrecta: "Reglamento de los Rovers.",
  },
  {
    id: 94,
    texto: "¿Qué buscaba orientar el Reglamento de los Rovers?",
    respuestaCorrecta: "La organización, los objetivos, las actividades, el uniforme y la dirección de los primeros Clanes.",
  },
  {
    id: 95,
    texto: "¿En qué año comenzaron a establecerse pruebas propias para los Rovers?",
    respuestaCorrecta: "En 1923.",
  },
  {
    id: 96,
    texto: "¿Qué importancia tuvieron las pruebas Rovers de 1923?",
    respuestaCorrecta: "Ayudaron a dar a la Rama un programa y una identidad propios.",
  },
  {
    id: 97,
    texto: "¿Quién fue el primer Comisionado Rover de la Oficina Central?",
    respuestaCorrecta: "El coronel Ulick de Burgh.",
  },
  {
    id: 98,
    texto: "¿En qué encuentro de 1920 participaron públicamente los Rovers?",
    respuestaCorrecta: "En el Jamboree Mundial de Olympia.",
  },
  {
    id: 99,
    texto: "¿Qué tareas realizaron los Rovers en los primeros grandes encuentros scouts?",
    respuestaCorrecta: "Trabajos de organización, administración, guía y servicio.",
  },
  {
    id: 100,
    texto: "¿En qué año se realizó una importante reunión Rover llamada Moot en Londres?",
    respuestaCorrecta: "En 1926.",
  },
  {
    id: 101,
    texto: "¿En qué se inspiró la ceremonia representada en el Moot de 1926?",
    respuestaCorrecta: "En los ideales y ceremonias de la caballería medieval.",
  },
  {
    id: 102,
    texto: "¿En qué año se realizó el primer Rover Moot Mundial?",
    respuestaCorrecta: "En 1931.",
  },
  {
    id: 103,
    texto: "¿Dónde se realizó el primer Rover Moot Mundial?",
    respuestaCorrecta: "En Kandersteg, Suiza.",
  },
  {
    id: 104,
    texto: "¿Qué finalidad tienen los Rover Moots?",
    respuestaCorrecta: "Reunir Rovers, intercambiar experiencias y fortalecer la hermandad internacional.",
  },
  {
    id: 105,
    texto: "¿De dónde proviene la expresión “Ich Dien”?",
    respuestaCorrecta: "Del alemán antiguo.",
  },
  {
    id: 106,
    texto: "¿Qué significa “Ich Dien”?",
    respuestaCorrecta: "Yo sirvo.",
  },
  {
    id: 107,
    texto: "¿En qué año fue adquirido Gilwell para el Movimiento Scout?",
    respuestaCorrecta: "En 1919.",
  },
  {
    id: 108,
    texto: "¿Quién ofreció los recursos para comprar un terreno destinado a los Scouts?",
    respuestaCorrecta: "W. de Bois Maclaren.",
  },
  {
    id: 109,
    texto: "¿Quién es considerado el descubridor de Gilwell?",
    respuestaCorrecta: "Percy Baden-Powell Nevill.",
  },
  {
    id: 110,
    texto: "¿En qué condiciones llegaron los primeros Rovers a Gilwell?",
    respuestaCorrecta: "Bajo una lluvia torrencial.",
  },
  {
    id: 111,
    texto: "¿Dónde se refugiaron los primeros Rovers?",
    respuestaCorrecta: "En un cobertizo que después fue conocido como El Chiquero.",
  },
  {
    id: 112,
    texto: "¿Qué trabajos realizaron los Rovers en el terreno de Gilwell?",
    respuestaCorrecta: "Retiraron árboles caídos, limpiaron el lugar y abrieron caminos y sendas.",
  },
  {
    id: 113,
    texto: "¿Por qué fue necesario realizar trabajos de pionerismo?",
    respuestaCorrecta: "Porque el terreno había permanecido abandonado durante años.",
  },
  {
    id: 114,
    texto: "¿En qué año se efectuó el primer curso Rover en Gilwell?",
    respuestaCorrecta: "En 1926.",
  },
  {
    id: 115,
    texto: "¿Qué construyeron el Clan de Rovers y los auxiliares de servicio en 1956?",
    respuestaCorrecta: "El Centro de Información de Gilwell.",
  },
  {
    id: 116,
    texto: "¿Qué construyeron posteriormente para ellos mismos?",
    respuestaCorrecta: "La Cueva de los Rovers.",
  },
  {
    id: 117,
    texto: "¿Qué instalación médica ayudaron a construir los Rovers?",
    respuestaCorrecta: "La Sala Campbell, destinada a enfermería y primeros auxilios.",
  },
  {
    id: 118,
    texto: "¿De dónde provienen las cuentas de la Insignia de Madera?",
    respuestaCorrecta: "Son copias de las cuentas del collar de Dinizulú que recibió Baden-Powell.",
  },
  {
    id: 119,
    texto: "¿Por qué la pañoleta de Gilwell lleva el tartán Maclaren?",
    respuestaCorrecta: "Para honrar a W. de Bois Maclaren, benefactor de Gilwell.",
  },
  {
    id: 120,
    texto: "¿Qué representa la Insignia de Madera?",
    respuestaCorrecta: "La formación del dirigente, la experiencia compartida y la fraternidad mundial de Gilwell.",
  },
  {
    id: 121,
    texto: "¿Quién escribió Roverismo hacia el éxito?",
    respuestaCorrecta: "Robert Baden-Powell.",
  },
  {
    id: 122,
    texto: "¿Cuál es su título original en inglés?",
    respuestaCorrecta: "Rovering to Success.",
  },
  {
    id: 123,
    texto: "¿En qué año se publicó Roverismo hacia el éxito?",
    respuestaCorrecta: "En 1922.",
  },
  {
    id: 124,
    texto: "¿Qué metáfora principal utiliza Baden-Powell en el libro?",
    respuestaCorrecta: "La vida como un viaje en canoa.",
  },
  {
    id: 125,
    texto: "¿Quién debe dirigir la canoa de la vida?",
    respuestaCorrecta: "La propia persona.",
  },
  {
    id: 126,
    texto: "¿Qué representan las dificultades del recorrido?",
    respuestaCorrecta: "Los peligros, las tentaciones, los errores y las decisiones que pueden desviar a una persona.",
  },
  {
    id: 127,
    texto: "¿Cómo se alcanza el verdadero éxito según la filosofía Rover?",
    respuestaCorrecta: "Desarrollando el carácter, viviendo responsablemente y sirviendo a los demás.",
  },
  {
    id: 128,
    texto: "¿Quién escribió The Rover Scout Book?",
    respuestaCorrecta: "John Lewis Marsh.",
  },
  {
    id: 129,
    texto: "¿Qué seudónimo utilizó John Lewis Marsh?",
    respuestaCorrecta: "Gilcraft.",
  },
  {
    id: 130,
    texto: "¿Qué diferencia general existe entre Roverismo hacia el éxito y The Rover Scout Book?",
    respuestaCorrecta: "Roverismo hacia el éxito desarrolla principalmente la filosofía Rover, mientras que The Rover Scout Book presenta aspectos más prácticos del funcionamiento del Clan.",
  },
  {
    id: 131,
    texto: "¿Quién fundó el Movimiento Scout?",
    respuestaCorrecta: "Lord Robert Stephenson Smyth Baden-Powell.",
  },
  {
    id: 132,
    texto: "¿Cuándo nació Baden-Powell?",
    respuestaCorrecta: "El 22 de febrero de 1857.",
  },
  {
    id: 133,
    texto: "¿Dónde nació Baden-Powell?",
    respuestaCorrecta: "En Londres, Inglaterra.",
  },
  {
    id: 134,
    texto: "¿Qué profesión tuvo Baden-Powell?",
    respuestaCorrecta: "Fue militar del arma de Caballería.",
  },
  {
    id: 135,
    texto: "¿A qué edad ingresó Baden-Powell al Ejército?",
    respuestaCorrecta: "A los 19 años.",
  },
  {
    id: 136,
    texto: "¿A qué regimiento fue destinado?",
    respuestaCorrecta: "Al XIII de Húsares.",
  },
  {
    id: 137,
    texto: "¿Dónde cumplió su primera comisión militar?",
    respuestaCorrecta: "En Lucknow, India.",
  },
  {
    id: 138,
    texto: "¿Contra qué pueblos combatió Baden-Powell en África?",
    respuestaCorrecta: "Contra zulúes, ashantis y matabeles, y posteriormente participó en la guerra contra los bóeres.",
  },
  {
    id: 139,
    texto: "¿Cuánto duró el sitio de Mafeking?",
    respuestaCorrecta: "217 días.",
  },
  {
    id: 140,
    texto: "¿En qué país actual se encuentra Mafeking?",
    respuestaCorrecta: "En Sudáfrica.",
  },
  {
    id: 141,
    texto: "¿En qué año se realizó el campamento experimental de Brownsea?",
    respuestaCorrecta: "En 1907.",
  },
  {
    id: 142,
    texto: "¿Entre qué fechas se realizó el campamento de Brownsea?",
    respuestaCorrecta: "Entre el 1 y el 9 de agosto de 1907.",
  },
  {
    id: 143,
    texto: "¿Dónde se realizó el campamento experimental de 1907?",
    respuestaCorrecta: "En la isla de Brownsea.",
  },
  {
    id: 144,
    texto: "¿Cuántas patrullas participaron del campamento de Brownsea?",
    respuestaCorrecta: "Cuatro patrullas.",
  },
  {
    id: 145,
    texto: "¿Cómo se llamaban las patrullas de Brownsea?",
    respuestaCorrecta: "Lobos, Toros, Chorlitos y Cuervos.",
  },
  {
    id: 146,
    texto: "¿Qué libro dio origen a la expansión del método scout?",
    respuestaCorrecta: "Escultismo para muchachos.",
  },
  {
    id: 147,
    texto: "¿En qué año comenzó a publicarse Escultismo para muchachos?",
    respuestaCorrecta: "En 1908.",
  },
  {
    id: 148,
    texto: "¿En qué año se realizó el primer Jamboree Scout Mundial?",
    respuestaCorrecta: "En 1920.",
  },
  {
    id: 149,
    texto: "¿Dónde se realizó el primer Jamboree Mundial?",
    respuestaCorrecta: "En Olympia, Londres.",
  },
  {
    id: 150,
    texto: "¿Qué título recibió Baden-Powell durante ese Jamboree?",
    respuestaCorrecta: "Jefe Scout Mundial.",
  },
  {
    id: 151,
    texto: "¿Qué es un Jamboree?",
    respuestaCorrecta: "Es un gran encuentro de scouts procedentes de diferentes lugares o países.",
  },
  {
    id: 152,
    texto: "¿Qué es una patrulla?",
    respuestaCorrecta: "Es un pequeño grupo de scouts organizado para trabajar, aprender y convivir.",
  },
  {
    id: 153,
    texto: "¿Cuál es la base moral del Movimiento Scout?",
    respuestaCorrecta: "La Ley y la Promesa Scout.",
  },
  {
    id: 154,
    texto: "¿Cuáles son las virtudes scouts mencionadas en la Justa?",
    respuestaCorrecta: "Lealtad, abnegación y pureza.",
  },
  {
    id: 155,
    texto: "¿Cuáles son los tres principios señalados en el material?",
    respuestaCorrecta: "Dios, Patria y Hogar.",
  },
  {
    id: 156,
    texto: "¿Qué dice el primer artículo de la Ley Scout?",
    respuestaCorrecta: "“El Scout cifra su honor en ser digno de confianza”.",
  },
  {
    id: 157,
    texto: "¿Qué expresa el quinto artículo de la Ley Scout?",
    respuestaCorrecta: "“El Scout es cortés y caballeroso”.",
  },
  {
    id: 158,
    texto: "¿Qué expresa el séptimo artículo de la Ley Scout?",
    respuestaCorrecta: "“El Scout obedece sin reprochar y realiza las tareas completas y en orden”.",
  },
  {
    id: 159,
    texto: "¿Qué expresa el octavo artículo de la Ley Scout?",
    respuestaCorrecta: "“El Scout sonríe y canta en sus dificultades”.",
  },
  {
    id: 160,
    texto: "¿Qué expresa el noveno artículo de la Ley Scout?",
    respuestaCorrecta: "“El Scout es económico, trabajador y cuidadoso del bien ajeno”.",
  },
  {
    id: 161,
    texto: "¿Qué simboliza la flor de lis?",
    respuestaCorrecta: "La identidad mundial del Escultismo y la orientación hacia un camino correcto.",
  },
  {
    id: 162,
    texto: "¿Qué representa la pañoleta scout?",
    respuestaCorrecta: "La pertenencia, la fraternidad y la identidad del Grupo o asociación.",
  },
  {
    id: 163,
    texto: "¿Qué es la buena acción?",
    respuestaCorrecta: "Es una ayuda realizada voluntariamente y sin esperar recompensa.",
  },
  {
    id: 164,
    texto: "¿Qué es el cuerno Kudú?",
    respuestaCorrecta: "Es un instrumento utilizado históricamente por Baden-Powell para realizar llamados.",
  },
  {
    id: 165,
    texto: "¿En qué campamento fue utilizado el cuerno Kudú en 1907?",
    respuestaCorrecta: "En el campamento de Brownsea.",
  },
  {
    id: 166,
    texto: "¿Qué Scout inspiró indirectamente la fundación del Escultismo en Estados Unidos?",
    respuestaCorrecta: "El Scout desconocido que ayudó a William D. Boyce.",
  },
  {
    id: 167,
    texto: "¿Qué enseñanza deja la historia del Scout desconocido?",
    respuestaCorrecta: "Que una buena acción desinteresada puede producir consecuencias muy importantes.",
  },
  {
    id: 168,
    texto: "¿Qué nudo sirve para unir cuerdas de diferente grosor?",
    respuestaCorrecta: "La vuelta de escota.",
  },
  {
    id: 169,
    texto: "¿Qué nudo sirve para unir cuerdas del mismo grosor?",
    respuestaCorrecta: "El nudo llano o rizo.",
  },
  {
    id: 170,
    texto: "¿Qué nudo permite acortar una cuerda sin cortarla?",
    respuestaCorrecta: "El nudo margarita.",
  },
  {
    id: 171,
    texto: "¿En qué fecha se inició el Escultismo nacional según la Justa?",
    respuestaCorrecta: "El 5 de octubre de 1913.",
  },
  {
    id: 172,
    texto: "¿Qué lugar ocupó Paraguay en el inicio del Escultismo en América del Sur?",
    respuestaCorrecta: "El tercer lugar, después de Chile y Argentina.",
  },
  {
    id: 173,
    texto: "¿En qué año comenzó el Escultismo en Chile según el material?",
    respuestaCorrecta: "En 1909.",
  },
  {
    id: 174,
    texto: "¿En qué año comenzó el Escultismo en Argentina según el material?",
    respuestaCorrecta: "En 1912.",
  },
  {
    id: 175,
    texto: "¿Qué significa FEPE?",
    respuestaCorrecta: "Federación Paraguaya de Escultismo.",
  },
  {
    id: 176,
    texto: "¿Cuándo fue fundada la FEPE?",
    respuestaCorrecta: "El 21 de septiembre de 1994.",
  },
  {
    id: 177,
    texto: "¿Quién fue el primer Jefe Nacional de los Boy Scouts de la FEPE según la Justa?",
    respuestaCorrecta: "El reverendo padre Milciades Ortigoza.",
  },
  {
    id: 178,
    texto: "¿Qué significa CANAPA?",
    respuestaCorrecta: "Campamento Nacional de Patrullas.",
  },
  {
    id: 179,
    texto: "¿Qué significa ENAPA?",
    respuestaCorrecta: "Encuentro Nacional de Patrullas.",
  },
  {
    id: 180,
    texto: "¿Qué significa CANAPI?",
    respuestaCorrecta: "Campamento Nacional de Pioneros.",
  },
  {
    id: 181,
    texto: "¿Qué significa CIPA?",
    respuestaCorrecta: "Campamento Internacional de Patrullas.",
  },
  {
    id: 182,
    texto: "¿Qué significa ENAJE?",
    respuestaCorrecta: "Encuentro Nacional de Jefes.",
  },
  {
    id: 183,
    texto: "¿Qué dirección de la FEPE elaboró el manual Roverismo Práctico?",
    respuestaCorrecta: "La Dirección Nacional de Programas.",
  },
  {
    id: 184,
    texto: "¿Qué dirección se encarga de la formación de dirigentes en el Manual Nivel 2?",
    respuestaCorrecta: "La Dirección Nacional de Adiestramiento.",
  },
  {
    id: 185,
    texto: "¿Qué busca el Curso Nivel 2 para dirigentes de Clan?",
    respuestaCorrecta: "Presentar una visión general del manejo del Clan y de la aplicación del Método Scout en la Rama Rover.",
  },
  {
    id: 186,
    texto: "¿Cuál es la capital de Paraguay?",
    respuestaCorrecta: "Asunción.",
  },
  {
    id: 187,
    texto: "¿Cuáles son los dos idiomas oficiales de Paraguay?",
    respuestaCorrecta: "Español y guaraní.",
  },
  {
    id: 188,
    texto: "¿Qué ríos separan parte del territorio de Paraguay y Argentina?",
    respuestaCorrecta: "El río Paraguay y, en otros sectores, el río Paraná.",
  },
  {
    id: 189,
    texto: "¿En qué continente se encuentra Paraguay?",
    respuestaCorrecta: "En América del Sur.",
  },
  {
    id: 190,
    texto: "¿Cuál es el planeta más cercano al Sol?",
    respuestaCorrecta: "Mercurio.",
  },
  {
    id: 191,
    texto: "¿Cuál es el planeta más grande del sistema solar?",
    respuestaCorrecta: "Júpiter.",
  },
  {
    id: 192,
    texto: "¿Cómo se llama el proceso por el cual las plantas producen su alimento?",
    respuestaCorrecta: "Fotosíntesis.",
  },
  {
    id: 193,
    texto: "¿Cuál es el océano más grande del mundo?",
    respuestaCorrecta: "El océano Pacífico.",
  },
  {
    id: 194,
    texto: "¿Quién escribió Don Quijote de la Mancha?",
    respuestaCorrecta: "Miguel de Cervantes Saavedra.",
  },
  {
    id: 195,
    texto: "¿Quién escribió El principito?",
    respuestaCorrecta: "Antoine de Saint-Exupéry.",
  },
  {
    id: 196,
    texto: "¿Cuál es la unidad básica de los seres vivos?",
    respuestaCorrecta: "La célula.",
  },
  {
    id: 197,
    texto: "¿Cuántos lados tiene un hexágono?",
    respuestaCorrecta: "Seis lados.",
  },
  {
    id: 198,
    texto: "¿Cuál es la capital de Francia?",
    respuestaCorrecta: "París.",
  },
  {
    id: 199,
    texto: "¿Qué instrumento se utiliza para medir la temperatura?",
    respuestaCorrecta: "El termómetro.",
  },
  {
    id: 200,
    texto: "¿Cuántos grados posee una vuelta completa?",
    respuestaCorrecta: "360 grados.",
  },
];

export function pickRandomUnused(
  usedIds: number[],
  questions: Question[],
  rng: Rng,
): Question {
  const available = questions.filter((q) => !usedIds.includes(q.id));
  if (available.length === 0) throw new Error("No unused questions left");
  const index = Math.min(
    available.length - 1,
    Math.floor(rng() * available.length),
  );
  return available[index];
}
