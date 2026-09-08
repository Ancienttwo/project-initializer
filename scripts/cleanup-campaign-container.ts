import { cleanupCampaignContainer } from '../src/effects/automation/campaign-container';

const args = process.argv.slice(2);
if (args.length !== 1 || args[0] === '--help') {
  console.error('Usage: bun scripts/cleanup-campaign-container.ts <absolute-protected-journal-directory>');
  process.exit(args[0] === '--help' ? 0 : 2);
}
try {
  console.log(JSON.stringify(await cleanupCampaignContainer(args[0]!)));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
