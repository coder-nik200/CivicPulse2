export const generateIssueId = () => {
  const date = new Date();

  const datePart = date.toISOString().slice(0, 10).replace(/-/g, "");

  const randomPart = Math.floor(10000 + Math.random() * 90000);

  return `CP-${datePart}-${randomPart}`;
};
