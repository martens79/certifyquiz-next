import GamesIndex from "@/features/games/GamesIndex"; import { gamesMetadata } from "@/features/games/metadata";
export const metadata=gamesMetadata("en"); export default function Page(){return <GamesIndex lang="en"/>;}
