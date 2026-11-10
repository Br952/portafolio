/**
 * Envío de contacto sin backend obligatorio.
 *
 * - Si `VITE_CONTACT_ENDPOINT` está definido, se hace POST JSON (Formspree,
 *   Resend, API propia…). Cualquier respuesta no-2xx lanza error y la UI
 *   ofrece reintento.
 * - Si no hay endpoint, se compone un `mailto:` con asunto y cuerpo ya
 *   rellenados. Nunca se simula un envío exitoso que no ocurrió.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(values) {
  const errors = {};

  if (values.name.trim().length < 2) {
    errors.name = 'Escribe tu nombre (mínimo 2 caracteres).';
  }

  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Introduce un email válido, por ejemplo nombre@empresa.com.';
  }

  if (values.message.trim().length < 20) {
    errors.message = 'Cuéntame un poco más: mínimo 20 caracteres.';
  }

  return errors;
}

export function buildMailto(values, email) {
  const subject = `Nuevo proyecto — ${values.name.trim()}`;
  const body = `${values.message.trim()}\n\n— ${values.name.trim()}\n${values.email.trim()}`;

  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export async function sendMessage(values, { endpoint, email } = {}) {
  if (!endpoint) {
    const link = document.createElement('a');
    link.href = buildMailto(values, email);
    link.rel = 'noopener noreferrer';
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    link.remove();

    return { channel: 'mailto' };
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    throw new Error(`El endpoint de contacto respondió ${response.status}`);
  }

  return { channel: 'api' };
}
