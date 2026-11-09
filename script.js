/* VANTA Creative Studios — portfolio
   To add a project: push a new object into PROJECTS (one image per language).
   To add a category: add its key to CATEGORIES and the label to each language in I18N. */
(function () {
  'use strict';

  var SUPPORTED = ['en', 'es', 'pt'];
  var DEFAULT_LANG = 'en';   /* used when the device language is not supported */
  /* Folder prefix: '' on the root page, '../' on /es and /pt (works from any host or from local files) */
  var ROOT = (document.querySelector('script[src*="script.js"]').getAttribute('src') || '').replace(/script\.js.*$/, '');
  var IMG_DIR = ROOT + 'images/';
  var THUMB_DIR = ROOT + 'images/thumbs/';
  var IMG_V = '?v=3'; /* bump to force browsers to reload images after replacing files */
  /* If a .webp fails to load, retry once with the .jpg next to it */
  document.addEventListener('error', function (e) {
    var el = e.target;
    if (el && el.tagName === 'IMG' && /\.webp(\?|$)/.test(el.src) && !el.dataset.fb) {
      el.dataset.fb = '1';
      el.src = el.src.replace(/\.webp/, '.jpg');
    }
  }, true);
  function W(n) { return n.replace(/\.jpg$/, '.webp'); } /* WebP in the site, JPG kept as fallback/download */

  /* Contact form: paste a Formspree (or compatible) endpoint here, e.g. 'https://formspree.io/f/xxxxxxx'.
     While empty, the form falls back to opening the visitor's mail app (mailto). See SETUP.md. */
  var FORM_ENDPOINT = '';

  var CATEGORIES = ['gaming', 'minecraft', 'concepts'];

  /* Plan prices in USD, same order as packs in I18N: Starter, Multilingual, Channel Pack */
  /* Launch offer on the Multilingual plan. The offer is real: after OFFER.until the price goes back to OFFER.regular on its own.
     Create two PayPal links (one for the offer price, one for the regular price) and paste them in payOffer / payRegular.
     While a link is empty, that plan shows no PayPal link (you send the payment link by email after the preview is approved). */
  var OFFER = { pack: 1, regular: 17, price: 12, until: '2026-11-30', payOffer: 'https://www.paypal.com/ncp/payment/B5D87BD57WEVU', payRegular: 'https://www.paypal.com/ncp/payment/GK5HPFRZPFDG2' };
  function offerOn() { return new Date() <= new Date(OFFER.until + 'T23:59:59'); }
  var PRICES = [5, offerOn() ? OFFER.price : OFFER.regular, 25];
  /* PayPal payment links, same order as PRICES */
  var PAY_LINKS = [
    'https://www.paypal.com/ncp/payment/TM8AZNUMWGA64',
    offerOn() ? OFFER.payOffer : OFFER.payRegular,
    'https://www.paypal.com/ncp/payment/VSJREZKL7NF5C'
  ];
  /* Real thumbnails shown at the top of each plan, to make the amount you get visible */
  var PREVIEWS = [
    [['who-are-you-en.jpg']],
    [['who-are-you-en.jpg', 'EN'], ['quien-sos-es.jpg', 'ES'], ['quem-e-voce-pt.jpg', 'PT']],
    [['who-are-you-en.jpg'], ['stop-en.jpg'], ['minecraft-cube-earth.jpg'], ['quien-sos-es.jpg'], ['basta-es-pt.jpg']]
  ];

  var PROJECTS = [
    {
      id: 'who-are-you',
      category: 'concepts',
      title: { en: 'Who are you?', es: '¿Quién sos?', pt: 'Quem é você?' },
      images: { en: 'who-are-you-en.jpg', es: 'quien-sos-es.jpg', pt: 'quem-e-voce-pt.jpg' }
    },
    {
      id: 'stop-basta',
      category: 'gaming',
      title: { en: 'Stop', es: 'Basta', pt: 'Basta' },
      images: { en: 'stop-en.jpg', es: 'basta-es-pt.jpg', pt: 'basta-es-pt.jpg' }
    },
    {
      id: 'minecraft-cube-earth',
      category: 'minecraft',
      title: { en: 'Minecraft: Cube Earth', es: 'Minecraft: La Tierra cúbica', pt: 'Minecraft: A Terra cúbica' },
      images: { en: 'minecraft-cube-earth.jpg', es: 'minecraft-cube-earth.jpg', pt: 'minecraft-cube-earth.jpg' }
    }
  ];

  var I18N = {
    en: {
      sub_secure: 'Secure payment with PayPal',
      sub_btn: 'Subscribe with PayPal',
      sub_tag: 'Subscription',
      sub_title: 'VANTA Subscription',
      sub_desc: 'Ongoing thumbnail design with a consistent look for your channel.',
      sub_f1: 'Recurring payment with PayPal',
      sub_f2: 'Cancel anytime from your PayPal account',
      sub_f3: 'After subscribing, write to us to set up your brief',
      sub_ok: 'Subscription active. Thank you! Write to us to set up your brief. Reference: {id}',
      sub_err: 'The payment could not be completed. Please try again.',
      sub_fail: 'PayPal could not be loaded. Disable your ad blocker or write to us by email.',
      nav_services: 'Services',
      services_eyebrow: 'Services',
      services_title: 'Pick your plan',
      services_sub: 'Fixed prices in USD. Send your brief first: you only pay after you approve a preview.',
      pk_hot: 'Most popular',
      nav_cta: 'Pick a plan', ch_email: 'Email', ch_copy: 'Tap to copy: vanta_creative_studio',
      lb_modes: 'View mode', lb_full: 'Full size', lb_yt: 'On YouTube', lb_small: 'Small sizes', lb_dark: 'Dark mode', lb_light: 'Light mode', lb_channel: 'Your channel',
      lb_home: 'Home', lb_search: 'Search results', lb_side: 'Suggested videos', lb_prev: 'Previous', lb_next: 'Next',
      lb_note_yt: 'Simulation: the duration badge covers the bottom-right corner, so keep important content out of it.',
      lb_note_small: 'Check that the main text stays readable at small sizes.',
      alt_thumb: 'YouTube thumbnail designed by VANTA Creative Studios', aria_main: 'Main', aria_lang: 'Language', aria_filter: 'Filter projects', aria_studio: 'Studio', how_eyebrow: 'How it works', how_title: 'From idea to thumbnail in three steps',
      st1_t: 'Send your brief', st1_d: 'Tell us the topic, the text you want on the image and any references. It\'s free and you pay nothing yet.',
      st2_t: 'Review your preview', st2_d: 'Within your plan\'s delivery time we send a watermarked preview and adjust it with your revisions.',
      st3_t: 'Approve, pay and receive', st3_d: 'Once you approve, pay securely with PayPal and get the final file without watermark.',
      offer_tag: 'Launch offer · {p}% off until {d}', offer_faq: 'launch offer until {d}, then {r}', date_loc: 'en-US',
      pk_cta: 'Already approved? Pay with PayPal', pk_brief: 'Start with a free brief',
      pk_note: ['No payment before you approve a preview', 'Paid securely through PayPal', 'Revisions included', 'JPG or PNG, 1920×1080'],
      pk_choose: 'Choose a package',
      pk_unsure: 'Not sure yet',
      packs: [['Starter', 'One thumbnail, built around one clear idea.', ['1 thumbnail (1920×1080)', '1 language', '2 rounds of revisions', 'Delivery in 48 h'], 'For one thumbnail'], ['Multilingual', 'The same idea, written natively for each audience.', ['1 thumbnail in EN · ES · PT', '3 rounds of revisions', 'Delivery in 72 h', 'Priority support'], 'For 3 languages in one'], ['Channel Pack', 'A consistent look across a series or a whole channel.', ['5 thumbnails, one visual style', 'Languages of your choice', '3 rounds of revisions each', 'Schedule agreed in the brief'], 'For 5 thumbnails, $5 each']],
      faq_eyebrow: 'FAQ',
      faq_title: 'Good to know',
      faq: [['How much does it cost?', 'Starter is $5, Multilingual is $15 and Channel Pack is $25. All prices are in USD.'], ['How long does a thumbnail take?', 'Starter takes about 48 hours and Multilingual about 72 hours. Channel Packs follow a schedule we agree on in the brief.'], ['How many revisions are included?', 'Two rounds in Starter and three in Multilingual and Channel Pack, so the result matches your idea.'], ['What do I receive?', 'A high-quality JPG or PNG at 1920×1080 (16:9), optimized for YouTube. Editable files are available on request.'], ['Can I get other languages?', 'Yes. Each language version is designed natively, not a translation pasted over the same image.'], ['When do I pay?', 'Only after you approve the watermarked preview. First you send the brief, we reply by email to confirm the details, and we deliver the preview within your plan\'s time.'], ['What if I don\'t like the result?', 'You get the revision rounds included in your plan. If the preview still isn\'t what you need, you don\'t pay.'], ['How do I start?', 'Send the brief below or write to vantacreativestudios1@gmail.com with your channel and video idea.']],
      f_name: 'Name',
      f_channel: 'Channel or video link',
      f_pack: 'Package',
      f_deadline: 'Deadline',
      f_deadline_ph: 'e.g. next Friday',
      f_langs: 'Languages',
      f_msg: 'Tell us about the video',
      f_msg_ph: 'Topic, mood, text you want on the image, references…',
      f_send: 'Send brief',
      f_or: 'Or write to us directly',
      f_err: 'Please add your name and a short description.',
      f_subject: 'New brief — VANTA Creative Studios', soon_t: 'Your project here', soon_s: 'More work is on the way', f_sending: 'Sending…', f_ok: 'Message sent. We will reply to your email.', f_fail: 'Could not send. Please try again or write to vantacreativestudios1@gmail.com.', f_email: 'Email', f_email_bad: 'Enter a valid email.',
      social_label: 'Or find us on', copied: 'Discord username copied!',
      skip: 'Skip to content', nav_work: 'Work', nav_about: 'About', nav_contact: 'Contact',
      hero_title: 'Ideas that get noticed.',
      hero_desc: 'VANTA creates eye-catching YouTube thumbnails that stop the scroll, spark curiosity and turn impressions into views.',
      hero_cta: 'View portfolio',
      stat_1: 'Click-ready format', stat_2: 'Languages per project', stat_3: 'Clear idea per image',
      portfolio_eyebrow: 'Selected work', portfolio_title: 'Thumbnail portfolio',
      about_eyebrow: 'About', about_title: 'Visual storytelling, in three languages.',
      about_p1: 'A thumbnail has less than a second to earn a click. We start from one clear idea, build a focal point, and use contrast, emotion and typography to communicate it instantly.',
      about_p2: 'Every project is designed natively for English, Spanish and Portuguese, so each audience sees the image written for them, not just a translation.',
      pillar_1: 'One idea, one focal point', pillar_2: 'Bold contrast & readable type', pillar_3: 'Native in every language',
      contact_title: "Let's create something great.",
      contact_desc: "Tell us about your channel and your next video. We'll reply with ideas.",
      footer_tag: 'Ideas that get noticed.',
      all: 'All projects', gaming: 'Gaming', minecraft: 'Minecraft', concepts: 'Concepts',
      langName: 'English', close: 'Close', open: 'Open preview', empty: 'No projects in this category yet.',
      doc_title: 'YouTube Thumbnail Design | VANTA Creative Studios',
      doc_desc: 'YouTube thumbnail design in English, Spanish and Portuguese. Browse the VANTA Creative Studios portfolio and pick a plan from $5.'
    },
    es: {
      sub_secure: 'Pago seguro con PayPal',
      sub_btn: 'Suscribirme con PayPal',
      sub_tag: 'Suscripción',
      sub_title: 'Suscripción VANTA',
      sub_desc: 'Diseño de miniaturas de forma continua, con un estilo coherente para tu canal.',
      sub_f1: 'Pago recurrente con PayPal',
      sub_f2: 'Cancela cuando quieras desde tu cuenta de PayPal',
      sub_f3: 'Después de suscribirte, escríbenos para coordinar tu brief',
      sub_ok: 'Suscripción activa. ¡Gracias! Escríbenos para coordinar tu brief. Referencia: {id}',
      sub_err: 'No se pudo completar el pago. Inténtalo de nuevo.',
      sub_fail: 'No se pudo cargar PayPal. Desactiva tu bloqueador de anuncios o escríbenos por correo.',
      nav_services: 'Servicios',
      services_eyebrow: 'Servicios',
      services_title: 'Elige tu plan',
      services_sub: 'Precios fijos en USD. Envía primero tu brief: solo pagas cuando apruebas una vista previa.',
      pk_hot: 'Más popular',
      nav_cta: 'Elegir plan', ch_email: 'Correo', ch_copy: 'Toca para copiar: vanta_creative_studio',
      lb_modes: 'Modo de vista', lb_full: 'Tamaño completo', lb_yt: 'En YouTube', lb_small: 'Tamaños pequeños', lb_dark: 'Modo oscuro', lb_light: 'Modo claro', lb_channel: 'Tu canal',
      lb_home: 'Inicio', lb_search: 'Resultados de búsqueda', lb_side: 'Videos sugeridos', lb_prev: 'Anterior', lb_next: 'Siguiente',
      lb_note_yt: 'Simulación: la etiqueta de duración cubre la esquina inferior derecha, así que ahí no debe ir nada importante.',
      lb_note_small: 'Comprueba que el texto principal siga leyéndose en tamaños reducidos.',
      alt_thumb: 'Miniatura de YouTube diseñada por VANTA Creative Studios', aria_main: 'Principal', aria_lang: 'Idioma', aria_filter: 'Filtrar proyectos', aria_studio: 'Estudio', how_eyebrow: 'Cómo funciona', how_title: 'De la idea a la miniatura en tres pasos',
      st1_t: 'Envía tu brief', st1_d: 'Cuéntanos el tema, el texto que quieres en la imagen y tus referencias. Es gratis y todavía no pagas nada.',
      st2_t: 'Revisa tu vista previa', st2_d: 'En el plazo de tu plan te enviamos una vista previa con marca de agua y la ajustamos con tus revisiones.',
      st3_t: 'Aprueba, paga y recibe', st3_d: 'Cuando apruebes, paga de forma segura con PayPal y recibe el archivo final sin marca de agua.',
      offer_tag: 'Oferta de lanzamiento · {p}% menos hasta el {d}', offer_faq: 'oferta de lanzamiento hasta el {d}, luego {r}', date_loc: 'es',
      pk_cta: '¿Ya aprobaste? Paga con PayPal', pk_brief: 'Empieza con un brief gratis',
      pk_note: ['Sin pagar hasta que apruebes una vista previa', 'Pago seguro con PayPal', 'Revisiones incluidas', 'JPG o PNG, 1920×1080'],
      pk_choose: 'Elige un paquete',
      pk_unsure: 'Aún no lo sé',
      packs: [['Starter', 'Una miniatura construida alrededor de una idea clara.', ['1 miniatura (1920×1080)', '1 idioma', '2 rondas de revisiones', 'Entrega en 48 h'], 'Por 1 miniatura'], ['Multilingüe', 'La misma idea, escrita de forma nativa para cada audiencia.', ['1 miniatura en EN · ES · PT', '3 rondas de revisiones', 'Entrega en 72 h', 'Soporte prioritario'], 'Por 3 idiomas en uno'], ['Pack de canal', 'Un estilo coherente para una serie o todo un canal.', ['5 miniaturas, un mismo estilo visual', 'Idiomas a tu elección', '3 rondas de revisiones cada una', 'Calendario acordado en el brief'], 'Por 5 miniaturas, $5 c/u']],
      faq_eyebrow: 'Preguntas',
      faq_title: 'Bueno saber',
      faq: [['¿Cuánto cuesta?', 'Starter cuesta $5, Multilingüe $15 y Pack de canal $25. Todos los precios están en USD.'], ['¿Cuánto tarda una miniatura?', 'Starter tarda unas 48 horas y Multilingüe unas 72 horas. Los packs de canal siguen un calendario que acordamos en el brief.'], ['¿Cuántas revisiones incluye?', 'Dos rondas en Starter y tres en Multilingüe y Pack de canal, para que el resultado coincida con tu idea.'], ['¿Qué recibo?', 'Un JPG o PNG de alta calidad a 1920×1080 (16:9), optimizado para YouTube. Los archivos editables están disponibles bajo petición.'], ['¿Puedo tener otros idiomas?', 'Sí. Cada versión se diseña de forma nativa, no es una traducción pegada sobre la misma imagen.'], ['¿Cuándo pago?', 'Solo después de aprobar la vista previa con marca de agua. Primero envías el brief, te respondemos por correo para confirmar los detalles y entregamos la vista previa en el plazo de tu plan.'], ['¿Y si no me gusta el resultado?', 'Tienes las rondas de revisiones incluidas en tu plan. Si la vista previa sigue sin ser lo que necesitas, no pagas.'], ['¿Cómo empiezo?', 'Envía el brief de abajo o escribe a vantacreativestudios1@gmail.com con tu canal y la idea del video.']],
      f_name: 'Nombre',
      f_channel: 'Canal o enlace del video',
      f_pack: 'Paquete',
      f_deadline: 'Fecha límite',
      f_deadline_ph: 'ej. el próximo viernes',
      f_langs: 'Idiomas',
      f_msg: 'Cuéntanos sobre el video',
      f_msg_ph: 'Tema, estilo, texto que quieres en la imagen, referencias…',
      f_send: 'Enviar brief',
      f_or: 'O escríbenos directamente',
      f_err: 'Agrega tu nombre y una breve descripción.',
      f_subject: 'Nuevo brief — VANTA Creative Studios', soon_t: 'Tu proyecto aquí', soon_s: 'Pronto más trabajos', f_sending: 'Enviando…', f_ok: 'Mensaje enviado. Te responderemos por correo.', f_fail: 'No se pudo enviar. Inténtalo de nuevo o escribe a vantacreativestudios1@gmail.com.', f_email: 'Correo', f_email_bad: 'Escribe un correo válido.',
      social_label: 'O encuéntranos en', copied: '¡Usuario de Discord copiado!',
      skip: 'Saltar al contenido', nav_work: 'Trabajos', nav_about: 'Nosotros', nav_contact: 'Contacto',
      hero_title: 'Ideas que llaman la atención.',
      hero_desc: 'VANTA crea miniaturas de YouTube llamativas que detienen el scroll, despiertan la curiosidad y convierten impresiones en vistas.',
      hero_cta: 'Ver portafolio',
      stat_1: 'Formato listo para clics', stat_2: 'Idiomas por proyecto', stat_3: 'Una idea clara por imagen',
      portfolio_eyebrow: 'Trabajos seleccionados', portfolio_title: 'Portafolio de miniaturas',
      about_eyebrow: 'Nosotros', about_title: 'Narrativa visual, en tres idiomas.',
      about_p1: 'Una miniatura tiene menos de un segundo para ganarse un clic. Partimos de una idea clara, construimos un punto focal y usamos contraste, emoción y tipografía para comunicarla al instante.',
      about_p2: 'Cada proyecto se diseña de forma nativa para inglés, español y portugués, para que cada audiencia vea la imagen pensada para ella, no solo una traducción.',
      pillar_1: 'Una idea, un punto focal', pillar_2: 'Contraste fuerte y tipografía legible', pillar_3: 'Nativo en cada idioma',
      contact_title: 'Creemos algo grandioso.',
      contact_desc: 'Cuéntanos sobre tu canal y tu próximo video. Te responderemos con ideas.',
      footer_tag: 'Ideas que llaman la atención.',
      all: 'Todos los proyectos', gaming: 'Gaming', minecraft: 'Minecraft', concepts: 'Conceptos',
      langName: 'Español', close: 'Cerrar', open: 'Abrir vista previa', empty: 'Aún no hay proyectos en esta categoría.',
      doc_title: 'Diseño de miniaturas para YouTube | VANTA Creative Studios',
      doc_desc: 'Diseño de miniaturas y thumbnails para YouTube en español, inglés y portugués. Mira el portafolio de VANTA Creative Studios y elige tu plan desde $5.'
    },
    pt: {
      sub_secure: 'Pagamento seguro pelo PayPal',
      sub_btn: 'Assinar com o PayPal',
      sub_tag: 'Assinatura',
      sub_title: 'Assinatura VANTA',
      sub_desc: 'Design de thumbnails contínuo, com um visual consistente para o seu canal.',
      sub_f1: 'Pagamento recorrente pelo PayPal',
      sub_f2: 'Cancele quando quiser pela sua conta do PayPal',
      sub_f3: 'Depois de assinar, escreva para nós para combinar seu briefing',
      sub_ok: 'Assinatura ativa. Obrigado! Escreva para nós para combinar seu briefing. Referência: {id}',
      sub_err: 'Não foi possível concluir o pagamento. Tente novamente.',
      sub_fail: 'Não foi possível carregar o PayPal. Desative seu bloqueador de anúncios ou escreva por e-mail.',
      nav_services: 'Serviços',
      services_eyebrow: 'Serviços',
      services_title: 'Escolha seu plano',
      services_sub: 'Preços fixos em USD. Envie primeiro seu briefing: você só paga depois de aprovar uma prévia.',
      pk_hot: 'Mais popular',
      nav_cta: 'Escolher plano', ch_email: 'E-mail', ch_copy: 'Toque para copiar: vanta_creative_studio',
      lb_modes: 'Modo de visualização', lb_full: 'Tamanho completo', lb_yt: 'No YouTube', lb_small: 'Tamanhos pequenos', lb_dark: 'Modo escuro', lb_light: 'Modo claro', lb_channel: 'Seu canal',
      lb_home: 'Início', lb_search: 'Resultados de busca', lb_side: 'Vídeos sugeridos', lb_prev: 'Anterior', lb_next: 'Próximo',
      lb_note_yt: 'Simulação: a etiqueta de duração cobre o canto inferior direito, então nada importante deve ficar ali.',
      lb_note_small: 'Confira se o texto principal continua legível em tamanhos reduzidos.',
      alt_thumb: 'Thumbnail do YouTube criada pela VANTA Creative Studios', aria_main: 'Principal', aria_lang: 'Idioma', aria_filter: 'Filtrar projetos', aria_studio: 'Estúdio', how_eyebrow: 'Como funciona', how_title: 'Da ideia à thumbnail em três passos',
      st1_t: 'Envie seu briefing', st1_d: 'Conte o tema, o texto que quer na imagem e suas referências. É grátis e você ainda não paga nada.',
      st2_t: 'Revise sua prévia', st2_d: 'No prazo do seu plano enviamos uma prévia com marca d\'água e ajustamos com suas revisões.',
      st3_t: 'Aprove, pague e receba', st3_d: 'Depois de aprovar, pague com segurança pelo PayPal e receba o arquivo final sem marca d\'água.',
      offer_tag: 'Oferta de lançamento · {p}% off até {d}', offer_faq: 'oferta de lançamento até {d}, depois {r}', date_loc: 'pt-BR',
      pk_cta: 'Já aprovou? Pague pelo PayPal', pk_brief: 'Comece com um briefing grátis',
      pk_note: ['Sem pagar até você aprovar uma prévia', 'Pagamento seguro pelo PayPal', 'Revisões incluídas', 'JPG ou PNG, 1920×1080'],
      pk_choose: 'Escolha um pacote',
      pk_unsure: 'Ainda não sei',
      packs: [['Starter', 'Uma thumbnail construída em torno de uma ideia clara.', ['1 thumbnail (1920×1080)', '1 idioma', '2 rodadas de revisões', 'Entrega em 48 h'], 'Por 1 thumbnail'], ['Multilíngue', 'A mesma ideia, escrita nativamente para cada público.', ['1 thumbnail em EN · ES · PT', '3 rodadas de revisões', 'Entrega em 72 h', 'Suporte prioritário'], 'Por 3 idiomas em um'], ['Pacote de canal', 'Um visual consistente para uma série ou um canal inteiro.', ['5 thumbnails, um mesmo estilo visual', 'Idiomas à sua escolha', '3 rodadas de revisões cada', 'Cronograma combinado no briefing'], 'Por 5 thumbnails, $5 cada']],
      faq_eyebrow: 'Perguntas',
      faq_title: 'Bom saber',
      faq: [['Quanto custa?', 'O Starter custa $5, o Multilíngue $15 e o Pacote de canal $25. Todos os preços são em USD.'], ['Quanto tempo leva uma thumbnail?', 'Starter leva cerca de 48 horas e Multilíngue cerca de 72 horas. Os pacotes de canal seguem um cronograma combinado no briefing.'], ['Quantas revisões estão incluídas?', 'Duas rodadas no Starter e três no Multilíngue e no Pacote de canal, para que o resultado combine com a sua ideia.'], ['O que eu recebo?', 'Um JPG ou PNG de alta qualidade em 1920×1080 (16:9), otimizado para o YouTube. Arquivos editáveis estão disponíveis sob pedido.'], ['Posso ter outros idiomas?', 'Sim. Cada versão é criada nativamente, não é uma tradução colada sobre a mesma imagem.'], ['Quando eu pago?', 'Somente depois de aprovar a prévia com marca d\'água. Primeiro você envia o briefing, respondemos por e-mail para confirmar os detalhes e entregamos a prévia no prazo do seu plano.'], ['E se eu não gostar do resultado?', 'Você tem as rodadas de revisões incluídas no seu plano. Se a prévia ainda não for o que você precisa, você não paga.'], ['Como começo?', 'Envie o briefing abaixo ou escreva para vantacreativestudios1@gmail.com com seu canal e a ideia do vídeo.']],
      f_name: 'Nome',
      f_channel: 'Canal ou link do vídeo',
      f_pack: 'Pacote',
      f_deadline: 'Prazo',
      f_deadline_ph: 'ex. próxima sexta',
      f_langs: 'Idiomas',
      f_msg: 'Conte-nos sobre o vídeo',
      f_msg_ph: 'Tema, estilo, texto que quer na imagem, referências…',
      f_send: 'Enviar briefing',
      f_or: 'Ou escreva diretamente',
      f_err: 'Adicione seu nome e uma breve descrição.',
      f_subject: 'Novo briefing — VANTA Creative Studios', soon_t: 'Seu projeto aqui', soon_s: 'Em breve, mais trabalhos', f_sending: 'Enviando…', f_ok: 'Mensagem enviada. Responderemos por e-mail.', f_fail: 'Não foi possível enviar. Tente de novo ou escreva para vantacreativestudios1@gmail.com.', f_email: 'E-mail', f_email_bad: 'Digite um e-mail válido.',
      social_label: 'Ou encontre-nos em', copied: 'Usuário do Discord copiado!',
      skip: 'Ir para o conteúdo', nav_work: 'Trabalhos', nav_about: 'Sobre', nav_contact: 'Contato',
      hero_title: 'Ideias que chamam atenção.',
      hero_desc: 'A VANTA cria thumbnails de YouTube chamativas que param o scroll, despertam curiosidade e transformam impressões em visualizações.',
      hero_cta: 'Ver portfólio',
      stat_1: 'Formato pronto para cliques', stat_2: 'Idiomas por projeto', stat_3: 'Uma ideia clara por imagem',
      portfolio_eyebrow: 'Trabalhos selecionados', portfolio_title: 'Portfólio de thumbnails',
      about_eyebrow: 'Sobre', about_title: 'Narrativa visual, em três idiomas.',
      about_p1: 'Uma thumbnail tem menos de um segundo para conquistar um clique. Partimos de uma ideia clara, construímos um ponto focal e usamos contraste, emoção e tipografia para comunicá-la na hora.',
      about_p2: 'Cada projeto é criado nativamente para inglês, espanhol e português, para que cada público veja a imagem pensada para ele, e não apenas uma tradução.',
      pillar_1: 'Uma ideia, um ponto focal', pillar_2: 'Contraste forte e tipografia legível', pillar_3: 'Nativo em cada idioma',
      contact_title: 'Vamos criar algo incrível.',
      contact_desc: 'Conte-nos sobre o seu canal e o seu próximo vídeo. Responderemos com ideias.',
      footer_tag: 'Ideias que chamam atenção.',
      all: 'Todos os projetos', gaming: 'Gaming', minecraft: 'Minecraft', concepts: 'Conceitos',
      langName: 'Português', close: 'Fechar', open: 'Abrir pré-visualização', empty: 'Ainda não há projetos nesta categoria.',
      doc_title: 'Design de thumbnails para YouTube | VANTA Creative Studios',
      doc_desc: 'Design de thumbnails e miniaturas para YouTube em português, inglês e espanhol. Veja o portfólio da VANTA Creative Studios e escolha seu plano a partir de $5.'
    }
  };

  var state = { lang: DEFAULT_LANG, filter: 'all' };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var grid = $('#grid'), filtersEl = $('#filters');
  var lightbox = $('#lightbox'), lbImg = $('#lightboxImg'), lbCap = $('#lightboxCap'), lbClose = $('#lightboxClose');
  var lastFocus = null;
  var fine = window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var cardIO = null, lbDir = 0;

  function detectLang() {
    var list = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || navigator.userLanguage || ''];
    for (var i = 0; i < list.length; i++) {
      var code = String(list[i] || '').toLowerCase().slice(0, 2);
      if (SUPPORTED.indexOf(code) !== -1) return code;
    }
    return DEFAULT_LANG;
  }

  function t(key) { return (I18N[state.lang] && I18N[state.lang][key]) || I18N.en[key] || key; }

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function imageFor(p, dir) {
    /* translated version if it exists, otherwise the original (p.original, or the first image listed) */
    return dir + W(p.images[state.lang] || p.images[p.original] || p.images[Object.keys(p.images)[0]]) + IMG_V;
  }

  function applyText() {
    document.documentElement.lang = state.lang;
    document.title = t('doc_title');
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', t('doc_desc'));
    document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    splitHero(); renderMarquee(); renderServices();
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) { el.placeholder = t(el.getAttribute('data-i18n-ph')); });
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === state.lang));
    });
    lbClose.setAttribute('aria-label', t('close'));
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
    lbPrev.setAttribute('aria-label', t('lb_prev')); lbNext.setAttribute('aria-label', t('lb_next'));
    [['meta[property="og:title"]', 'doc_title'], ['meta[property="og:description"]', 'doc_desc'], ['meta[name="twitter:title"]', 'doc_title'], ['meta[name="twitter:description"]', 'doc_desc']].forEach(function (m) {
      var el = document.querySelector(m[0]); if (el) el.setAttribute('content', t(m[1]));
    });
  }

  function renderFilters() {
    var keys = ['all'].concat(CATEGORIES);
    filtersEl.innerHTML = keys.map(function (k) {
      return '<button type="button" class="chip" data-filter="' + k + '" aria-pressed="' + (state.filter === k) + '">' + esc(t(k)) + '</button>';
    }).join('');
  }

  function renderGrid() {
    var items = PROJECTS.filter(function (p) { return state.filter === 'all' || p.category === state.filter; });
    if (!items.length) { grid.innerHTML = '<p class="empty">' + esc(t('empty')) + '</p>'; return; }
    grid.innerHTML = items.map(function (p, i) {
      var title = p.title[state.lang] || p.title.en;
      return '<button type="button" class="card" data-id="' + p.id + '" style="--d:' + (i * 130) + '" aria-label="' + esc(title + ' — ' + t('open')) + '">' +
        '<div class="card__media"><img src="' + imageFor(p, THUMB_DIR) + '" alt="' + esc(title + '. ' + t('alt_thumb') + ' (' + t('langName') + ')') + '" width="720" height="405" loading="' + (i < 2 ? 'eager' : 'lazy') + '" decoding="async">' +
        '<span class="card__badge">' + esc(t(p.category)) + '</span><span class="card__langs" aria-hidden="true">' + SUPPORTED.filter(function (l) { return p.images[l]; }).map(function (l) { return '<i' + (l === state.lang ? ' class="on"' : '') + '>' + l.toUpperCase() + '</i>'; }).join('') + '</span><span class="card__zoom" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>' +
        '<div class="card__meta"><span class="avatar" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 32 32"><path d="M6 8l10 17L26 8" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
        '<div><h3 class="card__title">' + esc(title) + '</h3><p class="card__info">VANTA Creative Studios</p>' +
        '<div class="tags"><span class="tag">' + esc(t(p.category)) + '</span><span class="tag tag--lang">' + esc(t('langName')) + '</span></div></div></div></button>';
    }).join('') + (state.filter === 'all' ? '<div class="soon"><b>' + esc(t('soon_t')) + '</b><span>' + esc(t('soon_s')) + '</span></div>' : '');
    renderShowcase();
    observeCards();
  }

  function renderShowcase() {
    var el = $('#showcase'); if (!el) return;
    el.innerHTML = PROJECTS.slice(0, 2).map(function (p) {
      return '<div class="show"><img src="' + imageFor(p, THUMB_DIR) + '" alt="" width="720" height="405"></div>';
    }).join('');
  }

  var lbId = null, lbMode = 'full', lbPreview = $('#lbPreview'), lbTabs = $('#lbTabs');

  function ytCard(src, title, theme, row) {
    return '<div class="yt yt--' + theme + (row ? ' yt--row' : '') + '"><div class="yt__thumb"><img src="' + src + '" alt="" width="720" height="405"><span class="yt__dur">10:24</span></div>' +
      '<div class="yt__meta">' + (row ? '' : '<span class="yt__av" aria-hidden="true">V</span>') + '<div><p class="yt__title">' + esc(title) + '</p><p class="yt__ch">' + esc(t('lb_channel')) + '</p></div></div></div>';
  }
  function renderLbMode(p, title) {
    var thumb = imageFor(p, THUMB_DIR), html = '';
    lbTabs.querySelectorAll('[data-mode]').forEach(function (b) {
      var on = b.getAttribute('data-mode') === lbMode; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1;
    });
    if (lbMode === 'full') { lbPreview.hidden = true; lbPreview.innerHTML = ''; lbImg.hidden = false; return; }
    lbImg.hidden = true; lbPreview.hidden = false;
    if (lbMode === 'yt') {
      html = '<div class="lb__item">' + ytCard(thumb, title, 'dark') + '<span class="lb__lbl">' + esc(t('lb_home') + ' · ' + t('lb_dark')) + '</span></div>' +
        '<div class="lb__item">' + ytCard(thumb, title, 'light') + '<span class="lb__lbl">' + esc(t('lb_home') + ' · ' + t('lb_light')) + '</span></div>' +
        '<div class="lb__item">' + ytCard(thumb, title, 'dark', true) + '<span class="lb__lbl">' + esc(t('lb_side')) + '</span></div>' +
        '<p class="lb__note">' + esc(t('lb_note_yt')) + '</p>';
    } else {
      html = [[360, 'lb_home'], [246, 'lb_search'], [168, 'lb_side']].map(function (z) {
        return '<div class="lb__item"><img class="lb__small" style="width:' + z[0] + 'px" src="' + thumb + '" alt="" width="720" height="405"><span class="lb__lbl">' + esc(t(z[1]) + ' · ' + z[0] + ' px') + '</span></div>';
      }).join('') + '<p class="lb__note">' + esc(t('lb_note_small')) + '</p>';
    }
    lbPreview.innerHTML = html;
  }
  var lbPrev = $('#lbPrev'), lbNext = $('#lbNext');
  function visibleList() { return PROJECTS.filter(function (x) { return state.filter === 'all' || x.category === state.filter; }); }

  function openLightbox(id, trigger) {
    var list = visibleList();
    var idx = list.map(function (x) { return x.id; }).indexOf(id);
    if (idx < 0) return;
    var p = list[idx], title = p.title[state.lang] || p.title.en;
    var wasHidden = lightbox.hidden;
    var fromImg = wasHidden && trigger && trigger.querySelector ? trigger.querySelector('img') : null;
    var r1 = fromImg ? fromImg.getBoundingClientRect() : null;
    lbId = id;
    lbImg.style.opacity = r1 && !reduced ? '0' : '';
    lbImg.src = imageFor(p, IMG_DIR);
    lbImg.alt = title;
    if (wasHidden) lbMode = 'full';
    renderLbMode(p, title);
    lbCap.innerHTML = '<strong>' + esc(title) + '</strong> · VANTA Creative Studios · ' + esc(t(p.category)) + ' · ' + esc(t('langName')) + (list.length > 1 ? ' · ' + (idx + 1) + ' / ' + list.length : '');
    lightbox.setAttribute('aria-label', title);
    lbPrev.hidden = lbNext.hidden = list.length < 2;
    if (wasHidden) lastFocus = trigger || document.activeElement;
    lightbox.hidden = false;
    document.body.classList.add('is-locked');
    lbClose.focus();
    if (reduced) return;
    var ease = 'cubic-bezier(.2,.8,.2,1)';
    if (r1) {
      var run = function () {
        lbImg.style.opacity = '';
        var r2 = lbImg.getBoundingClientRect(); if (!r2.width) return;
        lbImg.animate([
          { transformOrigin: '0 0', transform: 'translate(' + (r1.left - r2.left) + 'px,' + (r1.top - r2.top) + 'px) scale(' + (r1.width / r2.width) + ',' + (r1.height / r2.height) + ')' },
          { transformOrigin: '0 0', transform: 'none' }
        ], { duration: 640, easing: ease });
        lbCap.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: 320, easing: 'ease-out', fill: 'backwards' });
      };
      (lbImg.decode ? lbImg.decode() : Promise.resolve()).then(run, run);
    } else if (!wasHidden && lbDir) {
      lbImg.animate([{ opacity: 0, transform: 'translateX(' + (lbDir * 48) + 'px) scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: ease });
    }
  }

  function stepLightbox(d) {
    var list = visibleList(); if (list.length < 2 || lightbox.hidden) return;
    var i = list.map(function (x) { return x.id; }).indexOf(lbId);
    lbDir = d; openLightbox(list[(i + d + list.length) % list.length].id); lbDir = 0;
  }

  function closeLightbox() {
    if (lightbox.hidden) return;
    lightbox.hidden = true;
    lbImg.removeAttribute('src'); lbPreview.innerHTML = '';
    document.body.classList.remove('is-locked');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function setLang(lang, persist) {
    if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT_LANG;
    state.lang = lang;
    if (persist) { try { localStorage.setItem('vanta-lang', lang); if (/^https?:/.test(location.protocol)) history.replaceState(null, '', lang === DEFAULT_LANG ? '/' : '/' + lang); } catch (e) {} }
    applyText(); renderFilters(); renderGrid();
    if (!lightbox.hidden) closeLightbox();
  }

  // Events
  lbTabs.addEventListener('click', function (e) {
    var b = e.target.closest('[data-mode]'); if (!b) return;
    var p = PROJECTS.filter(function (x) { return x.id === lbId; })[0]; if (!p) return;
    lbMode = b.getAttribute('data-mode'); renderLbMode(p, p.title[state.lang] || p.title.en);
  });
  filtersEl.addEventListener('click', function (e) {
    var b = e.target.closest('[data-filter]'); if (!b) return;
    state.filter = b.getAttribute('data-filter'); renderFilters(); renderGrid();
  });
  grid.addEventListener('click', function (e) {
    var c = e.target.closest('.card'); if (c) openLightbox(c.getAttribute('data-id'), c);
  });
  document.querySelector('.lang').addEventListener('click', function (e) {
    var b = e.target.closest('[data-lang]'); if (b) setLang(b.getAttribute('data-lang'), true);
  });
  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', function () { stepLightbox(-1); });
  lbNext.addEventListener('click', function () { stepLightbox(1); });
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox || e.target.classList.contains('lightbox__fig')) closeLightbox(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
    if (e.key === 'Tab' && !lightbox.hidden) { e.preventDefault(); lbClose.focus(); }
  });
  document.querySelectorAll('[data-scroll]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.getElementById(a.getAttribute('data-scroll'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); history.replaceState(null, '', '#' + target.id); }
    });
  });

  // Motion helpers
  var progress = $('#progress'), hero = $('.hero');

  function splitHero() {
    var h = $('.hero h1'); if (!h) return;
    h.innerHTML = h.textContent.trim().split(/\s+/).map(function (w, i) {
      return '<span class="w"><span style="--i:' + i + '">' + esc(w) + '</span></span>';
    }).join(' ');
  }

  function renderMarquee() {
    var items = [[t('hero_title'), 0], ['VANTA Creative Studios', 1], [t('about_title'), 0], ['YouTube Thumbnails', 1]];
    var group = '<div class="marquee__group">' + items.map(function (it) {
      return '<span class="marquee__item' + (it[1] ? ' acc' : '') + '">' + esc(it[0]) + '</span><span class="marquee__dot"></span>';
    }).join('') + '</div>';
    $('#marquee').innerHTML = group + group;
  }

  function faqPrice() { return offerOn() ? '$' + OFFER.price + ' (' + t('offer_faq').replace('{d}', offerDate()).replace('{r}', '$' + OFFER.regular) + ')' : '$' + OFFER.regular; }
  function offerDate() { return new Date(OFFER.until + 'T12:00:00').toLocaleDateString(t('date_loc'), { day: 'numeric', month: 'long' }); }
  function packLabel(i) { return t('packs')[i][0] + ' ($' + PRICES[i] + ')'; }

  var pricesCounted = false;
  function countPrices() {
    var nums = document.querySelectorAll('.pk__num');
    if (pricesCounted || reduced || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) {
      if (!es.some(function (e) { return e.isIntersecting; })) return;
      pricesCounted = true; io.disconnect();
      nums.forEach(function (el, i) {
        var to = PRICES[i], t0 = performance.now(), dur = 900;
        (function tick(now) {
          var k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
          el.textContent = Math.round(to * e);
          if (k < 1) requestAnimationFrame(tick); else el.textContent = to;
        })(t0);
      });
    }, { threshold: 0.4 });
    nums.forEach(function (n) { io.observe(n); });
  }

  function renderServices() {
    var P = t('packs'), sel = $('#packSelect'), keep = sel.value;
    $('#packages').innerHTML = P.map(function (p, i) {
      var hot = i === 1;
      return '<article class="pk' + (hot ? ' pk--hot' : '') + '">' + (hot ? '<span class="pk__badge">' + esc(t('pk_hot')) + '</span>' : '') +
        '<div class="pk__vis pk__vis--' + PREVIEWS[i].length + '" aria-hidden="true">' + PREVIEWS[i].map(function (v) { return '<span class="pk__th"><img src="' + THUMB_DIR + W(v[0]) + IMG_V + '" alt="" loading="lazy" width="720" height="405">' + (v[1] ? '<b>' + v[1] + '</b>' : '') + '</span>'; }).join('') + '</div>' +
        '<h3>' + esc(p[0]) + '</h3>' +
        (i === OFFER.pack && offerOn() ? '<p class="pk__offer"><s>$' + OFFER.regular + '</s> <b>' + esc(t('offer_tag').replace('{p}', Math.round((1 - OFFER.price / OFFER.regular) * 100)).replace('{d}', offerDate())) + '</b></p>' : '') +
        '<p class="pk__price"><span class="pk__cur">$</span><span class="pk__num">' + PRICES[i] + '</span><span class="pk__usd">USD</span></p>' +
        '<p class="pk__unit">' + esc(p[3]) + '</p>' +
        '<p class="pk__desc">' + esc(p[1]) + '</p>' +
        '<ul>' + p[2].map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>' +
        '<button type="button" class="btn ' + (hot ? 'btn--primary' : 'btn--ghost') + '" data-pack="' + i + '">' + esc(t('pk_brief')) + '</button>' +
        (PAY_LINKS[i] ? '<a class="pk__pay" href="' + PAY_LINKS[i] + '" target="_blank" rel="noopener noreferrer">' + esc(t('pk_cta')) + '</a>' : '') + '</article>';
    }).join('');
    $('#pkNote').innerHTML = t('pk_note').map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('');
    sel.innerHTML = '<option value="">' + esc(t('pk_choose')) + '</option>' + P.map(function (p, i) { return '<option value="' + i + '">' + esc(packLabel(i)) + '</option>'; }).join('') + '<option value="x">' + esc(t('pk_unsure')) + '</option>';
    sel.value = keep || '';
    $('#faqList').innerHTML = t('faq').map(function (q) { return '<details><summary>' + esc(q[0]) + '</summary><p>' + esc(q[1].replace('$15', faqPrice())) + '</p></details>'; }).join('');
    document.querySelectorAll('.pk').forEach(function (el) { el.classList.add('in'); });
    countPrices();
  }

  $('#packages').addEventListener('click', function (e) {
    var b = e.target.closest('[data-pack]'); if (!b) return;
    $('#packSelect').value = b.getAttribute('data-pack');
    $('#brief').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    setTimeout(function () { $('#brief [name=name]').focus({ preventScroll: true }); }, reduced ? 0 : 600);
  });

  $('#brief').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, v = function (n) { return (f.elements[n].value || '').trim(); };
    if (!v('name') || !v('msg')) { $('#briefErr').textContent = t('f_err'); return; }
    $('#briefErr').textContent = '';
    var pk = f.elements.pack.value, packName = pk === '' ? '' : (pk === 'x' ? t('pk_unsure') : packLabel(+pk));
    var langs = Array.prototype.map.call(f.querySelectorAll('[name=lang]:checked'), function (c) { return c.value; }).join(', ');
    var body = [t('f_name') + ': ' + v('name'), t('f_email') + ': ' + v('email'), t('f_channel') + ': ' + v('channel'), t('f_pack') + ': ' + packName, t('f_langs') + ': ' + langs, t('f_deadline') + ': ' + v('deadline'), '', t('f_msg') + ':', v('msg')].join('\n');
    var email = v('email');
    if (FORM_ENDPOINT && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { $('#briefErr').textContent = t('f_email_bad'); return; }
    if (!FORM_ENDPOINT) { window.location.href = 'mailto:vantacreativestudios1@gmail.com?subject=' + encodeURIComponent(t('f_subject')) + '&body=' + encodeURIComponent(body); return; }
    var btn = f.querySelector('[type=submit]'), label = btn.textContent;
    btn.disabled = true; btn.textContent = t('f_sending');
    fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name: v('name'), email: email, channel: v('channel'), pack: packName, languages: langs, deadline: v('deadline'), message: v('msg'), _subject: t('f_subject'), _gotcha: v('website') }) })
      .then(function (r) { if (!r.ok) throw new Error(r.status); $('#briefErr').textContent = ''; f.reset(); alert(t('f_ok')); })
      .catch(function () { $('#briefErr').textContent = t('f_fail'); })
      .then(function () { btn.disabled = false; btn.textContent = label; });
  });

  function observeCards() {
    if (cardIO) cardIO.disconnect();
    var cards = grid.querySelectorAll('.card');
    if (!('IntersectionObserver' in window)) { cards.forEach(function (c) { c.classList.add('in'); }); return; }
    cardIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); cardIO.unobserve(e.target); } });
    }, { threshold: 0.2 });
    cards.forEach(function (c) { cardIO.observe(c); });
  }

  if (fine) {
    var SPOT = '.pk,.card__media,.stats li,.pillars li,.social__item';
    document.addEventListener('pointermove', function (e) {
      var el = e.target.closest && e.target.closest(SPOT); if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty('--x', (e.clientX - r.left) + 'px'); el.style.setProperty('--y', (e.clientY - r.top) + 'px');
    }, { passive: true });
    document.addEventListener('pointerout', function (e) {
      var el = e.target.closest && e.target.closest(SPOT);
      if (el && !(e.relatedTarget && el.contains(e.relatedTarget))) { el.style.removeProperty('--x'); el.style.removeProperty('--y'); }
    });
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5) * 2);
      hero.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5) * 2);
    });
    hero.addEventListener('pointerleave', function () { hero.style.setProperty('--mx', 0); hero.style.setProperty('--my', 0); });
    document.querySelectorAll('.hero__cta .btn,.btn--lg').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.translate = ((e.clientX - r.left - r.width / 2) * 0.22) + 'px ' + ((e.clientY - r.top - r.height / 2) * 0.3) + 'px';
      });
      b.addEventListener('pointerleave', function () { b.style.translate = ''; });
    });
  }

  // UI polish: header shadow, reveal on scroll, active nav link
  var topbar = $('.topbar');
  function onScroll() {
    var y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
    topbar.classList.toggle('is-scrolled', y > 10);
    progress.style.setProperty('--p', max > 0 ? Math.min(1, y / max) : 0);
    if (fine) hero.style.setProperty('--sy', Math.min(y, 800) * 0.25);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if ('IntersectionObserver' in window) {
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('.section__head,.about > *,.contact,.pk,.faq > *,.faq details,.steps li').forEach(function (el) { el.classList.add('reveal'); rio.observe(el); });
    var links = document.querySelectorAll('.nav a');
    var nio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['portfolio', 'services', 'about', 'contact'].forEach(function (id) { var el = document.getElementById(id); if (el) nio.observe(el); });
  }

  // Copy Discord username
  var copyBtn = $('#copyDiscord'), toast = $('#toast'), toastTimer;
  copyBtn.addEventListener('click', function () {
    var text = copyBtn.getAttribute('data-copy');
    function done() {
      toast.textContent = t('copied');
      clearTimeout(toastTimer); toastTimer = setTimeout(function () { toast.textContent = ''; }, 2500);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else { fallback(); }
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) {} document.body.removeChild(ta);
    }
  });

  // Cards: subtle 3D tilt that follows the pointer (mouse only)
  if (fine) {
    grid.addEventListener('pointermove', function (e) {
      var m = e.target.closest && e.target.closest('.card__media'); if (!m) return;
      var r = m.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      m.style.setProperty('--ry', (x * 7).toFixed(2) + 'deg'); m.style.setProperty('--rx', (-y * 5).toFixed(2) + 'deg');
    });
    grid.addEventListener('pointerout', function (e) {
      var m = e.target.closest && e.target.closest('.card__media');
      if (m && !m.contains(e.relatedTarget)) { m.style.setProperty('--rx', '0deg'); m.style.setProperty('--ry', '0deg'); }
    });
  }

  // Button feedback: soft ripple from the pointer position
  document.addEventListener('pointerdown', function (e) {
    var b = e.target.closest && e.target.closest('.btn'); if (!b || reduced) return;
    var r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2, s = document.createElement('span');
    s.className = 'rip';
    s.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' + (e.clientX - r.left - d / 2) + 'px;top:' + (e.clientY - r.top - d / 2) + 'px';
    b.appendChild(s);
    setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 700);
  });


  /* ---- Admin config (/admin): overrides prices, links, offer, subscription and projects ---- */
  function applyConfig(c) {
    if (!c || typeof c !== 'object') return;
    if (c.offer) { OFFER.regular = c.offer.regular; OFFER.price = c.offer.price; OFFER.until = c.offer.enabled ? c.offer.until : '2000-01-01'; if (c.offer.payOffer) OFFER.payOffer = c.offer.payOffer; if (c.offer.payRegular) OFFER.payRegular = c.offer.payRegular; }
    if (c.prices) PRICES = [c.prices.starter, offerOn() ? OFFER.price : OFFER.regular, c.prices.channel];
    else if (c.offer) PRICES[1] = offerOn() ? OFFER.price : OFFER.regular;
    PAY_LINKS = [(c.pay && c.pay.starter) || PAY_LINKS[0], offerOn() ? OFFER.payOffer : OFFER.payRegular, (c.pay && c.pay.channel) || PAY_LINKS[2]];
    if (c.subLink) { var sb = $('#subscribeBtn'); if (sb) sb.href = c.subLink; }
    if (c.projects && c.projects.length) { PROJECTS = c.projects; renderShowcase(); }
    setLang(state.lang, false);
  }
  fetch('/api/config').then(function (r) { return r.json(); }).then(applyConfig).catch(function () {});

  /* ---- Visit tracking (no IP stored; the admin's own visits are ignored server-side) ---- */
  (function () {
    var vid, ret = true, sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    try { vid = localStorage.getItem('vanta-vid'); if (!vid) { ret = false; vid = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('vanta-vid', vid); } } catch (e) { vid = sid; ret = false; }
    function ping(type) {
      var d = JSON.stringify({ vid: vid, sid: sid, type: type, ret: ret, path: location.pathname, lang: state.lang, ref: document.referrer });
      try { fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: d, keepalive: true }); } catch (e) {}
    }
    setTimeout(function () { ping('view'); }, 0);
    setInterval(function () { if (!document.hidden) ping('ping'); }, 30000);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) ping('ping'); });
  })();

  // Init: saved manual choice wins, otherwise auto-detect from the device
  var saved = null; try { saved = localStorage.getItem('vanta-lang'); } catch (e) {}
  $('#year').textContent = new Date().getFullYear();
  var pm = location.pathname.match(/^\/(es|pt)(\/|$)/);
  setLang(pm ? pm[1] : (saved && SUPPORTED.indexOf(saved) !== -1 ? saved : detectLang()), false);
})();
