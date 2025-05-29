import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInternshipsTable20250527020000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE internships (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId VARCHAR(36) NOT NULL,
                joinedDate DATE NOT NULL,
                completionDate DATE,
                isCertified BOOLEAN NOT NULL DEFAULT FALSE,
                mentorName VARCHAR(255) NOT NULL,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE internships`);
    }
}