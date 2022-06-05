
import { useState, useEffect } from "react";
import CompletedConfig from '../components/Topology/CompletedConfig'
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import {
  changeMode,
  addTableDevice,
  addTableID,
  setFinish,
  reset,
} from "../switchSlice";

import VisNetworks from "../components/Topology/network";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  NavItem,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components

import Header from "components/Headers/Header.js";

const Index = () => {
  const [cursor, setCursor] = useState("default");
  const [selecting, setSelecting] = useState(false);
  const dispatch = useDispatch();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [object, setObject] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [sent, setSent] = useState(false);
  const [saveObject, setSaveobject] = useState(false);
  CompletedConfig()

  const objectTemp = [];
  const temp = [];

  
  // if(sent === true&&saveObject===true){
  //   // dispatch(sendReq(objectTemp[0].flow[0].id))
  //   const check =true
  //   //  dispatch(sendReq(check))
  //    dispatch(setFinish())

  // }
  const selectMode = (event) => {
    setCursor("cell");
    setSelecting(true);
    dispatch(changeMode());
    dispatch(reset());
    setCorrect(false);
  };
  const post = (array, e) => {
    for (var i = 0; i < array.length; i++) {
      const format = array[i];

      const device = e[i];

      const baseURL = `http://192.168.56.56:8181/restconf/config/opendaylight-inventory:nodes/node/${device}/flow-node-inventory:table/0/`;
      axios
        .post(baseURL, format, {
          auth: {
            username: "admin",
            password: "admin",
          },
        })
        .then((res) => {
          console.log(res);
          if (res.status !== 204) {
            alert("request fail", res.status);
          } else {
        
            console.log("success?", res.status);
          }
        });
    }
    setSent(true);
    setObject(false);
    dispatch(setFinish());
  };
  const Correcting = () => {
    if (!selectSwitch[selectSwitch.length - 1].startsWith("host")) {
      alert("invalid input.the end of path must be host");
    } else {
      setCorrect(true);
      alert('Check !')
    
    }
  };

  const Correctbutton = () => (
    <button type="button" className="btn btn-success" onClick={Correcting}>
      Check
    </button>
  );
  const Cancelbutton = () => (
    <button type="button" className="btn btn-danger" onClick={deSelecting}>
      Cancel
    </button>
  );

  const sendConfig = () => {
    if (correct === false) {
      alert("Please confirm your path before send a request");
    } else {
      setCursor("default");
      setSelecting(false);

      setObject(true);
    }

    // dispatch(changeMode());
  };

  const SendButton = () => (
    <button type="button" className="btn btn-primary" onClick={sendConfig}>
      Send
      <i className="fa fa-paper-plane" aria-hidden="true"></i>
    </button>
  );

  const deSelecting = () => {
    setCursor("default");
    setSelecting(false);
    dispatch(changeMode());
  };

  const configMode = useSelector((state) => state.switch.selecting);
  const selectSwitch = useSelector((state) => state.switch.switch);
  const process = useSelector((state) => state.switch.processFinish);
  const count = useSelector((state) => state.switch.count);
  const priority = useSelector((state) => state.switch.priority);
  

  const allLink = useSelector((state) => state.switch.linkdata);


  if (loading === false && correct === true) {
    
    //ถ้าข้อมูลมาแล้วให้จัดการตามนี้

  
    var lastindex = selectSwitch.length - 1;
    var src = selectSwitch[0].substring(5);
    var dsc = selectSwitch[lastindex].substring(5);
    const linkTemp = allLink[0];
    var deviceTemp = [];



    function makeid(count) {
      var result = "EASYROUTE_";

      return result + count;
    }
    const findIndex = (array, source, desc) => {
      for (var i = 0; i < array.length; i++) {
        if (array[i].switch === source && array[i].connectTo === desc) {
          return i;
        }
      }
    };

    // }
    // // function nodeConnect(fruit) {
    //   return fruit.name === 'cherries';
    // }
    // allLink[0][0].switch ==="openflow:1" && allLink[0][0].connectTo ==="openflow:2"
    for (var i = 1; i < selectSwitch.length - 1; i++) {
      var nnode = {
        id: selectSwitch[i],
      };
      deviceTemp.push(selectSwitch[i]);
      temp.push(nnode);
      const name = makeid(count);

      const connectNext = findIndex(
        linkTemp,
        selectSwitch[i],
        selectSwitch[i - 1]
      );
      const connectBefore = findIndex(
        linkTemp,
        selectSwitch[i],
        selectSwitch[i + 1]
      );

      const bLink = linkTemp[connectBefore].link;
      const nLink = linkTemp[connectNext].link;

  

      const postFormat = {
        flow: [
          {
            table_id: 0,
            id: name, //flow id
            priority: priority, //priority
            "hard-timeout": 0,
            "idle-timeout": 0,
            match: {
              "ethernet-match": {
                "ethernet-source": {
                  address: src, //source MAC addr *****
                },
                "ethernet-destination": {
                  address: dsc, //destination MAC addr *****
                },
              },
            },
            instructions: {
              instruction: [
                {
                  order: 0,
                  "apply-actions": {
                    action: [
                      {
                        order: 0,
                        "output-action": {
                          "output-node-connector": bLink, //OUTPUT PORT
                          "max-length": 65535,
                        },
                      },
                      {
                        order: 1,
                        "output-action": {
                          "output-node-connector": nLink, //OUTPUT PORT
                          "max-length": 65535,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      };

      objectTemp.push(postFormat);
    }
   

  }
  const saveConfig = (array, e) => {
    dispatch(addTableID(e[0].flow[0].id));
    dispatch(addTableDevice(array));

    setSaveobject(true);
  };
  if (object === true) {
    saveConfig(selectSwitch, objectTemp);
    post(objectTemp, deviceTemp);
  }

 
  useEffect(() => {
    setLink(allLink);

    if (link !== null) {
      setLoading(false);
    }
  }, [allLink]);

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--5" fluid style={{ cursor: cursor }}>
        <Row>
          <Col className="mb-5 mb-xl-2" xl="8">
            <Card className="bg-white shadow text-dark">
              <CardHeader className="bg-transparent light">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-dark ls-1 mb-1">
                      EASY TOPOLOGY
                    </h6>
                    <h2 className="text-dark mb-0">TOPOLOGY</h2>
                  </div>
                  <div className="col">
                    <Nav className="justify-content-end" pills>
                      <NavItem>
                        <button
                          type="button"
                          className="btn btn-info"
                          onClick={() => window.location.reload()}
                        >
                          Refresh
                        </button>

                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={selectMode}
                        >
                          Config
                        </button>

                        {selecting ? <Correctbutton /> : null}
                        {selecting ? <Cancelbutton /> : null}
                        {selecting ? <SendButton /> : null}
                      </NavItem>
                    </Nav>
                  </div>
                </Row>
              </CardHeader>
              {selecting ? (
                <div>
                  <h5 style={{ color: "red" }}>
                    The path must begin from a host and end at another host !!
                  </h5>
                  <h3 className="pr-10" style={{ color: "green" }}>
                    showing config ..
                  </h3>
                </div>
              ) : null}

              <h5>{selectSwitch.join("=> ")}</h5>

              <CardBody className="align-items-left">
                <div className="col">
                  <VisNetworks />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                    Completed config
                    </h6>

                    <h2 className="mb-0">Completed config</h2>
                  </div>
                </Row><CompletedConfig/>
              </CardHeader>
             
            </Card>
            
          </Col>
          
        </Row>
      </Container>
    </>
  );
};

export default Index;
