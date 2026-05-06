import { Paper, Typography } from "@mui/material";

function FinanceStadisticCard({ title, amount, borderColorClass, textColor, bgClass = "" }) {
  return (
    <Paper className={`p-4 border-l-4 ${borderColorClass} ${bgClass} shadow-sm`}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontWeight: "bold", textTransform: "uppercase" }}
      >
        {title}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: "bold", color: textColor }}>
        Bs {amount}
      </Typography>
    </Paper>
  );
}

export default FinanceStadisticCard;
