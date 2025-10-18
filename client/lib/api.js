export async function api(url, options = {}) {
    const hasBody = options.body !== undefined && options.body !== null;
    const headers = {
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {}),
    };
    let res;
    try {
        res = await fetch(url, {
            credentials: "include",
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
