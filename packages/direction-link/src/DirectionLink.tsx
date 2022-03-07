import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { Flex, linkStyles } from '@ag.ds-next/box';
import { TextLink } from '@ag.ds-next/text';
import {
	ArrowUpIcon,
	ArrowDownIcon,
	ArrowLeftIcon,
	ArrowRightIcon,
} from '@ag.ds-next/icon';
import { forwardRefWithAs, LinkProps } from '@ag.ds-next/core';

export type Direction = 'up' | 'right' | 'down' | 'left';

export type DirectionLinkProps = LinkProps & {
	direction: Direction;
};

export const DirectionLink = ({ children, ...props }: DirectionLinkProps) => (
	<DirectionLinkBase as={TextLink} {...props}>
		{children}
	</DirectionLinkBase>
);

export type DirectionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	direction: Direction;
};

export const DirectionButton = ({
	children,
	...props
}: DirectionButtonProps) => (
	<DirectionLinkBase
		as="button"
		css={[
			linkStyles,
			{
				appearance: 'none',
				background: 'transparent',
				cursor: 'pointer',
				textAlign: 'left',
				fontSize: 'inherit',
			},
		]}
		{...props}
	>
		{children}
	</DirectionLinkBase>
);

type DirectionLinkBaseProps = PropsWithChildren<{
	direction: Direction;
}>;

const DirectionLinkBase = forwardRefWithAs<'div', DirectionLinkBaseProps>(
	function DirectionLinkBase({ children, as, direction, ...props }) {
		const Icon = iconMap[direction];
		const iconLeft = direction === 'left';
		return (
			<Flex
				as={as}
				inline
				gap={0.5}
				alignItems="center"
				color="action"
				fontFamily="body"
				fontWeight="normal"
				focus
				{...props}
			>
				{iconLeft ? <Icon size={1} /> : null}
				{children}
				{!iconLeft ? <Icon size={1} /> : null}
			</Flex>
		);
	}
);

const iconMap = {
	up: ArrowUpIcon,
	right: ArrowRightIcon,
	down: ArrowDownIcon,
	left: ArrowLeftIcon,
} as const;