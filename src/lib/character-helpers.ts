import { CharacterStatus } from "@/types/character";

export const statusColor: Record<CharacterStatus, string> = {
  Alive: "bg-emerald-500",
  Dead: "bg-red-500",
  unknown: "bg-gray-500",
};
