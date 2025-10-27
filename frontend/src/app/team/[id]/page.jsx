import { fetchAdvisersById } from "../FetchAdvisers";
import { notFound } from "next/navigation";
import TeamPageReal from "./TeamPageReal";

export default async function TeamPage({ params }) {
  const { id } = params;
  const adviser = await fetchAdvisersById(id);

  if (!adviser) return notFound();

  return (
    <TeamPageReal adviser={adviser} />
  );
}