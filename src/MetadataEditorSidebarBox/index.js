// @flow

import React, { memo } from "react"
import SidebarBoxContainer from "../SidebarBoxContainer"
import DescriptionIcon from "@mui/icons-material/Description"
import { styled } from "@mui/material/styles"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { grey } from "@mui/material/colors"
import Autocomplete from "@mui/material/Autocomplete"
import Popper from "@mui/material/Popper"

const getOptionValue = opt => (opt && typeof opt === "object" ? `${opt.value ?? ""}` : `${opt ?? ""}`)
const getOptionText = opt => (opt && typeof opt === "object" && opt.label ? opt.label : getOptionValue(opt))

// Show the whole list when the field is empty or already holds one of the options,
// so users can pick another value without clearing the current one first.
const filterOptions = (options, { inputValue }) => {
  const query = (inputValue || "").trim().toLowerCase()
  if (!query || options.some(opt => getOptionValue(opt).toLowerCase() === query)) return options
  return options.filter(opt =>
    getOptionValue(opt).toLowerCase().includes(query) ||
    getOptionText(opt).toLowerCase().includes(query)
  )
}

const AutoWidthPopper = ({ style, ...props }) => (
  <Popper
    {...props}
    placement="bottom-start"
    style={{ ...style, width: "auto", minWidth: style?.width, maxWidth: "90vw" }}
  />
)

type MetadataItemProps = {
  name: string,
  value: string,
  imageIndex: number,
  metadataId?: string,
  onChange: ({ name: string, value: String, imageIndex: number }) => void
}

const MetadataItemDiv = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  marginBottom: ".5em",
  "& > label": {
    fontSize: "1rem",
    marginBottom: ".5em",
    textTransform: "capitalize",
    wordWrap: "break-word",
  },
  label: {
    width: "50%",
  },
  select: {
    width: "100%",
  },
}))

const MetadataItem = ({ name, value, metadataId, imageIndex, groupId, onChange, metadataConfig = {} }: MetadataItemProps) => {
  // Ensure inputs are always controlled: when metadata value is undefined/null,
  // use an empty string so we don't keep stale values from a previously selected article.
  const normalizedValue = value == null ? "" : value

  const handleChange = e => {
    e.preventDefault()
    const { name, value } = e.target
    onChange({
      name,
      value,
      imageIndex,
      groupId,
      metadataId
    })
  }

  return (
    <MetadataItemDiv>
      <label for={name}>{name}</label>
      <div style={{
        width: "50%",
      }}>
        {
          metadataConfig?.selectable !== true && !(metadataConfig?.options?.length > 0) && (
            <input type="text" value={normalizedValue} name={name} onChange={handleChange} id={name} style={{ width: "100%" }} />
          )
        }
        {
          metadataConfig?.selectable !== true && metadataConfig?.options?.length > 0 && (
            <Autocomplete
              freeSolo
              openOnFocus
              disableClearable
              id={name}
              options={metadataConfig.options}
              value={normalizedValue}
              inputValue={normalizedValue}
              onInputChange={(e, newValue) => {
                if (newValue === normalizedValue) return
                onChange({ name, value: newValue, imageIndex, groupId, metadataId })
              }}
              getOptionLabel={getOptionValue}
              isOptionEqualToValue={(opt, val) => getOptionValue(opt) === getOptionValue(val)}
              filterOptions={filterOptions}
              renderOption={(props, opt) => (
                <li {...props} key={getOptionValue(opt)}>{getOptionText(opt)}</li>
              )}
              PopperComponent={AutoWidthPopper}
              ListboxProps={{ style: { maxHeight: "70vh", fontSize: 13 } }}
              renderInput={(params) => (
                <div ref={params.InputProps.ref}>
                  <input type="text" name={name} {...params.inputProps} style={{ width: "100%" }} />
                </div>
              )}
            />
          )
        }
        {
          metadataConfig?.selectable === true && (
            <select name={name} id={name} value={normalizedValue} onChange={handleChange} style={{ width: '100%' }}>
              {
                metadataConfig?.options?.map(opt => {
                  if (opt.value && opt.label) {
                    return <option key={opt.value} value={opt.value}>{opt.label}</option>
                  }
                  return <option key={opt} value={opt}></option>
                })
              }
            </select>
          )
        }

      </div>
    </MetadataItemDiv>
  )
}

const MetadataList = ({ title, metadata, imageIndex, onMetadataChange, metadataConfigs = [], groupId }) => (
  <div>
    <h2>{title}</h2>
    {
      metadata && metadata.map(({ key, value, metadataId }) => (
        <MetadataItem key={`${groupId}-${key}`} name={key} value={value} imageIndex={imageIndex} metadataId={metadataId} groupId={groupId} onChange={onMetadataChange} metadataConfig={metadataConfigs.find(i => i.key === key)} />
      ))
    }
  </div>
)

const theme = createTheme()
const DivContainer = styled("div")(({ theme }) => ({
  paddingLeft: 16,
  paddingRight: 16,
  fontSize: 12,
  "& h1": { fontSize: 18 },
  "& h2": { fontSize: 14 },
  "& h3": { fontSize: 12 },
  "& h4": { fontSize: 12 },
  "& h5": { fontSize: 12 },
  "& h6": { fontSize: 12 },
  "& p": { fontSize: 12 },
  "& a": {},
  "& img": { width: "100%" },
}))

export const MetadataEditorSidebarBox = ({ state, onMetadataChange }) => {
  const metadataConfigs = state.metadataConfigs || [];
  const selectedPhotoMetadata = state?.images[state.selectedImage]?.metadata;
  let selectedGroupId = state?.images[state.selectedImage]?.regions?.find(r => r.highlighted === true)?.groupId;
  let articleMetadata = []; // example: [{key: "previousArticleId", value "123-123-123-123-123"}]

  if (selectedGroupId !== undefined) {
    const articleMetadataRegion = state?.images[state.selectedImage].regions.find(r => r.cls === 'metadata' && `${r.groupId}` === selectedGroupId)
    if (articleMetadataRegion) {
      const metadata = JSON.parse(articleMetadataRegion.text)
      articleMetadata = metadata
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <SidebarBoxContainer
        title="Metadata"
        icon={<DescriptionIcon style={{ color: grey[700] }} />}
        expandedByDefault={true}
      >
        <DivContainer style={{
          height: "600px",
        }}>
          {
            articleMetadata.length > 0 && (
              <MetadataList key={`article-${selectedGroupId}`} title="Article" metadata={articleMetadata} imageIndex={state.selectedImage} groupId={selectedGroupId} onMetadataChange={onMetadataChange} metadataConfigs={metadataConfigs.filter(mfc => mfc.level === 'photo_metadata-engine')} />
            )
          }
          {
            selectedPhotoMetadata && (
              <MetadataList title="Page" metadata={selectedPhotoMetadata} imageIndex={state.selectedImage} onMetadataChange={onMetadataChange} metadataConfigs={metadataConfigs.filter(mfc => mfc.level === 'photo')} />
            )
          }
          <MetadataList title="Issue" metadata={state.albumMetadata} onMetadataChange={onMetadataChange} id="metadata-album" metadataConfigs={metadataConfigs.filter(mfc => mfc.level === 'album')} />
        </DivContainer>
      </SidebarBoxContainer>
    </ThemeProvider>
  )
}

export default memo(MetadataEditorSidebarBox)
