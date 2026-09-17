export interface UserUnifiedXP {
  totalXP: number;
  dsaXP: number;
  quizXP: number;
  mathXP: number;
  bonusXP: number;
  level: number;
  rankTitle: string;
}

export function getRankTitle(level: number): string {
  if (level >= 25) return "Grandmaster";
  if (level >= 18) return "Master";
  if (level >= 12) return "Architect";
  if (level >= 8) return "Senior Specialist";
  if (level >= 5) return "Practitioner";
  if (level >= 3) return "Apprentice";
  return "Initiate";
}

export function calculateXPLevel(totalXP: number): { level: number; rankTitle: string } {
  const level = Math.max(1, Math.floor(Math.sqrt(Math.max(0, totalXP) / 50)) + 1);
  return {
    level,
    rankTitle: getRankTitle(level),
  };
}
