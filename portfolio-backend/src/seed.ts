import 'dotenv/config';
import bcrypt from 'bcryptjs';
import connectDB from './config/db';

import Admin from './models/Admin';

async function seed(): Promise<void> {
  await connectDB();

  // --- Admin login ---
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'change-this-password';
  const existingAdmin = await Admin.findOne({ username });
  const passwordHash = await bcrypt.hash(password, 10);
  if (!existingAdmin) {
    await Admin.create({ username, passwordHash });
    console.log(`Admin user created: ${username}`);
  } else {
    existingAdmin.passwordHash = passwordHash;
    await existingAdmin.save();
    console.log(`Admin user password updated: ${username}`);
  }

  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});

