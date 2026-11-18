// MySQL JSON columns can arrive as arrays or JSON strings. Render them as plain React text.
function records(value) {
  try {
    const array = typeof value === "string" ? JSON.parse(value) : value;
    return Array.isArray(array)
      ? array.filter(
          (item) => item && typeof item === "object" && !Array.isArray(item),
        )
      : [];
  } catch {
    return [];
  }
}
export function normalizeParseResult(result) {
  if (!result) return null;
  return {
    ...result,
    skills: records(result.parsed_skills ?? result.parsed_skills_json),
    experience: records(
      result.parsed_experience ?? result.parsed_experience_json,
    ),
    education: records(result.parsed_education ?? result.parsed_education_json),
  };
}
export function resultText(value) {
  return ["string", "number", "boolean"].includes(typeof value)
    ? String(value)
    : "";
}
