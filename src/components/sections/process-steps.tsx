export function ProcessSteps({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, i) => (
        <li key={step.title} className="card reveal p-6">
          <span className="font-display text-sm font-semibold tabular-nums text-pulse-300" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="text-h3 mt-3">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
