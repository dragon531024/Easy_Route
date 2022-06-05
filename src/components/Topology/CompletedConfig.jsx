import React, { useState, useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import axios from 'axios'
import { deleteCon } from "../../switchSlice";

const CompletedConfig = () => {
  const dispatch = useDispatch();
  const tableID = useSelector((state) => state.switch.tableID);
  const tableDevice = useSelector((state) => state.switch.tableDevice);
  const sent = useSelector((state) => state.switch.processFinish);
  const [showID, setID] = useState([]);
  const [showDevice, setDevice] = useState([]);
  const [show, setShow] = useState(false);
 



  if (showID.length !== 0 && show === true) {
   
    

    console.log("ID", showID);
    console.log("Device", showDevice);
  }

 
const deleteConfig =  (ID) =>{
  
  
  const indexja =showID.indexOf(ID )
  

  for(var i =1;i<showDevice[indexja].length-1;i++){
    
    const id = ID
    const device = showDevice[indexja]
    
     const url = `http://localhost:8181/restconf/config/opendaylight-inventory:nodes/node/${device[i]}/table/0/flow/${id}`
      axios
         .delete(url, {
          auth: {
             username: "admin",
           password: "admin",
          },
         })
         .then((res) => {
          console.log(res);
          
         });
    console.log(url)
  }
    dispatch(deleteCon(showID[0].indexOf(ID )))
    
 

   alert('delete complete!')

  

}


  useEffect(() => {
    if(tableID.length !==0){
        setShow(true)
    }
    setID(tableID);
    setDevice(tableDevice);
  }, [tableID, tableDevice]);

  if (tableID === undefined) {
   
    return <></>;
  }
  return <div> 
    
   
  {[...new Array(tableID.length).keys()].map(index=>(
    <div key={index}>
      {`${showID[index]} ${showDevice[index]}`}<button className="btn btn-danger btn-sm" onClick={async()=>{
         window.confirm('Are you sure you wish to delete this item?') ? deleteConfig(showID[index]) : console.log("cancel")
      




      }}>X</button>
      <br/>

    </div>


  ))}
   
    



  </div>;
};

export default CompletedConfig;
