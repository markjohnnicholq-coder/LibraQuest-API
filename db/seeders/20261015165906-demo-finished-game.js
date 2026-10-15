'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Idempotency: if already seeded, do nothing
    const [existing] = await queryInterface.sequelize.query(
      `SELECT session_id FROM game_sessions WHERE join_code = '482913' LIMIT 1;`
    );
    if (existing && existing.length > 0) {
      return;
    }

    // 1. Fetch user IDs dynamically (Rule 30: Do Not Guess Generated IDs)
    const [users] = await queryInterface.sequelize.query(
      `SELECT user_id, school_id FROM users WHERE school_id IN ('2099-0001', '2099-0002', '2099-0003', '2099-0004', '2099-0005');`
    );
    const userMap = {};
    users.forEach((u) => {
      userMap[u.school_id] = u.user_id;
    });

    const hostId = userMap['2099-0001'];
    const alexId = userMap['2099-0002'];
    const beaId = userMap['2099-0003'];
    const carloId = userMap['2099-0004'];
    const dianaId = userMap['2099-0005'];

    // 2. Insert question_sets
    const [setResult] = await queryInterface.sequelize.query(
      `INSERT INTO question_sets (title, description, subject, grade_level, created_at)
       VALUES ('Dewey Decimal & Library Basics', 'Foundational library classification questions', 'Library Science', 'College', NOW())
       RETURNING set_id;`
    );
    const setId = setResult[0].set_id;

    // 3. Insert questions
    const [qResults] = await queryInterface.sequelize.query(
      `INSERT INTO questions (set_id, question_text, type, choices, correct_index, time_limit_sec, created_at)
       VALUES
       (${setId}, 'Which Dewey Decimal 100s section represents Philosophy and Psychology?', 'multiple_choice', '["100", "200", "300", "500"]', 0, 30, NOW()),
       (${setId}, 'What is the primary purpose of the Online Public Access Catalog (OPAC)?', 'multiple_choice', '["Search library holdings", "Borrow money", "Reserve cafeteria food", "Print ID cards"]', 0, 30, NOW()),
       (${setId}, 'Where can students find localized Philippine historical documents in the library?', 'multiple_choice', '["Filipiniana Section", "General Fiction", "Science Lab", "Archives only in Manila"]', 0, 30, NOW())
       RETURNING question_id;`
    );
    const question1Id = qResults[0].question_id;

    // 4. Insert finished game_session (Rule 29: closed session with 6-digit join_code and ended_at)
    const [sessionResult] = await queryInterface.sequelize.query(
      `INSERT INTO game_sessions (host_id, question_set_id, join_code, status, started_at, ended_at, created_at)
       VALUES (${hostId}, ${setId}, '482913', 'CLOSED', '2026-10-15 08:00:00+00', '2026-10-15 08:25:00+00', NOW())
       RETURNING session_id;`
    );
    const sessionId = sessionResult[0].session_id;

    // 5. Insert players: 3 completed players, 1 incomplete player, plus a tie for podium
    const [playerResults] = await queryInterface.sequelize.query(
      `INSERT INTO players (session_id, user_id, nickname, score, completed, joined_at, last_seen_at)
       VALUES
       (${sessionId}, ${alexId}, 'AlexSpeed', 150, true, '2026-10-15 08:00:05+00', '2026-10-15 08:25:00+00'),
       (${sessionId}, ${beaId}, 'BeaBookworm', 120, true, '2026-10-15 08:00:10+00', '2026-10-15 08:25:00+00'),
       (${sessionId}, ${carloId}, 'CarloSmart', 120, true, '2026-10-15 08:00:15+00', '2026-10-15 08:25:00+00'),
       (${sessionId}, ${dianaId}, 'DianaRacer', 30, false, '2026-10-15 08:01:00+00', '2026-10-15 08:10:00+00')
       RETURNING player_id, nickname;`
    );

    const alexPlayerId = playerResults.find((p) => p.nickname === 'AlexSpeed').player_id;
    const beaPlayerId = playerResults.find((p) => p.nickname === 'BeaBookworm').player_id;
    const carloPlayerId = playerResults.find((p) => p.nickname === 'CarloSmart').player_id;
    const dianaPlayerId = playerResults.find((p) => p.nickname === 'DianaRacer').player_id;

    // 6. Insert answers
    await queryInterface.bulkInsert('answers', [
      {
        player_id: alexPlayerId,
        question_id: question1Id,
        choice_index: 0,
        time_taken: 4.5,
        correct: true,
        stars_earned: 50,
        created_at: new Date(),
      },
      {
        player_id: beaPlayerId,
        question_id: question1Id,
        choice_index: 0,
        time_taken: 6.2,
        correct: true,
        stars_earned: 40,
        created_at: new Date(),
      },
      {
        player_id: carloPlayerId,
        question_id: question1Id,
        choice_index: 0,
        time_taken: 6.2,
        correct: true,
        stars_earned: 40,
        created_at: new Date(),
      },
      {
        player_id: dianaPlayerId,
        question_id: question1Id,
        choice_index: 1,
        time_taken: 15.0,
        correct: false,
        stars_earned: 0,
        created_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Delete in reverse order of foreign keys
    await queryInterface.sequelize.query(`DELETE FROM answers;`);
    await queryInterface.sequelize.query(`DELETE FROM players;`);
    await queryInterface.sequelize.query(`DELETE FROM game_sessions WHERE join_code = '482913';`);
    await queryInterface.sequelize.query(`DELETE FROM questions;`);
    await queryInterface.sequelize.query(`DELETE FROM question_sets;`);
  },
};
