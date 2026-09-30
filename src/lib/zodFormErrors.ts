import type { ZodIssue } from "zod/v3";

export function zodFieldErrors(issues: readonly ZodIssue[]): Record<string, string> {
  const errors: Record<string, string> = {};
  issues.forEach((issue) => {
    const key = issue.path.join('.');
    if (key && !errors[key]) {
      errors[key] = issue.message;
    }
  });
  return errors;
}
