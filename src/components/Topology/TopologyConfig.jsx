import React, { useEffect, useRef, useState } from "react";
import { Network } from "vis-network";
import useWindowSize from "./useWindowSize";
import axios from "axios";
import hostpic from "../../assets/img/topopic/host.png";
import switchpic from "../../assets/img/topopic/switch.png";

// import data from "../data.json";

const loadData = async (setState, setisLoading) => {
  try {
    const url =
      "http://192.168.56.56:8181/restconf/operational/network-topology:network-topology/topology/flow:1";
    const user = "admin";
    const pass = "admin";
    axios
      .get(
        "http://192.168.56.56:8181/restconf/operational/network-topology:network-topology/topology/flow:1",
        {
          auth: {
            username: "admin",
            password: "admin",
          },
        }
      )
      .then((res) => {
       
        window.data = res.data;
        setState(res.data);

        setisLoading(false);
      });
  
  } catch (err) {
    console.log(err);
  }
};
const VisNetwork = (props) => {
 
  const [data, setData] = useState({});
  const [isLoading, setisLoading] = useState(true);
  const [selectNode,setselectNode]= useState([]);
  const host = [];
  const switchDevice = [];

  const visJsRef = useRef(null);
  const { width, height } = useWindowSize(800, 600);
  useEffect(() => {
    loadData(setData, setisLoading);
  }, []);
  const options = {};
  const nodes = [];

  const tmpedges = [];

  const edges = [];
  useEffect(() => {
   
    const network =
      visJsRef.current &&
      new Network(visJsRef.current, { nodes, edges }, options);
    network?.setSize(width, height / 2);
    network?.on("selectNode", function (params) {
      // setselectNode(params.nodes[0])
      selectNode.push(params.nodes[0])
      console.log("selectNode Event:", params.nodes[0],selectNode.length);
      // console.log(selectNode)
    });

    // Use `network` here to configure events, etc
  }, [visJsRef, nodes, edges]);
  if (isLoading) return <></>;

  for (var i = 0; i < data.topology[0].node.length; i++) {
    var nodeID = data.topology[0].node[i]["node-id"];
    
    if (nodeID.startsWith("host")) {
      var nnode = { id: i + 1, label: nodeID, image: hostpic, shape: "image" };
      host.push(nnode);
    } else {
      var nnode = {
        id: i + 1,
        label: nodeID,
        image: switchpic,
        shape: "image",
      };
      switchDevice.push(nnode);
    }
    nodes.push(nnode);
  }

 


  console.log("------------------------");
  for (var j = 0; j < data.topology[0].link.length; j++) {
    var fromID = data.topology[0].link[j].source["source-node"];

    var lebelsrc = nodes.find((x) => x.label === fromID).id;

    //   mark.push(lebelsrc)
    var nextID = data.topology[0].link[j].destination["dest-node"];
    var lebeldst = nodes.find((x) => x.label === nextID).id;
    var llink = { from: lebelsrc, to: lebeldst };

    // var samesrc

    tmpedges.push(llink);
  }

  for (var z = 1; z < tmpedges.length; z++) {
    var temp = tmpedges[z].to;
    var temp2 = tmpedges[z].from;
    if (edges.find((x) => x.from === temp) === undefined) {
      edges.push(tmpedges[z]);
    } else if (edges.find((x) => x.to === temp2) === undefined) {
      edges.push(tmpedges[z]);
    } else if (
      edges.find((x) => x.to === temp2) &&
      edges.find((x) => x.from === temp)
    ) {
     

      const indextemp = edges.indexOf(edges.find((x) => x.to === temp2));
      if (edges[indextemp].from !== temp && edges[indextemp].to !== temp2) {
      
        edges.push(tmpedges[z]);
      }
    }
 
  }



  return <div ref={visJsRef} />;
};

export default VisNetwork;
