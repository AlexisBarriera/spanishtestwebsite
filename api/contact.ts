
import type { VercelRequest, VercelResponse } from '@vercel/node';

const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_GjYGBEbs_Hptk9n9i9bh9NAxFVCtCD8BN';
const CLIENT_EMAIL = process.env.CLIENT_EMAIL || 'alexisbarriera72@gmail.com';

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
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const formData = req.body;

    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      return res.status(400).json({ 
        error: 'Faltan campos obligatorios',
        required: ['nombre', 'correo', 'mensaje']
      });
    }

    // Create email HTML content in Spanish
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #722f37, #8b4049); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
          <h2 style="margin: 0; text-align: center;">Nueva Solicitud de Contacto</h2>
        </div>
        <div style="background: #faf8f5; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="margin-bottom: 20px;"><strong>De:</strong> ${formData.name}</p>
          <p style="margin-bottom: 20px;"><strong>Correo:</strong> <a href="mailto:${formData.email}" style="color: #722f37;">${formData.email}</a></p>
          ${formData.phone ? `<p style="margin-bottom: 20px;"><strong>Teléfono:</strong> ${formData.phone}</p>` : ''}
          ${formData.service ? `<p style="margin-bottom: 20px;"><strong>Servicio de Interés:</strong> ${formData.service}</p>` : ''}
          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #d4a574;">
            <p style="margin-bottom: 20px;"><strong>Mensaje:</strong></p>
            <p style="background: white; padding: 15px; border-left: 3px solid #722f37; border-radius: 5px;">${formData.message.replace(/\n/g, '<br>')}</p>
          </div>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #d4a574;">
          <p style="font-size: 12px; color: #6b5648; text-align: center;">
            Enviado el ${new Date(formData.timestamp).toLocaleString('es-ES', {
              weekday: 'long',
              year: 'numeric', 
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    `;

    // Send email using Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Formulario de Contacto <onboarding@resend.dev>',
        to: CLIENT_EMAIL,
        subject: `Nueva Solicitud de Contacto de ${formData.name}`,
        html: htmlContent,
        reply_to: formData.email
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend API error:', error);
      throw new Error('Error al enviar el correo');
    }

    const data = await response.json();
    console.log('Correo enviado exitosamente:', data);

    // Send auto-reply to user
    const autoReplyHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #722f37, #8b4049); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
          <h2 style="margin: 0; text-align: center;">¡Gracias por Contactarnos!</h2>
        </div>
        <div style="background: #faf8f5; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="margin-bottom: 20px;">Estimado/a ${formData.name},</p>
          <p style="margin-bottom: 20px;">Hemos recibido tu mensaje y te agradecemos por tomarte el tiempo de contactarnos.</p>
          <p style="margin-bottom: 20px;">Nuestro equipo revisará tu solicitud y te responderá dentro de las próximas 24 horas.</p>
          <p style="margin-bottom: 30px;">Si tu asunto es urgente, no dudes en llamarnos directamente.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="tel:${formData.phone || '[Tu Teléfono]'}" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #722f37, #8b4049); color: white; text-decoration: none; border-radius: 50px;">Llámanos Ahora</a>
          </div>
          <p style="margin-bottom: 20px;">Esperamos poder ayudarte con tus necesidades financieras.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #d4a574;">
          <div style="text-align: center; font-size: 14px; color: #6b5648;">
            <strong>Servicios Profesionales de Contabilidad</strong><br>
            <p>Correo: ${CLIENT_EMAIL}</p>
          </div>
        </div>
      </div>
    `;

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Servicios de Contabilidad <onboarding@resend.dev>',
        to: formData.email,
        subject: 'Gracias por tu mensaje - Servicios de Contabilidad',
        html: autoReplyHtml
      }),
    });

    res.status(200).json({ 
      success: true,
      message: '¡Tu mensaje ha sido enviado exitosamente!'
    });

  } catch (error) {
    console.error('Error en formulario de contacto:', error);
    res.status(500).json({ 
      error: 'Error al enviar el mensaje',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}
