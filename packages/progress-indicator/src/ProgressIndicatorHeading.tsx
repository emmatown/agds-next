import { Flex } from '@ag.ds-next/box';
import { Text } from '@ag.ds-next/text';

export type ProgressIndicatorHeadingProps = {
	title?: string;
	subTitle?: string;
};

export const ProgressIndicatorHeading = ({
	title,
	subTitle,
}: ProgressIndicatorHeadingProps) => {
	return (
		<Flex
			gap={0.25}
			flexDirection="column"
			display={{ xs: 'none', md: 'flex' }}
		>
			{title ? (
				<Text as="span" fontSize="md" fontWeight="bold" lineHeight="heading">
					{title}
				</Text>
			) : null}
			{subTitle ? (
				<Text as="span" color="muted" lineHeight="heading">
					{subTitle}
				</Text>
			) : null}
		</Flex>
	);
};