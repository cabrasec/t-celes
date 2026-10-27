const phoneField = document.querySelector('#telefone');
const contactForm = document.querySelector('.contact-form');
const formStatus = document.querySelector('#form-status');
const submitButton = contactForm?.querySelector('.form-submit');
const configuredEndpoint = contactForm?.getAttribute('action')?.trim() || '';
const formEndpoint = /^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/.test(configuredEndpoint)
  ? configuredEndpoint
  : '';
const primaryCtaLinks = document.querySelectorAll('header .btn-wpp, .hero .btn-principal, #contato .contact-side .acoes a');
const contactSection = document.querySelector('#contato');
const floatingContactLink = document.querySelector('.flutuante');
let submissionInProgress = false;

if (submitButton) {
  submitButton.disabled = !formEndpoint;
  if (!formEndpoint && formStatus) {
    formStatus.textContent = 'O formulário ainda não está configurado. Entre em contato pelo WhatsApp ou e-mail.';
  }
}

if (primaryCtaLinks.length && contactSection && floatingContactLink) {
  if ('IntersectionObserver' in window) {
    const visiblePrimaryCtas = new Set();
    let contactSectionVisible = false;
    const updateFloatingCtaVisibility = () => {
      const showFloatingCta = visiblePrimaryCtas.size === 0 && !contactSectionVisible;
      floatingContactLink.classList.toggle('is-visible', showFloatingCta);
      floatingContactLink.setAttribute('aria-hidden', String(!showFloatingCta));
      floatingContactLink.tabIndex = showFloatingCta ? 0 : -1;
    };
    const contactCtaObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === contactSection) {
          contactSectionVisible = entry.isIntersecting;
        } else if (entry.isIntersecting) {
          visiblePrimaryCtas.add(entry.target);
        } else {
          visiblePrimaryCtas.delete(entry.target);
        }
      });
      updateFloatingCtaVisibility();
    }, { threshold: 0.01 });

    primaryCtaLinks.forEach((link) => contactCtaObserver.observe(link));
    contactCtaObserver.observe(contactSection);
    const contactRect = contactSection.getBoundingClientRect();
    primaryCtaLinks.forEach((link) => {
      const rect = link.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) visiblePrimaryCtas.add(link);
    });
    contactSectionVisible = contactRect.bottom > 0 && contactRect.top < window.innerHeight;
    updateFloatingCtaVisibility();
  }
}

document.querySelector('.logo')?.setAttribute('alt', 'Logotipo Tamires Celestino Advocacia');
document.querySelectorAll('.retrato').forEach((image) => image.setAttribute('alt', 'Tamires Celestino, advogada'));
document.querySelector('.flor')?.setAttribute('alt', '');

phoneField?.addEventListener('input', () => {
  const digits = phoneField.value.replace(/\D/g, '').slice(0, 11);
  const areaCode = digits.slice(0, 2);
  const localNumber = digits.slice(2);
  let formatted = areaCode ? `(${areaCode}` : '';

  if (digits.length > 2) {
    formatted += `) ${localNumber}`;
    if (localNumber.length >= 8) {
      const splitAt = localNumber.length === 9 ? 5 : 4;
      formatted = `(${areaCode}) ${localNumber.slice(0, splitAt)}-${localNumber.slice(splitAt)}`;
    }
  }

  phoneField.value = formatted;
});

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (submissionInProgress || !contactForm.reportValidity()) return;
  if (!formEndpoint) {
    formStatus.textContent = 'O formulário ainda não está configurado. Entre em contato pelo WhatsApp ou e-mail.';
    return;
  }

  submissionInProgress = true;
  submitButton.disabled = true;
  submitButton.textContent = 'Enviando...';
  formStatus.textContent = 'Sua solicitação está sendo enviada.';

  try {
    const response = await fetch(formEndpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(new FormData(contactForm)).toString()
    });

    if (!response.ok) throw new Error(`Falha no envio: HTTP ${response.status}`);
    if (!(response.headers.get('content-type') || '').includes('application/json')) {
      throw new Error('Resposta inválida do serviço de formulário');
    }

    const result = await response.json();
    if (Array.isArray(result?.errors) && result.errors.length > 0) {
      throw new Error('O serviço de formulário recusou a solicitação');
    }

    contactForm.reset();
    formStatus.textContent = 'Solicitação enviada. Obrigada pelo contato; retornarei assim que possível.';
  } catch {
    formStatus.textContent = 'Não foi possível enviar agora. Tente novamente ou entre em contato pelo WhatsApp ou e-mail.';
  } finally {
    submissionInProgress = false;
    submitButton.disabled = !formEndpoint;
    submitButton.textContent = 'Enviar solicitação';
  }
});
