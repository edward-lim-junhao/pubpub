// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { z } from "zod";

/** Represents the enum public.ApiAccessType */
enum ApiAccessType {
	read = "read",
	write = "write",
	archive = "archive",
}

export default ApiAccessType;

/** Zod schema for ApiAccessType */
export const apiAccessTypeSchema = z.nativeEnum(ApiAccessType);
