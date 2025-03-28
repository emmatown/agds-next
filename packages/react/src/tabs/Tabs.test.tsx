import '@testing-library/jest-dom';
import 'html-validate/jest';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { render, cleanup, screen, act } from '../../../../test-utils';
import { TabButton } from './TabButton';
import { TabList } from './TabList';
import { TabPanel } from './TabPanel';
import { TabPanels } from './TabPanels';
import { Tabs } from './Tabs';

expect.extend(toHaveNoViolations);

afterEach(cleanup);

function renderTabs() {
	return render(
		<Tabs>
			<TabList>
				<TabButton>Tab 1</TabButton>
				<TabButton>Tab 2</TabButton>
				<TabButton>Tab 3</TabButton>
			</TabList>
			<TabPanels>
				<TabPanel>Tab panel 1</TabPanel>
				<TabPanel>Tab panel 2</TabPanel>
				<TabPanel>Tab panel 3</TabPanel>
			</TabPanels>
		</Tabs>
	);
}

function getTabByText(text: string) {
	return screen.getByText(text).parentNode as HTMLButtonElement;
}

describe('Tabs', () => {
	it('renders correctly', () => {
		const { container } = renderTabs();
		expect(container).toMatchSnapshot();
	});

	it('renders valid HTML with no a11y violations', async () => {
		const { container } = renderTabs();
		expect(container).toHTMLValidate({
			extends: ['html-validate:recommended'],
			rules: {
				// react 18s `useId` break this rule
				'valid-id': 'off',
			},
		});
		expect(await axe(container)).toHaveNoViolations();
	});

	it('flattens children correctly', async () => {
		render(
			<Tabs>
				<TabList>
					{undefined}
					{[1, 2].map((i) => (
						<TabButton key={i}>Tab {i}</TabButton>
					))}
					<TabButton>Tab 3</TabButton>
				</TabList>
				{false}
				<TabPanels>
					{undefined}
					{[1, 2].map((i) => (
						<TabPanel key={i}>Tab panel 1</TabPanel>
					))}
					<TabPanel>Tab panel 3</TabPanel>
					{false}
				</TabPanels>
			</Tabs>
		);

		// There should be 3 children of the "TabList" component
		const tablist = await screen.findByRole('tablist');
		expect(tablist.childElementCount).toEqual(3);

		// There should be a total of 3 "TabButton" components
		const tabs = await screen.findAllByRole('tab');
		expect(tabs.length).toEqual(3);

		// There should be a total of 3 "TabPanel" components
		// Enabling 'hidden' since inactive panels are not queried by default
		// https://testing-library.com/docs/queries/byrole/#hidden
		const panel = await screen.findAllByRole('tabpanel', { hidden: true });
		expect(panel.length).toEqual(3);
	});

	it('renders the correct ARIA tags', async () => {
		renderTabs();

		const firstTab = getTabByText('Tab 1');
		const firstPanel = screen.getByText('Tab panel 1');

		expect(firstTab).toBeInTheDocument();
		expect(firstTab).toHaveAttribute('role', 'tab');
		expect(firstTab).toHaveAttribute('tabIndex', '0');
		expect(firstTab).toHaveAttribute('aria-selected', 'true');
		expect(firstTab).toHaveAttribute('aria-controls', firstPanel.id);

		expect(firstPanel).toBeInTheDocument();
		expect(firstPanel).toHaveAttribute('role', 'tabpanel');
		expect(firstPanel).toHaveAttribute('tabIndex', '0');
		expect(firstPanel).toHaveAttribute('aria-labelledby', firstTab.id);

		const secondTab = getTabByText('Tab 2');
		const secondPanel = screen.getByText('Tab panel 2');

		expect(secondTab).toBeInTheDocument();
		expect(secondTab).toHaveAttribute('role', 'tab');
		expect(secondTab).toHaveAttribute('tabIndex', '-1');
		expect(secondTab).toHaveAttribute('aria-selected', 'false');
		expect(secondTab).toHaveAttribute('aria-controls', secondPanel.id);

		expect(secondPanel).toBeInTheDocument();
		expect(secondPanel).toHaveAttribute('role', 'tabpanel');
		expect(secondPanel).toHaveAttribute('tabIndex', '-1');
		expect(secondPanel).toHaveAttribute('aria-labelledby', secondTab.id);

		const thirdTab = getTabByText('Tab 3');
		const thirdPanel = screen.getByText('Tab panel 3');

		expect(thirdTab).toBeInTheDocument();
		expect(thirdTab).toHaveAttribute('role', 'tab');
		expect(thirdTab).toHaveAttribute('tabIndex', '-1');
		expect(thirdTab).toHaveAttribute('aria-selected', 'false');
		expect(thirdTab).toHaveAttribute('aria-controls', thirdPanel.id);

		expect(thirdPanel).toBeInTheDocument();
		expect(thirdPanel).toHaveAttribute('role', 'tabpanel');
		expect(thirdPanel).toHaveAttribute('tabIndex', '-1');
		expect(thirdPanel).toHaveAttribute('aria-labelledby', thirdTab.id);
	});

	it('responds to arrow keys keyboard events', async () => {
		renderTabs();
		const user = userEvent.setup();

		const tab1 = getTabByText('Tab 1');
		const tab2 = getTabByText('Tab 2');
		const tab3 = getTabByText('Tab 3');

		// Focus the first tab to activate keyboard navigation
		tab1.focus();
		expect(tab1).toHaveAttribute('aria-selected', 'true');
		expect(tab1).toHaveFocus();
		expect(tab2).toHaveAttribute('aria-selected', 'false');
		expect(tab3).toHaveAttribute('aria-selected', 'false');

		// After pressing the "Right" arrow key, the second tab should be selected
		await act(() => user.keyboard('[ArrowRight]'));
		expect(tab1).toHaveAttribute('aria-selected', 'false');
		expect(tab2).toHaveAttribute('aria-selected', 'true');
		expect(tab2).toHaveFocus();
		expect(tab3).toHaveAttribute('aria-selected', 'false');

		// After pressing the "Left" arrow key, the first tab should be selected
		await act(() => user.keyboard('[ArrowLeft]'));
		expect(tab1).toHaveAttribute('aria-selected', 'true');
		expect(tab1).toHaveFocus();
		expect(tab2).toHaveAttribute('aria-selected', 'false');
		expect(tab3).toHaveAttribute('aria-selected', 'false');

		// After pressing the "Right" arrow key twice, the third tab should be selected
		await act(() => user.keyboard('[ArrowRight]'));
		expect(tab2).toHaveFocus();

		await act(() => user.keyboard('[ArrowRight]'));
		expect(tab1).toHaveAttribute('aria-selected', 'false');
		expect(tab2).toHaveAttribute('aria-selected', 'false');
		expect(tab3).toHaveAttribute('aria-selected', 'true');
		expect(tab3).toHaveFocus();

		// When you are on the last tab and press the "Right" arrow key, the first tab should be selected
		await act(() => user.keyboard('[ArrowRight]'));
		expect(tab1).toHaveAttribute('aria-selected', 'true');
		expect(tab1).toHaveFocus();
		expect(tab2).toHaveAttribute('aria-selected', 'false');
		expect(tab3).toHaveAttribute('aria-selected', 'false');

		// When you are on the first tab and press the "Left" arrow key, the last tab should be selected
		await act(() => user.keyboard('[ArrowLeft]'));
		expect(tab1).toHaveAttribute('aria-selected', 'false');
		expect(tab2).toHaveAttribute('aria-selected', 'false');
		expect(tab3).toHaveAttribute('aria-selected', 'true');
		expect(tab3).toHaveFocus();
	});

	it('responds to home/end keys keyboard events', async () => {
		renderTabs();
		const user = userEvent.setup();

		const firstTab = getTabByText('Tab 1');
		const lastTab = getTabByText('Tab 3');

		// Focus the first tab to activate keyboard navigation
		firstTab.focus();
		expect(firstTab).toHaveAttribute('aria-selected', 'true');

		// Pressing the "End" key should select the last tab
		await act(() => user.keyboard('[END]'));
		expect(lastTab).toHaveAttribute('aria-selected', 'true');
		expect(lastTab).toHaveFocus();
		expect(firstTab).toHaveAttribute('aria-selected', 'false');

		// Pressing the "Home" key should select the first tab
		await act(() => user.keyboard('[HOME]'));
		expect(firstTab).toHaveAttribute('aria-selected', 'true');
		expect(firstTab).toHaveFocus();
		expect(lastTab).toHaveAttribute('aria-selected', 'false');
	});
});
