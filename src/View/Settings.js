import React,{ useState,useEffect } from 'react';
import fetchAPI from '../fetchAPI/fetchAPI';
import {config} from '../fetchAPI/config'; 
// Menu
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
// Table
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Grid from '@material-ui/core/Grid';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
// Header
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
// Image Upload
import ImageUpload from '../Components/ImageUpload';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';


function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-prevent-tabpanel-${index}`}
        aria-labelledby={`scrollable-prevent-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
}
function Users(props){
    const columns = [
      { id: 'action', label: 'Actions'},
      { id: 'name', label: 'UserName'},
      { id: 'email', label: 'Email'},
      { id: 'createdDate', label: 'Last Login'} ,
      { id: 'active', label: 'Active'}     
    ];
    const [UserData,setUserData] =useState([]); 
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [Showtable,setShowtable]=useState(true);
    const [ShowPassword, setShowPassword] = React.useState(false);
    const [name,setName]=useState('');
    const [password,setPassword]=useState('');
    const [active,setActive]=useState(false);
    const [email,setEmail]=useState('');
    const [lastLogin,setLastLogin]=useState('');
    const [createdDate,setCreatedDate]=useState('');
    const [userID,setUserID]=useState('');
    const [ProfileImg,setProfileImg]=useState("");
    const [ProfileImgVal,setProfileImgVal]=useState(""); 


    useEffect(() => {
      LoadUsers();
    },[]);

    function GetFullDate(d){
      var date = new Date(d);
      var year = date.getFullYear();
      var month = date.getMonth()+1;
      var dt = date.getDate();
      var ampm = (date.getHours() >= 12) ? "PM" : "AM";
      var hours = (date.getHours() >= 12) ? date.getHours()-12 : date.getHours();
      var minutes =date.getMinutes();


      if (dt < 10) {
        dt = '0' + dt;
      }
      if (month < 10) {
        month = '0' + month;
      }
      if(hours < 10 ){
        hours =  '0' + hours;
      }
      if(minutes < 10 ){
        minutes =  '0' + minutes;
      }
      let fullDate = dt +'-' + month +'-'+ year +' '+ hours +':'+ minutes +' '+ampm;
      return fullDate;
    }

    const handleChangePage = (event, newPage) => { setPage(newPage); };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    function LoadUsers(){
        props.loading(true);
        fetchAPI(config.api+"/getUser",{},'POST')
        .then(data => {
                  setUserData(data); 
                  props.loading(false);
        });
    }
    const handleChange = (props) => (event) =>{ setPassword(event.target.value); };

    const handleClickShowPassword = () => {
      setShowPassword(ShowPassword ? false : true);
    };

    function handleMouseDownPassword(event){ event.preventDefault(); };
    
    function AddUser(){
      setShowtable(false);
      setName("");
      setPassword("");
      setEmail("");
      setCreatedDate(GetFullDate(new Date()));
      setLastLogin(GetFullDate(new Date()));
      setActive(false);
      setUserID("");
      setProfileImg("");
    }
    function EditUser(row){
      setShowtable(false);
      setName(row.name);
      setPassword(row.password);
      setEmail(row.email);
      setCreatedDate(GetFullDate(row.createdDate));
      setLastLogin(GetFullDate(row.logoutDate));
      setActive(row.active);
      setUserID(row._id);
      setProfileImg(row.profile); 
    }

    function ImageChange(url){          
      setProfileImgVal(url); 
      console.log(url,"url")
    } 
    function ImageMessage(val){
      alert(val);
    } 

    function SaveUser(){      
      if(!ProfileImgVal){
        SaveUserData(ProfileImg);
      }else{
          props.loading(true);
          const formData = new FormData();
          formData.append('image',ProfileImgVal);
          const option = {
            method: 'POST',
            body: formData
          };
          fetch("http://localhost:5000/FileUpload",option)
          .then(res => res.json())
          .then(res => {
            if(res.success){
              SaveUserData(res.path);
              props.loading(false);
            }
          }).catch(err => {
            alert(err);
            props.loading(false);
          })
      }      
    }

    function SaveUserData(path){
      props.loading(true);
      let body = {
        "name":name,
        "password":password,
        "profile":path,
        "email":email,
      }; 
      if(userID){
        fetchAPI(config.api+"/editUser/"+userID,body,'PATCH')
        .then(data => {
                  alert(data.msg);
                  LoadUsers();
                  setShowtable(true);
                  props.loading(false);
        });
      }else{
        fetchAPI(config.api+"/saveUser",body,'POST')
        .then(data => {
                  alert(data.msg);
                  LoadUsers();
                  setShowtable(true);
                  props.loading(false);
        });
      }      
    }
    return (
        <div>
          {Showtable ? 
            <Paper>
                  <div>
                    <Button
                      size="small"
                      className="SaveBtn"
                      startIcon={<AddIcon />}
                      onClick={AddUser}
                    >
                      Add
                    </Button>
                  </div>
                  <TableContainer style={{height:400}}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead className="TableHeader">
                        <TableRow>
                          {columns.map((column) => (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{ minWidth: column.minWidth }}
                            >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {UserData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                          var date = new Date(row.logoutDate);
                          var year = date.getFullYear();
                          var month = date.getMonth()+1;
                          var dt = date.getDate();

                          if (dt < 10) {
                            dt = '0' + dt;
                          }
                          if (month < 10) {
                            month = '0' + month;
                          }
                          let fullDate = dt +'-' + month +'-'+ year;
                          return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={row._id}> 
                                  <TableCell key={row._id+1}>
                                    <Tooltip title="Edit" placement="top">
                                      <EditIcon className="TableIcons" onClick={()=>EditUser(row)}/>
                                    </Tooltip>
                                    <Tooltip title="Delete" placement="top">
                                      <DeleteIcon className="TableIcons"/>
                                    </Tooltip>  
                                  </TableCell> 
                                  <TableCell key={row._id+2}>{row.name}</TableCell> 
                                  <TableCell key={row._id+3}>{row.email}</TableCell> 
                                  <TableCell key={row._id+4}>{fullDate}</TableCell> 
                                  <TableCell key={row._id+5}>
                                    <input type="checkbox" checked={row.active} readOnly={true}/>
                                  </TableCell> 
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={UserData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                </Paper>
          :
            <div> 
                      <Grid container component={Paper} className="TablePaper">
                          <Grid container>
                            <Grid item xs={12} sm={12} md={12} align="right">
                                <Button
                                  size="small"
                                  className="CloseBtn"
                                  startIcon={<CloseIcon />}
                                  onClick={() => setShowtable(true)}
                                >
                                  Close
                                </Button>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} sm={6} md={4} elevation={6} square>
                              <TextField label="Name" variant="outlined" className="TextField"
                                value={name} onChange={(e) => setName(e.target.value)}
                              /> 
                          </Grid>
                          <Grid item xs={12} sm={6} md={4} elevation={6} square>
                            <FormControl variant="outlined" className="TextField">
                                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                <OutlinedInput
                                  id="outlined-adornment-password"
                                  type={ShowPassword ? 'text' : 'password'}
                                  value={password}
                                  onChange={handleChange('password')}
                                  endAdornment={
                                    <InputAdornment position="end">
                                      <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                      >
                                        {ShowPassword ? <Visibility /> : <VisibilityOff />}
                                      </IconButton>
                                    </InputAdornment>
                                  }
                                  labelWidth={70}
                                />
                              </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={6} md={4} elevation={6} square>
                              <TextField label="Email" variant="outlined" className="TextField"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                              /> 
                          </Grid>
                      </Grid>  
                      <Grid container component={Paper} className="TablePaper">
                          <Grid item xs={12} sm={6} md={4} elevation={6} square>
                              <TextField label="Created Date" disabled={true} variant="outlined" className="TextField"
                                value={createdDate}
                              /> 
                          </Grid>
                          <Grid item xs={12} sm={6} md={4} elevation={6} square>
                              <TextField label="Last Login" disabled={true} variant="outlined" className="TextField"
                                value={lastLogin}
                              /> 
                          </Grid>
                          <Grid item xs={12} sm={6} md={4} elevation={6} square>  
                            <ImageUpload 
                                value={ProfileImg}
                                onChange={(url,name) => {ImageChange(url,name)}} 
                                message={ImageMessage} 
                                id="LogoImg" 
                                width = "50"
                                height= "50"
                            />
                            {/* <FileUpload message={ImageMessage}/>  */}
                          </Grid>
                          <Grid item xs={12} sm={6} md={4} elevation={6} square >
                              <div className="DisplayFlex">
                                  <div className="DisplayFlex">
                                    <input type="checkbox" className="CheckBox" checked={active} readOnly={true}/>
                                    <p>Active</p>
                                  </div>
                                  <div className="SaveBtnDiv">
                                    <Button
                                      size="small"
                                      className="SaveBtn"
                                      startIcon={<SaveIcon />}
                                      onClick={SaveUser}
                                    >
                                      Save
                                    </Button>
                                  </div>
                              </div> 
                          </Grid>
                      </Grid>
            </div>
          }
        </div>
    );
}
export default function SettingsComponent(props){     
    const [TabValue,setTabValue] =useState(0);
    const [anchorEl, setAnchorEl] = useState(null); 

    const isMenuOpen = Boolean(anchorEl); 

    const handleProfileMenuOpen = (event) => {setAnchorEl(event.currentTarget);};

    const CloseMenu = () => { 
      setAnchorEl(null);  
    };  
    const Settings = () => {  
      setAnchorEl(null);  
      props.settings(true);
    }
    const renderMenu = (
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={CloseMenu}
          >
            <MenuItem onClick={CloseMenu}>Profile</MenuItem>
            <MenuItem onClick={Settings}>Setting</MenuItem>
            <MenuItem onClick={CloseMenu}>Logout</MenuItem>
          </Menu>
    );
    return (
        <div style={{height:"100%"}}>
          <div className="MessageBoxHeader">
              <div style={{width:"25%",display:"flex"}}>
                <ArrowBackIcon className="ArrowBack"/>
                <h2 className="HeaderTitle">Settings</h2>
              </div>
              <div style={{width:"67%"}}></div>
              <div style={{width:"8%"}} className="MoreIcon">
                    <IconButton
                      edge="end" color="inherit"
                      onClick={handleProfileMenuOpen}                     
                    >
                      <MoreVertIcon />
                    </IconButton>
              </div>
            {renderMenu}
          </div>
            <div className="MessageBody"> 
                <Paper square className="Height">
                    <Tabs
                        value={TabValue}
                        onChange={(e,val) => setTabValue(val)}
                        variant="fullWidth"
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <Tab label="Security" />
                        <Tab label="Notification" />
                        <Tab label="Display" />
                        <Tab label="Users" />
                    </Tabs>
                    <TabPanel value={TabValue} index={0}>
                        Security
                    </TabPanel>                    
                    <TabPanel value={TabValue} index={1}>
                        Notification
                    </TabPanel>
                    <TabPanel value={TabValue} index={2}>
                        Display
                    </TabPanel>
                    <TabPanel value={TabValue} index={3}>
                        <Users loading={(val) => props.loading(val)}/>
                    </TabPanel>
                </Paper> 
            </div>
        </div>
    )
}