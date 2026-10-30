import { resultText } from "../../utils/parseResult";
const groups = [
  [
    "skills",
    "Skills discovered",
    ["skill_name", "proficiency_level", "years_of_experience"],
  ],
  [
    "experience",
    "Experience discovered",
    ["job_title", "company_name", "start_date", "end_date", "description"],
  ],
  [
    "education",
    "Education discovered",
    [
      "qualification",
      "institute_name",
      "field_of_study",
      "start_date",
      "end_date",
      "grade",
      "description",
    ],
  ],
];
export default function ParseResult({ result }) {
  return (
    <section className="parse-results">
      <div className="parse-result-summary">
        <span className="eyebrow">ANALYSIS / SAVED INSIGHTS</span>
        <h2>A clearer picture.</h2>
        <p>
          {result.file_name
            ? `Source: ${result.file_name}`
            : `Source document ID: ${result.resume_id}`}
        </p>
        {result.parse_mode && (
          <p>Mode: {result.parse_mode.replaceAll("_", " ")}</p>
        )}
        <p>
          Review these suggestions against your document. Your profile is not
          changed automatically.
        </p>
      </div>
      <div className="parse-counts">
        {groups.map(([key, title]) => (
          <div key={key}>
            <strong>{result[key].length}</strong>
            <span>{title}</span>
          </div>
        ))}
      </div>
      {groups.map(([key, title, fields]) => (
        <section className="seeker-panel" key={key}>
          <h3>{title}</h3>
          {!result[key].length ? (
            <p className="muted">No {key} returned in this analysis.</p>
          ) : (
            <div className="parsed-records">
              {result[key].map((item, index) => (
                <dl key={index}>
                  {fields.map(
                    (field) =>
                      resultText(item[field]) !== "" && (
                        <div key={field}>
                          <dt>{field.replaceAll("_", " ")}</dt>
                          <dd>{resultText(item[field])}</dd>
                        </div>
                      ),
                  )}
                </dl>
              ))}
            </div>
          )}
        </section>
      ))}
      {result.skipped_documents?.length > 0 && (
        <section className="seeker-panel">
          <h3>Skipped documents</h3>
          {result.skipped_documents.map((item, index) => (
            <p key={index}>
              {resultText(item.file_name)}: {resultText(item.reason)}
            </p>
          ))}
        </section>
      )}
      {result.extracted_text && (
        <details className="extracted-text">
          <summary>View extracted document text</summary>
          <pre>{result.extracted_text}</pre>
        </details>
      )}
    </section>
  );
}
