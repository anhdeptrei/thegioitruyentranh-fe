import { Typography, Box, useTheme } from '@mui/material';
import { token } from '~/theme';

const Header = ({ title, subtitle }) => {
    const theme = useTheme();
    const colors = token(theme.palette.mode);
    return (
        <Box>
            <Typography variant="h2" color={colors.grey[100]} fontWeight="bold" sx={{ m: '0 0 5px 0' }}>
                {title}
            </Typography>
            <Typography variant="h5" color={colors.greenAccent[400]}>
                {subtitle}
            </Typography>
        </Box>
    );
};

export default Header;
