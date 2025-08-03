const {
  writeFile,
  readFile,
  access,
} = require("fs").promises;
const { join } = require("path");

const main = async () => {
  try {
    // Check if out directory exists (for static export)
    await access(join(__dirname, "out/404/index.html"));
    
    const file = await readFile(join(__dirname, "out/404/index.html"));
    await writeFile(join(__dirname, "out/404.html"), file);
  } catch (error) {
    // Skip if out directory doesn't exist (Vercel deployment)
    console.log("Skipping post-build script for Vercel deployment");
  }
};

main();