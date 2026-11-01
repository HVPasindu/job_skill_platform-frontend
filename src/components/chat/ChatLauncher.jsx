import "./chat.css";
import { lazy, Suspense, useState } from "react";
import { IconButton } from "@mui/material";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import useAuth from "../../hooks/useAuth";
// The actual panel, forms and chatbot requests load only on first opening.
const ChatPanel = lazy(() => import("./ChatPanel"));
export default function ChatLauncher() {
  const { token, user } = useAuth();
  // Remounting on an account/token change discards the previous private conversation.
  return <Launcher key={token || (user ? `user-${user.id}` : "guest")} />;
}
function Launcher() {
  const [open, setOpen] = useState(false);
  const [visited, setVisited] = useState(false);
  return (
    <>
      <div className="chat-launcher">
        <span aria-hidden="true">A little help?</span>
        {/* MUI IconButton provides focus, touch target and keyboard activation. */}
        <IconButton
          className="chat-launch-button"
          aria-label={
            open ? "Close platform assistant" : "Open platform assistant"
          }
          aria-expanded={open}
          aria-haspopup="dialog"
          onClick={() => {
            setVisited(true);
            setOpen(!open);
          }}
        >
          {open ? <CloseRoundedIcon /> : <ForumOutlinedIcon />}
        </IconButton>
      </div>
      {visited && (
        <Suspense
          fallback={
            <span className="chat-loading" role="status">
              Opening assistant…
            </span>
          }
        >
          <ChatPanel open={open} onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
