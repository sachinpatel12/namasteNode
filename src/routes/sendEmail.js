//generate dummy emails for bee queue
const generateDummyEmails = (count = 50) => {
  const emails = [];
  for (let i = 1; i <= count; i++) {
    emails.push(`user${i}@example.com`);
  }
  return emails;
};

module.exports = generateDummyEmails;
