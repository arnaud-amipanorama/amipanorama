import { redirect } from "next/navigation";

// La page /services a été retirée : son périmètre est couvert par /notre-programme.
// Redirection permanente pour ne laisser aucun lien mort.
export default function ServicesPage() {
  redirect("/notre-programme");
}
