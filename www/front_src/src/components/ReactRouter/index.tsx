import * as React from 'react';

import { Routes, Route, useHref } from 'react-router-dom';
import { isNil, not, propOr } from 'ramda';
import { useAtomValue } from 'jotai/utils';

import { styled } from '@mui/material';

import { PageSkeleton, useMemoComponent } from '@centreon/ui';

import internalPagesRoutes from '../../reactRoutes';
import { dynamicImport } from '../../helpers/dynamicImport';
import NotAllowedPage from '../../route-components/notAllowedPage';
import BreadcrumbTrail from '../../BreadcrumbTrail';
import useNavigation from '../../Navigation/useNavigation';
import { externalComponentsAtom } from '../../externalComponents/atoms';
import ExternalComponents, {
  ExternalComponent,
} from '../../externalComponents/models';

const PageContainer = styled('div')(({ theme }) => ({
  background: theme.palette.background.default,
  display: 'grid',
  gridTemplateRows: 'auto 1fr',
  height: '100%',
  overflow: 'auto',
}));

const getExternalPageRoutes = ({
  allowedPages,
  pages,
  basename,
}): Array<JSX.Element> => {
  const pageEntries = Object.entries(pages);
  const isAllowedPage = (path): boolean =>
    allowedPages?.find((allowedPage) => path.includes(allowedPage));

  const loadablePages = pageEntries.filter(([path]) => isAllowedPage(path));

  return loadablePages.map(([path, parameter]) => {
    const Page = React.lazy(() => dynamicImport(basename, parameter));

    return (
      <Route
        element={
          <PageContainer>
            <BreadcrumbTrail path={path} />
            <Page />
          </PageContainer>
        }
        key={path}
        path={path}
      />
    );
  });
};

interface Props {
  externalPagesFetched: boolean;
  pages: Record<string, unknown>;
}

const ReactRouterContent = ({
  pages,
  externalPagesFetched,
}: Props): JSX.Element => {
  const { allowedPages } = useNavigation();
  const basename = useHref('/');
  if (!externalPagesFetched || !allowedPages) {
    return <PageSkeleton />;
  }

  return (
    <React.Suspense fallback={<PageSkeleton />}>
      <Routes>
        {internalPagesRoutes.map(({ path, comp: Comp, ...rest }) => (
          <Route
            element={
              <PageContainer>
                {allowedPages.includes(path) ? (
                  <>
                    <BreadcrumbTrail path={path} />
                    <Comp />
                  </>
                ) : (
                  <NotAllowedPage />
                )}
              </PageContainer>
            }
            key={path}
            path={path}
            {...rest}
          />
        ))}
        {getExternalPageRoutes({ allowedPages, basename, pages })}
        {externalPagesFetched && <Route element={<NotAllowedPage />} />}
      </Routes>
    </React.Suspense>
  );
};

const ReactRouter = (): JSX.Element => {
  const externalComponents = useAtomValue(externalComponentsAtom);

  const pages = propOr<undefined, ExternalComponents | null, ExternalComponent>(
    undefined,
    'pages',
    externalComponents,
  );

  const externalPagesFetched = not(isNil(externalComponents));

  return useMemoComponent({
    Component: (
      <ReactRouterContent
        externalPagesFetched={externalPagesFetched}
        pages={pages}
      />
    ),
    memoProps: [externalPagesFetched, pages],
  });
};

export default ReactRouter;
