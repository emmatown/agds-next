import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { MDXRemote } from 'next-mdx-remote';
import { InpageNav } from '@ag.ds-next/react/inpage-nav';
import { Prose } from '@ag.ds-next/react/prose';
import { mdxComponents } from '../../components/mdxComponents';
import { SiteLayout } from '../../components/SiteLayout';
import { DocumentTitle } from '../../components/DocumentTitle';
import { PageLayout } from '../../components/PageLayout';
import { PageTitle } from '../../components/PageTitle';
import {
	getFoundationList,
	getFoundation,
	getFoundationBreadcrumbs,
	Foundation,
} from '../../lib/mdx/foundations';
import { generateToc } from '../../lib/generateToc';

export default function FoundationsPage({
	breadcrumbs,
	foundation,
	toc,
}: InferGetStaticPropsType<typeof getStaticProps>) {
	return (
		<>
			<DocumentTitle
				description={foundation.description}
				title={foundation.title}
			/>
			<SiteLayout>
				<PageLayout
					breadcrumbs={breadcrumbs}
					editPath={`/docs/content/foundations/${foundation.slug}.mdx`}
				>
					<PageTitle
						introduction={foundation.description}
						title={foundation.title}
					/>
					{toc?.length > 1 ? (
						<InpageNav
							links={toc.map((i) => ({ label: i.title, href: `#${i.slug}` }))}
							title="On this page"
						/>
					) : null}
					<Prose>
						<MDXRemote {...foundation.source} components={mdxComponents} />
					</Prose>
				</PageLayout>
			</SiteLayout>
		</>
	);
}

export const getStaticProps: GetStaticProps<
	{
		breadcrumbs: Awaited<ReturnType<typeof getFoundationBreadcrumbs>>;
		foundation: Foundation;
		toc: Awaited<ReturnType<typeof generateToc>>;
	},
	{ slug: string }
> = async ({ params }) => {
	const { slug } = params ?? {};
	const foundation = slug ? await getFoundation(slug) : undefined;

	if (!(foundation && slug)) {
		return { notFound: true };
	}

	const breadcrumbs = await getFoundationBreadcrumbs(slug);
	const toc = generateToc(foundation.content);

	return {
		props: {
			breadcrumbs,
			foundation,
			toc,
		},
	};
};

export const getStaticPaths = async () => {
	const foundations = await (
		await getFoundationList()
	).filter(({ slug }) => !['tokens'].includes(slug));

	return {
		paths: foundations.map(({ slug }) => ({
			params: { slug },
		})),
		fallback: false,
	};
};
