export async function api(url, options = {}) {
    // If url is a relative path (starts with '/'), prefix with VITE_BASE_URL if available
    const base = typeof import.meta !== "undefined" ? (import.meta.env?.VITE_BASE_URL || "") : "";
    if (typeof url === "string" && url.startsWith("/")) {
        url = `${base}${url}`;
    }

    const hasBody = options.body !== undefined && options.body !== null;
    const headers = {
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {}),
    };
    // Attach JWT token from localStorage if available and not overridden
    try {
        const token = localStorage.getItem("auth_token");
        if (token && !headers.Authorization && !headers.authorization) {
            headers["Authorization"] = `Bearer ${token}`;
        }
    }
    catch { }
    let res;
    try {
        res = await fetch(url, {
            credentials: options.credentials ?? "include",
            ...options,
            headers,
        });
    }
    catch {
        throw new Error("Network error. Please retry.");
    }
    if (!res.ok) {
        let message = `Request failed: ${res.status}`;
        try {
            const ct = res.headers.get("content-type") || "";
            if (ct.includes("application/json")) {
                const data = await res.json();
                message = typeof data === "string" ? data : data?.error || JSON.stringify(data);
            }
            else {
                message = await res.text();
            }
        }
        catch { }
        throw new Error(message);
    }
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
        return res.json();
    }
    const txt = await res.text();
    return (txt ? JSON.parse(txt) : {});
}
