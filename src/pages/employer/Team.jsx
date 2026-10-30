import { useCallback, useState } from "react";
import { useOutletContext } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import usePagedResource from "../../hooks/usePagedResource";
import { employerService } from "../../services/employerService";
import { memberFields } from "../../data/employerFields";
import { asBoolean } from "../../utils/seekerFiles";
import { confirmAction, showSuccess, showError } from "../../utils/alerts";
import { getApiError } from "../../utils/apiError";
import EditorDialog from "../../components/employer/EditorDialog";
import PageBar from "../../components/employer/PageBar";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
export default function Team() {
  const { company, isOwner, refreshCompany } = useOutletContext();
  const { user } = useAuth();
  const load = useCallback(
    (params, signal) => employerService.members(company.id, params, signal),
    [company.id],
  );
  const resource = usePagedResource(load);
  const [editor, setEditor] = useState(null);
  const [busy, setBusy] = useState(false);
  async function remove(member) {
    setBusy(true);
    try {
      if (
        !(await confirmAction(
          "Remove this company member?",
          `${member.full_name} will lose access to this company. Their platform account remains available.`,
          "Remove member",
        ))
      )
        return;
      await employerService.removeMember(company.id, member.company_user_id);
      resource.reload();
      await showSuccess(
        "Membership removed",
        "Your company team is up to date.",
      );
    } catch (error) {
      await showError(getApiError(error));
    } finally {
      setBusy(false);
    }
  }
  const editingSelf = editor && Number(editor.user_id) === Number(user.id);
  const fields = editor?.company_user_id
    ? memberFields.filter(
        (field) =>
          isOwner ||
          !["company_role", "is_primary_contact"].includes(field.name),
      )
    : [
        {
          name: "email",
          label: "Registered user email",
          type: "email",
          required: true,
          max: 150,
        },
        ...memberFields,
      ];
  return (
    <>
      <div className="seeker-toolbar">
        <div>
          <span className="eyebrow">GREAT WORK STARTS WITH PEOPLE</span>
          <h1 className="employer-section-heading">Your team.</h1>
        </div>
        {isOwner && (
          <Button
            disabled={busy}
            onClick={() => setEditor({ company_role: "employee" })}
          >
            Add member +
          </Button>
        )}
      </div>
      <p className="seeker-inline-note">
        {isOwner
          ? "Add registered users by email. Owners manage access; every member can manage company jobs."
          : "Your owner manages team access. You can edit your own job title, department and introduction."}
      </p>
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState message={resource.error} onRetry={resource.reload} />
      ) : (
        <div className="team-list">
          {resource.data.users.map((member) => (
            <article className="team-card" key={member.company_user_id}>
              <span className="team-avatar">{member.full_name.charAt(0)}</span>
              <div>
                <span className="employer-role">
                  {member.company_role}
                  {asBoolean(member.is_primary_contact)
                    ? " · Primary contact"
                    : ""}
                </span>
                <h2>
                  {member.full_name}
                  {Number(member.user_id) === Number(user.id) ? " (you)" : ""}
                </h2>
                <p>{member.email}</p>
                <p>
                  {[member.job_title, member.department]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                {member.bio && <p>{member.bio}</p>}
              </div>
              <div className="team-actions">
                {(isOwner || Number(member.user_id) === Number(user.id)) && (
                  <button disabled={busy} onClick={() => setEditor(member)}>
                    Edit profile ↗
                  </button>
                )}
                {isOwner && member.company_role !== "owner" && (
                  <button disabled={busy} onClick={() => remove(member)}>
                    Remove
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
      <PageBar
        pagination={resource.data?.pagination}
        onChange={resource.setPage}
        label="Team member pages"
      />
      {editor && (
        <EditorDialog
          title={
            editor.company_user_id
              ? "Edit team profile"
              : "Add a company member"
          }
          fields={fields}
          record={editor}
          locked={editingSelf ? ["company_role"] : []}
          onClose={() => setEditor(null)}
          onSave={(values) =>
            employerService.saveMember(
              company.id,
              values,
              editor.company_user_id,
            )
          }
          onSaved={() => {
            resource.reload();
            refreshCompany();
          }}
          message="Team membership saved. A newly assigned employer should sign out and sign in again to refresh their workspaces."
        />
      )}
    </>
  );
}
