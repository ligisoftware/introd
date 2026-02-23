export function orEmpty(s: string | null | undefined): string {
  return s ?? "";
}

export const inputClass =
  "w-full rounded-ds border border-ds-border bg-ds-surface px-3.5 py-2.5 text-ds-text placeholder-ds-text-subtle transition-[border-color,box-shadow] duration-ds-fast ease-ds focus:border-ds-accent focus:outline-none focus:ring-2 focus:ring-ds-accent/20 disabled:bg-ds-surface-hover disabled:text-ds-text-subtle";

export const labelClass = "block text-sm font-medium text-ds-text-muted";

export const sectionTitle = "text-sm font-semibold uppercase tracking-wider text-ds-text-subtle";

export const btnPrimary =
  "rounded-ds bg-ds-accent px-4 py-2.5 text-sm font-medium text-ds-text-inverse shadow-ds-sm transition-[color,box-shadow,transform] duration-ds ease-ds hover:bg-ds-accent-hover hover:shadow-ds focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

export const btnSecondary =
  "rounded-ds border border-ds-border bg-ds-surface px-4 py-2.5 text-sm font-medium text-ds-text transition-[color,box-shadow,transform] duration-ds ease-ds hover:bg-ds-surface-hover hover:shadow-ds focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
