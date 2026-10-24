import Link from "next/link";
import { ArrowIcon } from "@/components/ui/icons";

export function CtaBand({ title, text, href, label }: { title: string; text: string; href: string; label: string }) {
  return (
    <section className="section">
      <div className="container-page">
        <div className="card reveal relative overflow-hidden px-6 py-12 text-center md:px-12 md:py-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(76_125_255/0.22),transparent_60%)]" aria-hidden="true" />
          <h2 className="text-h2 relative mx-auto max-w-2xl text-balance">{title}</h2>
          <p className="text-lead relative mx-auto mt-4 max-w-xl">{text}</p>
          <Link href={href} className="btn btn-primary relative mt-8">
            {label}
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
