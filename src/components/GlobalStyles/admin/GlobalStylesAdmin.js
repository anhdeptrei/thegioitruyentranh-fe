import './GlobalStylesAdmin.scss';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from '~/theme';
function GlobalStylesAdmin({ children }) {
    const [theme, colorMode] = useMode();

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default GlobalStylesAdmin;
