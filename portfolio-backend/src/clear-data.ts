import 'dotenv/config';
import connectDB from './config/db';
import Profile from './models/Profile';
import Education from './models/Education';
import SkillGroup from './models/Skill';
import Project from './models/Project';
import Experience from './models/Experience';
import Certification from './models/Certification';
import Achievement from './models/Achievement';

async function clearData() {
  await connectDB();
  console.log('Connected to MongoDB. Clearing mock data...');

  try {
    // Delete all documents in mock collections
    await Profile.deleteMany({});
    console.log('Cleared Profile.');

    await Education.deleteMany({});
    console.log('Cleared Education.');

    await SkillGroup.deleteMany({});
    console.log('Cleared Skills.');

    await Project.deleteMany({});
    console.log('Cleared Projects.');

    await Experience.deleteMany({});
    console.log('Cleared Experience.');

    await Certification.deleteMany({});
    console.log('Cleared Certifications.');

    await Achievement.deleteMany({});
    console.log('Cleared Achievements.');

    console.log('All mock data cleared successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
}

clearData();
