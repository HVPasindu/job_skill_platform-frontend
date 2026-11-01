import "./styles-polish.css";
import AppErrorBoundary from "./components/ui/AppErrorBoundary";
import AppRoutes from "./routes/AppRoutes";
import ChatLauncher from "./components/chat/ChatLauncher";
function App() {
  return (
    <AppErrorBoundary>
      <AppRoutes />
      <ChatLauncher />
    </AppErrorBoundary>
  );
}
export default App;
