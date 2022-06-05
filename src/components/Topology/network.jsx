import React, { useEffect, useRef, useState } from "react";
import { Network } from "vis-network";
import axios from "axios";
import hostpic from "../../assets/img/topopic/host.png";
import switchpic from "../../assets/img/topopic/switch.png";
import { useDispatch, useSelector } from "react-redux";
import { addSwitch, addLink } from "../../switchSlice";


// import data from "../data.json";

const loadData = async (setState, setisLoading) => {
  try {
    
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
  const state = useSelector((state) => state.switch);
  window.configMode = state.selecting;

  const [data, setData] = useState({});
  const [isLoading, setisLoading] = useState(true);

  const [isRender, setIsRender] = useState(false);


  const host = [];
  
  const switchDevice = {
    switch: [],

    xx: "ss",
  };

  const visJsRef = useRef(null);
 

  useEffect(() => {
    loadData(setData, setisLoading);
  }, []);
  const options = { autoResize: false };
  const nodes = [];
  const allNode = [];

  const tmpedges = [];
  const linkRelate = [];
  const edges = [];

  const testlink = [];
  const testlink2 = [];

  const dispatch = useDispatch();
  let network = null;
  useEffect(() => {
    if (!isRender) {
      network =
        visJsRef.current &&
        new Network(visJsRef.current, { nodes, edges }, options);

      network?.setSize(800, 600);

      network?.on("selectNode", function (params) {
        var data = nodes.find((x) => x.id === params.nodes[0]).label;

        if (window.configMode) {
          console.log("dispatch!!");
          dispatch(addSwitch(data));
        }
      });
      if (network) {
      
        dispatch(addLink(linkRelate));
        setIsRender(true);
      }
    }

    
  }, [visJsRef, nodes, edges, linkRelate]);

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
      var temp = {
        switch: nnode.label,
      };

      switchDevice.switch.push(temp);

      // switchDevice.switch.push(temp,linktemp);
    }
    allNode.push(nnode.label);
    nodes.push(nnode);
  }
  // setIsAdd(switchDevice)
  console.log("------------------------");
  for (var j = 0; j < data.topology[0].link.length; j++) {
    var fromID = data.topology[0].link[j].source["source-node"];

    var lebelsrc = nodes.find((x) => x.label === fromID).id;

    //   mark.push(lebelsrc)
    var nextID = data.topology[0].link[j].destination["dest-node"];
    var lebeldst = nodes.find((x) => x.label === nextID).id;
    var llink = { from: lebelsrc, to: lebeldst };

    // var samesrc
    testlink.push(data.topology[0].link[j]["link-id"]);
    testlink2.push(data.topology[0].link[j].destination["dest-node"]);
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

  for (var i = 0; i < testlink.length; i++) {
    var switchTemp = testlink[i].substring(0, 10);
   
    var indexSwitch = switchDevice.switch.findIndex((object) => {
      return object.switch === switchTemp;
    });
    

    if (testlink[0].length > 13 && indexSwitch !== -1) {
      var relate = {
        switch: switchTemp,
        link: testlink[i].substring(11, 12),
        connectTo: testlink2[i],
      }
      
     
      linkRelate.push(relate);
      
    }
    else if(testlink[0].length < 13 && indexSwitch !== -1){
      var relate = {
        switch: switchTemp,
        link: testlink[i].substring(11, 12),
        connectTo: testlink2[i],
      }
      
  
      linkRelate.push(relate);




    }
  }

  


  return <div ref={visJsRef} />;
};

export default VisNetwork;
