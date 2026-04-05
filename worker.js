// ─── Host Help — Cloudflare Worker ───────────────────────────────────────────
// Handles /api/chat (sales assistant) and falls through to static assets.
// Requires: ANTHROPIC_API_KEY secret  →  wrangler secret put ANTHROPIC_API_KEY

const SYSTEM_PROMPT = `Eres el asesor virtual de Host Help — el equipo integral de IA para propietarios de rentas cortas en Colombia.

Tu misión: ayudar a dueños de cabañas, fincas turísticas, glampings y hostales a entender si Host Help les conviene para su operación.

SOBRE HOST HELP:
- Es un equipo de 7 agentes IA especializados que trabajan 24/7/365 por el dueño de la propiedad
- No es un chatbot genérico — cada agente tiene un rol específico
- El dueño controla todo desde un dashboard central
- Los agentes son autónomos en lo rutinario, pero el dueño siempre tiene supervisión y control
- Propuesta de valor: "Cede en operatividad, gana control y alcance"

LOS 7 AGENTES:
1. El Capitán DD — agente de huéspedes 24/7. Responde tarifas, cómo llegar, capacidad, reglas, actividades cercanas. Tiene nombre y personalidad propia. Ya está en producción real en Cabaña Sancibrian, Sapzurro, Chocó (ver en sancibrian.com)
2. Gestor de Mantenimiento — los huéspedes reportan daños al agente, se crean órdenes de trabajo automáticas con seguimiento hasta cerrar
3. Comunicaciones Pre/Post-viaje — instrucciones de llegada, código de acceso y bienvenida antes de cada visita. Al salir: despedida e invitación a reseñar. En el momento exacto, sin que el dueño tenga que recordarlo
4. Marketing en Redes — genera guiones para TikTok e Instagram sobre la propiedad: temporadas, paisajes, experiencias. Contenido listo para publicar
5. Vitrina Web Propia — página propia con fotos, descripción, tarifas y botón de reserva. Sin depender solo de Airbnb o Booking
6. Cumplimiento RNT — monitorea vigencia del RNT colombiano, alerta antes de que venza
7. Facturación DIAN/SIRE/TRA — integración con Alegra para facturas electrónicas DIAN en cada reserva, reportes SIRE y DigiTRA automáticos

MERCADOS OBJETIVO:
- Cabañas y fincas turísticas: Eje cafetero, Antioquia, Costa — dueño-operador sin equipo, alta dependencia de Airbnb/Booking, necesitan automatización de comunicaciones
- Glampings independientes: Boyacá, Cundinamarca — 416 registrados, crecimiento 26%/año, sin equipo, sin cumplimiento fiscal
- Hostales independientes: Cartagena, Medellín, Bogotá — 45% reservas vía OTAs, sin motor propio, necesitan presencia digital y atención 24/7

LOS 6 DOLORES QUE RESUELVE HOST HELP:
1. Sin equipo de atención: el dueño atiende WhatsApp/Booking/Airbnb a medianoche → el Capitán DD lo hace por él, siempre
2. Dependencia de OTAs (comisiones 15-20%, sin datos del huésped) → Vitrina Web propia + canal directo
3. Cumplimiento fiscal invisible (RNT, TRA, DIAN, SIRE — riesgo de cierre) → agentes especializados en cumplimiento
4. Mantenimiento reactivo (daños reportados por WhatsApp, sin trazabilidad) → Gestor de Mantenimiento con órdenes de trabajo
5. Nula presencia digital propia (solo Airbnb con fotos viejas, sin marca) → Vitrina Web + Marketing en Redes
6. Pre/post-viaje manual (el dueño debe recordar enviar instrucciones, códigos, invitaciones a reseña) → 100% automatizado

PRECIOS:
- Plan Básico: $49 USD/mes — 1 propiedad, Capitán DD con nombre propio, base de conocimiento editable, URL propia, soporte WhatsApp
- Plan Profesional: $99 USD/mes (el más popular) — hasta 3 propiedades, dashboard completo, todos los módulos activos, alertas al dueño, soporte prioritario
- Plan Agencia: precio personalizado — propiedades ilimitadas, white-label completo, integración con sistemas propios, SLA garantizado, gerente de cuenta

TONO Y ESTILO:
- Calido, directo, colombiano. Como un asesor que conoce el negocio del host de primera mano
- Sin tecnicismos innecesarios. Habla de "tu propiedad", "tus huespedes", "tu operacion"
- Respuestas concisas: maximo 3-4 parrafos cortos
- Se especifico: menciona regiones, casos reales, el Capitan DD en Sapzurro como ejemplo concreto
- Cuando sea relevante, pregunta por el tipo de propiedad del usuario para personalizar la respuesta

FORMATO DE RESPUESTAS:
- NUNCA uses markdown (ni **, ni ##, ni *, ni __)  -- el chat no lo renderiza
- Cuando hagas varias preguntas, SIEMPRE ponlas en lineas separadas numeradas, nunca juntas en un parrafo
- Ejemplo correcto:
  1. Que tipo de propiedad tienes?
  2. En que zona esta?
  3. Cuantas unidades manejas?
- Ejemplo INCORRECTO: "Que tipo de propiedad tienes? Y en que zona? Y cuantas unidades?"

CUÁNDO ESCALAR A WHATSAPP:
Cuando el usuario:
- Pregunta cómo empezar, activar, o cuánto cuesta en su caso específico
- Tiene una propiedad concreta y quiere saber si aplica
- Lleva 3+ intercambios y muestra interés real
- Pide hablar con alguien, una demo, o más información
→ Responde con tu mensaje normal Y agrega exactamente [ESCALAR_WA] al final

REQUISITOS PARA OPERAR (lo que el dueño necesita tener):
Requeridos: WiFi estable en la propiedad (Starlink para zonas rurales/costeras, 4G/5G, o ISP), número WhatsApp activo, cuenta email, número telefónico colombiano, RNT vigente, cuenta en Alegra o Siigo (para facturación DIAN), NIT o cédula para facturación, mínimo 8 fotos de la propiedad, información básica documentada (capacidad, tarifas, reglas, cómo llegar).
Opcionales: cuenta Instagram/TikTok, presupuesto para pauta digital ($50-200 USD/mes recomendado), credenciales Airbnb/Booking para sincronización.

RESTRICCIONES:
- NUNCA menciones que eres Claude, Anthropic, GPT, OpenAI, ni ningún modelo de IA externo
- Eres el asesor de Host Help — si preguntan por la tecnología, di que es tecnología propia de DeHyl para Host Help
- No inventes precios, módulos ni funciones que no estén en este prompt`;

async function fetchPlatformKB() {
  try {
    const res = await fetch('https://capitan-dd-production.up.railway.app/api/knowledge/platform', {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return '';
    const entries = await res.json();
    if (!Array.isArray(entries) || entries.length === 0) return '';
    return '\n\nCONOCIMIENTO ADICIONAL:\n' + entries.map(e => `## ${e.title}\n${e.content}`).join('\n\n');
  } catch {
    return '';
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Sales chat endpoint
    if (url.pathname === '/api/chat' && request.method === 'POST') {
      return handleChat(request, env);
    }

    // Everything else → static assets
    return env.ASSETS.fetch(request);
  },
};

async function saveSession(sessionId, messages, escalated) {
  try {
    await fetch('https://capitan-dd-production.up.railway.app/api/platform-sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, messages, escalated }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // fire-and-forget, never fail the chat response
  }
}

async function handleChat(request, env) {
  try {
    const { messages, sessionId } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return jsonResponse({ error: 'messages required' }, 400);
    }

    // Keep last 10 messages to stay within context limits
    const trimmed = messages.slice(-10);

    // Fetch dynamic KB entries from platform (non-blocking fallback)
    const kbExtra = await fetchPlatformKB();
    const systemPrompt = SYSTEM_PROMPT + kbExtra;

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: systemPrompt,
        messages: trimmed,
      }),
    });

    if (!upstream.ok) {
      const err = await upstream.text();
      console.error('Anthropic error:', err);
      return jsonResponse({ error: 'upstream_error' }, 502);
    }

    const data = await upstream.json();
    const raw = data.content?.[0]?.text ?? '';
    const escalate = raw.includes('[ESCALAR_WA]');
    const response = raw.replace('[ESCALAR_WA]', '').trim();

    // Persist full conversation (including new assistant turn) — fire and forget
    if (sessionId) {
      const fullMessages = [...trimmed, { role: 'assistant', content: response }];
      saveSession(sessionId, fullMessages, escalate);
    }

    return jsonResponse({ response, escalate });
  } catch (err) {
    console.error('handleChat error:', err);
    return jsonResponse({ error: err.message }, 500);
  }
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
