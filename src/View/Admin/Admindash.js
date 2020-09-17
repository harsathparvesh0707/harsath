import React, {useState , useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector } from "react-redux";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import fetchAPI from '../../fetchAPI/fetchAPI';
import {config} from '../../fetchAPI/config';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import CssBaseline from '@material-ui/core/CssBaseline';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import LinearProgress from '@material-ui/core/LinearProgress';



const useStyles = makeStyles(( theme ) => ({
  image: {
    backgroundImage: 'url(https://images.unsplash.com/photo-1506422748879-887454f9cdff?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  table: {
    minWidth: 650,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  body: {
    margin: 25
  },
  SaveBtn: {
    marginLeft: 50
  },
  Icons: {
    cursor: "pointer",
    color : "#2c3e50"
  },
  DeleteIcon: {
    cursor: "pointer",
    color : "#2c3e50"
  },
  paper: {
    backgroundColor:"white",
    width:"70%",
    padding:40
  },
  over:{
    width:"100%",
    height:"100%",
    padding:"5%"
  }
 
})); 



function App() {
  const classes = useStyles();
  const [showTable,setshowTable]=useState(true);
  const reduxValues = useSelector(state => state);
  const dispatch = useDispatch();
  const [nameTxt,setnameTxt]=useState("");
  const [emailTxt,setemailTxt]=useState("");
  const [passwordTxt,setpasswordTxt]=useState("");
  const [dateTxt,setdateTxt]=useState("");
  const [alert, setAlert] = useState(false);
  const [rows,setrows]=useState([]);
  const [modalopen,setmodalopen] =useState(false);
  const [message, setMessage] = useState("");
  const [id, setid] = useState("");

  function getval(){
    var data ={}
    fetchAPI(config.api+"/getUser",data,'POST')
    .then(data => {
          if(data.length == "0"){              
            setrows([])  
            dispatch({
              type:"TodoData",
              Data:[]
            });          
          }else {
            dispatch({
              type:"TodoData",
              Data:data
            });     
          }
    }).catch(err => {
      console.log(err)
    });

  }

  useEffect(() => {  
    getval()
  },[]);

  function AddRecord(){
    setmodalopen(true);  
    dispatch({
      type:"Name",
      Name:""
    });
    dispatch({
      type:"password",
      password:""
    });  
    dispatch({
      type:"email",
      email: ''
    });  
  }

  function CloseRecord(){
    setshowTable(true);
  }

  function SaveRecord(){  
    let json={name:reduxValues.Name,password:reduxValues.password,email:reduxValues.email};
    
    if(reduxValues.Name && reduxValues.password && reduxValues.email){
      let json={name:reduxValues.Name,password:reduxValues.password,email:reduxValues.email};

      reduxValues.Data.push(json); 

      fetchAPI(config.api+"/saveUser",json,'POST')
      .then(data => {
        setmodalopen(false);  
      }).catch(err => {
        console.log(err)
      });

      setshowTable(true);
    }else{
      if(!reduxValues.Name){
        setMessage("Name is Required");
        setAlert(true)
      }else if(!reduxValues.password){
        setMessage("Message is Required");
        setAlert(true)
      }else if(!reduxValues.email){
        setMessage("email is Required");
        setAlert(true)
      }
    }    
  }
  function EditRecord(data){

    dispatch({
      type:"Name",
      Name:data.name
    });
    dispatch({
      type:"password",
      password:data.password
    });  
    dispatch({
      type:"email",
      email:data.email
    });  
    setid(data._id)
    setshowTable(false);
  }

  function EditsaveSaveRecord (){
    let json={name:reduxValues.Name,password:reduxValues.password,email:reduxValues.email};
    fetchAPI(config.api+"/editUser/"+id,json,'PATCH')
    .then(data => {
      setshowTable(true);
      getval()
    }).catch(err => {
      console.log(err)
    });
    if(!reduxValues.Name){
      setnameTxt("Name is Required");
    }else if(!reduxValues.password){
      setpasswordTxt("Message is Required");
    }else if(!reduxValues.email){
      setemailTxt("email is Required");
    }
  }

  function DeleteRecord(data){
    let datas = reduxValues.Data.filter(val =>  val.name != data.name  )
    dispatch({
      type:"TodoData",
      Data:datas
    }); 
    console.log(data._id)
    let json={};
    fetchAPI(config.api+"/deleteUser/"+data._id,json,'PATCH')
    .then(data => {
      getval()
    }).catch(err => {
      console.log(err)
    });
    }

 
  return (
    <div className={classes.body}>
      {showTable ? 
            <div>
                        <Button variant="contained" color="primary" onClick={AddRecord}>
                          Add
                        </Button>

                        <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                          <TableHead>
                            <TableRow>
                                <TableCell>Action</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Password</TableCell>
                                <TableCell>email</TableCell>
                                <TableCell>Login date</TableCell>                
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {reduxValues.Data.map((row) => (
                              <TableRow key={row.name}>
                                <TableCell>
                                  <EditIcon className={classes.Icons} onClick={()=>{EditRecord(row)}}/>
                                  <DeleteIcon className={classes.DeleteIcon} onClick={()=>{DeleteRecord(row)}}/>
                                </TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.password}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.loginDate} </TableCell>                  
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
            </div>
        :
                <div>
                    <div align="right">
                        <Button variant="contained" color="secondary" onClick={CloseRecord}>
                                Close
                        </Button>
                      </div>
                      <div className="EditRecord">
                      <TextField value={reduxValues.Name} className="TextField" label="Name"
                            helperText={nameTxt} 
                            onChange={(e) => {
                              dispatch({
                                type:"Name",
                                Name:e.target.value
                              });
                              setnameTxt("")
                            }}
                          />
                           <TextField value={reduxValues.password} className="TextField" label="password" 
                            helperText={passwordTxt}
                            onChange={(e) => {
                              dispatch({
                                type:"password",
                                password:e.target.value
                              });
                              setpasswordTxt("")
                            }}
                          />
                           <TextField value={reduxValues.email} className="TextField" label="email" 
                            helperText={emailTxt}
                            onChange={(e) => {
                              dispatch({
                                type:"email",
                                email:e.target.value
                              });
                              setemailTxt("")
                            }}
                          />
                         
                      </div>
                      <div align="left">
                        <Button className={classes.SaveBtn} variant="contained" color="primary" onClick={EditsaveSaveRecord}>
                                Save
                        </Button>
                      </div>
                </div>
        }
        <Modal
        open={modalopen}  
      >
        <div className={classes.over}>
       <Grid container component="main">
      
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={12} square>
            <div align="right">
                        <Button variant="contained" color="secondary" onClick={()=>{setmodalopen(false)}}>
                                Close
                        </Button>
                      </div>   
              <div className={classes.paper}>    
                      
                <Typography component="h1" variant="h5">
                  ADD a new recored here
                </Typography>
                <TextField value={reduxValues.Name} className="TextField" label="Name"
                            helperText={nameTxt} 
                            onChange={(e) => {
                              dispatch({
                                type:"Name",
                                Name:e.target.value
                              });
                              setnameTxt("")
                            }}
                          />
                           <TextField value={reduxValues.password} className="TextField" label="password" 
                            helperText={passwordTxt}
                            onChange={(e) => {
                              dispatch({
                                type:"password",
                                password:e.target.value
                              });
                              setpasswordTxt("")
                            }}
                          />
                  <TextField value={reduxValues.email} className="TextField" label="email" 
                            helperText={emailTxt}
                            onChange={(e) => {
                              dispatch({
                                type:"email",
                                email:e.target.value
                              });
                              setemailTxt("")
                            }}
                          />
                  <Button
                    fullWidth variant="contained" color="primary" 
                    onClick={SaveRecord}
                  >
                    ADD
                  </Button>
                 
                  {alert && 
                      <Grid container>
                        <Grid item xs>
                            <Collapse in={alert}>
                              <Alert severity="error">{message}</Alert>
                            </Collapse> 
                        </Grid>
                      </Grid> 
                  }
              </div>
            </Grid>
          </Grid>
          </div>
      </Modal>
    </div>
  );
}

export default App;
