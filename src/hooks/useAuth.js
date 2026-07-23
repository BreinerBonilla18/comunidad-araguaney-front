import { useState, useEffect } from "react";

export function useAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);
        setIsAdmin(parsedUser?.is_admin === true);
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }
  }, []);

  return { isAdmin, user };
}
