// MUI Pagination provides accessible page buttons. Totals come from the SQL count query.
import Pagination from "@mui/material/Pagination";
export default function PageBar({
  pagination,
  onChange,
  label = "Result pages",
}) {
  if (!pagination) return null;
  return (
    <div className="employer-pagebar flex flex-wrap items-center justify-between gap-4 py-6">
      <p>
        {pagination.total} {pagination.total === 1 ? "record" : "records"}
        {pagination.total > 0
          ? ` · Page ${pagination.page} of ${pagination.total_pages}`
          : ""}
      </p>
      {pagination.total_pages > 1 && (
        <Pagination
          color="primary"
          aria-label={label}
          siblingCount={0}
          page={Math.min(pagination.page, pagination.total_pages)}
          count={pagination.total_pages}
          onChange={onChange}
        />
      )}
    </div>
  );
}
