import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const questions = [
  // Leadership & Vision
  { text: 'Demonstrates clear vision and strategic thinking', category: 'Leadership & Vision', order: 1 },
  { text: 'Inspires and motivates others', category: 'Leadership & Vision', order: 2 },
  { text: 'Makes effective decisions under pressure', category: 'Leadership & Vision', order: 3 },

  // Communication & Collaboration
  { text: 'Communicates clearly and effectively', category: 'Communication & Collaboration', order: 4 },
  { text: 'Actively listens to others\' perspectives', category: 'Communication & Collaboration', order: 5 },
  { text: 'Collaborates well across teams', category: 'Communication & Collaboration', order: 6 },
  { text: 'Provides constructive feedback', category: 'Communication & Collaboration', order: 7 },

  // Performance & Results
  { text: 'Consistently delivers high-quality work', category: 'Performance & Results', order: 8 },
  { text: 'Meets deadlines and commitments', category: 'Performance & Results', order: 9 },
  { text: 'Takes initiative and ownership', category: 'Performance & Results', order: 10 },

  // Professional Development
  { text: 'Continuously learns and develops new skills', category: 'Professional Development', order: 11 },
  { text: 'Adapts well to change', category: 'Professional Development', order: 12 },
  { text: 'Shares knowledge with others', category: 'Professional Development', order: 13 },

  // Interpersonal Skills
  { text: 'Builds positive working relationships', category: 'Interpersonal Skills', order: 14 },
  { text: 'Shows respect and empathy', category: 'Interpersonal Skills', order: 15 },
  { text: 'Handles conflicts constructively', category: 'Interpersonal Skills', order: 16 },

  // Overall Assessment
  { text: 'Overall effectiveness in their role', category: 'Overall Assessment', order: 17 },
  { text: 'What are the key areas for development? (Please provide specific examples)', category: 'Overall Assessment', order: 18 },
];

async function main() {
  console.log('Seeding database...');

  // Clear existing questions
  await prisma.question.deleteMany();

  // Seed questions
  for (const question of questions) {
    await prisma.question.create({
      data: question,
    });
  }

  console.log('Seeded 18 questions successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
