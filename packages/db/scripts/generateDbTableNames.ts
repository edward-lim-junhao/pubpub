import { writeFile } from "fs/promises";

import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

import { logger } from "logger";

import type { Database } from "../src/Database";

const db = new Kysely<Database>({
	dialect: new PostgresDialect({
		pool: new Pool({
			connectionString: process.env.DATABASE_URL,
		}),
	}),
});

const fileTemplate = (tableNames: string[]) =>
	`// This file is generated by generateDbTableNames.ts
// Do not modify manually

export const databaseTables = ${JSON.stringify(tableNames, null, 2)} as const; 
`;

async function generateDatabaseTables(destination: string, schemas = ["public"]) {
	logger.info(`Generating database tables at ${destination} for schemas ${schemas.join(", ")}`);

	const currentPath = new URL(import.meta.url).pathname;

	const packageDbPath = currentPath.match(/.*?\/packages\/db\//)?.[0];

	const destinationPath = `${packageDbPath}${destination}`;

	const tables = await db.introspection.getTables();

	if (!tables) {
		throw new Error("No tables found");
	}

	const tableNames = tables
		.filter((table) => table.schema && schemas.includes(table.schema))
		.map((table) => table.name);

	return writeFile(destinationPath, fileTemplate(tableNames));
}

const destination = process.argv[2];

if (!destination) {
	throw new Error("No destination provided");
}

if (!destination?.endsWith(".ts")) {
	throw new Error("Destination must be a typescript file");
}

const [, , , ...schemas] = process.argv;

generateDatabaseTables(destination, schemas)
	.then(() => {
		logger.info(`Database tables generated at: ${destination}`);
		process.exit(0);
	})
	.catch((error) => {
		logger.error({ msg: "Error generating database tables", error });
	});
