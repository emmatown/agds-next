import type { PropsWithChildren } from 'react';
import { Box } from '@ag.ds-next/box';
import { themeValues } from '@ag.ds-next/core';

import { localVars } from './utils';

export type SideNavContainerProps = PropsWithChildren<{
	variant: keyof typeof variantMap;
}>;

export const SideNavContainer = ({
	children,
	variant,
	...props
}: SideNavContainerProps) => {
	const { theme, background, hover } = variantMap[variant];
	return (
		<Box
			as="nav"
			fontFamily="body"
			background={background}
			theme={theme}
			fontSize="sm"
			lineHeight="default"
			css={{
				[localVars.linkHoverBg]: themeValues.background[hover],
				[localVars.linkActiveBg]: themeValues.background[background],
			}}
			{...props}
		>
			{children}
		</Box>
	);
};

const variantMap = {
	light: {
		theme: 'light',
		background: 'page',
		hover: 'shade',
	},
	lightAlt: {
		theme: 'light',
		background: 'pageAlt',
		hover: 'shadeAlt',
	},
	dark: {
		theme: 'dark',
		background: 'page',
		hover: 'shade',
	},
	darkAlt: {
		theme: 'dark',
		background: 'pageAlt',
		hover: 'shadeAlt',
	},
} as const;