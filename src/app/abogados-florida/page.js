"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default function AbogadosFlorida() {
  const router = useRouter();
  const formLoadTime = useRef(Date.now());
  const [formData, setFormData] = useState({
    name: "", phone: "", zipcode: "", email: "", caseType: "", description: "", consent: false,
  });
  const [honeypot, setHoneypot] = useState("");
  const [formStatus, setFormStatus] = useState("idle");
  const [openFaq, setOpenFaq] = useState(null);

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
    if (digits.length < 10 || area[0] === "0" || area[0] === "1") { setFormStatus("error"); return; }
    setFormStatus("submitting");
    try {
      const res = await fetch("https://dev-n8n.louislawgroup.com/webhook/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name, phone: formData.phone, zipcode: formData.zipcode,
          email: formData.email, caseType: formData.caseType || "General Consultation",
          description: `[ESPAÑOL] ${formData.description}`,
          consent: formData.consent ? "Yes" : "No",
          source: "abogados-florida",
        }),
      });
      if (!res.ok) throw new Error("Error");
      setFormStatus("success");
    } catch { setFormStatus("error"); }
  };

  useEffect(() => {
    if (formStatus === "success") router.push("https://www.louislawgroup.com/thank-you");
  }, [formStatus, router]);

  const practiceAreas = [
    { icon: "🏠", title: "Daños a la Propiedad", desc: "Daño por agua, huracán, techo, moho. Peleamos contra aseguradoras que no pagan." },
    { icon: "♿", title: "Discapacidad (SSDI/SSI)", desc: "Le negaron sus beneficios del Seguro Social. Apele antes de que venzan los 60 días.", link: "/abogado-discapacidad-florida" },
    { icon: "🚗", title: "Accidentes de Auto", desc: "Lesiones en accidentes de carro en Florida. Compensación por daños médicos y perdidas." },
    { icon: "⚖️", title: "Lesiones Personales", desc: "Accidentes de trabajo, resbalones, negligencia médica. Evaluación gratis hoy." },
    { icon: "🔒", title: "Privacidad Digital", desc: "Empresas que rastrearon su actividad en línea sin permiso. Puede tener derecho a compensación." },
    { icon: "📋", title: "Otras Áreas", desc: "Consulte con nosotros sobre cualquier situación legal. Primera llamada siempre gratis." },
  ];

  const cities = [
    { city: "Miami", desc: "Mayor ciudad hispanohablante de Florida" },
    { city: "Hialeah", desc: "70%+ de residentes de habla hispana" },
    { city: "Kissimmee", desc: "Comunidad puertorriqueña y centroamericana" },
    { city: "Orlando", desc: "Área metropolitana de rápido crecimiento hispano" },
    { city: "Tampa", desc: "Comunidad cubana e hispana establecida" },
    { city: "West Palm Beach", desc: "Gran población hispana del sur de Florida" },
    { city: "Fort Lauderdale", desc: "Diversa comunidad latinoamericana" },
    { city: "Jacksonville", desc: "Creciente comunidad hispanohablante" },
  ];

  const faqs = [
    { q: "¿La consulta realmente es gratis?", a: "Sí. La primera consulta con nuestros abogados no tiene ningún costo. No le pedimos dinero por adelantado. Solo cobramos si ganamos su caso." },
    { q: "¿Hablan español en Louis Law Group?", a: "Sí. Contamos con personal bilingüe que atiende en español. Puede comunicarse con nosotros en el idioma que le sea más cómodo." },
    { q: "¿Cuánto cobran los abogados?", a: "Trabajamos en contingencia para la mayoría de los casos. Eso significa $0 por adelantado. Si ganamos, nuestros honorarios se toman de la compensación obtenida — usted no pone dinero de su bolsillo." },
    { q: "¿Qué tipos de casos manejan?", a: "Manejamos daños a la propiedad (seguros de hogar), discapacidad del Seguro Social (SSDI/SSI), accidentes de auto, lesiones personales, y casos de privacidad digital. Si no estamos seguros de poder ayudarle, se lo decimos desde el principio." },
    { q: "¿Puedo tener una consulta por teléfono o por video?", a: "Sí. Ofrecemos consultas por teléfono, videollamada o en persona en Florida. Elija el método que le resulte más conveniente." },
  ];

  return (
    <div className={styles.page}>

      {/* Urgency Banner */}
      <div className={styles.urgencyBanner}>
        <strong>¡Atención!</strong> Muchos casos legales tienen plazos estrictos. No espere para consultar. Llame ahora: <a href="tel:8336574812">(833) 657-4812</a>
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
              Consulta con un{" "}
              <span className={styles.accent}>Abogado Gratis</span>{" "}
              en Florida
            </h1>
            <p className={styles.heroSubtitle}>
              Louis Law Group ofrece consultas gratuitas en español para residentes de Florida.
              Manejamos casos de daños a la propiedad, discapacidad, accidentes y más.{" "}
              <strong>Sin pago por adelantado. Solo cobramos si ganamos.</strong>
            </p>
            <div className={styles.trustRow}>
              <div className={styles.trustItem}>
                <span className={styles.trustNum}>$0</span>
                <span className={styles.trustLabel}>Consulta gratis</span>
              </div>
              <div className={styles.trustDivider} />
              <div className={styles.trustItem}>
                <span className={styles.trustNum}>En español</span>
                <span className={styles.trustLabel}>Atención bilingüe</span>
              </div>
              <div className={styles.trustDivider} />
              <div className={styles.trustItem}>
                <span className={styles.trustNum}>Sin riesgo</span>
                <span className={styles.trustLabel}>Solo pagamos si ganamos</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className={styles.heroRight}>
            <div className={styles.formCard}>
              <div className={styles.formHeader}>
                <span className={styles.formBadge}>CONSULTA GRATIS</span>
                <h2 className={styles.formTitle}>Hable con un Abogado Hoy</h2>
                <p className={styles.formSubtitle}>Respuesta rápida · Hablamos español · Sin costo</p>
              </div>

              {formStatus === "error" && (
                <p className={styles.formError}>Por favor ingrese un número de teléfono válido de EE. UU.</p>
              )}

              {formStatus === "submitting" ? (
                <div className={styles.spinner}>Enviando su consulta...</div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0 }} aria-hidden="true">
                    <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className={styles.formGrid}>
                    <input type="text" name="name" placeholder="Nombre completo" value={formData.name} onChange={handleChange} required className={styles.input} />
                    <input type="tel" name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange} required className={styles.input} />
                    <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} required className={styles.input} />
                    <input type="text" name="zipcode" placeholder="Código postal" value={formData.zipcode} onChange={handleChange} required className={styles.input} />
                  </div>

                  <select name="caseType" value={formData.caseType} onChange={handleChange} className={`${styles.input} ${formData.caseType === "" ? styles.placeholder : ""}`}>
                    <option value="">¿Qué tipo de caso tiene? (opcional)</option>
                    <option value="Property Damage">Daños a la propiedad / Seguro de hogar</option>
                    <option value="SSDI">Discapacidad del Seguro Social (SSDI/SSI)</option>
                    <option value="Personal Injury">Accidente de auto / Lesiones personales</option>
                    <option value="Privacy">Privacidad digital</option>
                    <option value="Other">Otro / No estoy seguro</option>
                  </select>

                  <textarea name="description" placeholder="Describa brevemente su situación (opcional)" value={formData.description} onChange={handleChange} rows={3} className={styles.textarea} />

                  <div className={styles.checkboxRow}>
                    <input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} required id="consent-es2" />
                    <label htmlFor="consent-es2" className={styles.checkboxLabel}>
                      Consiento recibir comunicaciones de Louis Law Group. Ver{" "}
                      <a href="https://www.louislawgroup.com/privacy-policy" target="_blank" rel="noopener noreferrer">Política de Privacidad</a>.
                    </label>
                  </div>

                  <button type="submit" className={styles.submitBtn}>Solicitar Consulta Gratis →</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Practice Areas */}
      <section className={styles.areasSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Áreas de Práctica — Atendemos en Español</h2>
          <p className={styles.sectionSubtitle}>Representamos a familias hispanohablantes en toda Florida en estas áreas:</p>
          <div className={styles.areasGrid}>
            {practiceAreas.map((area) => (
              <div key={area.title} className={styles.areaCard}>
                <span className={styles.areaIcon}>{area.icon}</span>
                <h3 className={styles.areaTitle}>{area.title}</h3>
                <p className={styles.areaDesc}>{area.desc}</p>
                {area.link && (
                  <Link href={area.link} className={styles.areaLink}>Ver más →</Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why LLG */}
      <section className={styles.whySection}>
        <div className="container">
          <div className={styles.whyGrid}>
            <div className={styles.whyContent}>
              <h2 className={styles.sectionTitle} style={{ textAlign: "left" }}>¿Por Qué Elegir Louis Law Group?</h2>
              <ul className={styles.whyList}>
                <li><span className={styles.whyCheck}>✓</span> Atención completa en español — sin barreras de idioma</li>
                <li><span className={styles.whyCheck}>✓</span> Sin pago por adelantado en la mayoría de los casos</li>
                <li><span className={styles.whyCheck}>✓</span> Conocemos las leyes de Florida y luchamos por nuestros clientes</li>
                <li><span className={styles.whyCheck}>✓</span> Consulta gratis — evaluamos su caso sin compromiso</li>
                <li><span className={styles.whyCheck}>✓</span> Representamos clientes en todo el estado de Florida</li>
                <li><span className={styles.whyCheck}>✓</span> Experiencia en casos contra grandes aseguradoras</li>
              </ul>
              <a href="tel:8336574812" className={styles.ctaCallInline}>📞 (833) 657-4812 — Llame Ahora</a>
            </div>
            <div className={styles.whyStats}>
              <div className={styles.statBox}>
                <span className={styles.statNum}>$0</span>
                <span className={styles.statLabel}>Costo inicial para empezar</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNum}>60 días</span>
                <span className={styles.statLabel}>Plazo para apelar negaciones de SSDI</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNum}>Florida</span>
                <span className={styles.statLabel}>Representamos clientes en todo el estado</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className={styles.citiesSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Ciudades Donde Atendemos en Español</h2>
          <div className={styles.citiesGrid}>
            {cities.map(({ city, desc }) => (
              <div key={city} className={styles.cityCard}>
                <h3 className={styles.cityName}>📍 {city}</h3>
                <p className={styles.cityDesc}>{desc}</p>
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
            <h2 className={styles.ctaTitle}>¿Necesita un Abogado en Florida? Hable con Nosotros Hoy — Gratis</h2>
            <p className={styles.ctaSubtitle}>Sin costo. Sin compromiso. Atendemos en español.</p>
            <div className={styles.ctaBtns}>
              <a href="tel:8336574812" className={styles.ctaCall}>📞 (833) 657-4812</a>
              <a href="sms:8336574812" className={styles.ctaSms}>💬 Enviar Texto</a>
            </div>
            <p className={styles.ctaNote}>Consulta gratis · Sin pago adelantado · Solo cobramos si ganamos</p>
          </div>
        </div>
      </section>

    </div>
  );
}
