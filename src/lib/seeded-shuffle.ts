// ============================================================================
// Shuffle deterministico seedato
// Stesso seed + stesso input array (stesso ordine) => stesso output, sempre.
// Usato da QuizEngine per rendere il resume affidabile: invece di confrontare
// l'ordine delle domande dopo un reshuffle casuale (quasi mai identico), si
// ricostruisce lo stesso ordine dal seed salvato.
// ============================================================================

// mulberry32: PRNG deterministico, non crittografico (va bene per uno shuffle)
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Genera un nuovo seed a 32 bit per una nuova sessione quiz. */
export function makeSeed(): number {
  return Math.floor(Math.random() * 0xffffffff) >>> 0;
}

/** Fisher-Yates seedato: stesso `items` (stesso ordine) + stesso `seed` => stesso risultato. */
export function seededShuffle<T>(items: T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * FNV-1a a 32 bit sulla sequenza ordinata degli id. Non crittografico: serve
 * solo a rilevare se il pool di domande è cambiato da quando una riga di
 * progresso (locale o DB) è stata scritta, per non ripristinare idx/risposte
 * su un ordine che non corrisponde più. Il risultato passa da `>>> 0` per
 * restare in [0, 2^32-1] — senza, JS produce un intero con segno che non
 * corrisponde a una colonna INT UNSIGNED lato DB.
 */
export function hashIds(ids: Array<string | number>): number {
  const str = ids.join(",");
  let hash = 0x811c9dc5; // FNV offset basis a 32 bit
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193); // FNV prime
  }
  return hash >>> 0;
}
