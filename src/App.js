import { Fragment } from 'react';
import { Routes, Route } from 'react-router-dom';
import { publicRoutes } from '~/routes';
import { DefaultLayout } from '~/components/Layout';
import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import GlobalStylesAdmin from './components/GlobalStyles/admin/GlobalStylesAdmin';
function App() {
    const [theme, colorMode] = useMode();
    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="app">
                    <Routes>
                        {publicRoutes.map((route, index) => {
                            const Page = route.component;

                            let Layout = DefaultLayout;

                            if (route.layout) {
                                Layout = route.layout;
                            } else if (route.layout === null) {
                                Layout = DefaultLayout;
                            }

                            return (
                                <Route
                                    key={`public-${index}`}
                                    path={route.path}
                                    element={
                                        <GlobalStylesAdmin>
                                            <Layout>
                                                <Page />
                                            </Layout>
                                        </GlobalStylesAdmin>
                                    }
                                />
                            );
                        })}
                    </Routes>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;
