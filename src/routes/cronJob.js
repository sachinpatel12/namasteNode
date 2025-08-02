const cron = require('node-cron');


// cron.schedule('* * * * *', () => {
//   console.log('running a task every minute');


// //this code is for bee queue but implement this when you learn redis
// //    const allEmails = generateDummyEmails();
// //   const batchSize = 10;

// //   for (let i = 0; i < allEmails.length; i += batchSize) {
// //     const batch = allEmails.slice(i, i + batchSize);
// //     emailQueue.createJob({ emails: batch }).save();
// //   }
// });