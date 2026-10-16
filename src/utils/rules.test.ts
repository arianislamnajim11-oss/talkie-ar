import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCEFRLevel,
  validateCertificateId,
  calculateGameScore,
  canPerformRoomAction,
  validateRoomJoin,
  filterSpeakingRooms,
  updateSpeakingStreak,
} from './rules.ts';

test('calculateCEFRLevel maps percentage boundaries correctly', () => {
  assert.deepEqual(calculateCEFRLevel(98), { level: 'C2', title: 'Proficient / Mastery' });
  assert.deepEqual(calculateCEFRLevel(88), { level: 'C1', title: 'Advanced English' });
  assert.deepEqual(calculateCEFRLevel(75), { level: 'B2', title: 'Upper-Intermediate' });
  assert.deepEqual(calculateCEFRLevel(60), { level: 'B1', title: 'Intermediate' });
  assert.deepEqual(calculateCEFRLevel(45), { level: 'A2', title: 'Elementary' });
  assert.deepEqual(calculateCEFRLevel(20), { level: 'A1', title: 'Beginner' });
  assert.deepEqual(calculateCEFRLevel(-10), { level: 'A1', title: 'Beginner' });
  assert.deepEqual(calculateCEFRLevel(150), { level: 'C2', title: 'Proficient / Mastery' });
});

test('validateCertificateId enforces TAR-2026-XXXXXX format', () => {
  assert.equal(validateCertificateId('TAR-2026-AB12CD'), true);
  assert.equal(validateCertificateId('TAR-2026-9900ZZ'), true);
  assert.equal(validateCertificateId('TAR-2025-AB12CD'), false);
  assert.equal(validateCertificateId('INVALID-ID'), false);
  assert.equal(validateCertificateId(''), false);
});

test('calculateGameScore awards time bonus and streak multiplier', () => {
  const zeroBase = calculateGameScore(0, 20, 5);
  assert.equal(zeroBase, 0);

  const baseScore = calculateGameScore(100, 0, 0);
  assert.equal(baseScore, 100);

  const boostedScore = calculateGameScore(100, 30, 2); // 100 + 50 = 150 * 1.2 = 180
  assert.equal(boostedScore, 180);
});

test('canPerformRoomAction checks permissions strictly', () => {
  assert.equal(canPerformRoomAction('host', 'mute_others'), true);
  assert.equal(canPerformRoomAction('moderator', 'mute_others'), true);
  assert.equal(canPerformRoomAction('speaker', 'mute_others'), false);
  assert.equal(canPerformRoomAction('listener', 'mute_others'), false);

  assert.equal(canPerformRoomAction('host', 'close_room'), true);
  assert.equal(canPerformRoomAction('moderator', 'close_room'), false);
  assert.equal(canPerformRoomAction('speaker', 'close_room'), false);

  assert.equal(canPerformRoomAction('speaker', 'speak'), true);
  assert.equal(canPerformRoomAction('listener', 'speak'), false);
  assert.equal(canPerformRoomAction('listener', 'raise_hand'), true);
});

test('validateRoomJoin enforces capacity, closed state, and private room password', () => {
  // Test capacity check
  const fullRoom = { capacity: 4, currentParticipants: 4, isPrivate: false, status: 'active' as const };
  assert.deepEqual(validateRoomJoin(fullRoom), { allowed: false, reason: 'Room is at full capacity.' });

  // Test closed room check
  const closedRoom = { capacity: 6, currentParticipants: 2, isPrivate: false, status: 'closed' as const };
  assert.deepEqual(validateRoomJoin(closedRoom), { allowed: false, reason: 'This room has been closed by the host.' });

  // Test private room with correct vs incorrect password
  const privateRoom = { capacity: 6, currentParticipants: 2, isPrivate: true, password: 'secret123', status: 'active' as const };
  assert.deepEqual(validateRoomJoin(privateRoom, 'wrong'), { allowed: false, reason: 'Incorrect room password.' });
  assert.deepEqual(validateRoomJoin(privateRoom, 'secret123'), { allowed: true });

  // Test valid public join
  const validPublic = { capacity: 6, currentParticipants: 2, isPrivate: false, status: 'active' as const };
  assert.deepEqual(validateRoomJoin(validPublic), { allowed: true });
});

test('filterSpeakingRooms filters by search, level, and category', () => {
  const sampleRooms = [
    { title: 'IELTS Prep Room', topic: 'Speaking Part 2', category: 'IELTS Practice', level: 'Intermediate', isBeginnerFriendly: false },
    { title: 'Morning Coffee Chat', topic: 'Daily Life', category: 'Everyday English', level: 'All Levels', isBeginnerFriendly: true },
    { title: 'Tech Debates', topic: 'AI ethics', category: 'Debate', level: 'Advanced', isBeginnerFriendly: false },
  ];

  const searchResults = filterSpeakingRooms(sampleRooms, { search: 'coffee' });
  assert.equal(searchResults.length, 1);
  assert.equal(searchResults[0].title, 'Morning Coffee Chat');

  const beginnerOnly = filterSpeakingRooms(sampleRooms, { beginnerOnly: true });
  assert.equal(beginnerOnly.length, 1);

  const ieltsCategory = filterSpeakingRooms(sampleRooms, { category: 'IELTS Practice' });
  assert.equal(ieltsCategory.length, 1);
});

test('updateSpeakingStreak handles daily consecutive days correctly', () => {
  const day1 = '2026-10-10T10:00:00Z';
  const day2 = '2026-10-11T12:00:00Z';
  const day4 = '2026-10-14T09:00:00Z';

  const initial = updateSpeakingStreak(undefined, day1, 0);
  assert.equal(initial.newStreak, 1);

  const nextDay = updateSpeakingStreak(day1, day2, 1);
  assert.equal(nextDay.newStreak, 2);
  assert.equal(nextDay.streakMaintained, true);

  const brokenStreak = updateSpeakingStreak(day1, day4, 5);
  assert.equal(brokenStreak.newStreak, 1);
  assert.equal(brokenStreak.streakMaintained, false);
});
