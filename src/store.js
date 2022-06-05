import {configureStore} from '@reduxjs/toolkit'
import switchReducer from './switchSlice'
import { devToolsEnhancer } from "@reduxjs/toolkit/dist/devtoolsExtension";
import {loadState,saveState} from './localStorage'


export const store = configureStore({
    reducer :{
        switch:switchReducer


    },devToolsEnhancer
},persistStore)

store.subscribe(()=>{
    
})
