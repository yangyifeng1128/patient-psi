import { readFile } from 'fs/promises';
import path from 'path';

import { kv } from '@vercel/kv';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function deleteAllProfilesFromKV() {
  try {
    const dataFilePath = path.join(process.cwd(), 'app/api/data', 'profiles_8.json');
    const jsonData = JSON.parse(await readFile(dataFilePath, 'utf8'));

    for (const profile of jsonData) {
      const id = profile.id;
      const key = `profile_${id}`;

      await kv.del(key);
      console.log(`Profile with key ${key} deleted successfully`);
    }

    console.log('All profiles deleted successfully');
  } catch (error) {
    console.error('Error deleting profiles from KV:', error);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function deleteCustomPrefixFromKV(prefix: string) {
  try {
    const keys = await kv.keys(prefix);

    for (const key of keys) {
      await kv.del(key);
      console.log(key, 'deleted successfully');
    }
  } catch (error) {
    console.error('Error retrieving keys:', error);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function assignParticipantSessions(userId: string, sessions: string[]) {
  const key = `assigned:${userId}`;
  const value = {
    sessions: sessions,
  };
  await kv.set(key, JSON.stringify(value));
}

async function storeDataToKV() {
  try {
    const dataFilePath = path.join(process.cwd(), 'python/data', 'profiles.json');
    const jsonData = JSON.parse(await readFile(dataFilePath, 'utf8'));

    for (const profile of jsonData) {
      const id = profile.id;
      const key = `profile_${id}`;

      await kv.set(key, JSON.stringify(profile));
      console.log(`Data for ${id} stored successfully with key ${key}`);
    }
  } catch (error) {
    console.error('Error storing data to KV:', error);
  }
}

storeDataToKV();

// Collection of kv keys
// profile_*-*
// ccdResult:${userId}:${chatId}
// ccdTruth:${userId}:${chatId}
// chat:${chatId}
// user:${userId}
// user:chat:${userId}

// curr_profile:${userId}
// type:${userId}:${chatId}
// assigned:${userId}
