import { getStats, initStats } from './src/lib/statsTracker.js';

async function test() {
  try {
    console.log("Testing initStats()...");
    await initStats();
    console.log("Testing getStats()...");
    const stats = await getStats();
    console.log("Result:", stats);
  } catch (err) {
    console.error("Caught error:", err);
  }
}

test();
