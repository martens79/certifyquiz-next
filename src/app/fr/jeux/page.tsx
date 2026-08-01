import GamesIndex from "@/features/games/GamesIndex"; import { gamesMetadata } from "@/features/games/metadata";
export const metadata=gamesMetadata("fr"); export default function Page(){return <GamesIndex lang="fr"/>;}
