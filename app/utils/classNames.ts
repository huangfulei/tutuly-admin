export function classNames(
  ...classNames: Array<string | number | boolean | undefined | null>
) {
  return classNames.filter(Boolean).join(" ");
}
