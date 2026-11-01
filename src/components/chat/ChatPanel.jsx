import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
// MUI Dialog handles focus/escape; TextField and CircularProgress provide form states.
import { Dialog, IconButton, TextField, CircularProgress } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { supportService } from "../../services/supportService";
import { getApiError } from "../../utils/apiError";
import { confirmAction } from "../../utils/alerts";
import AssistantOrb from "../experience/AssistantOrb";
export default function ChatPanel({ open, onClose }) {
  const { user, activeRole } = useAuth();
  const [messages, setMessages] = useState([]);
  const [pending, setPending] = useState(false);
  const [popup, setPopup] = useState(false);
  const request = useRef(null);
  const list = useRef(null);
  const input = useRef(null);
  const nextId = useRef(0);
  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: { question: "" },
  });
  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => {
    if (open)
      list.current?.scrollTo({
        top: list.current.scrollHeight,
        behavior: "instant",
      });
  }, [messages, pending, open]);
  async function submit(values) {
    const question = values.question.trim();
    if (!question || question.length > 2000 || request.current) return;
    const controller = new AbortController();
    request.current = controller;
    const id = ++nextId.current;
    setMessages((previous) => [
      ...previous.slice(-38),
      { id, question, answer: "", error: "" },
    ]);
    setPending(true);
    reset();
    try {
      const result = await supportService.ask(question, controller.signal);
      if (!controller.signal.aborted)
        setMessages((previous) =>
          previous.map((m) =>
            m.id === id ? { ...m, answer: result.answer } : m,
          ),
        );
    } catch (error) {
      if (!controller.signal.aborted)
        setMessages((previous) =>
          previous.map((m) =>
            m.id === id ? { ...m, error: getApiError(error) } : m,
          ),
        );
    } finally {
      if (!controller.signal.aborted) {
        request.current = null;
        setPending(false);
        input.current?.focus();
      }
    }
  }
  async function clear() {
    setPopup(true);
    const confirmed = await confirmAction(
      "Clear this conversation?",
      "This clears messages on this screen. Saved support logs remain available to administrators.",
      "Clear messages",
    );
    setPopup(false);
    if (confirmed) setMessages([]);
  }
  function selectPrompt(question) {
    setValue("question", question, { shouldValidate: true });
    input.current?.focus();
  }
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="platform-chat-dialog"
      disableEnforceFocus={popup}
      aria-labelledby="platform-chat-title"
      aria-describedby="platform-chat-description"
      slotProps={{ paper: { className: "platform-chat-paper" } }}
    >
      <header className="chat-heading">
        <AssistantOrb active={open} />
        <div>
          <span>SKILLJOB / YOUR NEXT STEP</span>
          <h2 id="platform-chat-title">Let's find your way.</h2>
        </div>
        <IconButton aria-label="Close assistant" onClick={onClose}>
          <CloseRoundedIcon />
        </IconButton>
      </header>
      <div className="chat-conversation" ref={list}>
        <div className="chat-intro">
          <span className="chat-badge">
            {user
              ? `Hello, ${user.full_name || "there"}`
              : "Hello, curious human"}
          </span>
          <p id="platform-chat-description">
            Ask about jobs, courses or your applications. Each question is
            answered independently.
          </p>
          <div className="chat-prompts">
            {["Show jobs", "Show courses", "My applications"].map(
              (question) => (
                <button
                  type="button"
                  key={question}
                  disabled={pending}
                  onClick={() => selectPrompt(question)}
                >
                  {question} ↗
                </button>
              ),
            )}
          </div>
          <small>
            Questions and replies are saved for admin support review. Avoid
            sharing passwords or secrets.
          </small>
        </div>
        {/* Plain React text safely renders API answers; no HTML or Markdown injection. */}
        <div
          className="chat-messages"
          role="log"
          aria-label="Assistant conversation"
          aria-live="polite"
          aria-relevant="additions text"
        >
          {messages.map((m) => (
            <section className="chat-turn" key={m.id}>
              <div className="chat-question">
                <small>You</small>
                <p>{m.question}</p>
              </div>
              <div className={`chat-answer ${m.error ? "chat-error" : ""}`}>
                <small>SkillJob assistant</small>
                {m.error ? (
                  <>
                    <p>{m.error}</p>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => selectPrompt(m.question)}
                    >
                      Try this question again ↗
                    </button>
                  </>
                ) : m.answer ? (
                  <p>{m.answer}</p>
                ) : (
                  <span className="chat-thinking">
                    <CircularProgress size={14} /> Finding your next step…
                  </span>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
      <nav className="chat-shortcuts" aria-label="Assistant shortcuts">
        <Link to="/jobs" onClick={onClose}>
          Jobs ↗
        </Link>
        <Link to="/courses" onClick={onClose}>
          Courses ↗
        </Link>
        {!user ? (
          <Link to="/login" onClick={onClose}>
            Sign in ↗
          </Link>
        ) : activeRole === "job_seeker" ? (
          <Link to="/dashboard/job-seeker/applications" onClick={onClose}>
            My applications ↗
          </Link>
        ) : (
          <Link to="/dashboard" onClick={onClose}>
            My workspace ↗
          </Link>
        )}
        <button
          type="button"
          disabled={pending || !messages.length}
          onClick={clear}
        >
          Clear
        </button>
      </nav>
      <form
        className="chat-composer"
        noValidate
        onSubmit={handleSubmit(submit)}
      >
        <Controller
          name="question"
          control={control}
          rules={{
            validate: (value) =>
              !value.trim()
                ? "Enter a question."
                : value.trim().length > 2000
                  ? "Use 2000 characters or fewer."
                  : true,
          }}
          render={({ field, fieldState }) => {
            const { ref, ...inputProps } = field;
            return (
              <TextField
                {...inputProps}
                inputRef={(element) => {
                  ref(element);
                  input.current = element;
                }}
                label="Your question"
                multiline
                minRows={1}
                maxRows={3}
                disabled={pending}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
                slotProps={{ htmlInput: { maxLength: 2000 } }}
              />
            );
          }}
        />
        <IconButton
          type="submit"
          className="chat-send"
          aria-label="Send question"
          disabled={pending}
        >
          {pending ? (
            <CircularProgress size={20} />
          ) : (
            <ArrowUpwardRoundedIcon />
          )}
        </IconButton>
      </form>
      <p className="chat-footnote">
        AI replies can be mistaken. Check account details in your workspace.
      </p>
    </Dialog>
  );
}
