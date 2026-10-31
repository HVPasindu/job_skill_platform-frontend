import { useState } from "react";
import usePagedResource from "../../hooks/usePagedResource";
import { supportService } from "../../services/supportService";
import AdminHeader from "../../components/admin/AdminHeader";
import CategoryDialog from "../../components/admin/CategoryDialog";
import PageBar from "../../components/employer/PageBar";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
import { confirmAction, showError, showSuccess } from "../../utils/alerts";
import { getApiError } from "../../utils/apiError";
export default function JobCategories() {
  const resource = usePagedResource(supportService.categories);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);
  async function remove(category) {
    if (busy) return;
    setBusy(true);
    try {
      if (
        !(await confirmAction(
          "Delete this job category?",
          `Remove “${category.category_name}”? Existing jobs will stay in place without this category.`,
          "Delete category",
        ))
      )
        return;
      await supportService.removeCategory(category.id);
      resource.reload();
      await showSuccess(
        "Category removed",
        "The job category has been deleted.",
      );
    } catch (error) {
      await showError(getApiError(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <AdminHeader
        title={
          <>
            Make opportunity
            <br />
            <em>easier to find.</em>
          </>
        }
        description="Shared job categories bring structure to every employer's next opening."
      />
      <div className="admin-toolbar">
        <div>
          <span className="eyebrow">THE PLATFORM INDEX</span>
          <h2>Job categories.</h2>
        </div>
        <Button onClick={() => setAdding(true)} disabled={busy}>
          Add category +
        </Button>
      </div>
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState message={resource.error} onRetry={resource.reload} />
      ) : !resource.data.categories.length ? (
        <section className="admin-empty">
          <h2>Room for the first category.</h2>
          <p>Add a job category to help employers organise opportunities.</p>
        </section>
      ) : (
        <div className="admin-category-grid">
          {resource.data.categories.map((category) => (
            <article key={category.id} className="admin-category-card">
              <span className="admin-card-index">
                JOB CATEGORY / {String(category.id).padStart(2, "0")}
              </span>
              <h3>{category.category_name}</h3>
              <p>Shared across employer workspaces</p>
              <div>
                <Button
                  variant="outlined"
                  onClick={() => setEditing(category)}
                  disabled={busy}
                >
                  Edit ↗
                </Button>
                <button
                  className="admin-delete"
                  type="button"
                  onClick={() => remove(category)}
                  disabled={busy}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
      <PageBar
        pagination={resource.data?.pagination}
        onChange={resource.setPage}
        label="Job category pages"
      />
      {(adding || editing) && (
        <CategoryDialog
          record={editing}
          onClose={() => {
            setAdding(false);
            setEditing(null);
          }}
          onSaved={resource.reload}
        />
      )}
    </>
  );
}
