import "./App.css";
import { BiWorld } from "react-icons/bi";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

function App() {
  return (
    <>
      <h1 class="text-3xl font-bold underline">
        <BiWorld /> Hello world!
      </h1>
      <Stack spacing={2} direction="row">
        <Button variant="text">Text</Button>
        <Button variant="contained">Contained</Button>
        <Button variant="outlined">Outlined</Button>
      </Stack>
    </>
  );
}

export default App;
