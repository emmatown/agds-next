import { SearchIcon } from '../icon';
import { mapSpacing, tokens } from '../core';

export type SearchIconProps = { disabled?: boolean };

export function SearchInputIcon({ disabled }: SearchIconProps) {
	return (
		<SearchIcon
			color="muted"
			css={{
				position: 'absolute',
				top: '50%',
				left: `calc(${mapSpacing(0.75)} + ${tokens.borderWidth.lg}px)`, // Align from the inner border
				transform: 'translateY(-50%)',
				pointerEvents: 'none',
				opacity: disabled ? 0.3 : undefined,
			}}
			size="md"
			weight="regular"
		/>
	);
}
