import { Combobox as HeadlessCombobox } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { useState } from "react";

import { classNames } from "../../utils/classNames";

interface ComboboxProps {
	options: string[];
	defaultValue: string;
	onSelect: (value: string) => void;
	label?: string;
}

const Combobox: React.FunctionComponent<ComboboxProps> = props => {
	const { options, label, defaultValue, onSelect } = props;
	const [query, setQuery] = useState("");
	const [selectedOption, setSelectedOption] = useState<string>(defaultValue);

	const filteredOption =
		query === ""
			? options
			: options.filter(option => {
					return option.toLowerCase().includes(query.toLowerCase());
			  });

	return (
		<HeadlessCombobox
			as="div"
			value={selectedOption}
			onChange={(value: string) => {
				onSelect(value);
				setSelectedOption(value);
			}}>
			<HeadlessCombobox.Label className="block text-sm font-medium text-gray-700">{label}</HeadlessCombobox.Label>
			<div className="relative mt-1">
				<HeadlessCombobox.Input
					className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
					onChange={event => setQuery(event.target.value)}
					displayValue={(option: string) => option}
				/>
				<HeadlessCombobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
					<SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
				</HeadlessCombobox.Button>

				{filteredOption.length > 0 && (
					<HeadlessCombobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
						{filteredOption.map((option, index) => (
							<HeadlessCombobox.Option
								key={index}
								value={option}
								className={({ active }) =>
									classNames(
										"relative cursor-default select-none py-2 pl-8 pr-4",
										active ? "bg-indigo-600 text-white" : "text-gray-900"
									)
								}>
								{({ active, selected }) => (
									<>
										<span className={classNames("block truncate", selected && "font-semibold")}>{option}</span>

										{selected && (
											<span
												className={classNames(
													"absolute inset-y-0 left-0 flex items-center pl-1.5",
													active ? "text-white" : "text-indigo-600"
												)}>
												<CheckIcon className="h-5 w-5" aria-hidden="true" />
											</span>
										)}
									</>
								)}
							</HeadlessCombobox.Option>
						))}
					</HeadlessCombobox.Options>
				)}
			</div>
		</HeadlessCombobox>
	);
};
export default Combobox;
