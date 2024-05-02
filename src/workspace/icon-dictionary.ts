// @flow

import { createContext, useContext } from "react";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";

export const IconDictionaryContext = createContext<
  Record<string, OverridableComponent<SvgIconTypeMap>>
>({});

const emptyObj: Record<string, OverridableComponent<SvgIconTypeMap>> = {};

export const useIconDictionary = () =>
  useContext(IconDictionaryContext) || emptyObj;
