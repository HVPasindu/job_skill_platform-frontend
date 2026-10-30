import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
export default function EmptyState({ title, description, children }) {
  return (
    <div className="empty-state">
      <AutoAwesomeOutlinedIcon color="primary" />
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </div>
  );
}
