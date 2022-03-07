import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Box, Stack } from '@ag.ds-next/box';
import { TextInput } from '@ag.ds-next/text-input';
import { Fieldset, FieldsetContainer, FieldsetLegend } from './index';
import { H1 } from '@ag.ds-next/heading';
import { Text } from '@ag.ds-next/text';
import { FieldsetHint } from './FieldsetHint';

export default {
	title: 'forms/Fieldset',
	component: Fieldset,
	subcomponents: { FieldsetContainer, FieldsetLegend, FieldsetHint },
} as ComponentMeta<typeof Fieldset>;

const Template: ComponentStory<typeof Fieldset> = (args) => (
	<Fieldset {...args}>
		<Stack alignItems="flex-start" gap={1.5}>
			<TextInput label="Street and number" required maxWidth="xl" />
			<TextInput label="Suburb" required maxWidth="xl" />
			<TextInput label="Country" required maxWidth="xl" />
			<TextInput label="Postcode" required maxWidth="sm" />
		</Stack>
	</Fieldset>
);

export const OnLight = Template.bind({});
OnLight.args = {
	legend: 'What is your address?',
	hint: 'We will only use this to respond to your requests',
};

export const OnDark: ComponentStory<typeof Fieldset> = (args) => (
	<Box palette="dark" background="body" padding={1.5}>
		<Template {...args} />
	</Box>
);
OnDark.args = {
	legend: 'What is your address?',
	hint: 'We will only use this to respond to your requests',
};
export const LegendAsPageHeading: ComponentStory<typeof Fieldset> = (args) => (
	<Fieldset {...args}>
		<Stack alignItems="flex-start" gap={1.5}>
			<TextInput label="Day" inputMode="numeric" maxWidth="md" required />
			<TextInput label="Month" inputMode="numeric" maxWidth="md" required />
			<TextInput label="Year" inputMode="numeric" maxWidth="md" required />
		</Stack>
	</Fieldset>
);
LegendAsPageHeading.args = {
	legend: <H1>What is your date of birth?</H1>,
	hint: (
		<Text fontSize="md" color="muted">
			We will only use this to respond to your requests
		</Text>
	),
};

export const Modular = () => (
	<FieldsetContainer>
		<Stack gap={0.75}>
			<FieldsetLegend>What is your address?</FieldsetLegend>
			<FieldsetHint>
				We will only use this to respond to your requests
			</FieldsetHint>
		</Stack>
		<Stack alignItems="flex-start" gap={1.5}>
			<TextInput label="Street and number" required maxWidth="xl" />
			<TextInput label="Suburb" required maxWidth="xl" />
			<TextInput label="Country" required maxWidth="xl" />
			<TextInput label="Postcode" required maxWidth="sm" />
		</Stack>
	</FieldsetContainer>
);