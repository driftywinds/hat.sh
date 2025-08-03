import { Chip } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: "0.75rem",
  height: "20px",
  "& .MuiChip-label": {
    padding: "0 8px",
  },
}));

const VersionBadge = ({ version }) => {
  return <StyledChip label={`v${version}`} size="small" />;
};

export default VersionBadge;
