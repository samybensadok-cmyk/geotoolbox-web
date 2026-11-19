// Native Spanish (Spain) privacy policy body for /es/privacy. Mirrors components/legal/privacy-content.tsx
// (EN, last updated 2026-11-19) section for section; the note at the top states the EN version prevails.
export function PrivacyEs() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Política de privacidad</h1>
      <p className="mt-2 text-sm text-gray-600">Última actualización: 19 de noviembre de 2026</p>
      <p className="mt-2 text-xs text-gray-500">
        Esta traducción se facilita únicamente a título informativo. En caso de divergencia, prevalece la{" "}
        <a href="/privacy" className="underline">versión en inglés</a>.
      </p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-gray-600">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">1. Datos que recopilamos</h2>
          <p className="mt-2">
            Cuando el usuario inicia sesión con Google, recibimos de su cuenta de Google su <strong>nombre</strong>, su <strong>dirección de correo electrónico</strong> y su <strong>foto de perfil</strong>.
          </p>
          <p className="mt-3">
            Si el usuario conecta Google Search Console, accedemos a su lista de propiedades de GSC y a sus <strong>datos de rendimiento en la búsqueda</strong> (consultas, clics, impresiones, posición media, país, dispositivo, página, fecha) de los sitios que autorice, con el alcance <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">https://www.googleapis.com/auth/webmasters.readonly</code>.
          </p>
          <p className="mt-3">
            Si el usuario conecta Google Analytics 4, accedemos a su lista de propiedades de GA4 y a sus <strong>métricas de tráfico</strong> (sesiones, usuarios, tasa de interacción, conversiones, páginas de destino, dimensiones de origen) con el alcance <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">https://www.googleapis.com/auth/analytics.readonly</code>. Utilizamos estos datos para identificar el tráfico procedente de motores de búsqueda con IA (ChatGPT, Gemini, Claude, Perplexity, NotebookLM).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">2. Cómo utilizamos los datos</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Para autenticar al usuario y mostrar la información de su cuenta</li>
            <li>Para mostrar sus datos de Google Search Console y Google Analytics 4 en el panel de GEO Toolbox</li>
            <li>Para generar informes de visibilidad en IA de sus dominios</li>
            <li>Para enviarle ocasionalmente correos electrónicos sobre las funciones y ofertas de GEO Toolbox (véase más abajo; el usuario puede darse de baja en cualquier momento)</li>
          </ul>
          <p className="mt-3">
            <strong>El uso de los datos de usuario de Google se limita estrictamente a las finalidades indicadas arriba.</strong> No utilizamos los datos de usuario de Google para desarrollar, mejorar ni entrenar modelos generalizados de inteligencia artificial o de aprendizaje automático. No transferimos datos de usuario de Google a terceros, salvo cuando sea necesario para prestar o mejorar el Servicio o cuando lo exija la ley. Nuestro tratamiento de los datos de usuario de Google se ajusta a la <a href="https://developers.google.com/terms/api-services-user-data-policy" className="text-accent-700 underline hover:text-accent-800">Google API Services User Data Policy</a>, incluidos sus requisitos de uso limitado (Limited Use).
          </p>
          <p className="mt-3">
            <strong>Correos electrónicos sobre el producto y las ofertas.</strong> Si el usuario ha creado una cuenta o ha realizado un escaneo gratuito, podemos enviarle ocasionalmente correos electrónicos sobre las funciones y ofertas de GEO Toolbox, sobre la base de nuestro interés legítimo en informar a los usuarios existentes de un servicio similar. Para ello solo utilizamos su dirección de correo electrónico y su nombre, nunca sus datos de Search Console o de Analytics. Cada uno de estos correos incluye un enlace para darse de baja con un solo clic, y el usuario puede oponerse en cualquier momento respondiendo al correo o escribiendo a <a href="mailto:samy@geotoolbox.ai" className="text-accent-700 underline hover:text-accent-800">samy@geotoolbox.ai</a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">3. Almacenamiento y conservación de los datos</h2>
          <p className="mt-2">
            <strong>No almacenamos en nuestros servidores los datos sin procesar de Google Search Console ni de Google Analytics 4 del usuario.</strong>{" "}Todas las respuestas de las API de GSC y GA4 se guardan en caché en el localStorage del navegador del usuario durante un máximo de 6 horas y después se borran automáticamente. Al borrar el almacenamiento del navegador, se eliminan de inmediato.
          </p>
          <p className="mt-3">
            El almacenamiento en el servidor se limita a:
          </p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Los tokens OAuth del usuario (de acceso y de actualización), cifrados en reposo, que se conservan hasta que el usuario desconecte la integración</li>
            <li>Los identificadores de las propiedades de GSC y GA4 conectadas</li>
            <li>Los registros de autenticación (intentos de inicio de sesión, cookies de sesión) — se eliminan automáticamente tras un máximo de 7 días de inactividad</li>
            <li>La caché de páginas descargadas (HTML renderizado que descargamos en nombre del usuario para analizarlo) — se conserva hasta 24 horas y después se sustituye en la siguiente descarga</li>
            <li>Los resultados de análisis que genera el usuario (informes de escaneo, resúmenes de dominio, comprobaciones de agent-readiness, briefs de contenido, análisis de citabilidad, escaneos de radar de competidores, transformaciones de exportación AI-ready, seguimiento de la visibilidad en IA) — <strong>se conservan indefinidamente</strong> para que el usuario y su equipo puedan comparar el rendimiento a lo largo del tiempo. El plan contratado determina qué parte de ese historial se muestra en el panel: los planes inferiores muestran un periodo limitado del historial de escaneos (por ejemplo, 180 días en <strong>Starter</strong>), mientras que los superiores muestran el historial completo. Los datos más antiguos que quedan fuera del periodo del plan no se muestran, pero nunca se modifican ni se eliminan mientras la cuenta esté activa.</li>
            <li>Los registros internos de costes y de auditoría para la supervisión de nuestra propia infraestructura, que no contienen datos personales más allá de un ID de cuenta seudonimizado</li>
            <li>La telemetría de errores (anonimizada, sin datos personales) durante un máximo de 90 días</li>
            <li>Los registros de facturación y contractuales &mdash; la aceptación por parte del usuario de los <a href="/terms" className="text-accent-700 underline hover:text-accent-800">Términos del servicio</a> (versión, fecha y hora, dirección IP, plan y precio indicados en el momento del pago), los identificadores de cliente y de suscripción de Stripe, y las copias de las comunicaciones de facturación que le enviamos (confirmación del periodo de prueba, recordatorios, confirmaciones de cancelación). Se conservan durante la vigencia de la cuenta más 5 años (plazo de prescripción de las acciones contractuales); las facturas se conservan 10 años, conforme exige la legislación mercantil francesa. Estos registros se utilizan para responder a consultas de facturación y a reclamaciones relacionadas con pagos.</li>
          </ul>
          <p className="mt-3">
            <strong>Derecho de supresión.</strong> El usuario puede eliminar todos sus datos en cualquier momento eliminando su cuenta o escribiendo a{" "}
            <a href="mailto:samy@geotoolbox.ai" className="text-accent-700 underline hover:text-accent-800">samy@geotoolbox.ai</a>. Tramitamos la eliminación completa de la cuenta en un plazo de 14 días. Al retirar una marca seguida del panel, esta se elimina de inmediato de forma lógica (soft delete), junto con su lista de seguimiento.
          </p>
        </section>

        <section>
          <h2 id="subprocessors" className="scroll-mt-24 text-lg font-semibold text-gray-900">4. Comunicación de datos a terceros</h2>
          <p className="mt-2">
            No vendemos, alquilamos ni compartimos los datos personales del usuario con terceros con fines de marketing. Para prestar el Servicio recurrimos a los siguientes encargados del tratamiento:
          </p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Google OAuth: autenticación</li>
            <li>API de Google Search Console: datos de rendimiento en la búsqueda</li>
            <li>API de datos de Google Analytics: datos de tráfico procedente de IA</li>
            <li>Google Analytics 4: analítica de uso agregada de nuestro sitio web</li>
            <li>Microsoft Clarity: analítica de uso agregada de nuestro sitio web (mapas de calor y grabaciones de sesión con el texto sensible y los campos de entrada enmascarados)</li>
            <li>Stripe: procesamiento de pagos (nunca almacenamos nosotros los números de tarjeta)</li>
            <li>Resend: envío de correo electrónico (verificación, enlaces mágicos, resúmenes periódicos y correos ocasionales sobre el producto y las ofertas)</li>
            <li>Vercel: alojamiento de la aplicación</li>
            <li>Replit: alojamiento de la aplicación (backend PHP)</li>
            <li>Neon: alojamiento de la base de datos PostgreSQL</li>
            <li>Sentry: supervisión de errores (no se transmiten datos personales)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">5. Derechos del usuario</h2>
          <p className="mt-2">El usuario puede:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Revocar en cualquier momento el acceso de GEO Toolbox a su cuenta de Google en <a href="https://myaccount.google.com/permissions" className="text-accent-700 underline hover:text-accent-800">https://myaccount.google.com/permissions</a></li>
            <li>Desconectar GSC o GA4 desde la pestaña Analytics de la aplicación (el enlace &laquo;disconnect&raquo; situado bajo la etiqueta de la cuenta conectada)</li>
            <li>Solicitar la supresión de todos los datos almacenados en el servidor escribiendo a <a href="mailto:samy@geotoolbox.ai" className="text-accent-700 underline hover:text-accent-800">samy@geotoolbox.ai</a>; respondemos en un plazo de 14 días</li>
            <li>Eliminar los datos guardados en la caché local borrando el almacenamiento del navegador</li>
          </ul>
          <p className="mt-3">
            Si el usuario se encuentra en el Espacio Económico Europeo, el Reino Unido o Suiza, dispone además de los derechos de <strong>acceso</strong>, <strong>rectificación</strong>, <strong>supresión</strong>, <strong>limitación del tratamiento</strong>, <strong>portabilidad de los datos</strong> y <strong>oposición</strong> previstos en el RGPD (artículos 15 a 21), así como del derecho a <strong>retirar el consentimiento en cualquier momento</strong>, sin que ello afecte a la licitud del tratamiento anterior. Para ejercer cualquiera de estos derechos, basta con escribir a{" "}
            <a href="mailto:samy@geotoolbox.ai" className="text-accent-700 underline hover:text-accent-800">samy@geotoolbox.ai</a>. El usuario también tiene derecho a presentar una reclamación ante su autoridad de control: en Francia, la CNIL (<a href="https://www.cnil.fr" className="text-accent-700 underline hover:text-accent-800">cnil.fr</a>); en España, la Agencia Española de Protección de Datos (AEPD, <a href="https://www.aepd.es" className="text-accent-700 underline hover:text-accent-800">aepd.es</a>).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">6. Cookies y consentimiento</h2>
          <p className="mt-2">
            Utilizamos <strong>cookies estrictamente necesarias</strong> para la gestión de la sesión, la seguridad (protección CSRF) y para recordar la elección del usuario sobre las cookies. Están siempre activas y no requieren consentimiento.
          </p>
          <p className="mt-3">
            También utilizamos cookies de analítica, tal como se describe a continuación; cuando la legislación aplicable exige consentimiento &mdash;incluido el caso de los visitantes del EEE, el Reino Unido y Suiza&mdash;, estas herramientas solo se activan después de que el usuario acepte el banner de consentimiento. Las instalan <strong>Google Analytics 4</strong> (tráfico agregado, páginas vistas, tipo de dispositivo, ubicación aproximada) y <strong>Microsoft Clarity</strong> (patrones de interacción agregados, incluidos mapas de calor y grabaciones de sesión que ocultan el texto sensible y los campos de formulario). Ninguna de las dos se utiliza con fines publicitarios ni para el seguimiento entre sitios.
          </p>
          <p className="mt-3">
            Si el usuario nos visita desde el EEE, el Reino Unido o Suiza, <strong>no se ejecuta ninguna herramienta de analítica hasta que acepte</strong> el banner de consentimiento. Puede rechazarlas con un solo clic (el rechazo se recuerda durante 6 meses / 180 días; la aceptación, durante 12 meses / 365 días) y cambiar su elección en cualquier momento mediante el enlace <strong>Configuración de cookies</strong> del pie de página del sitio web, el enlace <strong>Cookie settings</strong> de la página de cuenta (Account) de la aplicación, o borrando la cookie <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">sg_consent</code>. También instalamos una cookie de corta duración, <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">sg_cc</code>, que contiene únicamente el código de país del usuario (o el valor <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">unknown</code>{" "}cuando no se puede determinar) y que sirve para decidir si el banner es aplicable; no contiene ningún identificador.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">7. Transferencias internacionales de datos</h2>
          <p className="mt-2">
            Estamos establecidos en la Unión Europea, y varios de los encargados del tratamiento enumerados en la sección 4 (entre ellos Google, Microsoft, Vercel, Neon, Stripe y Sentry) tratan datos en los Estados Unidos. Cuando se transfieren a los Estados Unidos datos personales de personas que se encuentran en el EEE, el Reino Unido o Suiza, nos basamos en el <strong>Marco de Privacidad de Datos UE&ndash;EE.&nbsp;UU.</strong> (EU&ndash;U.S. Data Privacy Framework, y sus extensiones para el Reino Unido y Suiza) cuando el proveedor cuenta con una certificación activa y, en caso contrario, en las <strong>cláusulas contractuales tipo</strong>{" "}de la Comisión Europea incorporadas al contrato de encargo del tratamiento del proveedor. Los datos de analítica (Google Analytics, Microsoft Clarity) solo se tratan, en el caso de los visitantes del EEE, el Reino Unido y Suiza, tras su consentimiento explícito (véase la sección 6).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">8. Contacto</h2>
          <p className="mt-2">
            Las consultas sobre privacidad y las solicitudes de supresión de datos pueden dirigirse a{" "}
            <a href="mailto:samy@geotoolbox.ai" className="text-accent-700 underline hover:text-accent-800">samy@geotoolbox.ai</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
