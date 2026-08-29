const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

type IssueCategory = "pothole" | "garbage" | "streetlight";

interface SubmitIssueInput {
  file: File;
  category: IssueCategory;
  latitude: number;
  longitude: number;
  address: string;
  description?: string;
}

export async function submitIssue(
  input: SubmitIssueInput,
): Promise<{ issue: { id: string } }> {
  const imageUrl = await fileToDataUrl(input.file);

  return request("/issues", {
    method: "POST",
    body: JSON.stringify({
      category: input.category,
      imageUrl,
      lat: input.latitude,
      lng: input.longitude,
      address: input.address,
      description: input.description,
    }),
  });
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed");
  }

  return payload as T;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}
