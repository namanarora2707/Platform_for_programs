import { useEffect, useState, useCallback } from "react";
import { api } from "../lib/api";
export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            const me = await api("/api/auth/me");
            setUser(me);
        }
        catch {
            setUser(null);
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        refresh();
    }, [refresh]);
    const logout = useCallback(async () => {
        // Clear stored token and local user state
        try { localStorage.removeItem("auth_token"); } catch { }
        setUser(null);
    }, []);
    return { user, loading, refresh, logout, setUser };
}
