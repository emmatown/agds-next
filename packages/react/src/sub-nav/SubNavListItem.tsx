import type { PropsWithChildren } from 'react';
import { focusStyles } from '../box';
import {
	boxPalette,
	mapSpacing,
	mq,
	mapResponsiveProp,
	packs,
	tokens,
} from '../core';
import { Flex } from '../flex';
import { localPalette } from './utils';

export type SubNavListItemProps = PropsWithChildren<{
	active?: boolean;
}>;

export function SubNavListItem({ children, active }: SubNavListItemProps) {
	return (
		<Flex
			as="li"
			borderBottom
			css={mq({
				borderBottomColor: mapResponsiveProp([
					boxPalette.borderMuted,
					active ? boxPalette.selected : boxPalette.borderMuted,
				]),
				borderBottomWidth: mapResponsiveProp([
					tokens.borderWidth.sm,
					mapSpacing(0.5),
				]),

				// See https://www.w3.org/TR/CSS21/ui.html#system-colors
				'@media (forced-colors: active)': {
					borderBottomColor: active ? 'Background' : 'MenuText',
				},

				'&:first-of-type': {
					borderTopWidth: mapResponsiveProp([tokens.borderWidth.sm, 0]),
					borderTopStyle: 'solid',
					borderTopColor: boxPalette.borderMuted,

					'@media (forced-colors: active)': {
						borderBottomColor: 'GrayText',
					},
				},

				'& a': {
					flex: 1,
					display: mapResponsiveProp(['flex', 'inline-flex']),
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: mapSpacing(0.5),
					position: 'relative',
					color: active
						? boxPalette.foregroundText
						: boxPalette.foregroundAction,
					padding: mapSpacing(1),
					textDecoration: 'none',
					borderLeftStyle: 'solid',
					borderLeftWidth: mapResponsiveProp([tokens.borderWidth.xl, 0]),
					borderLeftColor: active ? boxPalette.selected : 'transparent',

					// See https://www.w3.org/TR/CSS21/ui.html#system-colors
					'@media (forced-colors: active)': {
						borderLeftColor: active ? 'MenuText' : 'Background',
					},

					...focusStyles,

					'&:hover': {
						color: boxPalette.foregroundText,
						backgroundColor: localPalette.linkHoverBg,
						// Underline the label
						'& > span:first-of-type': packs.underline,
					},
				},
			})}
		>
			{children}
		</Flex>
	);
}
