/** An unavailable/invalid API payload must never look like an empty bank. */
export function unavailableApiResponse(message: string): Error & { status: number } {
  return Object.assign(new Error(message), { status: 503 });
}

export async function decodeApiJson<T>(response: Response): Promise<T> {
  try {
    return JSON.parse(await response.text()) as T;
  } catch {
    throw unavailableApiResponse('API response is unavailable or is not valid JSON');
  }
}

export function validateQuestionPayload<T>(payload: T): T {
  const questions = Array.isArray(payload) ? payload : (payload as { questions?: unknown } | null)?.questions;
  if (!Array.isArray(questions) || questions.some(q => !q || typeof q !== 'object' || !Array.isArray(q.answers))) {
    throw unavailableApiResponse('Question bank returned an invalid payload');
  }
  return payload;
}
