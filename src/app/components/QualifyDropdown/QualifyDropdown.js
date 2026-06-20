"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Hammer, Accessibility, Car, ShieldCheck, ChevronDown } from "lucide-react";
import { QUALIFY_OPTIONS_EN, QUALIFY_OPTIONS_ES } from "./qualifyOptions";
import styles from "./QualifyDropdown.module.css";

const ICONS = { Home, Hammer, Accessibility, Car, ShieldCheck };

/**
 * Generic "See If You Qualify" control that asks the client which issue they're
 * having and routes them to the correct qualifier instead of a generic page.
 *
 * Props:
 *   variant="dropdown" (default) — a button that expands an issue list (use in nav)
 *   variant="cards" — always-open card grid (use on /free-case-evaluation)
 *   onNavigate — optional callback fired when an option is chosen (e.g. close mobile menu)
 */
export default function QualifyDropdown({ variant = "dropdown", onNavigate }) {
  const pathname = usePathname() || "";
  const isES = /\b(abogado|abogados|discapacidad|calificar|reclamos-propiedad|seguro-social|negaron)\b/.test(pathname);
  const options = isES ? QUALIFY_OPTIONS_ES : QUALIFY_OPTIONS_EN;

  const [open, setOpen] = useState(variant === "cards");
  const ref = useRef(null);

  // Close dropdown on outside click / Escape
  useEffect(() => {
    if (variant === "cards") return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [variant]);

  const label = isES ? "Vea Si Califica — Gratis" : "See If You Qualify — Free";
  const prompt = isES ? "¿Con qué tipo de caso necesita ayuda?" : "What can we help you with?";

  const list = (
    <ul className={variant === "cards" ? styles.cardGrid : styles.menu} role="menu">
      {options.map((o) => {
        const Icon = ICONS[o.icon] || Home;
        return (
          <li key={o.key} role="none">
            <Link
              href={o.href}
              className={variant === "cards" ? styles.card : styles.item}
              role="menuitem"
              onClick={() => { setOpen(variant === "cards"); onNavigate && onNavigate(); }}
            >
              <span className={styles.itemIcon}><Icon size={variant === "cards" ? 26 : 20} strokeWidth={1.6} /></span>
              <span className={styles.itemText}>
                <span className={styles.itemLabel}>{o.label}</span>
                <span className={styles.itemDesc}>{o.desc}</span>
              </span>
              <span className={styles.itemArrow}>→</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  if (variant === "cards") {
    return (
      <div className={styles.cardsWrap}>
        <p className={styles.cardsPrompt}>{prompt}</p>
        {list}
      </div>
    );
  }

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <ChevronDown size={18} className={open ? styles.caretOpen : styles.caret} />
      </button>
      {open && (
        <div className={styles.panel}>
          <p className={styles.panelPrompt}>{prompt}</p>
          {list}
        </div>
      )}
    </div>
  );
}
