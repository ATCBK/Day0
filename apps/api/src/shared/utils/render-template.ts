export function renderTemplate(template: string, vars: Record<string, unknown>): string {
  return template.replace(/\$\{vars\.([a-zA-Z0-9_]+)\}/g, (_, key) => String(vars[key] ?? ""));
}
