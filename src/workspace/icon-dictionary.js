// @flow

import { createContext, useContext } from "react"

export const IconDictionaryContext = createContext({})

const emptyObj = {}

export const useIconDictionary = () =>
  useContext(IconDictionaryContext) || emptyObj
