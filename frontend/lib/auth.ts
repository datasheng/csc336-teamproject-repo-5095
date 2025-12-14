export function logout() {
  if (typeof window === "undefined") return;

  localStorage.removeItem("auth_user");
  localStorage.removeItem("user_id");
}