// components/legal/terms-es.tsx
// Native Spanish (Spain) Terms of Service body for /es/terms. Mirrors components/legal/terms-content.tsx
// (EN, version and dates imported below) section for section, with identical clause numbers and heading ids.
// The note at the top says the translation is for information only; EN §21.6 (translated as §21.6 here) governs.
// Annex A keeps the French statutory text verbatim, as the EN file does.

import {
  TERMS_VERSION,
  TERMS_UPDATED,
  TERMS_EFFECTIVE_NEW,
  TERMS_EFFECTIVE_EXISTING,
} from "@/components/legal/terms-content"

const link = "text-accent-700 underline hover:text-accent-800"

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-lg font-semibold text-gray-900">
      {children}
    </h2>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-2">{children}</p>
}

function UL({ children }: { children: React.ReactNode }) {
  return <ul className="mt-2 list-disc space-y-1 pl-5">{children}</ul>
}

const TOC: Array<[string, string]> = [
  ["who-we-are", "1. Quiénes somos"],
  ["acceptance", "2. Aceptación y uso profesional"],
  ["accounts", "3. Cuentas"],
  ["service", "4. El Servicio, los planes y los créditos"],
  ["free-trial", "5. Periodo de prueba gratuito"],
  ["fees", "6. Tarifas, facturación y renovación automática"],
  ["cancellation", "7. Cancelación"],
  ["refunds", "8. Reembolsos, derechos legales y disputas de pagos"],
  ["addons", "9. Paquetes de créditos, complementos y servicios"],
  ["data", "10. Datos del Cliente, privacidad y cuentas conectadas"],
  ["ip", "11. Propiedad intelectual y licencia"],
  ["acceptable-use", "12. Uso aceptable"],
  ["third-party", "13. Servicios de terceros y resultados generados por IA"],
  ["availability", "14. Disponibilidad, cambios y funciones beta"],
  ["warranties", "15. Exclusión de garantías"],
  ["liability", "16. Limitación de responsabilidad"],
  ["indemnity", "17. Indemnidad"],
  ["term", "18. Duración, suspensión y resolución"],
  ["changes", "19. Modificaciones de estos Términos"],
  ["law", "20. Ley aplicable y litigios"],
  ["general", "21. Disposiciones generales"],
  ["contact", "22. Contacto"],
  ["annex-a", "Anexo A — Textos legales franceses (solo consumidores y no profesionales)"],
  ["annex-b", "Anexo B — Modelo de formulario de desistimiento (solo consumidores)"],
]

export function TermsEs() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Términos del servicio</h1>
      <p className="mt-2 text-sm text-gray-600">
        Versión {TERMS_VERSION} · Última actualización: {TERMS_UPDATED} · En vigor para los nuevos clientes: {TERMS_EFFECTIVE_NEW}; para los clientes existentes: {TERMS_EFFECTIVE_EXISTING}
      </p>
      <p className="mt-2 text-xs text-gray-500">
        Esta traducción se facilita únicamente a título informativo. En caso de divergencia, prevalece la{" "}
        <a href="/terms" className="underline">versión en inglés</a>, en los términos del §21.6.
      </p>

      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
        <p className="font-semibold text-gray-900">Resumen en lenguaje sencillo (rigen los Términos completos que figuran a continuación)</p>
        <UL>
          <li>GEO Toolbox es una herramienta profesional. Al suscribirse, el Cliente confirma que actúa con fines empresariales o profesionales.</li>
          <li>Los planes de pago son <strong>suscripciones que se renuevan automáticamente</strong> (mensual o anualmente) hasta que el Cliente las cancele.</li>
          <li>El periodo de prueba gratuito requiere una tarjeta y <strong>se convierte automáticamente en una suscripción de pago cuando finaliza</strong>, salvo que el Cliente lo cancele antes. El importe y la fecha del primer cargo (en un plan anual, la tarifa anual completa) se muestran en el momento del pago y en el correo electrónico de confirmación, y además enviamos un correo electrónico antes del cargo. La cancelación de un periodo de prueba iniciado a partir del 27 de octubre de 2026 pone fin a dicho periodo, y al acceso del Cliente, de forma inmediata.</li>
          <li>El Cliente puede cancelar en cualquier momento desde <strong>Account → Manage subscription</strong>. La cancelación de una suscripción de pago surte efecto al final del periodo en curso; el Cliente conserva el acceso hasta entonces.</li>
          <li><strong>Las tarifas no son reembolsables</strong> —incluso cuando un periodo de prueba se convierte porque el Cliente no lo canceló a tiempo, y por el tiempo o los créditos no utilizados—, salvo cuando la ley reconozca al Cliente un derecho que no podamos excluir (véase el §8).</li>
        </UL>
      </div>

      <nav aria-label="Índice" className="mt-8 text-sm">
        <p className="font-semibold text-gray-900">Índice</p>
        <ol className="mt-2 grid gap-1 sm:grid-cols-2">
          {TOC.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} className="text-gray-600 hover:text-gray-900">
                {label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-gray-600">
        <section>
          <H2 id="who-we-are">1. Quiénes somos</H2>
          <P>
            GEO Toolbox («<strong>GEO Toolbox</strong>», «<strong>nosotros</strong>») es explotado por <strong>Samy Ben Sadok</strong>, empresario individual (entrepreneur individuel — EI), inscrito en Francia con el SIREN 827 472 424 (Registre national des entreprises), con domicilio profesional en 1 esplanade de Chantilly, 93330 Neuilly-sur-Marne, Francia. IVA: no aplicable — artículo 293 B del Code général des impôts francés (franchise en base); por consiguiente, los precios se facturan sin IVA francés hasta nuevo aviso. Aviso legal completo:{" "}
            <a href="/es/legal" className={link}>geotoolbox.ai/legal</a>. Contacto:{" "}
            <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>.
          </P>
          <P>
            Los presentes Términos del servicio (los «<strong>Términos</strong>») constituyen un acuerdo vinculante entre el Cliente (la persona física o jurídica que utiliza el Servicio, el «<strong>Cliente</strong>») y nosotros. Incorporan nuestra{" "}
            <a href="/es/privacy" className={link}>Política de privacidad</a> y nuestra{" "}
            <a href="/es/refund-policy" className={link}>Política de cancelación y reembolso</a>, así como los detalles del plan que se muestran en la{" "}
            <a href="/es/pricing" className={link}>página de precios</a> y en el momento del pago cuando el Cliente se suscribe (en conjunto, el «<strong>Contrato</strong>»).
          </P>
        </section>

        <section>
          <H2 id="acceptance">2. Aceptación y uso profesional</H2>
          <P>
            <strong>2.1 Aceptación.</strong>{" "}El Cliente acepta estos Términos al crear una cuenta, al marcar la casilla de aceptación en el registro o en el pago, al hacer clic en un botón que haga referencia a ellos o al utilizar el Servicio. Si no está de acuerdo, no debe utilizar el Servicio. Si el Cliente acepta en nombre de una sociedad u otra entidad, confirma que tiene facultades para obligarla, y «el Cliente» designa a dicha entidad.
          </P>
          <P>
            <strong>2.2 Uso exclusivamente profesional.</strong> El Servicio es una herramienta profesional destinada a profesionales del marketing, consultores de SEO/GEO, agencias y empresas. <strong>El Cliente confirma que contrata y utiliza el Servicio con fines relacionados con su actividad comercial, empresarial, de oficio o profesión, y no con fines personales, familiares o domésticos.</strong> Nos basamos en esta declaración. Si, no obstante, el Cliente tiene la condición de consumidor con arreglo a la legislación imperativa de su país de residencia, se le aplican el §8.6 y el §20.4.
          </P>
          <P>
            <strong>2.3 Edad.</strong> El Cliente debe tener al menos 18 años.
          </P>
        </section>

        <section>
          <H2 id="accounts">3. Cuentas</H2>
          <P>
            <strong>3.1</strong> El Cliente puede iniciar sesión con una dirección de correo electrónico y una contraseña, con un enlace mágico o con Google OAuth. El Cliente es responsable de toda la actividad realizada con su cuenta (salvo que se deba a un incumplimiento por nuestra parte) y de mantener la confidencialidad de sus credenciales. Debe avisarnos de inmediato en{" "}
            <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a> si sospecha un acceso no autorizado.
          </P>
          <P>
            <strong>3.2 Puestos de equipo.</strong> Cuando el plan del Cliente incluya puestos de equipo, el Cliente puede invitar a miembros. El Cliente es responsable de que estos cumplan estos Términos. Solo el titular de la cuenta puede modificar la facturación, cancelar o eliminar la cuenta.
          </P>
          <P>
            <strong>3.3 Exactitud.</strong> El Cliente debe mantener exactos los datos de su cuenta y de facturación, incluidos su denominación comercial, su dirección de facturación y, en su caso, su número de IVA.
          </P>
        </section>

        <section>
          <H2 id="service">4. El Servicio, los planes y los créditos</H2>
          <P>
            <strong>4.1</strong> El Servicio proporciona analítica de visibilidad en la búsqueda con IA: seguimiento de cómo aparece una marca en los motores de IA (por ejemplo, ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews y AI Mode, Bing Copilot, Grok), así como escaneos, informes y herramientas de contenido relacionados, según se describen en nuestro sitio web en el momento del pedido del Cliente.
          </P>
          <P>
            <strong>4.2 Planes.</strong> Cada plan otorga las funciones y los límites indicados en la página de precios y en el momento del pago (por ejemplo, marcas, prompts, motores, puestos, periodo de historial). Podemos mejorar o ajustar el Servicio; las reducciones sustanciales de un plan que el Cliente haya pagado solo surten efecto a partir de su siguiente renovación, previo aviso conforme al §19.
          </P>
          <P>
            <strong>4.3 Créditos.</strong> El uso se mide en créditos. Cada plan otorga una asignación mensual de créditos, que se concede al inicio de cada mes de servicio (también en los planes anuales), o en un nivel reducido durante un periodo de prueba, según se describe en el §5. <strong>Los créditos no utilizados no se acumulan para el periodo siguiente, no tienen valor monetario y no son reembolsables.</strong> La ponderación de créditos por motor y por herramienta se publica en la aplicación y puede cambiar; los cambios se aplican solo de cara al futuro.
          </P>
          <P>
            <strong>4.4 Uso razonable.</strong> Los límites de los planes se aplican por medios técnicos. Podemos limitar o suspender el uso que sea abusivo, que esté automatizado más allá del uso previsto o que amenace la estabilidad o la base de costes del Servicio, previo aviso cuando sea factible.
          </P>
        </section>

        <section>
          <H2 id="free-trial">5. Periodo de prueba gratuito</H2>
          <P>
            <strong>5.1 En qué consiste.</strong> Cuando se ofrezca (actualmente en determinados planes, según se indica en la página de precios), el periodo de prueba gratuito da acceso al plan que el Cliente haya seleccionado durante el periodo de prueba indicado en el momento del pago (actualmente <strong>7 días</strong>). En los periodos de prueba iniciados con arreglo a la versión 2.1 o posterior, la cancelación pone fin al periodo de prueba y a su acceso de forma inmediata (§5.4). Para iniciar un periodo de prueba se requiere un medio de pago válido. Las cuentas en periodo de prueba pueden funcionar con límites reducidos (por ejemplo, una fracción de los créditos del plan, un número máximo de marcas inferior o sin informes de marca blanca); el plan completo se desbloquea cuando el periodo de prueba se convierte.
          </P>
          <P>
            <strong>5.2 Conversión automática: léase con atención.</strong> <strong>Salvo que el Cliente lo cancele antes de que finalice, el periodo de prueba se convierte automáticamente en una suscripción de pago al plan y con la periodicidad de facturación (mensual o anual) que el Cliente haya seleccionado, y en la fecha de finalización del periodo de prueba se carga en el medio de pago registrado el importe mostrado en el momento del pago.</strong> El importe exacto, la moneda y la fecha del primer cargo se muestran en el momento del pago antes de que el Cliente confirme, y se repiten en el correo electrónico de confirmación que enviamos cuando se inicia el periodo de prueba. A continuación, la suscripción se renueva automáticamente conforme al §6.
          </P>
          <P>
            <strong>5.3 Recordatorios.</strong> Enviamos el correo electrónico de confirmación del periodo de prueba en el momento del alta (con el importe y la fecha del primer cargo y la forma de cancelar), que constituye el aviso del cargo próximo, y, además, correos electrónicos de recordatorio antes del primer cargo, a la dirección asociada a la cuenta del Cliente. Los recordatorios se envían por cortesía y para cumplir las normas de las redes de tarjetas; <strong>la falta de recepción de un recordatorio (por ejemplo, por un filtro de correo no deseado o por una dirección errónea) no afecta a la conversión automática ni da derecho a un reembolso</strong>. El Cliente debe mantener actualizada su dirección de correo electrónico.
          </P>
          <P>
            <strong>5.4 Cómo cancelar un periodo de prueba.</strong> El Cliente puede cancelar en cualquier momento antes de que finalice el periodo de prueba desde <strong>Account → Manage subscription</strong> (portal de cliente de Stripe), o escribiendo a{" "}
            <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>{" "}desde la dirección del titular de la cuenta antes de la fecha y hora de finalización del periodo de prueba que figuran en su cuenta y en el correo electrónico de confirmación. Un periodo de prueba cancelado antes de que finalice nunca se cobra. <strong>En el caso de los periodos de prueba iniciados con arreglo a la versión 2.1 o posterior de estos Términos (a partir del 27 de octubre de 2026), la cancelación de un periodo de prueba le pone fin de inmediato:</strong> el acceso al plan de prueba cesa en ese mismo momento y la cuenta del Cliente pasa al plan gratuito. Un periodo de prueba iniciado con anterioridad conserva el acceso hasta su fecha de finalización. Dado que los periodos de prueba están limitados a uno por cliente (§5.6), una nueva suscripción posterior se factura desde el inicio. La cancelación se confirma por correo electrónico.
          </P>
          <P>
            <strong>5.5 Sin reembolso por no cancelar a tiempo.</strong> Dado que las condiciones de conversión se comunican en el momento del pago y se confirman por correo electrónico en el momento del alta, <strong>un cargo derivado de que el Cliente no haya cancelado antes de la finalización del periodo de prueba es un cargo válido y no es reembolsable</strong> (con la única salvedad del §8.6); los recordatorios adicionales del §5.3 no alteran lo anterior. Esto se aplica por igual a las suscripciones mensuales y anuales.
          </P>
          <P>
            <strong>5.6 Un periodo de prueba por cliente.</strong> Los periodos de prueba están limitados a uno por persona, empresa y medio de pago, y no están disponibles en las mejoras de plan ni cuando el Cliente vuelva a suscribirse. Podemos denegar, acortar o finalizar anticipadamente un periodo de prueba, rechazar la suscripción, cerrar cuentas duplicadas o retirar la oferta de prueba cuando detectemos un uso abusivo de los periodos de prueba (por ejemplo, múltiples cuentas o medios de pago) o en cualquier momento previo aviso.
          </P>
        </section>

        <section>
          <H2 id="fees">6. Tarifas, facturación y renovación automática</H2>
          <P>
            <strong>6.1 Las suscripciones se renuevan automáticamente.</strong> Los planes de pago se venden como suscripciones periódicas. <strong>La suscripción del Cliente se renueva automáticamente al final de cada periodo de facturación (mensual o anual, según lo seleccionado) por otro periodo de la misma duración, y al inicio de cada periodo se carga en el medio de pago registrado la tarifa vigente en ese momento para su plan, hasta que el Cliente cancele</strong> conforme al §7. Los planes anuales se cobran íntegramente y por adelantado por todo el año. En las suscripciones anuales enviamos por correo electrónico un recordatorio de renovación unas cinco semanas (entre 33 y 39 días) antes de la fecha de renovación, en el que se indican el importe de la renovación, la fecha y la forma de cancelar.
          </P>
          <P>
            <strong>6.2 Pago.</strong> Los pagos se procesan a través de Stripe. Al facilitar un medio de pago, el Cliente nos autoriza (a través de Stripe) a cobrar todas las tarifas adeudadas en virtud del Contrato, incluidas las tarifas de renovación, los impuestos aplicables y los paquetes de créditos o complementos que solicite. Las facturas y los recibos se emiten por correo electrónico y están disponibles en el portal de cliente.
          </P>
          <P>
            <strong>6.3 Precios, moneda e impuestos.</strong> Los precios son los que se muestran en el momento del pago en la moneda seleccionada (USD o EUR). <strong>Las tarifas no incluyen el IVA, el impuesto sobre las ventas ni impuestos similares</strong>, que se añaden en el momento del pago cuando proceda en función de la dirección de facturación del Cliente; si el Cliente facilita un número de IVA válido, puede aplicarse la inversión del sujeto pasivo. El Cliente es responsable de cualesquiera impuestos, derechos o gastos bancarios distintos de los impuestos sobre nuestros ingresos.
          </P>
          <P>
            <strong>6.4 Cambios de precio.</strong> Podemos modificar nuestros precios. Los aumentos de precio se aplican a la suscripción del Cliente únicamente a partir de su siguiente renovación posterior a un preaviso de al menos <strong>30 días</strong> por correo electrónico. Si el Cliente no está de acuerdo, debe cancelar antes de la renovación; seguir utilizando el Servicio después de la fecha de efecto supone la aceptación del nuevo precio.
          </P>
          <P>
            <strong>6.5 Pagos fallidos.</strong> Si un cargo falla, podemos (a través de Stripe) reintentarlo y enviar un correo electrónico al Cliente para que actualice su medio de pago. Podemos suspender la cuenta o rebajarla a un plan inferior mientras haya un pago pendiente, y darla de baja si el impago no se subsana en un plazo razonable. El Cliente sigue siendo responsable de las tarifas del periodo. Las cantidades adeudadas con retraso por clientes profesionales devengan intereses al triple del tipo de interés legal francés, más una indemnización fija de 40 € por gastos de cobro por factura (Code de commerce L441-10 y D441-5).
          </P>
          <P>
            <strong>6.6 Mejoras y rebajas de plan.</strong> Las mejoras de plan surten efecto de inmediato y Stripe las prorratea. Las rebajas de plan surten efecto en la siguiente renovación; la diferencia no se reembolsa.
          </P>
          <P>
            <strong>6.7 Promociones.</strong> Los cupones y los precios promocionales se aplican durante el periodo indicado y, a continuación, se vuelve al precio estándar mostrado en el momento del pago.
          </P>
        </section>

        <section>
          <H2 id="cancellation">7. Cancelación</H2>
          <P>
            <strong>7.1 Cancelación en línea en cualquier momento.</strong> El Cliente puede cancelar su suscripción en cualquier momento desde <strong>Account → Manage subscription</strong>, que abre el portal de cliente de Stripe (&quot;Cancel subscription&quot;), o escribiendo a{" "}
            <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>{" "}desde la dirección del titular de la cuenta. Confirmamos toda cancelación por correo electrónico, indicando la fecha en que finaliza la suscripción.
          </P>
          <P>
            <strong>7.2 Efectos.</strong> La cancelación detiene las renovaciones futuras. <strong>En una suscripción de pago, surte efecto al final del periodo de facturación en curso</strong> y el Cliente conserva el acceso hasta entonces. <strong>La cancelación de un periodo de prueba gratuito iniciado con arreglo a la versión 2.1 o posterior le pone fin de inmediato</strong>: el acceso al plan de prueba cesa en ese momento y no se cobra nada (§5.4); un periodo de prueba iniciado antes conserva el acceso hasta su fecha de finalización. <strong>No se concede ningún reembolso prorrateado ni parcial por el resto de un periodo ya pagado</strong>, incluidos los periodos anuales, sin perjuicio del §8.6.
          </P>
          <P>
            <strong>7.3 Plazo límite.</strong> Para evitar un cargo de renovación, el Cliente debe cancelar, a más tardar, el día anterior a la fecha de renovación que figura en su cuenta y en nuestros correos electrónicos (los cargos se efectúan a la misma hora, en UTC, en que se contrató la suscripción original del Cliente). Una cancelación realizada después de un cargo se aplica al periodo siguiente.
          </P>
          <P>
            <strong>7.4 La eliminación de la cuenta</strong> cancela cualquier suscripción activa con efecto al final del periodo en curso y da lugar a la supresión de los datos conforme a nuestra Política de privacidad. La eliminación de una cuenta no da derecho, por sí sola, a un reembolso. Revocar el acceso de Google OAuth o desinstalar integraciones <em>no</em> cancela una suscripción; para ello debe utilizarse el §7.1.
          </P>
        </section>

        <section>
          <H2 id="refunds">8. Reembolsos, derechos legales y disputas de pagos</H2>
          <P>
            <strong>8.1 Ninguna tarifa es reembolsable.</strong> Salvo lo expresamente previsto en este §8, <strong>las tarifas de un periodo de facturación ya iniciado se adeudan en su totalidad y no son reembolsables</strong>. En particular, no se concede ningún reembolso ni crédito por: (a) un periodo de prueba que se haya convertido porque el Cliente no lo canceló antes de su finalización (§5.5); (b) una renovación automática que el Cliente no canceló a tiempo (§7.3), incluidas las renovaciones anuales; (c) el tiempo no utilizado de un periodo de facturación después de que el Cliente cancele o rebaje su plan; (d) los créditos, puestos, marcas o prompts no utilizados; (e) los periodos durante los cuales el Cliente no haya utilizado el Servicio; (f) las funciones que el Cliente no haya utilizado o que hayan cambiado; (g) la insatisfacción con los resultados, posicionamientos o respuestas de los motores de IA, que escapan a nuestro control (§13).
          </P>
          <P>
            <strong>8.2 Errores propios.</strong> Si hemos cobrado al Cliente de forma incorrecta (importe erróneo, cargo duplicado, cargo posterior a una cancelación confirmada), lo corregiremos y reembolsaremos la diferencia; rogamos al Cliente que nos lo comunique con prontitud (idealmente en un plazo de 60 días) para que podamos localizar el pago.
          </P>
          <P>
            <strong>8.3 Gestos comerciales.</strong> Podemos, a nuestra entera discreción y sin obligación alguna, conceder un reembolso o un crédito como gesto comercial. Hacerlo en una ocasión no nos obliga a hacerlo de nuevo ni modifica estos Términos.
          </P>
          <P>
            <strong>8.4 Forma y plazo del reembolso.</strong> Todo reembolso se efectúa en el medio de pago original a través de Stripe, normalmente en un plazo de 14 días desde nuestra decisión.
          </P>
          <P>
            <strong>8.5 Contacto previo a la impugnación de un cargo.</strong> Si el Cliente considera que un cargo es erróneo, debe ponerse primero en contacto con nosotros en{" "}
            <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>: la mayoría de las incidencias se resuelven en un plazo de dos días hábiles. Nada de lo dispuesto en estos Términos limita el derecho del Cliente a presentar una reclamación ante el emisor de su tarjeta o su banco. No obstante, si se abre un contracargo (chargeback) respecto de un cargo efectuado de conformidad con estos Términos (por ejemplo, la conversión de un periodo de prueba o una renovación debidamente comunicadas), aportaremos las pruebas de la aceptación de estos Términos por parte del Cliente, de la información facilitada en el momento del pago, de los correos electrónicos de confirmación y de recordatorio y del uso del Servicio por parte del Cliente; mientras la disputa siga abierta, podremos suspender la cuenta. Si prospera un contracargo respecto de un cargo válidamente efectuado con arreglo a estos Términos, el Cliente nos sigue adeudando el importe; si se presenta un contracargo sin fundamento de buena fe, podremos dar de baja la cuenta por incumplimiento.
          </P>
          <P>
            <strong>8.6 Derechos legales de los consumidores.</strong> El Servicio está destinado a un uso profesional (§2.2). Si, pese a ello, el Cliente es <em>consumidor</em> con arreglo a la legislación imperativa de su país de residencia (en particular, la Directiva de la UE sobre los derechos de los consumidores, el Code de la consommation francés o las UK Consumer Contracts Regulations 2013), nada de lo dispuesto en estos Términos limita los derechos que no pueden excluirse por contrato. En tal caso: (a) el Cliente tiene derecho a desistir del Contrato en un plazo de 14 días desde el día en que se suscribe (incluido el día en que se inicia un periodo de prueba gratuito), sin necesidad de justificación, mediante una declaración inequívoca dirigida a{" "}
            <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a> (puede utilizar el modelo de formulario del Anexo B); (b) en el registro y en el momento del pago, el Cliente <strong>solicitó expresamente que comenzáramos la prestación durante el plazo de desistimiento y reconoció</strong> que, si desiste, deberá abonar un importe proporcional al servicio prestado hasta el momento en que nos haya comunicado el desistimiento, y que pierde el derecho de desistimiento una vez que el servicio se haya ejecutado completamente; (c) los reembolsos debidos en virtud de este §8.6 se efectúan en un plazo de 14 días desde la comunicación del Cliente; (d) las disposiciones francesas sobre la renovación tácita y la resolución en línea reproducidas en el Anexo A se aplican a los consumidores y no profesionales según se definen en dicho anexo. Los clientes profesionales no tienen derecho de desistimiento.
          </P>
        </section>

        <section>
          <H2 id="addons">9. Paquetes de créditos, complementos y servicios</H2>
          <P>
            <strong>9.1</strong> Los paquetes de créditos y los complementos son compras únicas, no reembolsables, que se consumen conforme al §4.3; los créditos de los paquetes caducan según lo indicado en el momento de la compra.
          </P>
          <P>
            <strong>9.2</strong> Los servicios llave en mano (por ejemplo, de contenido, auditorías o servicios de GEO/AEO) se rigen por la descripción, el precio y las condiciones de entrega mostrados en el momento del pedido y, en su caso, por un documento de alcance (statement of work) independiente. Dado que el trabajo comienza con el pedido, las tarifas de los servicios no son reembolsables una vez iniciado el trabajo, salvo que no cumplamos con la entrega.
          </P>
        </section>

        <section>
          <H2 id="data">10. Datos del Cliente, privacidad y cuentas conectadas</H2>
          <P>
            <strong>10.1</strong> Nuestro tratamiento de los datos personales se describe en la{" "}
            <a href="/es/privacy" className={link}>Política de privacidad</a>. Cuando tratamos datos personales por cuenta del Cliente (por ejemplo, en los informes que genera), actuamos como su encargado del tratamiento; nuestras condiciones de tratamiento de datos (art. 28 del RGPD) y la lista actual de subencargados están disponibles en{" "}
            <a href="/es/privacy#subprocessors" className={link}>geotoolbox.ai/privacy</a> y, previa solicitud, en versión firmada.
          </P>
          <P>
            <strong>10.2 Datos del Cliente.</strong> El Cliente conserva todos los derechos sobre los datos, marcas, prompts y contenidos que aporte (los «<strong>Datos del Cliente</strong>»). El Cliente nos otorga una licencia no exclusiva para alojar, tratar y mostrar los Datos del Cliente con el fin de prestar, proteger y mejorar el Servicio. Podemos utilizar datos de uso agregados y desidentificados (por ejemplo, estadísticas de citas por motor) que no identifiquen al Cliente ni a sus clientes.
          </P>
          <P>
            <strong>10.3 Cuentas conectadas.</strong> Si el Cliente conecta Google Search Console o Google Analytics, autoriza un acceso de solo lectura con los alcances que se muestran en el momento de la conexión y garantiza que está facultado para concederlo. El Cliente puede desconectarlas en cualquier momento.
          </P>
          <P>
            <strong>10.4 Conservación y exportación.</strong> Los resultados de los análisis se conservan según se describe en la Política de privacidad. Tras la resolución, el Cliente puede exportar sus datos durante 30 días, transcurridos los cuales podremos suprimirlos (los registros de facturación se conservan según exija la ley).
          </P>
          <P>
            <strong>10.5 Confidencialidad.</strong>{" "}Cada parte mantendrá la confidencialidad de la información no pública de la otra parte y la utilizará únicamente para ejecutar el Contrato, durante su vigencia y los tres años siguientes, salvo la información que sea o pase a ser pública sin mediar incumplimiento, que la parte receptora ya conociera lícitamente o haya desarrollado de forma independiente, o que deba revelarse por imperativo legal (con aviso previo cuando esté permitido).
          </P>
        </section>

        <section>
          <H2 id="ip">11. Propiedad intelectual y licencia</H2>
          <P>
            <strong>11.1</strong>{" "}El Servicio, su software, su metodología, sus puntuaciones, sus bases de datos, sus diseños y sus contenidos son propiedad nuestra o de nuestros licenciantes y están protegidos por la legislación en materia de propiedad intelectual e industrial. Otorgamos al Cliente una licencia limitada, no exclusiva e intransferible (revocable únicamente conforme al §18) para acceder al Servicio y utilizarlo, así como para utilizar los informes y resultados que genere para su propio negocio o el de sus clientes, durante la vigencia del Contrato y dentro de los límites de su plan.
          </P>
          <P>
            <strong>11.2 Los informes de marca blanca</strong> (cuando estén incluidos en el plan del Cliente) pueden presentarse bajo la marca del Cliente a sus clientes; el Cliente sigue siendo responsable de su uso y de cualesquiera afirmaciones que haga sobre la base de ellos.
          </P>
          <P>
            <strong>11.3 Los comentarios</strong> que el Cliente nos facilite pueden ser utilizados libremente por nosotros sin obligación alguna.
          </P>
          <P>
            <strong>11.4 Marcas.</strong>{" "}«GEO Toolbox» y nuestros logotipos son marcas nuestras. Las marcas de terceros (incluidos los nombres de los motores de IA) pertenecen a sus respectivos titulares y se utilizan únicamente a efectos de identificación; no estamos afiliados a ellos ni contamos con su respaldo.
          </P>
        </section>

        <section>
          <H2 id="acceptable-use">12. Uso aceptable</H2>
          <P>El Cliente se compromete a no realizar, ni permitir que otros realicen, ninguna de las siguientes conductas:</P>
          <UL>
            <li>utilizar el Servicio de forma ilícita, o vulnerando derechos de terceros o las condiciones de cualquier servicio conectado o motor de IA;</li>
            <li>intentar acceder sin autorización al Servicio, a otras cuentas o a nuestra infraestructura, o sondear, escanear o poner a prueba su vulnerabilidad sin nuestro consentimiento por escrito;</li>
            <li>interferir en el Servicio o perturbarlo, o eludir los límites de los planes, la medición de créditos, los límites de frecuencia o los controles de seguridad;</li>
            <li>extraer mediante scraping, rastrear o extraer de forma masiva el Servicio o sus datos por medios distintos de las funciones que ponemos a disposición, o utilizar medios automatizados más allá del uso previsto;</li>
            <li>revender, sublicenciar o alquilar el Servicio, compartir credenciales de acceso a él u ofrecerlo como servicio a terceros (service bureau), o redistribuir nuestros datos o informes salvo en la medida permitida por el §11;</li>
            <li>aplicar ingeniería inversa al Servicio o copiarlo, o desarrollar un producto competidor aprovechando el acceso a él;</li>
            <li>cargar código malicioso o aportar contenidos ilícitos, difamatorios o que infrinjan derechos;</li>
            <li>falsear su identidad, crear múltiples cuentas para obtener periodos de prueba o créditos de forma reiterada, o utilizar un medio de pago para cuyo uso no esté autorizado.</li>
          </UL>
        </section>

        <section>
          <H2 id="third-party">13. Servicios de terceros y resultados generados por IA</H2>
          <P>
            <strong>13.1</strong> El Servicio consulta y analiza motores de IA y proveedores de datos de terceros. Su disponibilidad, su comportamiento, sus resultados y sus condiciones cambian con frecuencia y escapan a nuestro control. <strong>Las respuestas de los motores de IA no son deterministas</strong>: los resultados varían entre ejecuciones, regiones, cuentas y fechas. No garantizamos que ningún motor vaya a mencionar o citar al Cliente, que las puntuaciones o estimaciones de visibilidad sean exactas o completas, ni que ninguna recomendación vaya a producir un resultado concreto.
          </P>
          <P>
            <strong>13.2</strong> Los resultados (puntuaciones, informes, briefs, contenidos generados, recomendaciones) son herramientas informativas para profesionales y no constituyen asesoramiento profesional, jurídico, financiero ni de marketing. El Cliente es responsable de revisar los resultados antes de basarse en ellos o publicarlos.
          </P>
          <P>
            <strong>13.3</strong> Si un proveedor externo retira o restringe el acceso, podemos sustituir, modificar o suprimir la función afectada, de forma inmediata cuando el proveedor no deje alternativa; si ello reduce sustancialmente un plan de pago, el Cliente puede resolver el Contrato y le reembolsaremos la parte no utilizada del periodo en curso (§18.4).
          </P>
        </section>

        <section>
          <H2 id="availability">14. Disponibilidad, cambios y funciones beta</H2>
          <P>
            <strong>14.1</strong> Aspiramos a una alta disponibilidad, pero no garantizamos un funcionamiento ininterrumpido o libre de errores. El mantenimiento, las actualizaciones y las caídas de servicios de terceros pueden provocar interrupciones. No se consumen créditos por los escaneos que fallen por causas imputables a nosotros.
          </P>
          <P>
            <strong>14.2</strong> Las funciones etiquetadas como beta, versión preliminar (preview), experimentales o similares se proporcionan tal cual, pueden modificarse o retirarse sin previo aviso y quedan excluidas de cualquier compromiso de disponibilidad.
          </P>
        </section>

        <section>
          <H2 id="warranties">15. Exclusión de garantías</H2>
          <P>
            En la máxima medida permitida por la ley, el Servicio se proporciona <strong>«tal cual» y «según disponibilidad»</strong>, sin garantías de ningún tipo, expresas o implícitas, incluidas las de comerciabilidad, idoneidad para un fin determinado, exactitud, no infracción, o de que el Servicio vaya a satisfacer los requisitos del Cliente o a lograr un resultado determinado. Nada de lo dispuesto en estos Términos excluye las garantías o los derechos que no puedan excluirse con arreglo a la legislación aplicable.
          </P>
        </section>

        <section>
          <H2 id="liability">16. Limitación de responsabilidad</H2>
          <P>
            <strong>16.1 Exclusiones.</strong> En la máxima medida permitida por la ley, no somos responsables de ningún daño indirecto, incidental, especial, consecuencial o punitivo, ni del lucro cesante, ni de la pérdida de ingresos, negocio, fondo de comercio, datos o ahorros previstos, ni de las decisiones adoptadas sobre la base de los resultados (§13), cualquiera que sea su causa.
          </P>
          <P>
            <strong>16.2 Límite.</strong> Nuestra responsabilidad total acumulada derivada del Contrato o relacionada con él en cualquier periodo de 12 meses se limita a <strong>las tarifas que el Cliente nos haya abonado por el Servicio en los 12 meses anteriores al hecho que dé lugar a la reclamación</strong> (o a 100 € si el Cliente no ha abonado nada).
          </P>
          <P>
            <strong>16.3 Excepciones.</strong> Nada de lo anterior limita la responsabilidad por muerte o lesiones personales causadas por negligencia, por fraude o dolo (dol), por culpa grave (faute lourde) en la medida en que no pueda limitarse con arreglo al Derecho francés, ni cualquier otra responsabilidad que no pueda limitarse por ley. Si el Cliente es consumidor, los §§16.1 y 16.2 no se le aplican y nuestra responsabilidad se rige por la legislación imperativa.
          </P>
        </section>

        <section>
          <H2 id="indemnity">17. Indemnidad</H2>
          <P>
            Si el Cliente es un cliente profesional, nos defenderá y mantendrá indemnes frente a las reclamaciones de terceros, y los costes relacionados (incluidos unos honorarios de abogados razonables), derivadas de los Datos del Cliente, del uso del Servicio por su parte en incumplimiento del Contrato o de la ley, de sus informes de marca blanca o de las afirmaciones que haga a sus clientes sobre la base de los resultados, siempre que le notifiquemos con prontitud la reclamación, le permitamos dirigir la defensa y la transacción (sin ninguna transacción que implique un reconocimiento de culpa en nuestro nombre sin nuestro consentimiento) y cooperemos razonablemente, a costa del Cliente.
          </P>
        </section>

        <section>
          <H2 id="term">18. Duración, suspensión y resolución</H2>
          <P>
            <strong>18.1 Duración.</strong> El Contrato comienza cuando el Cliente crea una cuenta y continúa hasta su resolución. Las suscripciones se extienden por periodos sucesivos conforme al §6.1.
          </P>
          <P>
            <strong>18.2 Suspensión.</strong> Podemos suspender el acceso, total o parcialmente, previo aviso cuando sea factible, si: existe un pago vencido; tenemos motivos razonables para creer que existe un riesgo de seguridad, un uso abusivo o un incumplimiento del §12; lo exige la ley o un proveedor externo; o hay un contracargo pendiente (§8.5).
          </P>
          <P>
            <strong>18.3 Resolución por incumplimiento.</strong> Cualquiera de las partes puede resolver el Contrato si la otra lo incumple de forma sustancial y no subsana el incumplimiento en un plazo de 15 días desde la notificación (de forma inmediata en caso de incumplimiento del §12 o de impago que persista tras un recordatorio). En caso de resolución por incumplimiento del Cliente, las tarifas del periodo en curso siguen adeudándose y no se reembolsan.
          </P>
          <P>
            <strong>18.4 Resolución sin causa por nuestra parte o cese del Servicio.</strong>{" "}Podemos resolver el Contrato o dejar de prestar el Servicio con un preaviso mínimo de 30 días por correo electrónico. En tal caso, reembolsaremos las tarifas pagadas por adelantado correspondientes a la parte no utilizada del periodo en curso del Cliente.
          </P>
          <P>
            <strong>18.5 Efectos.</strong> A la resolución, la licencia del Cliente se extingue; el §10.4 rige la exportación y la supresión de los datos; los §§8, 10.5, 11, 15–17, 20 y 21 subsisten.
          </P>
        </section>

        <section>
          <H2 id="changes">19. Modificaciones de estos Términos</H2>
          <P>
            Podemos actualizar estos Términos a medida que evolucionen el Servicio y la ley. La versión vigente, su número y su fecha se muestran siempre en la parte superior de esta página, y las versiones anteriores están disponibles previa solicitud. En el caso de <strong>modificaciones sustanciales</strong> que reduzcan los derechos del Cliente, daremos un preaviso mínimo de <strong>30 días</strong> por correo electrónico o en la aplicación antes de que surtan efecto para los clientes existentes; si no está de acuerdo, el Cliente puede resolver el Contrato antes de la fecha de efecto y, en tal caso, le reembolsaremos las tarifas pagadas por adelantado correspondientes al periodo posterior a la resolución. Las modificaciones no sustanciales (aclaraciones, nuevas funciones, referencias legales) se aplican desde su publicación. Seguir utilizando el Servicio después de la fecha de efecto supone su aceptación.
          </P>
        </section>

        <section>
          <H2 id="law">20. Ley aplicable y litigios</H2>
          <P>
            <strong>20.1 Ley aplicable.</strong> El Contrato se rige por el Derecho francés, con exclusión de sus normas de conflicto de leyes y de la Convención de las Naciones Unidas sobre los Contratos de Compraventa Internacional de Mercaderías.
          </P>
          <p className="mt-2 rounded border border-gray-300 bg-white p-3 font-semibold uppercase tracking-wide text-gray-900">
            20.2 Jurisdicción (clientes profesionales). Todo litigio derivado del Contrato o relacionado con él que no se resuelva amistosamente en un plazo de 30 días desde su notificación por escrito se someterá a la jurisdicción exclusiva de los tribunales competentes de París (Francia), incluso en procedimientos con pluralidad de partes, no obstante cualquier otra cláusula de sumisión. Nada impide a ninguna de las partes solicitar en cualquier momento medidas urgentes o cautelares. Para los clientes establecidos en Francia, esta cláusula solo se aplica en la medida permitida por el Code de procédure civile francés (artículo 48); en caso contrario, es competente el tribunal que lo sea con arreglo a dicho código.
          </p>
          <P>
            <strong>20.3 Contacto previo.</strong> Rogamos al Cliente que se ponga en contacto con nosotros antes de iniciar cualquier procedimiento; resolvemos casi todas las incidencias por correo electrónico.
          </P>
          <P>
            <strong>20.4 Consumidores.</strong> Si el Cliente es consumidor, el §20.2 no se le aplica: se beneficia de las normas imperativas de protección de los consumidores de su país de residencia y puede ejercitar acciones ante los tribunales de dicho país. Los consumidores franceses también pueden recurrir a la mediación de consumo gratuita (Code de la consommation L612-1 y siguientes) tras haberse dirigido previamente a nosotros por escrito; el médiateur de la consommation (mediador de consumo) está en proceso de designación y se indicará aquí y en <a href="/es/legal" className={link}>geotoolbox.ai/legal</a>. La plataforma europea de resolución de litigios en línea dejó de funcionar el 20 de julio de 2025.
          </P>
        </section>

        <section>
          <H2 id="general">21. Disposiciones generales</H2>
          <P><strong>21.1 Acuerdo íntegro.</strong> El Contrato constituye el acuerdo íntegro entre las partes en relación con su objeto y sustituye a las condiciones anteriores; si el Cliente ha firmado con nosotros un acuerdo escrito independiente, este prevalece sobre estos Términos en caso de conflicto.</P>
          <P><strong>21.2 Cesión.</strong> El Cliente no puede ceder el Contrato sin nuestro consentimiento. Podemos cederlo a un sucesor de nuestro negocio, previa notificación.</P>
          <P><strong>21.3 Fuerza mayor.</strong> Ninguna de las partes es responsable de los retrasos o incumplimientos causados por hechos que escapen a su control razonable (incluidas las caídas de plataformas de terceros, los fallos de red y los actos de las autoridades), salvo en lo que respecta a las obligaciones de pago.</P>
          <P><strong>21.4 Divisibilidad; renuncia.</strong> Si una disposición se declara inaplicable, se limitará en la medida mínima necesaria y el resto seguirá en vigor. No exigir el cumplimiento de una disposición no constituye una renuncia.</P>
          <P><strong>21.5 Notificaciones.</strong> Podemos enviar notificaciones al Cliente por correo electrónico a la dirección de su cuenta o en la aplicación; nuestras notificaciones se consideran recibidas el día hábil siguiente a su envío. El Cliente nos notifica en <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>; sus notificaciones (incluidas las cancelaciones) surten efecto cuando llegan a nuestro servidor de correo.</P>
          <P><strong>21.6 Idioma.</strong> Estos Términos están redactados en inglés. Las traducciones se facilitan por comodidad; cuando la legislación imperativa exija una traducción para los consumidores, dicha traducción se aplica a esos consumidores y, en los demás casos, prevalece la versión en inglés.</P>
          <P><strong>21.7 Plazo para reclamar; sanciones.</strong> Para los clientes profesionales, toda reclamación derivada del Contrato debe ejercitarse en el plazo de un año desde el hecho que la origine. El Cliente declara que no está sujeto a sanciones ni a restricciones a la exportación que nos impidan prestarle el Servicio.</P>
          <P><strong>21.8 Registros.</strong> Conservamos un registro de la aceptación de estos Términos por parte del Cliente (versión, fecha y hora, dirección IP, plan y precio comunicado) y de las comunicaciones de facturación, y podemos utilizarlo como prueba.</P>
        </section>

        <section>
          <H2 id="contact">22. Contacto</H2>
          <P>
            Preguntas sobre estos Términos, la facturación o la cancelación:{" "}
            <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>. Aviso legal:{" "}
            <a href="/es/legal" className={link}>geotoolbox.ai/legal</a>.
          </P>
        </section>

        <section className="border-t border-gray-200 pt-8">
          <H2 id="annex-a">Anexo A — Textos legales franceses (solo consumidores y no profesionales)</H2>
          <P>
            Los siguientes artículos del Code de la consommation francés se reproducen íntegramente, tal como exige el artículo L215-4 de dicho código. Solo se aplican a los contratos celebrados con consumidores y no profesionales según los define el Derecho francés (una persona física que actúa con fines ajenos a su actividad comercial, empresarial, de oficio o profesión; o una persona jurídica que no actúa con fines profesionales). No se aplican a los clientes profesionales (§2.2). Texto vigente a 15 de agosto de 2026 (fuente: legifrance.gouv.fr). Los artículos se reproducen en su versión original en francés.
          </P>
          <div className="mt-3 space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm" lang="fr">
            <p><strong>Article L215-1</strong> — Pour les contrats de prestations de services conclus pour une durée déterminée avec une clause de reconduction tacite, le professionnel prestataire de services informe le consommateur par écrit, par lettre nominative ou courrier électronique dédiés, au plus tôt trois mois et au plus tard un mois avant le terme de la période autorisant le rejet de la reconduction, de la possibilité de ne pas reconduire le contrat qu&apos;il a conclu avec une clause de reconduction tacite. Cette information, délivrée dans des termes clairs et compréhensibles, mentionne, dans un encadré apparent, la date limite de non-reconduction.<br />
            Lorsque cette information ne lui a pas été adressée conformément aux dispositions du premier alinéa, le consommateur peut mettre gratuitement un terme au contrat, à tout moment à compter de la date de reconduction.<br />
            Les avances effectuées après la dernière date de reconduction ou, s&apos;agissant des contrats à durée indéterminée, après la date de transformation du contrat initial à durée déterminée, sont dans ce cas remboursées dans un délai de trente jours à compter de la date de résiliation, déduction faite des sommes correspondant, jusqu&apos;à celle-ci, à l&apos;exécution du contrat.<br />
            Les dispositions du présent article s&apos;appliquent sans préjudice de celles qui soumettent légalement certains contrats à des règles particulières en ce qui concerne l&apos;information du consommateur.<br />
            Par exception au premier alinéa du présent article, pour les contrats de fourniture de service de télévision au sens de l&apos;article 2 de la loi n° 86-1067 du 30 septembre 1986 relative à la liberté de communication et pour les contrats de fourniture de services de médias audiovisuels à la demande, le consommateur peut mettre gratuitement un terme au contrat, à tout moment à compter de la première reconduction, dès lors qu&apos;il change de domicile ou que son foyer fiscal évolue.</p>
            <p><strong>Article L215-1-1</strong> — Lorsqu&apos;un contrat a été conclu par voie électronique ou a été conclu par un autre moyen et que le professionnel, au jour de la résiliation par le consommateur, offre au consommateur la possibilité de conclure des contrats par voie électronique, la résiliation est rendue possible selon cette modalité. A cet effet, le professionnel met à la disposition du consommateur une fonctionnalité gratuite permettant d&apos;accomplir, par voie électronique, la notification et les démarches nécessaires à la résiliation du contrat. Lorsque le consommateur notifie la résiliation du contrat, le professionnel lui confirme la réception de la notification et l&apos;informe, sur un support durable et dans des délais raisonnables, de la date à laquelle le contrat prend fin et des effets de la résiliation.</p>
            <p><strong>Article L215-2</strong> — Les dispositions du présent chapitre, à l&apos;exception de l&apos;article L. 215-1-1, ne sont pas applicables aux exploitants des services d&apos;eau potable et d&apos;assainissement.</p>
            <p><strong>Article L215-3</strong> — Les dispositions du présent chapitre sont également applicables aux contrats conclus entre des professionnels et des non-professionnels.</p>
            <p><strong>Article L241-3</strong> — Lorsque le professionnel n&apos;a pas procédé au remboursement dans les conditions prévues à l&apos;article L. 215-1, les sommes dues sont productives d&apos;intérêts au taux légal.</p>
          </div>
        </section>

        <section>
          <H2 id="annex-b">Anexo B — Modelo de formulario de desistimiento (solo consumidores)</H2>
          <P>Cumplimente y envíe el presente formulario únicamente si es consumidor y desea desistir del contrato (§8.6).</P>
          <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
            <p>A la atención de: Samy Ben Sadok (GEO Toolbox), 1 esplanade de Chantilly, 93330 Neuilly-sur-Marne, Francia — samy@geotoolbox.ai</p>
            <p className="mt-2">Por la presente le comunico/comunicamos (*) que desisto de mi/desistimos de nuestro (*) contrato de prestación del siguiente servicio: suscripción a GEO Toolbox, plan ______________</p>
            <p className="mt-2">Pedido el (*) / recibido el (*): ______________</p>
            <p className="mt-2">Nombre del consumidor o de los consumidores: ______________</p>
            <p className="mt-2">Domicilio del consumidor o de los consumidores: ______________</p>
            <p className="mt-2">Correo electrónico de la cuenta: ______________</p>
            <p className="mt-2">Firma del consumidor o de los consumidores (solo si el presente formulario se presenta en papel): ______________</p>
            <p className="mt-2">Fecha: ______________</p>
            <p className="mt-2 text-gray-500">(*) Táchese lo que no proceda.</p>
          </div>
        </section>
      </div>
    </div>
  )
}
