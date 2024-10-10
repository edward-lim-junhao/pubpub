import { Checkbox } from "ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "ui/form";
import { Input } from "ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "ui/select";

import type { InnerFormProps } from "./types";
import MultivalueBase from "./MultivalueBase";

enum MinMaxChoices {
	AtLeast = "At Least",
	AtMost = "At Most",
	Exactly = "Exactly",
}

export default (props: InnerFormProps) => {
	const { form } = props;
	return (
		<MultivalueBase {...props} label="Checkbox">
			<FormField
				control={form.control}
				name="config.includeOther"
				render={({ field }) => (
					<FormItem className="mt-2">
						<div className="flex items-end gap-x-2">
							<FormControl>
								<Checkbox checked={field.value} onCheckedChange={field.onChange} />
							</FormControl>
							<FormLabel>Allow selection of 'Other' with custom string</FormLabel>
						</div>
						<FormMessage />
					</FormItem>
				)}
			/>
			<div className="grid grid-cols-2 gap-2">
				<FormField
					control={form.control}
					name="config.userShouldSelect"
					render={({ field }) => (
						<FormItem>
							<div className="grid-rows-auto grid gap-2">
								<FormLabel>User Should Select</FormLabel>
								<FormControl>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												{Object.values(MinMaxChoices).map((c) => {
													return (
														<SelectItem key={c} value={c}>
															{c}
														</SelectItem>
													);
												})}
											</SelectGroup>
										</SelectContent>
									</Select>
								</FormControl>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="config.numCheckboxes"
					render={({ field }) => (
						<div className="grid-rows-auto grid gap-2">
							<FormLabel>Checkboxes</FormLabel>
							<FormControl>
								<Input
									type="number"
									{...field}
									value={field.value === undefined ? 0 : field.value}
									onChange={(e) => {
										field.onChange(e.target.valueAsNumber);
									}}
								/>
							</FormControl>
							<FormMessage />
						</div>
					)}
				/>
			</div>
		</MultivalueBase>
	);
};