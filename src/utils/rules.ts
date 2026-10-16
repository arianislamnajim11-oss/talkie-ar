export type EnglishLevel = 'Beginner' | 'Elementary' | 'Intermediate' | 'Upper-Intermediate' | 'Advanced' | 'Proficient';
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

/**
 * Calculates CEFR level based on assessment percentage score (0 - 100)
 */
export function calculateCEFRLevel(percentage: number): { level: CEFRLevel; title: string } {
  const clamped = Math.max(0, Math.min(100, Math.round(percentage)));

  if (clamped >= 95) {
    return { level: 'C2', title: 'Proficient / Mastery' };
  } else if (clamped >= 85) {
    return { level: 'C1', title: 'Advanced English' };
  } else if (clamped >= 70) {
    return { level: 'B2', title: 'Upper-Intermediate' };
  } else if (clamped >= 55) {
    return { level: 'B1', title: 'Intermediate' };
  } else if (clamped >= 40) {
    return { level: 'A2', title: 'Elementary' };
  } else {
    return { level: 'A1', title: 'Beginner' };
  }
}

/**
 * Validates a Talkie AR Certificate ID format: TAR-2026-[A-Z0-9]{6}
 */
export function validateCertificateId(certId: string): boolean {
  if (!certId || typeof certId !== 'string') return false;
  const regex = /^TAR-2026-[A-Z0-9]{6}$/;
  return regex.test(certId.trim().toUpperCase());
}

/**
 * Computes game scoring with anti-cheat thresholds and speed bonuses
 */
export function calculateGameScore(
  basePoints: number,
  timeRemainingSeconds: number,
  streakCount: number,
  maxRoundTime: number = 30
): number {
  if (basePoints <= 0) return 0;
  const clampedTime = Math.max(0, Math.min(timeRemainingSeconds, maxRoundTime));
  const timeBonus = Math.round((clampedTime / maxRoundTime) * 50);
  const streakMultiplier = Math.min(3, 1 + Math.max(0, streakCount) * 0.1);
  return Math.round((basePoints + timeBonus) * streakMultiplier);
}

/**
 * Checks role-based permission in speaking rooms
 */
export function canPerformRoomAction(
  userRole: 'host' | 'moderator' | 'speaker' | 'listener',
  action: 'mute_others' | 'kick' | 'change_topic' | 'close_room' | 'speak' | 'raise_hand'
): boolean {
  switch (action) {
    case 'close_room':
      return userRole === 'host';
    case 'mute_others':
    case 'kick':
    case 'change_topic':
      return userRole === 'host' || userRole === 'moderator';
    case 'speak':
      return userRole === 'host' || userRole === 'moderator' || userRole === 'speaker';
    case 'raise_hand':
      return userRole === 'listener';
    default:
      return false;
  }
}

/**
 * Validates whether a user can join a speaking room based on capacity, status, and privacy
 */
export function validateRoomJoin(room: {
  status?: 'active' | 'closed';
  capacity: number;
  currentParticipants: number;
  isPrivate: boolean;
  password?: string;
}, providedPassword?: string): { allowed: boolean; reason?: string } {
  if (room.status === 'closed') {
    return { allowed: false, reason: 'This room has been closed by the host.' };
  }
  if (room.currentParticipants >= room.capacity) {
    return { allowed: false, reason: 'Room is at full capacity.' };
  }
  if (room.isPrivate) {
    if (!room.password || room.password.trim() === '') {
      return { allowed: true };
    }
    if (room.password !== providedPassword) {
      return { allowed: false, reason: 'Incorrect room password.' };
    }
  }
  return { allowed: true };
}

/**
 * Filters speaking rooms by search criteria
 */
export interface RoomFilterOptions {
  search?: string;
  category?: string;
  level?: string;
  beginnerOnly?: boolean;
}

export function filterSpeakingRooms<T extends { title: string; topic: string; category: string; level: string; isBeginnerFriendly: boolean }>(
  rooms: T[],
  options: RoomFilterOptions
): T[] {
  return rooms.filter((room) => {
    if (options.search) {
      const q = options.search.toLowerCase().trim();
      const matchesSearch = room.title.toLowerCase().includes(q) ||
        room.topic.toLowerCase().includes(q) ||
        room.category.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    if (options.category && options.category !== 'All') {
      if (room.category.toLowerCase() !== options.category.toLowerCase()) {
        return false;
      }
    }

    if (options.level && options.level !== 'All Levels') {
      if (room.level !== 'All Levels' && room.level !== options.level) {
        return false;
      }
    }

    if (options.beginnerOnly) {
      if (!room.isBeginnerFriendly) return false;
    }

    return true;
  });
}

/**
 * Updates daily practice streak
 */
export function updateSpeakingStreak(
  lastActiveIso: string | undefined,
  currentIso: string,
  currentStreak: number
): { newStreak: number; streakMaintained: boolean } {
  if (!lastActiveIso) {
    return { newStreak: 1, streakMaintained: true };
  }

  const lastDate = new Date(lastActiveIso).toISOString().slice(0, 10);
  const currDate = new Date(currentIso).toISOString().slice(0, 10);

  if (lastDate === currDate) {
    return { newStreak: currentStreak, streakMaintained: true };
  }

  const diffDays = Math.round(
    (new Date(currDate).getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 1) {
    return { newStreak: currentStreak + 1, streakMaintained: true };
  } else {
    return { newStreak: 1, streakMaintained: false };
  }
}
