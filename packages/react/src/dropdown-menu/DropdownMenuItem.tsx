import {
	ComponentType,
	PropsWithChildren,
	ReactNode,
	useEffect,
	useRef,
} from 'react';
import { boxPalette, forwardRefWithAs, mergeRefs } from '../core';
import { Flex } from '../flex';
import { IconProps } from '../icon';
import { useDropdownMenuContext } from './DropdownMenuContext';
import { useDropdownMenuItemId } from './utils';

export type DropdownMenuItemProps = PropsWithChildren<{
	/** Defines an identifier (ID) which must be unique. */
	id?: string;
	/** Function to be fired following a click event of the item. */
	onClick?: () => void;
	/** Used to add an icon to the start of the item. */
	icon?: ComponentType<IconProps>;
	/** Used to add decorative elements to the end of the item such as Indicator dot or Notification badge. */
	endElement?: ReactNode;
}>;

export const DropdownMenuItem = forwardRefWithAs<'div', DropdownMenuItemProps>(
	function DropdownMenuItem(
		{
			as,
			children,
			onClick: onClickProp,
			endElement,
			icon: Icon,
			id: idProp,
			...props
		},
		forwardedRef
	) {
		const ref = useRef<HTMLElement>(null);
		const { activeDescendantId, closeMenu } = useDropdownMenuContext();

		const id = useDropdownMenuItemId(idProp);
		const isActiveDescendant = id === activeDescendantId;

		// Ensure the active descendant is visible in long lists with overflow
		// Without this, the active item may not be visible on the screen
		useEffect(() => {
			if (!isActiveDescendant) return;
			ref.current?.scrollIntoView({ block: 'nearest' });
		}, [isActiveDescendant]);

		function onClick() {
			onClickProp?.();
			closeMenu();
		}

		return (
			<Flex
				as={as}
				ref={mergeRefs([forwardedRef, ref])}
				role="menuitem"
				tabIndex={-1}
				id={id}
				onClick={onClick}
				alignItems="center"
				justifyContent="space-between"
				background={isActiveDescendant ? 'shade' : 'body'}
				gap={1}
				padding={1}
				link
				focus
				css={{
					...(isActiveDescendant && {
						textDecoration: 'none',
						color: boxPalette.foregroundText,
						backgroundColor: boxPalette.backgroundShade,
					}),
					'&:hover': {
						backgroundColor: boxPalette.backgroundShade,
					},
				}}
				{...props}
			>
				<Flex alignItems="center" gap={1}>
					{Icon ? <Icon color="action" size="md" /> : null}
					<span>{children}</span>
				</Flex>
				{endElement}
			</Flex>
		);
	}
);