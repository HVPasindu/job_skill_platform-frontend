import { useCallback } from "react";
import { Link, NavLink, Outlet, useParams } from "react-router-dom";
import useApiResource from "../../hooks/useApiResource";
import { employerService } from "../../services/employerService";
import Loading from "../ui/Loading";
import ErrorState from "../ui/ErrorState";
export default function CompanyLayout() {
  const { companyId } = useParams();
  const load = useCallback(
    (signal) => employerService.company(companyId, signal),
    [companyId],
  );
  const resource = useApiResource(load);
  if (resource.loading) return <Loading label="Opening your company…" />;
  if (resource.error)
    return <ErrorState message={resource.error} onRetry={resource.reload} />;
  const company = resource.data;
  const base = `/dashboard/employer/companies/${companyId}`;
  return (
    <>
      <div className="company-context">
        <div>
          <span className="eyebrow">
            CURRENT COMPANY / {company.company_role}
          </span>
          <h2>{company.company_name}</h2>
        </div>
        <Link to="/dashboard/employer/companies">Switch company ↗</Link>
      </div>
      <nav className="company-tabs" aria-label="Company tools">
        <NavLink to={base} end>
          Company profile
        </NavLink>
        <NavLink to={`${base}/team`}>Team members</NavLink>
        <NavLink to={`${base}/jobs`}>Jobs & candidates</NavLink>
      </nav>
      <Outlet
        context={{
          company,
          refreshCompany: resource.reload,
          isOwner: company.company_role === "owner",
        }}
      />
    </>
  );
}
