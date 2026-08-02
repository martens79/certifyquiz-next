import HexBlitzGame from "@/features/games/hex-blitz/HexBlitzGame";
import { hexBlitzMetadata } from "@/features/games/metadata";

export const metadata = hexBlitzMetadata("es");

export default function Page() {
  return <HexBlitzGame lang="es" />;
}
