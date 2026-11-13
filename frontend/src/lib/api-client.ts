
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not configured");
}

type ApiOptions = Omit<RequestInit, "body" | "headers"> & {
    headers?: HeadersInit;
    body?: unknown;
    params?: Record<string, string | number | boolean | undefined>;
    token?: string;
};

export async function apiRequest<T>(
    endpoint: string,
    options: ApiOptions = {}
): Promise<T> {
    const {
        headers,
        body,
        params,
        token,
        ...fetchOptions
    } = options;

    const url = new URL(
        `${API_BASE_URL}${endpoint}`
    );

    // Append query parameters
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                url.searchParams.append(key, String(value));
            }
        });
    }

    const response = await fetch(url.toString(), {
        ...fetchOptions,
        headers: {
            Accept: "application/json",
            ...(body !== undefined && {
                "Content-Type": "application/json",
            }),
            ...(token && {
                Authorization: `Bearer ${token}`,
            }),
            ...Object.fromEntries(new Headers(headers).entries()),
        },
        ...(body !== undefined && {
            body: JSON.stringify(body),
        }),
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
}
