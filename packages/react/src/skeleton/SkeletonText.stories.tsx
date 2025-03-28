import { StoryObj, Meta } from '@storybook/react';
import { Stack } from '../stack';
import { Text } from '../text';
import { FontSize, tokens } from '../core';
import { Columns, Column } from '../columns';
import { SkeletonText } from './SkeletonText';

const meta: Meta<typeof SkeletonText> = {
	title: 'content/Skeleton/SkeletonText',
	component: SkeletonText,
};

export default meta;

type Story = StoryObj<typeof SkeletonText>;

export const Basic: Story = {
	args: {
		fontSize: 'sm',
		width: '100%',
	},
};

export const Sizes: Story = {
	render: ({ lineHeight }) => {
		const sizes = Object.keys(tokens.fontSize.sm).reverse() as FontSize[];
		return (
			<Stack gap={1.5}>
				{sizes.map((size) => (
					<Columns gap={[0.5, 1.5]} key={size}>
						<Column columnSpan={[12, 6]}>
							<SkeletonText
								fontSize={size}
								key={size}
								lineHeight={lineHeight}
							/>
						</Column>
						<Column columnSpan={[12, 6]}>
							<Text
								border
								display="block"
								fontSize={size}
								lineHeight={lineHeight}
							>
								Text {size}
							</Text>
						</Column>
					</Columns>
				))}
			</Stack>
		);
	},
	args: {
		lineHeight: 'default',
	},
};
