export function getApiError(error) {
  if (error.code === "ERR_NETWORK")
    return "We could not reach the server. Please check that the backend is running.";
  if (error.code === "ECONNABORTED")
    return "The request took too long. Please try again.";
  return (
    error.response?.data?.message ||
    error.message ||
    "Something went wrong. Please try again."
  );
}
