export async function loginWithEmail(email: string) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(payload?.error ?? "ログインに失敗しました。");
  }

  return response.json() as Promise<{ ok?: true; verificationRequired?: true }>;
}

export async function verifyLoginCode(email: string, code: string, password?: string) {
  const response = await fetch("/api/auth/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, code, password }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(payload?.error ?? "確認コードの検証に失敗しました。");
  }

  return response.json();
}

export async function logout() {
  await fetch("/api/auth/logout", {
    method: "POST",
  });
}