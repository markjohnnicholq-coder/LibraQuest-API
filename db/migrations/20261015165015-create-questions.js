'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      question_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      set_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'question_sets', key: 'set_id' },
        onDelete: 'CASCADE',
      },
      question_text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'multiple_choice',
      },
      choices: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      correct_index: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      time_limit_sec: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 30,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('questions');
  },
};
