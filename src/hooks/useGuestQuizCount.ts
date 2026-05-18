import { useEffect, useState } from 'react';

const KEY = 'cq_guest_count';
const REGISTER_LIMIT = 5;

export function useGuestQuizCount(isLoggedIn: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isLoggedIn) return;
    const stored = parseInt(localStorage.getItem(KEY) ?? '0', 10);
    setCount(stored);
  }, [isLoggedIn]);

  function increment() {
    if (isLoggedIn) return;
    const next = count + 1;
    localStorage.setItem(KEY, String(next));
    setCount(next);
  }

  return {
    count,
    increment,
    registerLimitReached: !isLoggedIn && count >= REGISTER_LIMIT,
  };
}