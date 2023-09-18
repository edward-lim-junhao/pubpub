import { PermissionPayload, PermissionPayloadUser } from "./types";

export const getPubUsers = (permissions: PermissionPayload[]) => {
	const users: PermissionPayloadUser[] = [];
	for (const permission of permissions) {
		if (permission.member) {
			users.push(permission.member.user);
		} else if (permission.memberGroup) {
			for (const user of permission.memberGroup.users) {
				users.push(user);
			}
		} else {
			throw new Error("Invalid permission");
		}
	}
	return users;
};
