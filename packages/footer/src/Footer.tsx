import { Flex, Stack } from '@ag.ds-next/box';
import { tokens, globalVars } from '@ag.ds-next/core';
import type { PropsWithChildren } from 'react';

type FooterProps = PropsWithChildren<{
	variant?: 'light' | 'lightAlt' | 'dark' | 'darkAlt';
}>;

export const Footer = ({ variant = 'dark', children }: FooterProps) => {
	return (
		<Flex
			as="footer"
			justifyContent="center"
			background={variantMap[variant].background}
			color="text"
			theme={variantMap[variant].theme}
			paddingY={3}
			css={{
				borderTop: '4px solid',
				borderColor: globalVars.accent,

				li: {
					marginLeft: 0,
				},

				hr: {
					borderColor: globalVars.accent,
				},
			}}
		>
			<Stack
				maxWidth={tokens.maxWidth.container}
				width="100%"
				gap={1.5}
				paddingX={tokens.containerPadding}
			>
				{children}
			</Stack>
		</Flex>
	);
};

const variantMap = {
	light: {
		theme: 'light',
		background: 'page',
	},
	lightAlt: {
		theme: 'light',
		background: 'pageAlt',
	},
	dark: {
		theme: 'dark',
		background: 'page',
	},
	darkAlt: {
		theme: 'dark',
		background: 'pageAlt',
	},
} as const;
