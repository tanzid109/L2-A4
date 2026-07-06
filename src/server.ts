import app from "./app";
import { prisma } from "./lib/prisma";

async function main() {
  try {
    await prisma.$connect()
    console.log("prisma connected");
    app.listen(5000, () => {
      console.log(`Server is running on port 5000`);
    });
  } catch (error) {
    console.error("Error Starting the server", error);
    prisma.$disconnect()
    process.exit(1)
  }
}

main();
