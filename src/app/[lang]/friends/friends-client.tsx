"use client";

import { useEffect, useState, type FC } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { Locale } from "@/lib/i18n";
import { getLabel } from "@/lib/i18n";
import { apiFetch, getToken } from "@/lib/auth";

const LBL = {
  title: {
    it: "Amici",
    en: "Friends",
    fr: "Amis",
    es: "Amigos",
  },
  subtitle: {
    it: "Aggiungi amici per confrontarti con loro in classifica.",
    en: "Add friends to compare with them on the leaderboard.",
    fr: "Ajoutez des amis pour vous comparer à eux dans le classement.",
    es: "Añade amigos para compararte con ellos en la clasificación.",
  },
  backProfile: {
    it: "Torna al profilo",
    en: "Back to profile",
    fr: "Retour au profil",
    es: "Volver al perfil",
  },
  searchPlaceholder: {
    it: "Username o email",
    en: "Username or email",
    fr: "Nom d'utilisateur ou email",
    es: "Usuario o email",
  },
  sendRequest: {
    it: "Invia richiesta",
    en: "Send request",
    fr: "Envoyer une demande",
    es: "Enviar solicitud",
  },
  pendingTitle: {
    it: "Richieste in arrivo",
    en: "Incoming requests",
    fr: "Demandes reçues",
    es: "Solicitudes recibidas",
  },
  noPending: {
    it: "Nessuna richiesta in sospeso.",
    en: "No pending requests.",
    fr: "Aucune demande en attente.",
    es: "No hay solicitudes pendientes.",
  },
  friendsTitle: {
    it: "I tuoi amici",
    en: "Your friends",
    fr: "Vos amis",
    es: "Tus amigos",
  },
  noFriends: {
    it: "Non hai ancora amici.",
    en: "You don't have any friends yet.",
    fr: "Vous n'avez pas encore d'amis.",
    es: "Aún no tienes amigos.",
  },
  accept: {
    it: "Accetta",
    en: "Accept",
    fr: "Accepter",
    es: "Aceptar",
  },
  decline: {
    it: "Rifiuta",
    en: "Decline",
    fr: "Refuser",
    es: "Rechazar",
  },
  remove: {
    it: "Rimuovi",
    en: "Remove",
    fr: "Supprimer",
    es: "Eliminar",
  },
  seeLeaderboard: {
    it: "Vedi classifica amici →",
    en: "See friends leaderboard →",
    fr: "Voir le classement des amis →",
    es: "Ver clasificación de amigos →",
  },
  userNotFound: {
    it: "Utente non trovato.",
    en: "User not found.",
    fr: "Utilisateur introuvable.",
    es: "Usuario no encontrado.",
  },
  alreadyExists: {
    it: "Richiesta già esistente con questo utente.",
    en: "A request already exists with this user.",
    fr: "Une demande existe déjà avec cet utilisateur.",
    es: "Ya existe una solicitud con este usuario.",
  },
  genericError: {
    it: "Qualcosa è andato storto, riprova.",
    en: "Something went wrong, please try again.",
    fr: "Une erreur est survenue, réessayez.",
    es: "Algo salió mal, inténtalo de nuevo.",
  },
};

type FriendRow = { friendship_id: number; user_id: number; username: string };
type RequestRow = { id: number; requester_id: number; requester_username: string };

const FriendsClient: FC<{ lang: Locale }> = ({ lang }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<FriendRow[]>([]);
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace(`/${lang}/login?redirect=${encodeURIComponent(`/${lang}/friends`)}`);
    }
  }, [lang, router]);

  async function loadData() {
    setLoading(true);
    try {
      const [friendsRes, requestsRes] = await Promise.all([
        apiFetch("/friends"),
        apiFetch("/friends/requests"),
      ]);
      if (friendsRes.ok) {
        const data = await friendsRes.json();
        setFriends(Array.isArray(data?.items) ? data.items : []);
      }
      if (requestsRes.ok) {
        const data = await requestsRes.json();
        setRequests(Array.isArray(data?.items) ? data.items : []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSendRequest() {
    const target = search.trim();
    if (!target) return;
    setSending(true);
    setMessage(null);
    try {
      const res = await apiFetch("/friends/request", {
        method: "POST",
        body: JSON.stringify({ usernameOrEmail: target }),
      });
      if (res.status === 404) {
        setMessage(getLabel(LBL.userNotFound, lang));
      } else if (res.status === 409) {
        setMessage(getLabel(LBL.alreadyExists, lang));
      } else if (!res.ok) {
        setMessage(getLabel(LBL.genericError, lang));
      } else {
        setSearch("");
        setMessage(null);
        await loadData();
      }
    } catch {
      setMessage(getLabel(LBL.genericError, lang));
    } finally {
      setSending(false);
    }
  }

  async function handleAccept(id: number) {
    await apiFetch(`/friends/${id}/accept`, { method: "POST" });
    await loadData();
  }

  async function handleDecline(id: number) {
    await apiFetch(`/friends/${id}/decline`, { method: "POST" });
    await loadData();
  }

  async function handleRemove(id: number) {
    await apiFetch(`/friends/${id}`, { method: "DELETE" });
    await loadData();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            👥 {getLabel(LBL.title, lang)}
          </h1>
          <p className="mt-1 text-sm text-slate-600">{getLabel(LBL.subtitle, lang)}</p>
        </div>
        <Link
          href={`/${lang}/profile`}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-3 py-1.5 text-xs md:text-sm text-slate-700 hover:bg-slate-50"
        >
          ← {getLabel(LBL.backProfile, lang)}
        </Link>
      </div>

      <div className="rounded-2xl bg-white shadow ring-1 ring-black/5 p-4 mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={getLabel(LBL.searchPlaceholder, lang)}
            className="flex-1 rounded-full border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            disabled={sending || !search.trim()}
            onClick={handleSendRequest}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {getLabel(LBL.sendRequest, lang)}
          </button>
        </div>
        {message && <p className="mt-2 text-xs text-amber-700">{message}</p>}
      </div>

      {!loading && requests.length > 0 && (
        <div className="rounded-2xl bg-white shadow ring-1 ring-black/5 p-4 mb-4">
          <h2 className="text-sm font-semibold text-slate-700 mb-2">
            {getLabel(LBL.pendingTitle, lang)}
          </h2>
          <ul className="space-y-2">
            {requests.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-2">
                <span className="text-sm">{r.requester_username}</span>
                <span className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleAccept(r.id)}
                    className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700"
                  >
                    {getLabel(LBL.accept, lang)}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDecline(r.id)}
                    className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    {getLabel(LBL.decline, lang)}
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-2xl bg-white shadow ring-1 ring-black/5 p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-slate-700">
            {getLabel(LBL.friendsTitle, lang)}
          </h2>
          {!loading && friends.length > 0 && (
            <Link
              href={`/${lang}/leaderboard`}
              className="text-xs text-slate-600 hover:text-slate-900 underline"
            >
              {getLabel(LBL.seeLeaderboard, lang)}
            </Link>
          )}
        </div>
        {loading ? (
          <div className="animate-pulse h-6 w-40 bg-slate-100 rounded" />
        ) : friends.length === 0 ? (
          <p className="text-sm text-slate-600">{getLabel(LBL.noFriends, lang)}</p>
        ) : (
          <ul className="space-y-2">
            {friends.map((f) => (
              <li key={f.friendship_id} className="flex items-center justify-between gap-2">
                <span className="text-sm">{f.username}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(f.friendship_id)}
                  className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
                >
                  {getLabel(LBL.remove, lang)}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default FriendsClient;
