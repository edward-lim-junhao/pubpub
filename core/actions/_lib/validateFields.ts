import Ajv from "ajv";

import { logger } from "logger";

import type { BasePubField, CorePubField } from "../corePubFields";

/**
 * TODO: Replace this with a more robust validation implementation
 *
 * This currently does not allow for mapping of field values to a schema
 */
export const validatePubValues = ({
	fields,
	values,
}: {
	fields: BasePubField[];
	values: Record<string, unknown>;
}) => {
	const validator = new Ajv();

	for (const field of fields) {
		const value = values[field.slug];

		if (value === undefined) {
			return { error: `Field ${field.slug} not found in pub values` };
		}

		try {
			const val = validator.validate(field.schema.schema, value);
			if (val !== true) {
				return {
					error: `Field ${field.slug} failed schema validation. Field "${field.name}" of type "${field.slug}" cannot be assigned to value: ${value} of type ${typeof value}`,
				};
			}
		} catch (e) {
			logger.error(e);
			return { error: `Field ${field.slug} failed schema validation` };
		}
	}
};
