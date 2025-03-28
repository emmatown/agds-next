import { StoryObj, Meta } from '@storybook/react';
import { useCallback, useState } from 'react';
import { sub, subDays, addDays } from 'date-fns';
import { Box } from '../box';
import { Stack } from '../stack';
import { Button, ButtonGroup } from '../button';
import { isValidDate } from '../date-picker-next';
import {
	DateRangePickerNext,
	type DateRange,
	type DateRangePickerNextProps,
} from './DateRangePickerNext';

function ControlledDateRangePickerNext(props: DateRangePickerNextProps) {
	const [range, setRange] = useState<DateRange>({
		from: undefined,
		to: undefined,
	});

	const isFromInvalid = useCallback(
		(value: DateRange['from'], otherDate: DateRange['to']) =>
			!isValidDate(value, {
				toDate: otherDate,
				minDate: props.minDate ? sub(props.minDate, { days: 1 }) : undefined,
			}),
		[props.minDate]
	);

	const isToInvalid = useCallback(
		(value: DateRange['to'], otherDate: DateRange['from']) =>
			!isValidDate(value, {
				fromDate: otherDate,
				maxDate: props.maxDate,
			}),
		[props.maxDate]
	);

	const fromInvalid =
		props.fromInvalid || range.from
			? isFromInvalid(range.from, range.to)
			: false;
	const toInvalid =
		props.toInvalid || range.to ? isToInvalid(range.to, range.from) : false;

	return (
		<DateRangePickerNext
			{...props}
			fromInvalid={fromInvalid}
			message={
				fromInvalid && toInvalid
					? 'Enter valid start and end dates'
					: fromInvalid
					? 'Enter a valid start date'
					: toInvalid
					? 'Enter a valid end date'
					: undefined
			}
			onChange={setRange}
			toInvalid={toInvalid}
			value={range}
		/>
	);
}

const meta: Meta<typeof DateRangePickerNext> = {
	title: 'forms/DateRangePickerNext',
	component: DateRangePickerNext,
	render: ControlledDateRangePickerNext,
};

export default meta;

type Story = StoryObj<typeof DateRangePickerNext>;

export const Basic: Story = {};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
};

const today = new Date();
const lastWeek = subDays(today, 7);
const nextWeek = addDays(today, 7);
export const MinMaxDates: Story = {
	args: {
		minDate: lastWeek,
		maxDate: nextWeek,
	},
};

export const Legend: Story = {
	args: {
		legend: 'Date range',
	},
};

export const HideOptionalLabel: Story = {
	args: {
		legend: 'Date range',
		hideOptionalLabel: true,
	},
};

export const Hint: Story = {
	args: {
		legend: 'Date range',
		hint: 'Hint text',
	},
};

export const Invalid: Story = {
	args: {
		legend: 'Date range',
		fromInvalid: true,
		toInvalid: true,
		message: 'Enter a valid date',
	},
};

export const FromInvalid: Story = {
	args: {
		legend: 'Date range',
		fromInvalid: true,
		message: 'Enter a valid date',
	},
};

export const ToInvalid: Story = {
	args: {
		legend: 'Date range',
		toInvalid: true,
		message: 'Enter a valid date',
	},
};

export const ToInvalidWithHint: Story = {
	args: {
		legend: 'Date range',
		toInvalid: true,
		message: 'Enter a valid date',
		hint: 'Hint text',
	},
};

export const Required: Story = {
	args: {
		legend: 'Date range',
		required: true,
	},
};

export const Labels: Story = {
	args: {
		fromLabel: 'From',
		toLabel: 'To',
	},
};

export const AlternativeDateFormat: Story = {
	args: {
		dateFormat: 'd MMM yyyy',
	},
};

export const CustomAllowedDateFormats: Story = {
	args: {
		allowedDateFormats: ['dd/MM/yyyy', 'dd-MM-yyyy', 'dd MM yyyy'],
	},
};

export const ScrollExample: Story = {
	render: (props) => (
		<Box>
			<Box height="1000px"></Box>
			<ControlledDateRangePickerNext {...props} />
			<Box height="1000px"></Box>
		</Box>
	),
};

export const ClearableExample: Story = {
	render: function Render(props) {
		const [range, setRange] = useState<DateRange>({
			from: undefined,
			to: undefined,
		});
		return (
			<Stack alignItems="flex-start" gap={4}>
				<DateRangePickerNext {...props} onChange={setRange} value={range} />
				<ButtonGroup>
					<Button
						onClick={() =>
							setRange({
								from: new Date(2020, 7, 14),
								to: new Date(2020, 7, 18),
							})
						}
					>
						Set pre-defined range
					</Button>
					<Button
						onClick={() => setRange({ from: undefined, to: undefined })}
						variant="secondary"
					>
						Clear range
					</Button>
				</ButtonGroup>
			</Stack>
		);
	},
};
