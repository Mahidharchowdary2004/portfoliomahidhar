import 'dotenv/config';
import connectDB from './config/db';
import Profile from './models/Profile';

async function updateDb() {
  await connectDB();
  const profile = await Profile.findOne();
  if (profile) {
    profile.availability = 'Available for Internship, Full-Time, Remote, Hybrid, Relocation';
    await profile.save();
    console.log('Availability updated in DB successfully.');
  } else {
    console.log('No profile document found in DB.');
  }
  process.exit(0);
}

updateDb().catch(err => {
  console.error(err);
  process.exit(1);
});
