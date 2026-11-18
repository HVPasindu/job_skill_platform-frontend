import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { companyFields, companyPayload } from "../../data/employerFields";
import { employerService } from "../../services/employerService";
import { fileUrl } from "../../utils/seekerFiles";
import { externalUrl } from "../../utils/jobFormat";
import EditorDialog from "../../components/employer/EditorDialog";
import Button from "../../components/ui/Button";
export default function CompanyProfile() {
  const { company, refreshCompany, isOwner } = useOutletContext();
  const [editing, setEditing] = useState(false);
  return (
    <>
      <section className="company-profile-hero">
        <div>
          {fileUrl(company.logo_url) && (
            <img
              className="company-large-logo"
              src={fileUrl(company.logo_url)}
              alt={`${company.company_name} logo`}
            />
          )}
          <span className="eyebrow">THE PEOPLE BEHIND WHAT'S NEXT</span>
          <h1>{company.company_name}</h1>
          <p>
            {company.description ||
              "Tell the world what your company is here to build."}
          </p>
          <Button onClick={() => setEditing(true)}>Edit company ↗</Button>
        </div>
        <aside>
          <span>Your membership</span>
          <strong>{company.company_role}</strong>
          <p>
            {isOwner
              ? "Manage your company, people, jobs and candidates."
              : "Manage company details, jobs and candidates. Update your own team profile."}
          </p>
        </aside>
      </section>
      <section className="seeker-panel">
        <h2>A little about the company.</h2>
        <dl className="company-facts">
          {[
            ["Industry", company.industry],
            ["Company size", company.company_size],
            ["Email", company.company_email],
            ["Phone", company.company_phone],
            [
              "Address",
              [company.address_line, company.city, company.country]
                .filter(Boolean)
                .join(", "),
            ],
          ].map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value || "Not specified"}</dd>
            </div>
          ))}
          {externalUrl(company.website_url) && (
            <div>
              <dt>Website</dt>
              <dd>
                <a
                  href={externalUrl(company.website_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {company.website_url} ↗
                </a>
              </dd>
            </div>
          )}
        </dl>
      </section>
      <div className="employer-quick-links">
        <Link to="team">Meet your team ↗</Link>
        <Link to="jobs">Manage jobs & candidates ↗</Link>
      </div>
      {editing && (
        <EditorDialog
          title="Edit company"
          fields={companyFields}
          record={company}
          logo
          imageUrl={fileUrl(company.logo_url)}
          onClose={() => setEditing(false)}
          onSave={(values, file) =>
            employerService.saveCompany(
              companyPayload(values, file),
              company.id,
            )
          }
          onSaved={refreshCompany}
        />
      )}
    </>
  );
}
