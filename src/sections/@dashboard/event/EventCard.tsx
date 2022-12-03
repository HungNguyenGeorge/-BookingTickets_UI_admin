import PropTypes from 'prop-types';
// @mui
import { alpha, styled, ThemeProvider } from '@mui/material/styles';
import { Box, Link, Card, Grid, Avatar, Typography, CardContent, Button, Tooltip } from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
import { fShortenNumber } from '../../../utils/formatNumber';
//
import SvgColor from '../../../components/svg-color';
import Iconify from '../../../components/iconify';
import { ThemeContext } from '@emotion/react';

// ----------------------------------------------------------------------

const StyledCardMedia = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)',
});

const StyledTitle = styled(Link)({
  // height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  left: theme.spacing(3),
  bottom: theme.spacing(-2),
}));

const StyledInfo = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  // marginTop: theme.spacing(3),
  color: theme.palette.text.disabled,
}));

const StyledCover = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

EventCard.propTypes = {
  event: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default function EventCard({ event, index, onBooking }) {
  const { cover, name, description, start_date, end_date } = event;
  const latestPostLarge = index === 0;
  const latestPost = index === 1 || index === 2;


  return (
    <Grid item xs={12} sm={latestPostLarge ? 12 : 6} md={latestPostLarge ? 6 : 3}>
      <Card sx={{
        position: 'relative',
        ":hover": {
          boxShadow: "0 2px 15px 0px rgba(0,0,0,0.4 )"
        }
      }}>
        <StyledCardMedia
          sx={{
            ...((latestPostLarge || latestPost) && {
              pt: 'calc(100% * 4 / 3)',
              '&:after': {
                top: 0,
                content: "''",
                width: '100%',
                height: '100%',
                position: 'absolute',
                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
              },
            }),
            ...(latestPostLarge && {
              pt: {
                xs: 'calc(100% * 4 / 3)',
                sm: 'calc(100% * 3 / 4.66)',
              },
            }),
          }}
        >
          <SvgColor
            color="paper"
            src="/assets/icons/shape-avatar.svg"
            sx={{
              width: 80,
              height: 36,
              zIndex: 9,
              bottom: -15,
              position: 'absolute',
              color: 'background.paper',
              ...((latestPostLarge || latestPost) && { display: 'none' }),
            }}
          />
          <StyledAvatar
            alt={name}
            src={name}
            sx={{
              ...((latestPostLarge || latestPost) && {
                zIndex: 9,
                top: 24,
                left: 24,
                width: 40,
                height: 40,
              }),
            }}
          />

          <StyledCover alt={name} src={`/assets/images/covers/cover_${++index}.jpg`} />
        </StyledCardMedia>

        <CardContent
          sx={{
            pt: 4,
            ...((latestPostLarge || latestPost) && {
              bottom: 0,
              width: '100%',
              position: 'absolute',
            }),
          }}
        >
          <Typography gutterBottom variant="caption" sx={{ color: 'text.disabled', display: 'block', fontSize: "1rem" }}>
            {fDate(start_date, "dd/mm/yyyy")} - {fDate(end_date, "dd/mm/yyyy")}
          </Typography>

          <StyledTitle
            color="inherit"
            variant="subtitle2"
            underline="hover"
            sx={{
              ...(latestPostLarge && { typography: 'h5', height: 60 }),
              ...((latestPostLarge || latestPost) && {
                color: 'common.white',
              }),
              cursor: 'pointer'
            }}
          >
            {name}
          </StyledTitle>

          <StyledInfo>
            {/* <Tooltip title={`Total: ${10}`}>
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'default',
                  mr: 1
                }}
              >
                <Iconify icon={"eva:inbox-fill"} sx={{ width: 16, height: 16, mr: 0.5 }} />
                <Typography variant="caption">{fShortenNumber(10)}</Typography>
              </Box>
            </Tooltip>
            <Tooltip title={`Available: ${10}`}>
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'default'
                }}
              >
                <Iconify icon={"eva:checkmark-circle-outline"} sx={{ width: 16, height: 16, mr: 0.5 }} />
                <Typography variant="caption" >{fShortenNumber(10)}</Typography>
              </Box>
            </Tooltip> */}
            <Typography variant="caption" >{description}</Typography>
          </StyledInfo>
          <Button
            variant="contained"
            size="small"
            sx={{
              float: "right",
              marginBottom: "24px"
            }}
            onClick={() => onBooking()}
          >
            Book
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
}
