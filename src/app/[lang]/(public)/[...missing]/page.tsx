import { notFound } from "next/navigation";

/** Any unknown URL renders the bilingual 404 page inside the normal site layout. */
export default function CatchAll() {
  notFound();
}
