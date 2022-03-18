import type { NextPage } from 'next';
import { Stack } from '@ag.ds-next/box';
import { Content } from '@ag.ds-next/content';
import { Columns, Column } from '@ag.ds-next/columns';
import { ProgressIndicator } from '@ag.ds-next/progress-indicator';
import { AppLayout } from '../components/AppLayout';
import { DocumentTitle } from '../components/DocumentTitle';
import { FormExampleMultiStep } from '../components/FormExampleMultiStep';

const FormMultiStepPage: NextPage = () => {
	return (
		<>
			<DocumentTitle title="Multi step form example" />
			<AppLayout>
				<Content>
					<Stack gap={3}>
						<Columns>
							<Column columnSpan={{ xs: 12, md: 3 }}>
								<ProgressIndicator
									items={[
										{
											label: 'Personal details',
											status: 'doing',
										},
										{
											label: 'Contact details',
											status: 'todo',
										},
										{
											label: 'Notification preferences',
											status: 'todo',
										},
									]}
								/>
							</Column>
							<Column columnSpan={{ xs: 12, md: 8 }} columnStart={{ md: 5 }}>
								<FormExampleMultiStep />
							</Column>
						</Columns>
					</Stack>
				</Content>
			</AppLayout>
		</>
	);
};

export default FormMultiStepPage;
