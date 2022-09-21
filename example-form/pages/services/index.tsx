import { SectionContent } from '@ag.ds-next/content';
import {
	HeroCategoryBanner,
	HeroCategoryBannerTitle,
	HeroCategoryBannerSubtitle,
} from '@ag.ds-next/hero-banner';
import { AppLayout } from '../../components/AppLayout';
import { DocumentTitle } from '../../components/DocumentTitle';
import { ServicesCardList } from '../../components/ServicesCardList';

export default function ServicesPage() {
	return (
		<>
			<DocumentTitle title="Services" />
			<AppLayout>
				<HeroCategoryBanner>
					<HeroCategoryBannerTitle>Services</HeroCategoryBannerTitle>
					<HeroCategoryBannerSubtitle>
						An easier and faster way to connect with government services for
						your business
					</HeroCategoryBannerSubtitle>
				</HeroCategoryBanner>
				<SectionContent>
					<ServicesCardList />
				</SectionContent>
			</AppLayout>
		</>
	);
}