// components/legal/refund-policy-es.tsx
// Native Spanish (Spain) Cancellation & Refund Policy body for /es/refund-policy. Mirrors
// components/legal/refund-policy-content.tsx (EN) section for section; the note at the top
// states the EN version prevails. Must stay consistent with Terms §5–§8.
import { TERMS_UPDATED } from "@/components/legal/terms-content"

const link = "text-accent-700 underline hover:text-accent-800"

export function RefundPolicyEs() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Política de cancelación y reembolso</h1>
      <p className="mt-2 text-sm text-gray-600">Última actualización: {TERMS_UPDATED} · Forma parte de nuestros <a href="/es/terms" className={link}>Términos del servicio</a> (§5–§8)</p>
      <p className="mt-2 text-xs text-gray-500">
        Esta traducción se facilita únicamente a título informativo. En caso de divergencia, prevalece la{" "}
        <a href="/refund-policy" className="underline">versión en inglés</a>, salvo cuando la legislación imperativa exija una traducción para los consumidores; en ese caso, dicha traducción se aplica a esos consumidores (§21.6 de los Términos).
      </p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-gray-600">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">Cómo funcionan las suscripciones</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Los planes de pago son <strong>suscripciones que se renuevan automáticamente</strong>, con periodicidad mensual o anual, hasta que el usuario las cancele. El cargo se realiza en la tarjeta registrada al inicio de cada periodo. Los planes anuales se cobran íntegramente y por adelantado.</li>
            <li>Una <strong>prueba gratuita</strong> requiere una tarjeta y <strong>se convierte automáticamente</strong> en el plan y la periodicidad de facturación que el usuario haya seleccionado, en la fecha de fin de la prueba indicada al contratar, salvo que la cancele antes de esa fecha. Enviamos un correo electrónico al usuario cuando comienza la prueba (con el importe y la fecha del primer cargo) y otro antes de realizar el cargo.</li>
            <li>Los precios no incluyen el IVA ni otros impuestos sobre las ventas, que se añaden al contratar cuando proceda.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Cómo cancelar</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Inicie sesión y abra <strong>Account → Manage subscription</strong> (Cuenta → Gestionar suscripción), lo que abre el portal de cliente de Stripe.</li>
            <li>Elija <strong>Cancel subscription</strong> (Cancelar suscripción) y confirme. El usuario recibe un correo electrónico de confirmación con la fecha de finalización.</li>
            <li>También puede enviar un correo electrónico a <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a> desde la dirección del titular de la cuenta, a más tardar el día anterior a la fecha de renovación (o antes de la fecha y hora de fin de la prueba) indicada en su cuenta y en nuestros correos electrónicos.</li>
          </ol>
          <p className="mt-2">La cancelación de una suscripción de pago surte efecto al final del periodo en curso, y el usuario conserva el acceso hasta entonces. La cancelación de una prueba gratuita iniciada a partir del 27 de octubre de 2026 (versión 2.1 de los Términos) le pone fin de inmediato: el acceso cesa en ese momento y no se cobra nada; una prueba anterior conserva el acceso hasta su fecha de finalización. Revocar el acceso de Google o eliminar las cookies de la aplicación <em>no</em> cancela una suscripción.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Reembolsos</h2>
          <p className="mt-2"><strong>Las cuotas no son reembolsables.</strong> No reembolsamos:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>una prueba que se haya convertido en suscripción por no haberse cancelado antes de su finalización (mensual o anual);</li>
            <li>una renovación que no se haya cancelado antes de la fecha de renovación;</li>
            <li>el tiempo no utilizado tras cancelar o cambiar a un plan inferior, ni los créditos, puestos (seats), marcas o prompts no utilizados;</li>
            <li>los periodos en los que el usuario no haya iniciado sesión ni utilizado el Servicio;</li>
            <li>la insatisfacción con los resultados, las clasificaciones o las citas de los motores de IA, que escapan a nuestro control.</li>
          </ul>
          <p className="mt-2"><strong>Sí</strong> corregimos nuestros propios errores de facturación (importe incorrecto, cargo duplicado, cargo posterior a una cancelación confirmada); le rogamos que nos lo comunique sin demora. Si <em>nosotros</em> resolvemos su suscripción sin causa, dejamos de prestar el Servicio o un cambio de un tercero reduce sustancialmente su plan, reembolsamos la parte no utilizada del periodo en curso (Términos, §13.3, §18.4, §19). Los derechos legales de los consumidores se describen más abajo. También podemos conceder un reembolso de cortesía a nuestra entera discreción; hacerlo no genera obligación alguna.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Si considera que un cargo es incorrecto</h2>
          <p className="mt-2">Escriba primero a <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>: la mayoría de las incidencias se resuelven en un plazo de dos días hábiles. El usuario conserva siempre el derecho a dirigirse a su banco; no obstante, en el caso de un cargo realizado conforme a los Términos (una conversión de prueba o una renovación debidamente informadas), facilitaremos al banco el registro de su aceptación, la información mostrada al contratar, los correos electrónicos de confirmación y de recordatorio y su uso del Servicio; la cuenta puede suspenderse mientras la disputa esté abierta y, si prospera un contracargo (chargeback) contra un cargo válido, el importe sigue siendo exigible (Términos, §8.5).</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Derechos legales de los consumidores</h2>
          <p className="mt-2">GEO Toolbox es una herramienta profesional y el usuario confirma su uso profesional al suscribirse. Si, no obstante, tiene la condición de <em>consumidor</em> conforme a la legislación imperativa de su país (por ejemplo, en la UE o en el Reino Unido), conserva los derechos que dicha legislación le reconoce, incluido un derecho de desistimiento de 14 días a contar desde el día en que se suscribe (incluido el inicio de una prueba), con la obligación de abonar la parte proporcional del servicio ya prestado. Véase el <a href="/es/terms#refunds" className={link}>§8.6 de los Términos</a> y el modelo de formulario de desistimiento del Anexo B de los Términos.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Contacto</h2>
          <p className="mt-2">Consultas sobre facturación y cancelaciones: <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>.</p>
        </section>
      </div>
    </div>
  )
}
