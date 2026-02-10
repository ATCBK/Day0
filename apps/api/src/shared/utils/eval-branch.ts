export function evalBranch(expression: string, vars: Record<string, unknown>): boolean {
  if (expression.includes(" contains ")) {
    const [left, right] = expression.split(" contains ");
    const lv = String(vars[left.trim()] ?? "");
    return lv.includes(right.trim().replaceAll("'", ""));
  }
  if (expression.includes("==")) {
    const [left, right] = expression.split("==");
    const lv = String(vars[left.trim()] ?? "");
    const rv = right.trim().replaceAll("'", "");
    return lv === rv;
  }
  return false;
}
