"use client";

import { useId, useState } from "react";
import styles from "./guided.module.css";

export const eur = (n: number) => `${Math.round(n).toLocaleString("fr-FR")} €`;
export const plural = (n: number, one: string, many: string) => `${n} ${n > 1 ? many : one}`;
export const cx = (...names: (string | false | null | undefined)[]) => names.filter(Boolean).join(" ");

/** Gros bouton de choix. L'état sélectionné est porté par aria-pressed et par une coche, pas seulement par la couleur. */
export function ChoiceButton({ selected, onSelect, children, hint }: { selected: boolean; onSelect: () => void; children: React.ReactNode; hint?: string }) {
  return (
    <button type="button" aria-pressed={selected} onClick={onSelect} className={cx(styles.choice, selected && styles.choiceOn)}>
      <span aria-hidden="true" className={styles.choiceMark}>{selected ? "✓" : ""}</span>
      <span className={styles.choiceBody}>
        <span>{children}</span>
        {hint && <span className={styles.choiceHint}>{hint}</span>}
      </span>
    </button>
  );
}

/** Champ numérique avec boutons moins et plus. `label` est toujours lu par les lecteurs d'écran. */
export function NumberStepper({ label, value, onChange, min = 0, max = 999, big, hideLabel, unit }: { label: string; value: number; onChange: (value: number) => void; min?: number; max?: number; big?: boolean; hideLabel?: boolean; unit?: string }) {
  const id = useId();
  const clamp = (n: number) => Math.min(max, Math.max(min, Math.round(n)));
  return (
    <div>
      <label htmlFor={id} className={hideLabel ? styles.srOnly : styles.label} style={hideLabel ? undefined : { display: "block", marginBottom: 8 }}>{label}</label>
      <div className={cx(styles.stepper, big && styles.stepperBig)}>
        <button type="button" className={styles.stepperBtn} onClick={() => onChange(clamp(value - 1))} disabled={value <= min} aria-label={`Diminuer : ${label}`}>−</button>
        <input
          id={id}
          className={styles.stepperInput}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={Number.isFinite(value) ? value : ""}
          onChange={(event) => onChange(event.target.value === "" ? min : clamp(Number(event.target.value)))}
        />
        <button type="button" className={styles.stepperBtn} onClick={() => onChange(clamp(value + 1))} disabled={value >= max} aria-label={`Augmenter : ${label}`}>+</button>
        {unit && <span aria-hidden="true" style={{ color: "var(--faint)", fontSize: 14 }}>{unit}</span>}
      </div>
    </div>
  );
}

export function MoneyField({ label, hint, value, onChange, invalid }: { label: string; hint?: string; value: number | null; onChange: (value: number | null) => void; invalid?: boolean }) {
  const id = useId();
  // Saisie en cours : permet de vider le champ même quand le parent retombe sur une valeur par défaut.
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>{label}</label>
      <div className={styles.moneyWrap}>
        <input
          id={id}
          className={cx(styles.input, invalid && styles.inputInvalid)}
          type="number"
          inputMode="decimal"
          min={0}
          value={draft ?? value ?? ""}
          aria-invalid={invalid || undefined}
          aria-describedby={hint ? `${id}-hint` : undefined}
          onChange={(event) => {
            setDraft(event.target.value);
            onChange(event.target.value === "" ? null : Math.max(0, Number(event.target.value)));
          }}
          onBlur={() => setDraft(null)}
        />
        <span aria-hidden="true" className={styles.moneyUnit}>€</span>
      </div>
      {hint && <span id={`${id}-hint`} className={styles.fieldHint}>{hint}</span>}
    </div>
  );
}

export function TextField({ label, value, onChange, type = "text", required, invalid, autoComplete, hint, multiline }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; invalid?: boolean; autoComplete?: string; hint?: string; multiline?: boolean }) {
  const id = useId();
  const shared = {
    id,
    value,
    required,
    autoComplete,
    "aria-invalid": invalid || undefined,
    "aria-describedby": hint ? `${id}-hint` : undefined,
  };
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>{label}{required ? "" : " (facultatif)"}</label>
      {multiline
        ? <textarea {...shared} className={cx(styles.textarea, invalid && styles.inputInvalid)} onChange={(event) => onChange(event.target.value)} />
        : <input {...shared} type={type} className={cx(styles.input, invalid && styles.inputInvalid)} onChange={(event) => onChange(event.target.value)} />}
      {hint && <span id={`${id}-hint`} className={styles.fieldHint}>{hint}</span>}
    </div>
  );
}

/** Choix exclusif entre deux ou trois options courtes. */
export function ToggleGroup<T extends string>({ legend, hint, value, onChange, options }: { legend: string; hint?: string; value: T; onChange: (value: T) => void; options: { value: T; label: string }[] }) {
  return (
    <fieldset className={styles.fieldset}>
      <legend>{legend}</legend>
      {hint && <p className={styles.fieldHint} style={{ margin: "0 0 10px" }}>{hint}</p>}
      <div className={styles.toggle}>
        {options.map((option) => (
          <button key={option.value} type="button" aria-pressed={value === option.value} onClick={() => onChange(option.value)} className={cx(styles.toggleBtn, value === option.value && styles.toggleOn)}>
            {value === option.value ? "✓ " : ""}{option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function Callout({ tone = "info", children }: { tone?: "info" | "warn" | "error"; children: React.ReactNode }) {
  return (
    <div role={tone === "error" ? "alert" : "note"} className={cx(styles.callout, tone === "warn" && styles.calloutWarn, tone === "error" && styles.calloutError)}>
      <span aria-hidden="true" className={styles.calloutIcon}>{tone === "info" ? "ℹ" : "!"}</span>
      <div>{children}</div>
    </div>
  );
}
