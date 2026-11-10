/**
 * Caso de estudio: monitor sísmico para FUNVISIS.
 *
 * Fuente: README técnico del proyecto real (Vanilla JS + Express + Leaflet +
 * Gemini) y las decisiones tomadas durante su construcción. El código y los
 * datos son internos; aquí solo se documenta lo que puede mostrarse en público.
 */

export const CASE_STUDY_HASH = '#/proyectos/monitoreo-sismico';

export const seismicCaseStudy = {
  id: 'monitoreo-sismico',
  index: '01',
  kicker: 'Caso de estudio · Monitoreo sísmico',
  title: 'La sismicidad de un país, en una sola lectura',
  subtitle:
    'Diseñé y construí el mapa de monitoreo sísmico de FUNVISIS: red nacional e internacional en vivo, histórico completo, capas de amenaza y un asistente que opera el mapa con voz o texto.',

  disclaimer:
    'Proyecto interno de FUNVISIS. El código y los datos no son públicos: este caso documenta la arquitectura, las decisiones y una captura autorizada.',

  seo: {
    title: 'Monitor sísmico FUNVISIS — Caso de estudio · Brayan Rondón',
    description:
      'Caso de estudio del mapa de monitoreo sísmico de FUNVISIS: red de 45 estaciones, eventos en vivo e histórico, capas de amenaza, reportes Excel y un asistente de IA por voz y texto.',
  },

  meta: [
    { label: 'Rol', value: 'Desarrollo full stack' },
    { label: 'Alcance', value: 'Único desarrollador' },
    { label: 'Contexto', value: 'FUNVISIS · Venezuela' },
    { label: 'Estado', value: 'Producción interna' },
  ],

  stack: ['JavaScript', 'Leaflet', 'Node.js', 'Express', 'SheetJS', 'Gemini 2.5 Flash'],

  image: {
    src: '/projects/monitoreo-sismico.png',
    alt: 'Panel del monitor sísmico: mapa de Venezuela con fallas, estaciones y eventos recientes sobre Leaflet.',
    width: 1280,
    height: 709,
    caption:
      'Vista operativa: fallas geológicas, estaciones de la red y eventos recientes conviven en el mismo mapa.',
  },

  toc: [
    { id: 'caso-problema', label: 'Problema' },
    { id: 'caso-rol', label: 'Rol' },
    { id: 'caso-solucion', label: 'Solución' },
    { id: 'caso-arquitectura', label: 'Arquitectura' },
    { id: 'caso-decisiones', label: 'Decisiones' },
    { id: 'caso-resultados', label: 'Resultados' },
    { id: 'caso-aprendizajes', label: 'Aprendizajes' },
  ],

  problem: {
    kicker: '// el problema',
    title: 'Los datos existían. La lectura, no.',
    intro:
      'Venezuela vive sobre un borde de placas activo. Cada día se publican eventos, se actualizan estaciones y se consultan capas de amenaza, pero esa información vivía repartida entre un feed, una hoja de cálculo, archivos GeoJSON y el conocimiento del analista. Explicar qué estaba pasando —y dónde— exigía abrir cinco fuentes y traducirlas en tiempo real.',
    points: [
      {
        title: 'Fuentes dispersas',
        body: 'Feed en vivo, Excel histórico y capas institucionales en formatos distintos, sin una vista que los reconciliara.',
      },
      {
        title: 'Lectura lenta',
        body: 'Cruzar magnitud, profundidad, fallas y estaciones a mano hacía que un evento se explicara minutos después, no al instante.',
      },
      {
        title: 'Reportes artesanales',
        body: 'Cada informe exigía filtrar, copiar y pegar en Excel. Horas de trabajo y errores de transcripción en un dato que se publica.',
      },
      {
        title: 'Comunicación limitada',
        body: 'Sin una interfaz clara, la realidad sísmica del país dependía de quien supiera interpretar la jerga técnica.',
      },
    ],
  },

  role: {
    kicker: '// mi rol',
    title: 'Del modelo de datos a la operación diaria',
    intro:
      'Fui el único desarrollador del producto. Definí la arquitectura, construí el cliente y el servidor, y asumí la mantenibilidad: el sistema tenía que seguir funcionando cuando una fuente fallara, cuando la cuota de IA se agotara o cuando el operador estuviera frente a una audiencia.',
    responsibilities: [
      {
        title: 'Arquitectura de información',
        body: 'Jerarquía de capas, paneles y flujos para que un evento se entienda en segundos.',
      },
      {
        title: 'Cliente geoespacial',
        body: 'Mapa Leaflet con panes, marcadores, popups y capas conmutables sobre datos normalizados.',
      },
      {
        title: 'Backend y datos',
        body: 'Proxy de feeds, caché, persistencia atómica y ETL del Excel maestro a GeoJSON.',
      },
      {
        title: 'IA aplicada',
        body: 'ROBER: catálogo de herramientas, function calling, sesiones en servidor y voz con fallback.',
      },
      {
        title: 'Calidad y seguridad',
        body: 'Validación de payloads, sanitización de exportaciones, autenticación de escrituras y degradación elegante.',
      },
    ],
  },

  solution: {
    kicker: '// la solución',
    title: 'Un mapa que se opera, no que se observa',
    intro:
      'Una sola superficie para leer la red, el evento, la amenaza y el histórico. Cada capacidad se diseñó para responder una pregunta operativa concreta, no para acumular funcionalidades.',
    features: [
      {
        icon: 'map',
        span: 'lg:col-span-7',
        title: 'Mapa operativo',
        body: 'Leaflet con mapas base oscuro y satelital, panes dedicados y marcadores por tipo. Cada capa se enciende y apaga sin recargar la página.',
      },
      {
        icon: 'radio',
        span: 'lg:col-span-5',
        title: 'Red nacional e internacional',
        body: '45 estaciones nacionales —sismológicas, acelerográficas, multipropósito y portátiles— más red internacional, local y geodésica, con estado refrescado cada 30 segundos.',
      },
      {
        icon: 'activity',
        span: 'lg:col-span-5',
        title: 'Eventos en vivo e histórico',
        body: 'El feed reciente y todo el registro del Excel maestro conviven como GeoJSON. Si el epicentro viene vacío, se estima con Haversine sobre 173 localidades.',
      },
      {
        icon: 'layers',
        span: 'lg:col-span-7',
        title: 'Fallas, isoaceleraciones y amenaza',
        body: 'Capas COVENIN 1756:2001, A0, sistemas de fallas, límites y criterios de tsunami sobre el mismo territorio, con opacidad y orden controlados.',
      },
      {
        icon: 'waves',
        span: 'lg:col-span-4',
        title: 'Riesgo sísmico y tsunami',
        body: 'Niveles de riesgo del territorio y protocolo de alerta como capas independientes, no como texto en un anexo.',
      },
      {
        icon: 'ruler',
        span: 'lg:col-span-4',
        title: 'Medición de distancias',
        body: 'Distancia geodésica y rumbo entre puntos, para dimensionar la relación entre un evento y una ciudad o estación.',
      },
      {
        icon: 'settings',
        span: 'lg:col-span-4',
        title: 'Gestión de estaciones y redes',
        body: 'Alta, edición, baja, categoría y clasificación; además de redes dinámicas con expiración perezosa y sin procesos en segundo plano.',
      },
      {
        icon: 'file',
        span: 'lg:col-span-7',
        title: 'Reportes Excel instantáneos',
        body: 'Filtros por magnitud, profundidad, rango de tiempo y territorio. Libro de dos hojas con cabecera institucional, autofiltro y celdas sanitizadas.',
      },
      {
        icon: 'bot',
        span: 'lg:col-span-5',
        title: 'ROBER, el asistente del mapa',
        body: 'Voz o texto. Entiende el estado real del mapa y ejecuta 24 herramientas: capas, filtros, descargas, enfoque y distancias.',
      },
    ],
  },

  architecture: {
    kicker: '// arquitectura',
    title: 'Dos procesos, una sola verdad operativa',
    intro:
      'El navegador no habla con las fuentes ni con la IA directamente. El servidor concentra credenciales, caché y validación; el cliente solo pinta datos ya normalizados.',
    layers: [
      {
        icon: 'monitor',
        tag: 'Cliente',
        title: 'Vanilla JS + Leaflet',
        body: 'IIFE sin bundler. El orden de los <script> es el grafo de dependencias y state.js concentra el estado global. Three.js se usa solo para la esfera de voz.',
      },
      {
        icon: 'server',
        tag: 'Servidor',
        title: 'Express 4',
        body: 'Proxy delgado para feeds y API. Sin base de datos: JSON plano con escritura atómica (write-tmp + rename) y Excel maestro cacheado por mtime.',
      },
      {
        icon: 'bot',
        tag: 'IA',
        title: 'Gemini 2.5 Flash',
        body: 'Sesiones en servidor, function calling y lista blanca de 24 herramientas idempotentes de solo lectura. SSE, con fallback JSON para túneles que no lo soportan.',
      },
    ],
    flow: [
      {
        title: 'Fuente',
        body: 'Feed FUNVISIS, Excel maestro y capas institucionales.',
      },
      {
        title: 'Proxy y caché',
        body: 'El servidor normaliza, limita y cachea. El navegador nunca llama a la fuente ni ve una clave.',
      },
      {
        title: 'Normalización',
        body: 'Epicentro estimado, tipos de estación y propiedades listas para pintar.',
      },
      {
        title: 'Mapa y paneles',
        body: 'Leaflet renderiza; el operador filtra, mide, compara y exporta.',
      },
      {
        title: 'Asistente',
        body: 'ROBER lee el estado real y actúa solo mediante herramientas declaradas.',
      },
    ],
    resilience:
      'Si el Excel falla: último caché válido → JSON de respaldo → colección vacía. El mapa nunca recibe un 500 por una fuente caída.',
  },

  decisions: [
    {
      title: 'Sin framework, con el orden de carga como inyección de dependencias',
      decision:
        'Mantener el cliente en JavaScript puro con IIFE y un orden de scripts explícito, en lugar de introducir un bundler y reescribir la aplicación.',
      why: 'El monitor ya operaba y no podía detenerse por una migración. Un bundler añadía riesgo y una reescritura completa sin resolver un problema real del producto.',
      cost: 'Exige disciplina: contratos explícitos, nombres estables y pruebas que protejan los módulos que se envuelven.',
    },
    {
      title: 'El servidor como único intermediario',
      decision:
        'Todo acceso a feeds, IA y TTS pasa por Express; el navegador solo consume endpoints propios.',
      why: 'Las claves viven en el servidor. Eso habilita caché, rate limit, CORS con lista blanca y una degradación controlada ante fallos externos.',
      cost: 'Un proceso Node que mantener y desplegar; a cambio, el cliente no puede filtrar secretos ni saltarse la validación.',
    },
    {
      title: 'Archivos JSON atómicos en lugar de una base de datos',
      decision:
        'Persistir estaciones, redes y configuración en archivos planos, con escritura temporal y rename atómico.',
      why: 'Un solo operador, una sola máquina y backups triviales. La escritura atómica evita archivos a medio escribir.',
      cost: 'No hay transacciones entre archivos. Se documenta y se diseña para que cada archivo sea independiente.',
    },
    {
      title: 'La IA no toca el DOM: ejecuta herramientas de una lista blanca',
      decision:
        'ROBER solo puede llamar acciones declaradas, idempotentes y de solo lectura sobre el mapa y las descargas.',
      why: 'El modelo puede alucinar o recibir texto malicioso. La lista blanca acota el daño posible y permite que las respuestas se apoyen en datos reales.',
      cost: 'Menos flexibilidad conversacional y un catálogo que mantener sincronizado con el cliente.',
    },
  ],

  results: {
    kicker: '// resultados',
    title: 'Lo que cambió en la operación',
    intro:
      'El impacto no se mide en líneas de código, sino en el tiempo que el analista recupera y en la confianza con la que puede explicar un evento.',
    metrics: [
      {
        value: '95%',
        label: 'ahorro operativo en reportes',
        body: 'De horas de filtrado manual a segundos, con trazabilidad de los criterios aplicados.',
      },
      {
        value: '45',
        label: 'estaciones nacionales en una vista',
        body: 'Más red internacional, local y geodésica bajo el mismo modelo de estado.',
      },
      {
        value: '24',
        label: 'herramientas de IA conectadas',
        body: 'Capas, filtros, descargas, enfoque y distancias ejecutadas sobre datos reales.',
      },
      {
        value: '0',
        label: 'caídas del mapa por fuente',
        body: 'Cadena de degradación Excel → caché → respaldo → colección vacía.',
      },
    ],
  },

  learnings: [
    {
      title: 'La legibilidad también es infraestructura',
      body: 'Un dato correcto que nadie entiende no sirve para comunicar. La jerarquía visual y el lenguaje de la interfaz son parte del producto, no un acabado.',
    },
    {
      title: 'La degradación se diseña antes del incidente',
      body: 'Definir la cadena de respaldo desde el primer día convirtió una fuente caída en un detalle invisible para el operador.',
    },
    {
      title: 'Un asistente útil es el que tiene permisos estrechos',
      body: 'ROBER funciona porque no puede hacer todo: su lista blanca es lo que hace que sus respuestas y acciones sean confiables.',
    },
    {
      title: 'Documentar contratos permite iterar sin miedo',
      body: 'Nombres de herramientas, orden de carga y formatos de datos son acuerdos verificables, no comentarios al pie del código.',
    },
  ],
};
