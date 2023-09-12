import {
  Button,
  ButtonGroup,
  Paper,
  Select,
  TextField,
  Typography,
} from "@material-ui/core"
import React from "react"
import { asMutable } from "seamless-immutable"
import CreatableSelect from "react-select/creatable"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
}

export default function BreakoutSection({
  region,
  dispatch,
  setOpen,
  breakoutList,
}) {
  const [breakoutName, setBreakoutName] = React.useState("")
  const [selectedBreakout, setSelectedBreakout] = React.useState(
    breakoutList !== null && breakoutList.length > 0
      ? {
          label: breakoutList[0].name,
          value: breakoutList[0].id,
        }
      : null
  )
  const [isExisting, setExisting] = React.useState(
    breakoutList === null ? false : true
  )

  const ExistingSetup = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <Typography
          variant="subtitle2"
          gutterBottom
          style={{
            fontWeight: "bold",
            fontSize: "12px",
          }}
        >
          Add to Existing Breakout
        </Typography>
        <Typography
          style={{
            fontSize: "10px",
          }}
          variant="body2"
          gutterBottom
        >
          Select a Breakout to add this region to.
        </Typography>
        <div style={{ width: "268px" }}>
          <CreatableSelect
            placeholder="Breakouts"
            onChange={(e) => {
              setSelectedBreakout(e)
            }}
            value={selectedBreakout}
            options={asMutable(
              breakoutList.map((b) => ({
                label: b.name,
                value: b.id,
              }))
            )}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          style={{
            fontSize: "10px",
            marginTop: 16,
          }}
          onClick={() => {
            dispatch({
              type: "ADD_EXISTING_BREAKOUT",
              breakoutId: selectedBreakout.value,
              breakoutName: selectedBreakout.label,
              region: region,
            })
            setOpen(false)
          }}
        >
          Save Breakout
        </Button>
      </div>
    )
  }

  const NewSetup = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          fontSize: "10px",
        }}
      >
        <Typography
          variant="subtitle2"
          gutterBottom
          style={{
            fontWeight: "bold",
            fontSize: "12px",
          }}
        >
          Create a New Breakout
        </Typography>
        <Typography
          variant="body2"
          gutterBottom
          style={{
            fontSize: "10px",
            wordBreak: "break-word",
            paddingBottom: 8,
          }}
        >
          Please enter a name for the new Breakout you would like to create for
          this region.
        </Typography>
        <TextField
          label="Breakout Name"
          style={{
            width: "100%",
            fontSize: "10px",
            "& .MuiFormLabelRoot": {
              fontSize: "10px",
            },
          }}
          variant="outlined"
          value={breakoutName}
          onChange={(event) => setBreakoutName(event.target.value)}
          size="small"
          inputProps={{
            style: { fontSize: "12px" },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          style={{
            marginTop: 16,
            fontSize: "10px",
          }}
          onClick={() => {
            dispatch({
              type: "ADD_NEW_BREAKOUT",
              name: breakoutName,
              region: region,
            })
            setOpen(false)
          }}
        >
          Save Breakout
        </Button>
      </div>
    )
  }

  return (
    <>
      <Paper
        elevation={24}
        style={{
          minWidth: 300,
          maxWidth: 300,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <ButtonGroup fullWidth>
            <Button
              size="small"
              style={{
                backgroundColor: isExisting ? "#f0f0f0" : "white",
                fontSize: "10px",
                fontWeight: isExisting ? "bold" : "normal",
              }}
              disabled={breakoutList === null}
              onClick={() => setExisting(true)}
            >
              Add to Existing Breakout
            </Button>
            <Button
              style={{
                backgroundColor: !isExisting ? "#f0f0f0" : "white",
                fontSize: "10px",
                fontWeight: !isExisting === "new" ? "bold" : "normal",
              }}
              size="small"
              onClick={() => setExisting(false)}
            >
              Create a New Breakout
            </Button>
          </ButtonGroup>
        </div>
        {isExisting ? <ExistingSetup /> : <NewSetup />}
      </Paper>
    </>
  )
}
