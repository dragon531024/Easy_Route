import React, { useEffect, useState } from "react";

import axios from "axios";




const loadData = async (setState, setisLoading) => {
    try {
      const url =
        "http://192.168.56.56:8181/restconf/operational/network-topology:network-topology/topology/flow:1";
      const user = "admin";
      const pass = "admin";
      axios
        .get(
          url,
          {
            auth: {
              username: user,
              password: pass,
            },
          }
        )
        .then((res) => {
          
          window.data = res.data;
          setState(res.data);
  
          setisLoading(false);
        });
      //   const data =  testData.then((data) => data)
    } catch (err) {
      console.log(err);
    }
  };
  const Things = (props) => {
    const host = [];
    const switchDevice = [];

  const [data, setData] = useState({});
  const [isLoading, setisLoading] = useState(true);
  useEffect(() => {
    loadData(setData, setisLoading);
  }, []);
  if (isLoading) return <></>;

 
  
  for (var i = 0; i < data.topology[0].node.length; i++) {
    
    var nodeID = data.topology[0].node[i]["node-id"];
   
    if(nodeID.startsWith('host')){
    var nnode = { id: i + 1, label: nodeID};
    host.push(nnode)
    }
    else {
      var nnode = { id: i + 1, label: nodeID};
      switchDevice.push(nnode);
    }
   
  }

if (props.thing ==="host"){
  return(


  <h1><div>{host.length}</div>  </h1>

  )
}
else if (props.thing ==="all"){
    return(
  
  
    <h1><div>{data.topology[0].node.length}</div>  </h1>
  
    )
  }
 else if (props.thing ==="switch"){
    return(
  
  
    <h1><div>{switchDevice.length}</div>  </h1>
  
    )
  }
 
  }









  export default Things;