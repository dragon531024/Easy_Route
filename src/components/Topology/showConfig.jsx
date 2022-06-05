import React from 'react'
import { useSelector } from "react-redux";

const ShowConfig =() => {
  const configMode = useSelector((state)=> state.switch.selecting)
  const selectSwitch = useSelector((state)=> state.switch.switch)

console.log(configMode)
console.log(selectSwitch)




if(configMode === true && selectSwitch.length !==0){
  return (
    
    <div>

    {selectSwitch}
    </div>
  )
}
else return <></>
}




export default ShowConfig;

