import { readFile } from "node:fs/promises";

const data = JSON.parse(await readFile(new URL("../data/platforms.json", import.meta.url), "utf8"));
const requiredFields = [
  "name",
  "url",
  "description",
  "category",
  "bestFor",
  "pricing",
  "cadence",
  "evergreen",
  "communityVoting",
  "maintainerProject",
  "tags",
  "linkType",
  "dofollow",
  "domainRating",
  "access"
];
const names = new Set();
const errors = [];

for (const [index, platform] of data.platforms.entries()) {
  for (const field of requiredFields) {
    if (!(field in platform)) errors.push(`Entry ${index + 1} is missing ${field}.`);
  }
  if (!data.categories.includes(platform.category)) {
    errors.push(`${platform.name || `Entry ${index + 1}`} uses an unknown category.`);
  }
  if (!/^https:\/\//.test(platform.url || "")) {
    errors.push(`${platform.name || `Entry ${index + 1}`} must use an HTTPS URL.`);
  }
  const normalizedName = platform.name?.toLowerCase();
  if (names.has(normalizedName)) errors.push(`${platform.name} is listed more than once.`);
  names.add(normalizedName);
  if (typeof platform.linkType !== "string") errors.push(`${platform.name || `Entry ${index + 1}`} is missing linkType.`);
  if (platform.domainRating !== null && !Number.isFinite(platform.domainRating)) {
    errors.push(`${platform.name || `Entry ${index + 1}`} has an invalid domainRating.`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${data.platforms.length} platforms across ${data.categories.length} categories.`);
