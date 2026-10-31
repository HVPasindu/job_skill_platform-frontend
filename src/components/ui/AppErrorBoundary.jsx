import { Component } from "react";
// React's built-in error boundary catches render/lazy-chunk failures, not normal API errors.
export default class AppErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="app-recovery" id="main-content">
        <a className="brand" href="/">
          <span className="brand-mark">↗</span>skilljob.
        </a>
        <span className="eyebrow">A SMALL PAUSE. ANOTHER WAY FORWARD.</span>
        <h1>
          Let's get you
          <br />
          <em>back on track.</em>
        </h1>
        <p>
          This page could not finish opening. Refresh to load the latest
          version, or return to the home page.
        </p>
        <div>
          <button type="button" onClick={() => window.location.reload()}>
            Refresh page ↻
          </button>
          <a href="/">Back to home ↗</a>
        </div>
      </main>
    );
  }
}
