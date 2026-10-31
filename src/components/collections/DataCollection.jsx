import "./collection.css";
import { useId } from "react";
// MUI exclusive toggles provide labelled controls, keyboard focus and pressed states.
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
import useCollectionView from "../../hooks/useCollectionView";
export default function DataCollection(props) {
  // A different collection gets its own stored preference, even on a reused route.
  return <Collection key={props.viewKey} {...props} />;
}
function Collection({
  viewKey,
  label,
  className = "",
  defaultView = "grid",
  children,
}) {
  const { view, changeView } = useCollectionView(viewKey, defaultView);
  const id = useId();
  return (
    <section className="data-collection" data-view={view} aria-label={label}>
      <div className="collection-toolbar">
        <span className="collection-label">{label}</span>
        <ToggleButtonGroup
          exclusive
          value={view}
          onChange={changeView}
          size="small"
          aria-label={`${label} view`}
        >
          <ToggleButton value="grid" aria-controls={id}>
            <GridViewRoundedIcon fontSize="small" />
            <span>Grid</span>
          </ToggleButton>
          <ToggleButton value="list" aria-controls={id}>
            <ViewListRoundedIcon fontSize="small" />
            <span>List</span>
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div id={id} className={`collection-items ${className}`}>
        {children}
      </div>
    </section>
  );
}
