import * as React from "react";

import { FormControl, FormItem, FormMessage } from "../../form";
import { Input } from "../../input";
import AutoFormDescription from "../common/description";
import AutoFormLabel from "../common/label";
import AutoFormTooltip from "../common/tooltip";
import { AutoFormInputComponentProps } from "../types";

export default function AutoFormInput({
	label,
	description,
	isRequired,
	fieldConfigItem,
	fieldProps,
}: AutoFormInputComponentProps) {
	const { showLabel: _showLabel, ...fieldPropsWithoutShowLabel } = fieldProps;
	const showLabel = _showLabel === undefined ? true : _showLabel;
	const type = fieldProps.type || "text";

	return (
		<div className="flex flex-row  items-center space-x-2">
			<FormItem className="flex w-full flex-col justify-start">
				{showLabel && (
					<>
						<AutoFormLabel label={label} isRequired={isRequired} />
						{description && <AutoFormDescription description={description} />}
					</>
				)}
				<FormControl>
					<Input type={type} {...fieldPropsWithoutShowLabel} />
				</FormControl>
				<AutoFormTooltip fieldConfigItem={fieldConfigItem} />
				<FormMessage />
			</FormItem>
		</div>
	);
}
