import '@testing-library/jest-dom';
import 'html-validate/jest';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, screen } from '../../../../test-utils';
import { ProgressIndicator, ProgressIndicatorProps } from './ProgressIndicator';
import {
	activeProgressStatusAllowedList,
	allProgressStatuses,
	ProgressIndicatorItemStatus,
	ProgressIndicatorItem,
} from './utils';

expect.extend(toHaveNoViolations);

function createLegacyList(
	activeStatus: ProgressIndicatorItemStatus,
	extraProperties: Partial<ProgressIndicatorItem>
): ProgressIndicatorProps {
	return {
		items: [
			{
				...extraProperties,
				label: 'Done',
				status: 'done',
				isActive: activeStatus === 'done',
			},
			{
				...extraProperties,
				label: 'Blocked',
				status: 'blocked',
				isActive: activeStatus === 'blocked',
			},
			{
				...extraProperties,
				label: 'Doing',
				status: 'doing',
				isActive: activeStatus === 'doing',
			},
			{
				...extraProperties,
				label: 'Error',
				status: 'error',
				isActive: activeStatus === 'error',
			},
			{
				...extraProperties,
				label: 'Saved',
				status: 'saved',
				isActive: activeStatus === 'saved',
			},
			{
				...extraProperties,
				label: 'Started',
				status: 'started',
				isActive: activeStatus === 'started',
			},
			{
				...extraProperties,
				label: 'To do',
				status: 'todo',
				isActive: activeStatus === 'todo',
			},
		],
	};
}

function renderProgressIndicator(props: ProgressIndicatorProps) {
	return render(<ProgressIndicator {...props} />);
}

describe('ProgressIndicator', () => {
	describe('With anchors', () => {
		const exampleProps: ProgressIndicatorProps = {
			items: [
				{ href: '#', label: 'Done', status: 'done' },
				{ href: '#', label: 'Blocked', status: 'blocked' },
				{ href: '#', label: 'Doing', status: 'doing' },
				{ href: '#', label: 'Error', status: 'error' },
				{ href: '#', label: 'Saved', status: 'saved' },
				{ href: '#', label: 'Started', status: 'started' },
				{ href: '#', label: 'To do', status: 'todo' },
			],
		};

		it('renders correctly', () => {
			const { container } = renderProgressIndicator(exampleProps);
			expect(container).toMatchSnapshot();
		});

		it('renders valid HTML with no a11y violations', async () => {
			const { container } = renderProgressIndicator(exampleProps);
			expect(container).toHTMLValidate({
				extends: ['html-validate:recommended'],
				rules: {
					'no-inline-style': 'off',
					// react 18s `useId` break this rule
					'valid-id': 'off',
				},
			});
			expect(await axe(container)).toHaveNoViolations();
		});
	});

	describe('With buttons', () => {
		const exampleProps: ProgressIndicatorProps = {
			items: [
				{
					onClick: console.log,
					label: 'Done',
					status: 'done',
				},
				{
					onClick: console.log,
					label: 'Blocked',
					status: 'blocked',
				},
				{
					onClick: console.log,
					label: 'Doing',
					status: 'doing',
				},
				{
					onClick: console.log,
					label: 'Error',
					status: 'error',
				},
				{
					onClick: console.log,
					label: 'Saved',
					status: 'saved',
				},
				{
					onClick: console.log,
					label: 'Started',
					status: 'started',
				},
				{
					onClick: console.log,
					label: 'To do',
					status: 'todo',
				},
			],
		};

		it('renders correctly', () => {
			const { container } = renderProgressIndicator(exampleProps);
			expect(container).toMatchSnapshot();
		});

		it('renders valid HTML with no a11y violations', async () => {
			const { container } = renderProgressIndicator(exampleProps);
			expect(container).toHTMLValidate({
				extends: ['html-validate:recommended'],
				rules: {
					'no-inline-style': 'off',
					// react 18s `useId` break this rule
					'valid-id': 'off',
				},
			});
			expect(await axe(container)).toHaveNoViolations();
		});
	});

	describe('legacy handlers', () => {
		describe('With isActive applied', () => {
			allProgressStatuses.forEach((status) => {
				const isWhiteListedStatus =
					activeProgressStatusAllowedList.includes(status);

				describe(`${status} status active`, () => {
					function runTest(
						extraProperties: Partial<ProgressIndicatorItem>
					): void {
						try {
							const { container } = renderProgressIndicator(
								createLegacyList(status, extraProperties)
							);
							if (isWhiteListedStatus) {
								expect(container).toMatchSnapshot();
							}
						} catch (err) {
							expect((err as Error).message).toBe(
								`The "${status}" status cannot be set to active. Please use one of the following status types instead: ${activeProgressStatusAllowedList.join(
									', '
								)}`
							);
						}
					}

					it('renders active link', () => {
						runTest({ href: '#' });
					});

					it('renders active button', () => {
						runTest({ onClick: console.log });
					});
				});
			});

			describe('renders valid HTML with no a11y violations', () => {
				it('renders valid active link', async () => {
					const { container } = renderProgressIndicator(
						createLegacyList('started', { href: '#' })
					);
					expect(container).toHTMLValidate({
						extends: ['html-validate:recommended'],
						rules: {
							'no-inline-style': 'off',
							// react 18s `useId` break this rule
							'valid-id': 'off',
						},
					});
					expect(await axe(container)).toHaveNoViolations();
				});

				it('renders valid active button', async () => {
					const { container } = renderProgressIndicator(
						createLegacyList('started', { onClick: console.log })
					);
					expect(container).toHTMLValidate({
						extends: ['html-validate:recommended'],
						rules: {
							'no-inline-style': 'off',
							// react 18s `useId` break this rule
							'valid-id': 'off',
						},
					});
					expect(await axe(container)).toHaveNoViolations();
				});
			});
		});

		describe('when the "doing" status is defined plus both `isActive` and `activePath` are not defined', () => {
			test.each([
				['Introduction Completed', false],
				['Submit evidence In progress', true],
				['Organisations In progress', true],
			])('then %s has an active status of %s', (label, isActiveStep) => {
				render(
					<ProgressIndicator
						items={[
							{
								label: 'Introduction',
								status: 'done',
								href: '/introduction',
							},
							{
								label: 'Submit evidence',
								status: 'doing',
								href: '/evidence',
							},
							{
								label: 'Organisations',
								status: 'doing',
								href: '/organisations',
							},
						]}
					/>
				);

				const step = screen.getByRole('link', {
					name: label,
					hidden: true,
					current: isActiveStep,
				});

				expect(step).toBeInTheDocument();
			});
		});
	});
});
