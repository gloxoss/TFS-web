/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    // Access token field is now included in the quotes collection creation migration
    // This migration is no longer needed but kept for migration history
    console.log('Access token field migration skipped - field included in collection creation');
}, (app) => {
    // No rollback needed - field is part of collection creation
    console.log('Access token field rollback skipped - field is part of collection creation');
})