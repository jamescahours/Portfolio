import initial from "../content/site.json";
export const projectStyles = [
  {
    className: "project-card project-card-wide project-site",
    label: "Software (wide)",
  },
  { className: "project-card project-automation", label: "Automation" },
  { className: "project-card project-deck", label: "Home & DIY" },
  { className: "project-card project-music", label: "Music" },
];
export type SiteContent = typeof initial;
export function validateContent(input: unknown): SiteContent {
  function check(value: unknown, template: unknown, path: string): void {
    if (typeof template === "string") {
      if (typeof value !== "string" || value.length > 5000 || !value.trim())
        throw new Error(`${path} must contain between 1 and 5,000 characters.`);
    } else if (Array.isArray(template)) {
      if (!Array.isArray(value) || value.length < 1 || value.length > 30)
        throw new Error(`${path} must contain between 1 and 30 items.`);
      value.forEach((item, index) =>
        check(item, template[0], `${path}.${index + 1}`),
      );
    } else {
      if (!value || typeof value !== "object" || Array.isArray(value))
        throw new Error(`${path} is invalid.`);
      const object = value as Record<string, unknown>,
        expected = template as Record<string, unknown>;
      if (Object.keys(object).some((key) => !(key in expected)))
        throw new Error(`${path} has unexpected fields.`);
      Object.entries(expected).forEach(([key, item]) =>
        check(object[key], item, `${path}.${key}`),
      );
    }
  }
  check(input, initial, "Content");
  const data = input as SiteContent;
  if (!/^https:\/\//.test(data.contact.github))
    throw new Error("GitHub link must start with https://.");
  try {
    new URL(data.contact.github);
  } catch {
    throw new Error("GitHub link is invalid.");
  }
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(data.contact.email))
    throw new Error("Enter a valid email address.");
  if (data.categories.some((item) => !/^#[a-zA-Z][\w-]*$/.test(item.href)))
    throw new Error(
      "Category links must be section anchors, such as #projects.",
    );
  const styles = projectStyles.map((item) => item.className);
  if (data.projects.some((item) => !styles.includes(item.className)))
    throw new Error("Choose a supported project style.");
  return data;
}
