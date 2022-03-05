import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { Fragment, useState } from "react";

import { classNames } from "../../utils/classNames";

interface SelectMenuProps {
	items: unknown[];
	defaultValue?: string;
	title?: string;
	onSelected: (item: unknown) => void;
}

const SelectMenu: React.FunctionComponent<SelectMenuProps> = props => {
	const { title, items, defaultValue, onSelected } = props;
	const [selected, setSelected] = useState({ name: defaultValue || "select" });

	return (
		<Listbox
			value={selected}
			onChange={value => {
				setSelected(value);
				onSelected(value);
			}}>
			{({ open }) => (
				<>
					<Listbox.Label className="block text-sm font-medium text-gray-700">{title}</Listbox.Label>
					<div className="mt-1 relative">
						<Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
							<span className="block truncate">{selected.name}</span>
							<span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
								<SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
							</span>
						</Listbox.Button>

						<Transition
							show={open}
							as={Fragment}
							leave="transition ease-in duration-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0">
							<Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
								{items.map(item => (
									<Listbox.Option
										key={item.name}
										className={({ active }) =>
											classNames(
												active ? "text-white bg-indigo-600" : "text-gray-900",
												"cursor-default select-none relative py-2 pl-8 pr-4"
											)
										}
										value={item}>
										{({ selected, active }) => (
											<>
												<span className={classNames(selected ? "font-semibold" : "font-normal", "block truncate")}>
													{item.name}
												</span>

												{selected ? (
													<span
														className={classNames(
															active ? "text-white" : "text-indigo-600",
															"absolute inset-y-0 left-0 flex items-center pl-1.5"
														)}>
														<CheckIcon className="h-5 w-5" aria-hidden="true" />
													</span>
												) : null}
											</>
										)}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
					</div>
				</>
			)}
		</Listbox>
	);
};

export default SelectMenu;
