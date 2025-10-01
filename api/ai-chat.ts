import type { VercelRequest, VercelResponse } from '@vercel/node';

// Store this in your .env.local file - NEVER commit API keys to code
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, userMessage } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemPrompt = `Eres un asistente virtual experto en contabilidad y servicios financieros en Puerto Rico. 
Tu trabajo es ayudar a los clientes en ESPAÑOL a:
1. Responder preguntas sobre impuestos, contabilidad, y finanzas con conocimiento específico de Puerto Rico
2. Identificar qué servicio necesitan basado en su situación
3. Proporcionar información precisa sobre leyes fiscales y contables de Puerto Rico
4. Ayudar con preguntas sobre planillas, IVU, patentes municipales, y otros temas locales

Servicios disponibles en nuestra firma:
- Preparación de Impuestos (planillas federales y de Puerto Rico, corporaciones, individuos)
- Contabilidad (libros contables, estados financieros, IVU mensual)  
- Planificación Financiera (inversiones, retiro, estrategias fiscales)
- Consultoría Empresarial (incorporación, estructura legal, permisos)
- Auditoría (cumplimiento, verificación, controles internos)
- Nómina (procesamiento, retenciones, formularios trimestrales)

Información de contacto:
- Teléfono: +1 (939) 608-3732
- Email: shaddaietp@gmail.com
- Dirección: 29 C. Cristina, Ponce, PR 00730
- Horario: Lunes-Viernes 8:30 AM - 5:00 PM, Sábado (solo PHP) 10:00 AM - 1:00 PM

REGLAS IMPORTANTES:
- SIEMPRE responde en español
- Sé profesional pero amigable y accesible
- Proporciona información específica de Puerto Rico (leyes locales, fechas límite locales, etc.)
- Si alguien necesita ayuda específica, sugiere programar una consulta
- NO des consejos legales definitivos, sugiere consulta profesional para casos específicos
- Menciona las fechas límite importantes (15 de abril para individuos, IVU mensual, etc.)
- Sé específico sobre documentos necesarios cuando pregunten`;

    // Prepare messages for OpenRouter API
    const openRouterMessages = [
      { 
        role: "system", 
        content: systemPrompt 
      },
      ...messages.slice(-10).map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      })),
      { 
        role: "user", 
        content: userMessage 
      }
    ];

    // Call OpenRouter API with free Llama model
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.VERCEL_URL || "http://localhost:3000",
        "X-Title": "Accounting Services AI Assistant",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct:free", // Free model
        messages: openRouterMessages,
        max_tokens: 800,
        temperature: 0.7,
        top_p: 0.9,
        stream: false
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenRouter API error:', error);
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Analyze response for action buttons
    let showBooking = false;
    let showContact = false;
    
    const lowerResponse = aiResponse.toLowerCase();
    if (lowerResponse.includes('cita') || 
        lowerResponse.includes('consulta') ||
        lowerResponse.includes('programar') ||
        lowerResponse.includes('agendar') ||
        lowerResponse.includes('reunión')) {
      showBooking = true;
    }
    
    if (lowerResponse.includes('contacta') || 
        lowerResponse.includes('llama') ||
        lowerResponse.includes('teléfono') ||
        lowerResponse.includes('email') ||
        lowerResponse.includes('939-608')) {
      showContact = true;
    }

    res.status(200).json({ 
      response: aiResponse,
      showBooking,
      showContact,
      model: "llama-3.3-70b"
    });

  } catch (error) {
    console.error('AI Chat error:', error);
    
    // Fallback response if AI fails
    const fallbackResponses = [
      'Disculpa, estoy experimentando dificultades técnicas. Por favor contacta directamente al +1 (939) 608-3732 o envía un correo a shaddaietp@gmail.com.',
      'Lo siento, hay un problema temporal con mi conexión. Mientras tanto, puedes usar el formulario de contacto o llamar al +1 (939) 608-3732.',
      'Estoy teniendo problemas técnicos en este momento. Te recomiendo contactar directamente a nuestro equipo al +1 (939) 608-3732 para asistencia inmediata.'
    ];
    
    res.status(200).json({ 
      response: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      showContact: true,
      error: true
    });
  }
}
