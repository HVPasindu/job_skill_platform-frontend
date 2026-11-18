// SweetAlert2 is loaded only when an alert is needed. Use `text`, never HTML from the API.
let popupPromise;
async function popup(options) {
  popupPromise ||= import("sweetalert2").then((module) => module.default);
  const Swal = await popupPromise;
  return Swal.fire({
    confirmButtonColor: "#315cff",
    cancelButtonColor: "#596477",
    background: "#fffef9",
    color: "#101729",
    customClass: { popup: "skilljob-alert" },
    ...options,
  });
}
export function showSuccess(title, text) {
  return popup({ icon: "success", title, text });
}
export function showError(text) {
  return popup({ icon: "error", title: "Let's try that again", text });
}
export async function confirmAction(
  title,
  text,
  confirmButtonText = "Continue",
) {
  const result = await popup({
    icon: "question",
    title,
    text,
    confirmButtonText,
    showCancelButton: true,
    reverseButtons: true,
  });
  return result.isConfirmed;
}
