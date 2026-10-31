import ImageWithFallback from "../../components/ui/ImageWithFallback";
import DataCollection from "../../components/collections/DataCollection";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import usePagedResource from "../../hooks/usePagedResource";
import { employerService } from "../../services/employerService";
import {
  companyFields,
  contactFields,
  companyPayload,
} from "../../data/employerFields";
import { fileUrl } from "../../utils/seekerFiles";
import EmployerHeader from "../../components/employer/EmployerHeader";
import EditorDialog from "../../components/employer/EditorDialog";
import PageBar from "../../components/employer/PageBar";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
export default function Companies() {
  const resource = usePagedResource(employerService.companies, 6);
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <EmployerHeader
        title={
          <>
            Great teams.
            <br />
            <em>Start here.</em>
          </>
        }
        description="Choose the company you're building with. Make room for the people who will take it further."
      />
      <div className="seeker-toolbar">
        <h2>Your companies.</h2>
        <Button onClick={() => setAdding(true)}>Create company +</Button>
      </div>
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState message={resource.error} onRetry={resource.reload} />
      ) : !resource.data.companies.length ? (
        <section className="seeker-empty">
          <span>↗</span>
          <h2>Your next chapter needs a home.</h2>
          <p>Create your first company to publish jobs and meet candidates.</p>
        </section>
      ) : (
        <DataCollection
          viewKey="employer-companies"
          label="Your companies"
          className="company-grid"
        >
          {resource.data.companies.map((company) => (
            <article className="company-card" key={company.id}>
              <div className="company-card-top">
                <ImageWithFallback
                  src={fileUrl(company.logo_url)}
                  alt={`${company.company_name} logo`}
                  fallback={
                    <span className="company-monogram">
                      {company.company_name.charAt(0)}
                    </span>
                  }
                />
                <span className="employer-role">{company.company_role}</span>
              </div>
              <h2>{company.company_name}</h2>
              <p>
                {[company.industry, company.city, company.country]
                  .filter(Boolean)
                  .join(" · ") || "Your company, ready to grow."}
              </p>
              <Link to={`/dashboard/employer/companies/${company.id}`}>
                Open company ↗
              </Link>
            </article>
          ))}
        </DataCollection>
      )}
      <PageBar
        pagination={resource.data?.pagination}
        onChange={resource.setPage}
        label="Company pages"
      />
      {adding && (
        <EditorDialog
          title="Create your company"
          fields={[...companyFields, ...contactFields]}
          logo
          onClose={() => setAdding(false)}
          onSave={(values, file) =>
            employerService.saveCompany(companyPayload(values, file))
          }
          onSaved={(result) =>
            navigate(`/dashboard/employer/companies/${result.company_id}`)
          }
          message="Your company and owner membership are ready."
        />
      )}
    </>
  );
}
