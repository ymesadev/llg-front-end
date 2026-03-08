"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function AbogadoDiscapacidadFlorida() {
  const router = useRouter();
  const formLoadTime = useRef(Date.now());
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    zipcode: "",
    email: "",
    description: "",
    consent: false,
  });
  const [honeypot, setHoneypot] = useState("");
  const [formStatus, setFormStatus] = useState("idle");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (honeypot) return;
    if (Date.now() - formLoadTime.current < 3000) return;
    const digits = formData.phone.replace(/\D/g, "");
    const area = digits.length === 11 && digits[0] === "1" ? digits.slice(1, 4) : digits.slice(0, 3);
    if (digits.length < 10 || area[0] === "0" || area[0] === "1") {
      setFormStatus("error");
      return;
    }
    setFormStatus("submitting");
    try {
      const res = await fetch("https://dev-n8n.louislawgroup.com/webhook/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          zipcode: formData.zipcode,
          email: formData.email,
          caseType: "SSDI",
          description: `[ESPAÑOL - Discapacidad] ${formData.description}`,
          consent: formData.consent ? "Yes" : "No",
          source: "abogado-discapacidad-florida",
        }),
      });
      if (!res.ok) throw new Error("Error");
      setFormStatus("success");
    } catch {
      setFormStatus("error");
    }
  };

  useEffect(() => {
    if (formStatus === "success") router.push("https://www.louislawgroup.com/thank-you");
  }, [formStatus, router]);

  const cities = [
    "Miami", "Hialeah", "Kissimmee", "Orlando", "Tampa",
    "West Palm Beach", "Fort Lauderdale", "Jacksonville",
    "Pembroke Pines", "Hollywood", "Coral Springs", "Cape Coral",
  ];

  const faqs = [
    {
      q: "¿Cuánto tiempo tengo para apelar una denegación del Seguro Social?",
      a: "Tiene exactamente 60 días (más 5 días de correo postal = 65 días totales) para presentar una apelación después de recibir una carta de denegación. Este plazo es estricto — si lo pierde, generalmente debe comenzar de cero con una nueva solicitud.",
    },
    {
      q: "¿Cuánto cobra un abogado de discapacidad?",
      a: "Trabajamos en contingencia. Usted no paga nada por adelantado. Sólo cobramos si ganamos su caso — y la ley federal limita nuestros honorarios al 25% del pago atrasado, con un máximo de $7,200.",
    },
    {
      q: "¿Qué pasa si me negaron el Seguro Social antes?",
      a: "La mayoría de los casos son denegados en primera instancia. Eso no significa que no califica. Con representación legal, las posibilidades de aprobación aumentan significativamente, especialmente en la audiencia ante un juez administrativo (ALJ).",
    },
    {
      q: "¿Necesito ser ciudadano americano para aplicar?",
      a: "No necesariamente. Los residentes legales permanentes y ciertos otros inmigrantes también pueden calificar para SSI o SSDI dependiendo de su historial de trabajo y estatus migratorio.",
    },
    {
      q: "¿Cuánto demora el proceso?",
      a: "Las solicitudes iniciales tardan 3-6 meses. Las apelaciones pueden tomar 1-2 años. Por eso es crucial actuar rápido y no perder ningún plazo.",
    },
  ];

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className={styles.page}>

      {/* Urgency Banner */}
      <div className={styles.urgencyBanner}>
        <span className={styles.urgencyIcon}>⚠️</span>
        <strong>PLAZO CRÍTICO:</strong> Si le negaron la discapacidad, tiene solo <strong>60 días</strong> para apelar. No pierda su derecho. Llame ahora: <a href="tel:8336574812">(833) 657-4812</a>
      </div>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroLeft}>
            <div className={styles.badge}>
              <span>🇺🇸</span>
              <span>Abogados en Español — Florida</span>
            </div>
            <h1 className={styles.heroTitle}>
              ¿Le Negaron su{" "}
              <span className={styles.accent}>Discapacidad</span>{" "}
              del Seguro Social?
            </h1>
            <p className={styles.heroSubtitle}>
              Louis Law Group ayuda a familias hispanohablantes en toda Florida a obtener los
              beneficios de discapacidad que merecen. <strong>Consulta gratis. Sin pago por adelantado.</strong>
            </p>
            <div className={styles.trustRow}>
              <div className={styles.trustItem}>
                <span className={styles.trustNum}>$0</span>
                <span className={styles.trustLabel}>Por adelantado</span>
              </div>
              <div className={styles.trustDivider} />
              <div className={styles.trustItem}>
                <span className={styles.trustNum}>60 días</span>
                <span className={styles.trustLabel}>Para apelar una negación</span>
              </div>
              <div className={styles.trustDivider} />
              <div className={styles.trustItem}>
                <span className={styles.trustNum}>Solo pagamos</span>
                <span className={styles.trustLabel}>Si ganamos su caso</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className={styles.heroRight}>
            <div className={styles.formCard}>
              <div className={styles.formHeader}>
                <span className={styles.formBadge}>CONSULTA GRATIS</span>
                <h2 className={styles.formTitle}>Evalúe Su Caso Ahora</h2>
                <p className={styles.formSubtitle}>Sin costo. Sin compromiso. Hablamos español.</p>
              </div>

              {formStatus === "error" && (
                <p className={styles.formError}>
                  Por favor ingrese un número de teléfono válido de EE. UU. e intente de nuevo.
                </p>
              )}

              {formStatus === "submitting" ? (
                <div className={styles.spinner}>Enviando...</div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  {/* Honeypot */}
                  <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0 }} aria-hidden="true">
                    <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <input type="text" name="name" placeholder="Nombre completo" value={formData.name} onChange={handleChange} required className={styles.input} />
                    </div>
                    <div className={styles.field}>
                      <input type="tel" name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange} required className={styles.input} />
                    </div>
                    <div className={styles.field}>
                      <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} required className={styles.input} />
                    </div>
                    <div className={styles.field}>
                      <input type="text" name="zipcode" placeholder="Código postal" value={formData.zipcode} onChange={handleChange} required className={styles.input} />
                    </div>
                  </div>

                  <textarea
                    name="description"
                    placeholder="Cuéntenos brevemente sobre su situación (ej: me negaron el seguro social, tengo una condición médica...)"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className={styles.textarea}
                  />

                  <div className={styles.checkboxRow}>
                    <input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} required id="consent-es" />
                    <label htmlFor="consent-es" className={styles.checkboxLabel}>
                      Al enviar este formulario, consiento recibir comunicaciones de Louis Law Group al número proporcionado. Consulte nuestra{" "}
                      <a href="https://www.louislawgroup.com/privacy-policy" target="_blank" rel="noopener noreferrer">Política de Privacidad</a>.
                    </label>
                  </div>

                  <button type="submit" className={styles.submitBtn}>
                    Solicitar Consulta Gratis →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SOL Urgency Section */}
      <section className={styles.solSection}>
        <div className="container">
          <div className={styles.solCard}>
            <div className={styles.solIcon}>⏰</div>
            <div className={styles.solContent}>
              <h2 className={styles.solTitle}>El Tiempo Es Crucial — Plazos Legales en Florida</h2>
              <div className={styles.solGrid}>
                <div className={styles.solItem}>
                  <strong>Denegación inicial</strong>
                  <span>60 días para pedir reconsideración</span>
                </div>
                <div className={styles.solItem}>
                  <strong>Denegación en reconsideración</strong>
                  <span>60 días para solicitar audiencia con juez (ALJ)</span>
                </div>
                <div className={styles.solItem}>
                  <strong>Denegación del ALJ</strong>
                  <span>60 días para apelar al Consejo de Apelaciones</span>
                </div>
                <div className={styles.solItem}>
                  <strong>Si pierde todos los plazos</strong>
                  <span>Debe comenzar desde cero — pierde años de pagos atrasados</span>
                </div>
              </div>
              <p className={styles.solWarning}>
                <strong>⚠️ Los plazos se cuentan desde la fecha en que recibió la carta de denegación.</strong>{" "}
                No espere. Llame al <a href="tel:8336574812">(833) 657-4812</a> ahora mismo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Qualifies */}
      <section className={styles.qualifySection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>¿Quién Puede Calificar para Beneficios por Discapacidad?</h2>
          <p className={styles.sectionSubtitle}>
            Si usted o un familiar en Florida tiene alguna de estas condiciones, puede tener derecho a beneficios del Seguro Social.
          </p>
          <div className={styles.conditionsGrid}>
            {[
              "Problemas de espalda / columna vertebral",
              "Diabetes y complicaciones",
              "Enfermedades cardíacas",
              "Depresión / ansiedad severa",
              "Artritis / dolor crónico",
              "Cáncer",
              "PTSD / trauma",
              "Enfermedad renal",
              "Lupus / enfermedades autoinmunes",
              "Lesiones laborales permanentes",
              "Condiciones neurológicas",
              "Otras enfermedades crónicas",
            ].map((cond) => (
              <div key={cond} className={styles.conditionItem}>
                <span className={styles.checkmark}>✓</span>
                <span>{cond}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Cómo Funciona — 3 Pasos Simples</h2>
          <div className={styles.stepsGrid}>
            <div className={styles.step}>
              <div className={styles.stepNum}>1</div>
              <h3>Consulta Gratis</h3>
              <p>Llame, escriba o complete el formulario. Un abogado en español revisará su caso sin costo.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>2</div>
              <h3>Nosotros Manejamos Todo</h3>
              <p>Recopilamos sus registros médicos, completamos el papeleo y representamos su caso ante la Administración del Seguro Social.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>3</div>
              <h3>Usted Recibe Sus Beneficios</h3>
              <p>Si ganamos, usted recibe sus pagos mensuales y pagos atrasados desde la fecha de inicio de su discapacidad. Solo cobramos si ganamos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className={styles.citiesSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Representamos Clientes en Toda Florida</h2>
          <p className={styles.sectionSubtitle}>Atendemos en español a familias en las siguientes ciudades y sus alrededores:</p>
          <div className={styles.citiesGrid}>
            {cities.map((city) => (
              <div key={city} className={styles.cityItem}>
                <span className={styles.cityPin}>📍</span>
                <span>{city}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faqSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Preguntas Frecuentes</h2>
          <div className={styles.faqList}>
            {faqs.map((faq, i) => (
              <div key={i} className={`${styles.faqItem} ${openFaq === i ? styles.faqOpen : ""}`}>
                <button className={styles.faqQuestion} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  <span className={styles.faqArrow}>{openFaq === i ? "▲" : "▼"}</span>
                </button>
                {openFaq === i && <div className={styles.faqAnswer}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaBox}>
            <h2 className={styles.ctaTitle}>No Espere Más — Cada Día Cuenta</h2>
            <p className={styles.ctaText}>
              Miles de familias hispanas en Florida pierden sus beneficios de discapacidad cada año por no apelar a tiempo.
              Nuestros abogados hablan español y están listos para ayudarle hoy.
            </p>
            <div className={styles.ctaBtns}>
              <a href="tel:8336574812" className={styles.ctaCall}>
                📞 Llamar Ahora: (833) 657-4812
              </a>
              <a href="sms:8336574812" className={styles.ctaText2}>
                💬 Enviar Mensaje de Texto
              </a>
            </div>
            <p className={styles.ctaDisclaimer}>
              Consulta completamente gratis · Sin pago por adelantado · Solo cobramos si ganamos
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
