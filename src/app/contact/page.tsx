import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import { contactDestinations, contactTopics } from "./options";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Décrivez votre projet en quelques lignes. Nous revenons vers vous rapidement avec un premier cadrage adapté à votre projet.",
};

type ContactSearch = {
  objet?: string | string[];
  destination?: string | string[];
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function ContactPage({ searchParams }: { searchParams: Promise<ContactSearch> }) {
  const params = await searchParams;
  const topic = first(params.objet);
  const destination = first(params.destination);
  return (
    <ContactForm
      initialTopic={contactTopics.includes(topic) ? topic : ""}
      initialDestination={contactDestinations.includes(destination) ? destination : ""}
    />
  );
}
