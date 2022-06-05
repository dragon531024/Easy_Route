import { createSlice } from "@reduxjs/toolkit";

const initialState = () => {
  let state = JSON.parse(localStorage.getItem('store'));
  return ({
    switch: [],
    selecting: false,
    correct: false,
    linkdata: [],
    finish: [],
    priority: 5,
    count: 1,
    sendStatus: true,
    tableID: state?.tableID || [],
    tableDevice: state?.tableDevice || [],
    processFinish: false,
    urlSelect:state?.urlSelect|| [],
  })
};

const saveState = (state) => {
  let stateStr = JSON.stringify({ tableID: state.tableID, tableDevice: state.tableDevice,prioity:state.prioity,count:state.count,urlSelect:state.urlSelect })
  localStorage.setItem('store', stateStr)
}

export const addSwitchSlice = createSlice({
  name: "switch",
  initialState: initialState(),
  reducers: {
    addSwitch: (state, action) => {
      console.log("action", action);
      if (action.payload.startsWith("host")) {
        state.switch.push(action.payload);
        state.correct = true;
      } else if (state.correct === true) {
        state.switch.push(action.payload);
      } else alert("invalid input");
    },
    changeMode: (state) => {
      if (state.selecting === false) {
        state.selecting = true;
      }
      // else if (state.selecting=== true &&)
      // else if (state.processFinish === true){

      // }
      else {
        state.selecting = false;
        state.switch = []
      }
    },
    addLink: (state, action) => {
      state.linkdata.push(action.payload);
    },
    sendReq: (state, action) => {
      if (action.payload === true) {
        console.log("sendreqpayload", action.payload)
        state.selecting = false
      }
      else {
        state.tableDevice = []
        state.count = -1
        state.priority = -1
        state.tableID = []
        saveState(state)
      }
    },
    addTableID: (state, action) => {
      state.tableID.push(action.payload)
      saveState(state)
    },
    addCount: (state) => {
      state.count = +1
      state.priority = +1
    },
    addTableDevice: (state, action) => {
      state.tableDevice.push(action.payload)
      state.count = state.count + 1
      state.priority = state.priority + 1
      state.selecting = false
      saveState(state)

    },
    setFinish: (state) => {
      if (state.processFinish === true) {
        state.processFinish = false

      }
      else
        state.processFinish = true
    },
    reset: (state) => {
      if (state.processFinish === true) {
        state.correct = false
        state.switch = []
        state.processFinish = false

      }
    },
    deleteCon:(state,index)=>{
      
        state.tableDevice.splice(index.payload, 1)
        state.tableID.splice(index.payload, 1);
     
    
       saveState(state)
    },
    addURL:(state,url)=>{
      state.urlSelect.push(url.payload)
      saveState(state)
    }

  },
});

export const { addSwitch, changeMode, addLink, sendReq, addTableID, addCount, addTableDevice, setFinish, reset, deleteCon,addURL } = addSwitchSlice.actions;
export default addSwitchSlice.reducer;
