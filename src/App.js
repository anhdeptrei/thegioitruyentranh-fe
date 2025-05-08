import { Fragment } from 'react';
import { Routes, Route } from 'react-router-dom';
import { publicRoutes } from '~/routes';
import { AdminDefaultLayout } from '~/components/Layout';
import GlobalStylesAdmin from './components/GlobalStyles/admin/GlobalStylesAdmin';
import GlobalStylesClient from './components/GlobalStyles/client/GlobalStylesClient';
import DefaultLayout from './components/Layout/Client/DefaultLayout';

function App() {
    return (
        <Routes>
            {publicRoutes.map((route, index) => {
                const Page = route.component;
                const Globle = route.globle;
                let Layout = DefaultLayout;

                if (route.layout) {
                    Layout = route.layout;
                } else if (route.layout === null) {
                    Layout = AdminDefaultLayout;
                }

                return (
                    <Route
                        key={`public-${index}`}
                        path={route.path}
                        element={
                            <Globle>
                                <Layout>
                                    <Page />
                                </Layout>
                            </Globle>
                        }
                    />
                );
            })}
        </Routes>

        // <ColorModeContext.Provider value={colorMode}>
        //     <ThemeProvider theme={theme}>
        //         <CssBaseline />
        //         <div className="app">
        //             <Routes>
        //                 {/* {privateRoutes.map((route, index) => {
        //                     const Page = route.component;

        //                     let Layout = AdminDefaultLayout;

        //                     if (route.layout) {
        //                         Layout = route.layout;
        //                     } else if (route.layout === null) {
        //                         Layout = Fragment;
        //                     }

        //                     return (
        //                         <Route
        //                             key={`private-${index}`}
        //                             path={route.path}
        //                             element={
        //                                 <RoleBasedRoute allowedRole={route.role}>
        //                                     <Layout>
        //                                         <Page />
        //                                     </Layout>
        //                                 </RoleBasedRoute>
        //                             }
        //                         />
        //                     );
        //                 })} */}
        //                 {publicRoutes.map((route, index) => {
        //                     const Page = route.component;

        //                     let Layout = AdminDefaultLayout;

        //                     if (route.layout) {
        //                         Layout = route.layout;
        //                     } else if (route.layout === null) {
        //                         Layout = AdminDefaultLayout;
        //                     }

        //                     return (
        //                         <Route key={`public-${index}`} path={route.path}>
        //                             <GlobalStylesClient>
        //                                 <Layout>
        //                                     <Page />
        //                                 </Layout>
        //                             </GlobalStylesClient>
        //                         </Route>
        //                     );
        //                 })}
        //             </Routes>
        //         </div>
        //     </ThemeProvider>
        // </ColorModeContext.Provider>
    );
}

export default App;
