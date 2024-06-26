import { PropsWithChildren, ReactNode, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';
import {
	mapResponsiveProp,
	mq,
	tokens,
	usePrefersReducedMotion,
	useToggleState,
	useWindowSize,
} from '@ag.ds-next/react/core';
import { backgroundColorMap, Box } from '@ag.ds-next/react/box';
import { BaseButton } from '@ag.ds-next/react/button';
import { Flex } from '@ag.ds-next/react/flex';
import { Stack } from '@ag.ds-next/react/stack';
import { ChevronDownIcon } from '@ag.ds-next/react/icon';
import {
	hoverColorMap,
	CollapsingSideBarBackground,
	collapsingSideBarLocalPalette,
	collapsingSideBarLocalPaletteVars,
	useCollapsingSideBarIds,
} from './utils';

export type CollapsingSideBarProps = PropsWithChildren<{
	/** The HTML element to render the CollapsingSideBar as. */
	as?: CollapsingSideBarContainerElementType;
	/** The aria-label for the CollapsingSideBar. */
	'aria-label'?: string;
	/** If CollapsingSideBar is placed on 'bodyAlt' background, please set this to 'bodyAlt'. */
	background?: CollapsingSideBarBackground;
	/** Used as the title of the expand/collapse trigger on smaller screen sizes. */
	collapseButtonLabel: string;
	/** The title of the CollapsingSideBar. Place a CollapsingSideBarTitle here unless you implement something custom. */
	title?: ReactNode;
	/** The sub title of the CollapsingSideBar. */
	subTitle?: string;
}>;

export function CollapsingSideBar({
	as = 'div',
	'aria-label': ariaLabel,
	background = 'body',
	children,
	collapseButtonLabel,
	title,
}: CollapsingSideBarProps) {
	const { bodyId, buttonId } = useCollapsingSideBarIds();
	const ref = useRef<HTMLDivElement>(null);
	const [isOpen, onToggle] = useToggleState(false, true);

	const prefersReducedMotion = usePrefersReducedMotion();
	const animatedHeight = useSpring({
		from: { display: 'none', height: 0 },
		to: async (next) => {
			// Show the element so it's height can be animated
			if (isOpen) await next({ display: 'block', overflow: 'hidden' });
			// Animate the elements height
			await next({
				overflow: 'hidden',
				height: isOpen ? ref.current?.offsetHeight : 0,
				immediate: prefersReducedMotion,
			});
			// Animation end state
			await next(
				isOpen
					? { height: 'auto', overflow: 'initial' }
					: { display: 'none', overflow: 'initial' }
			);
		},
	});

	const { windowWidth } = useWindowSize();
	const isMobile = (windowWidth || 0) <= tokens.breakpoint.lg - 1;

	return (
		<CollapsingSideBarContainer
			as={as}
			background={background}
			ariaLabel={ariaLabel}
		>
			{title}
			<SideBarCollapseButton
				isOpen={isOpen}
				onClick={onToggle}
				ariaControls={bodyId}
				id={buttonId}
			>
				{collapseButtonLabel}
			</SideBarCollapseButton>
			<animated.div
				id={bodyId}
				// As this component looks similar to an accordion in smaller screen sizes, we need to conditionally add some aria attributes
				{...(isMobile && { role: 'region', 'aria-labelledby': buttonId })}
				style={animatedHeight}
				css={{
					// Overwrite the animated height for tablet/desktop sizes.
					[tokens.mediaQuery.min.md]: {
						overflow: 'unset',
						display: 'block !important',
						height: 'auto !important',
					},
				}}
			>
				<Box ref={ref}>{children}</Box>
			</animated.div>
		</CollapsingSideBarContainer>
	);
}

/** The HTML element to render the CollapsingSideBar as. */
type CollapsingSideBarContainerElementType =
	| 'aside'
	| 'nav'
	| 'section'
	| 'div';

type CollapsingSideBarContainerProps = PropsWithChildren<{
	as: CollapsingSideBarContainerElementType;
	ariaLabel?: string;
	background: CollapsingSideBarBackground;
}>;

const CollapsingSideBarContainer = ({
	as,
	ariaLabel,
	background,
	children,
}: CollapsingSideBarContainerProps) => {
	const hoverColor = hoverColorMap[background];
	return (
		<Stack
			as={as}
			aria-label={ariaLabel}
			background={background}
			gap={{ xs: 0, md: 1 }}
			css={mq({
				[collapsingSideBarLocalPaletteVars.hover]: mapResponsiveProp(
					hoverColor,
					(t) => backgroundColorMap[t]
				),
			})}
		>
			{children}
		</Stack>
	);
};

type SideBarCollapseButtonProps = PropsWithChildren<{
	ariaControls: string;
	id: string;
	isOpen: boolean;
	onClick: () => void;
}>;

/** Button that toggles the CollapsingSideBar. */
export const SideBarCollapseButton = ({
	ariaControls,
	children,
	id,
	isOpen,
	onClick,
}: SideBarCollapseButtonProps) => {
	return (
		<Flex
			as={BaseButton}
			aria-controls={ariaControls}
			aria-expanded={isOpen}
			onClick={onClick}
			id={id}
			color="action"
			fontSize="md"
			lineHeight="heading"
			fontWeight="bold"
			paddingY={1}
			paddingX={{
				xs: 0.75,
				md: 0,
			}}
			justifyContent="space-between"
			alignItems="center"
			width="100%"
			link
			focusRingFor="keyboard"
			borderBottom
			css={{
				'&:hover': {
					background: collapsingSideBarLocalPalette.hover,
				},
				[tokens.mediaQuery.min.md]: {
					display: 'none',
				},
			}}
		>
			{children}
			<ChevronDownIcon
				weight="bold"
				css={{
					transition: `transform ${tokens.transition.duration}ms ${tokens.transition.timingFunction}`,
					transform: `rotate(${isOpen ? 180 : 0}deg)`,
				}}
			/>
		</Flex>
	);
};
