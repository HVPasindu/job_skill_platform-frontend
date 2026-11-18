import useAuth from "../../hooks/useAuth";
import { ROLE_DETAILS } from "../../data/roles";
import Button from "../../components/ui/Button";
import Reveal from "../../components/experience/Reveal";
export default function Account() {
  const { user } = useAuth();
  return (
    <Reveal>
      <span className="eyebrow">YOUR SKILLJOB IDENTITY</span>
      <h1 className="workspace-page-title">
        One account.
        <br />
        Your possibilities.
      </h1>
      <p className="workspace-page-intro">
        The details connected to your current sign-in.
      </p>
      <section className="workspace-card account-details">
        <h2>Account details</h2>
        <dl>
          <div>
            <dt>Full name</dt>
            <dd>{user.full_name || "Not provided"}</dd>
          </div>
          <div>
            <dt>Email address</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt>Your workspaces</dt>
            <dd className="account-role-chips">
              {user.roles.map((role) => (
                <span key={role}>{ROLE_DETAILS[role].label}</span>
              ))}
            </dd>
          </div>
        </dl>
      </section>
      <section className="workspace-card account-details">
        <h2>Company memberships</h2>
        {user.companies.length ? (
          <ul className="company-memberships">
            {user.companies.map((company) => (
              <li key={company.company_id}>
                <strong>{company.company_name}</strong>
                <span>{company.company_role}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No company memberships were returned at sign-in.</p>
        )}
        <p className="muted">
          Memberships reflect your last sign-in. Sign in again to refresh
          changes made elsewhere.
        </p>
      </section>
      {!user.roles.includes("trainer") && (
        <Button to="/dashboard/become-trainer">Become a trainer ↗</Button>
      )}
    </Reveal>
  );
}
