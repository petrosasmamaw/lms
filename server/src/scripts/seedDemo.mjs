import dotenv from 'dotenv';
import { Pool } from 'pg';
import { auth } from '../config/auth.js';
import { db } from '../db/index.js';
import { db } from '../db/index.js';
import { departments, courses } from '../db/schema.js';
import { updateUserProfile, getUserByEmail } from '../services/userService.js';

dotenv.config();

const ADMIN_EMAIL = 'mistrasmamaw@gmail.com';
const ADMIN_PASSWORD = '12345678';
const ADMIN_NAME = 'Asmamaw Admin';

async function ensureAdmin() {
  let user = await getUserByEmail(ADMIN_EMAIL);
  if (!user) {
    await auth.api.signUpEmail({
      body: { name: ADMIN_NAME, email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    });
    user = await getUserByEmail(ADMIN_EMAIL);
  }
  if (user) {
    await updateUserProfile(user.id, {
      role: 'admin',
      departmentId: null,
      year: null,
    });
    console.log('Admin ready:', ADMIN_EMAIL);
  }
}

async function seedContent() {
  const existing = await db.select().from(departments);
  if (existing.length) {
    console.log('Demo departments already exist, skipping content seed');
    return;
  }

  const [se, mgmt] = await db.insert(departments).values([
    { name: 'Software Engineering' },
    { name: 'Management' },
  ]).returning();

  await db.insert(courses).values([
    { name: 'Programming', departmentId: se.id, year: 1 },
    { name: 'Database Systems', departmentId: se.id, year: 2 },
    { name: 'Business Communication', departmentId: mgmt.id, year: 1 },
    { name: 'Operations Management', departmentId: mgmt.id, year: 2 },
  ]);

  console.log('Seeded departments and courses');
}

async function ensureStudent() {
  const email = 'student.demo@example.com';
  const password = '12345678';
  let user = await getUserByEmail(email);
  if (!user) {
    await auth.api.signUpEmail({
      body: { name: 'Demo Student', email, password },
    });
    user = await getUserByEmail(email);
  }
  const depts = await db.select().from(departments);
  const dept = depts[0];
  if (user && dept) {
    await updateUserProfile(user.id, {
      role: 'student',
      departmentId: dept.id,
      year: 1,
    });
    console.log('Student ready:', email, '/ password:', password);
  }
}

async function run() {
  await ensureAdmin();
  await seedContent();
  await ensureStudent();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
