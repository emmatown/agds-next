import { ButtonHTMLAttributes } from 'react';
import { BaseButton } from '../button';
import {
	ProgressIndicatorBackground,
	ProgressIndicatorItemStatus,
} from './utils';
import { ProgressIndicatorItem } from './ProgressIndicatorItem';

export type ProgressIndicatorItemButtonProps =
	ButtonHTMLAttributes<HTMLButtonElement> & {
		status: ProgressIndicatorItemStatus;
		background?: ProgressIndicatorBackground;
		isActive?: boolean;
	};

export const ProgressIndicatorItemButton = ({
	children,
	...props
}: ProgressIndicatorItemButtonProps) => (
	<ProgressIndicatorItem as={BaseButton} {...props}>
		{children}
	</ProgressIndicatorItem>
);
