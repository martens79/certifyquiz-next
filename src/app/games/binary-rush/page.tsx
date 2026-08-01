import BinaryRushGame from "@/features/games/binary-rush/BinaryRushGame"; import { gamesMetadata } from "@/features/games/metadata";
export const metadata=gamesMetadata("en",true); export default function Page(){return <BinaryRushGame lang="en"/>;}
