'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check for idempotency: if seed rows already exist, do nothing
    const [existing] = await queryInterface.sequelize.query(
      `SELECT user_id FROM users WHERE school_id = '2099-0001' LIMIT 1;`
    );
    if (existing && existing.length > 0) {
      return;
    }

    await queryInterface.bulkInsert('users', [
      {
        school_id: '2099-0001',
        full_name: 'Prof. Librario Host',
        email: 'host1@school.test',
        role: 'host',
        created_at: new Date(),
      },
      {
        school_id: '2099-0002',
        full_name: 'Alex Rivera',
        email: 'alex@student.test',
        role: 'player',
        created_at: new Date(),
      },
      {
        school_id: '2099-0003',
        full_name: 'Bea Santos',
        email: 'bea@student.test',
        role: 'player',
        created_at: new Date(),
      },
      {
        school_id: '2099-0004',
        full_name: 'Carlo Dalisay',
        email: 'carlo@student.test',
        role: 'player',
        created_at: new Date(),
      },
      {
        school_id: '2099-0005',
        full_name: 'Diana Prince',
        email: 'diana@student.test',
        role: 'player',
        created_at: new Date(),
      },
      {
        school_id: '2099-0006',
        full_name: 'Evan Cruz',
        email: 'evan@student.test',
        role: 'player',
        created_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      school_id: [
        '2099-0001',
        '2099-0002',
        '2099-0003',
        '2099-0004',
        '2099-0005',
        '2099-0006',
      ],
    });
  },
};
