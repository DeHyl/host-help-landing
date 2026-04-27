# Host-Help.com — Reglas de desarrollo

## Ortografía en español (REGLA OBLIGATORIA)

Cualquier contenido en español debe respetar la ortografía de la RAE.
Aplica a `index.html`, copy de marketing, emails, mensajes del agente,
cualquier texto que vaya a producción.

### Tildes (acentos)

Palabras que SIEMPRE llevan tilde y nunca pueden aparecer sin ella:
- `gestión` (no "gestion"), `comunicación`, `operación`, `atención`,
  `información`, `aplicación`, `sección`, `suscripción`, `educación`,
  `automatización`, `administración`, `configuración`, `decoración`
- `país` (singular), `países` (plural)
- `también`, `más` (cuando es comparativo: "más rápido", "más fotos"),
  `está`, `están`, `estás`, `estará`, `aquí`, `ahí`, `así` (sí lleva
  tilde solo cuando es afirmación enfática, no como adverbio modal —
  pero en español moderno casi siempre se acepta sin tilde)
- `política`, `pública` (adj), `técnica`, `crítica`, `básica`
- `pequeño/a`, `año`, `años`, `mañana`, `niño/a`, `señor/a`, `compañía`,
  `España`, `español/a`, `diseño`
- `francés`, `inglés` (nacionalidades), `atrás`, `detrás`, `después`
- `cómo`, `qué`, `cuándo`, `dónde`, `por qué`, `cuál` (en preguntas
  directas e indirectas: "¿cómo va?", "no sé cómo va")
- `tú` (pronombre: "tú decides") — distinto de `tu` (posesivo: "tu casa")
- `mí` (pronombre: "para mí") — distinto de `mi` (posesivo: "mi casa")
- `él` (pronombre) — distinto de `el` (artículo)
- `sí` (afirmación) — distinto de `si` (condicional)
- `aún` (todavía: "aún no llega") — distinto de `aun` (incluso: "aun así")

### Letra ñ

Palabras con ñ obligatoria — `ano` ≠ `año`, `cana` ≠ `caña`, `pena` ≠
`peña`, etc. NUNCA escribir n donde va ñ:
- `año/años`, `mañana`, `niño/a`, `señor/a`, `compañía`, `pequeño/a`,
  `España`, `español/a`, `diseño`, `enseñar`, `ñ` en general

### Signos de apertura

En español SIEMPRE se abren las preguntas y exclamaciones:
- `¿Cómo va?` — no `Cómo va?`
- `¡Qué bueno!` — no `Qué bueno!`

Cumple la regla de memoria global `feedback_spanish_punctuation`.

### HTML entities vs caracteres UTF-8

El archivo se sirve UTF-8, así que los caracteres directos (`á`, `ñ`,
`¿`) son válidos. Si encuentras entidades como `&#243;`, `&#225;`,
`&#241;`, `&#191;` no es necesario convertirlas — funcionan igual.
Pero en código nuevo prefiere los caracteres directos por legibilidad.

### Falsos amigos comunes (NO confundir)

- `solo` (sin tilde) es el adverbio moderno aceptado por la RAE desde
  2010 (antes era `sólo`). Prefiere sin tilde.
- `mas` sin tilde = "pero" (literario, casi extinto). En 99% de casos
  lo correcto es `más`.
- `por que` / `porque` / `por qué` / `porqué` son cuatro cosas distintas:
  - `porque` = causa: "vino porque quería"
  - `por qué` = pregunta: "¿por qué viniste?"
  - `por que` = preposición + relativo: "la razón por que vino"
  - `porqué` = sustantivo: "el porqué de su llegada"

## Workflow

- Antes de mergear cambios de copy en español, hacer pasada manual
  buscando estos patrones (`gestion`, `comunicacion`, `operacion`,
  `tambien`, `pais`, `mas`, `como`, `tu` en contexto pronombre, etc).
- Cuando agregues copy nuevo en español, escríbelo bien desde el primer
  intento — las correcciones acumulan PRs.

## Despliegue

Cloudflare Worker auto-deploya en cada push a `main`. No requiere
`wrangler deploy` manual. Ver memoria `feedback_cloudflare_autodeploy`.
