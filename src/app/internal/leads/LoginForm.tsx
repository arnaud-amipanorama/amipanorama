"use client";

import { useActionState } from "react";
import { signInLeads } from "./actions";
import styles from "./leads.module.css";

export default function LoginForm() {
  const [state, action, pending] = useActionState(
    async (_previous: { error: string }, formData: FormData) => (await signInLeads(formData)) ?? { error: "" },
    { error: "" },
  );

  return (
    <form action={action} className={styles.login}>
      <label>
        E-mail professionnel AMI
        <input name="email" type="email" autoComplete="email" required placeholder="prenom@amipanorama.com" />
      </label>
      {state.error && <p role="alert">{state.error}</p>}
      <button type="submit" disabled={pending}>{pending ? "Vérification…" : "Entrer"}</button>
    </form>
  );
}
