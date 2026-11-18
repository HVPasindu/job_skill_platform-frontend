import { useEffect, useState } from "react";
export default function useResendCooldown(resendAt) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return Math.max(0, Math.ceil((resendAt - now) / 1000));
}
