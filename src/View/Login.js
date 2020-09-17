import React, {useEffect, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import ChatIcon from '@material-ui/icons/Chat';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import LinearProgress from '@material-ui/core/LinearProgress';
// for using history.push
import { withRouter } from 'react-router-dom';
// Import Fetch Method
import fetchAPI from '../fetchAPI/fetchAPI';
import {config} from '../fetchAPI/config';

const useStyles = makeStyles((theme) => ({
  image: {
    backgroundImage: 'url(https://images.unsplash.com/photo-1506422748879-887454f9cdff?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Login(props) {
  const classes = useStyles();
  const [userName,setUserName] = useState("");
  const [password,setPassword] = useState("");
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [progress,setProgress] = useState(false);
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
    }, 300);
    return () => {
      clearInterval(timer);
    };
  }, [loading]);


  function LoginFunction(){
    if(userName == "harsath" && password=="harsath")
    {
      props.history.push('/AdminDash');
    }else{
    setLoading(true);
    let data = {"name":userName , "password":password}
    fetchAPI(config.api+"/getUser",data,'POST')
    .then(data => {
          if(data.length == "1"){              
              // props.history.push('/home');
              props.history.push('/AdminDash');
              localStorage.setItem('userName',data[0].name);
              localStorage.setItem('userProfile',data[0].profile);
              localStorage.setItem('userID',data[0]._id);
              setLoading(false);
              SaveUserDetails(data[0]._id);              
          }else {
              setAlert(true);
              setLoading(false);
              setMessage("Username or Password does not match!")
              setTimeout(() => {setAlert(false) }, 1500);           
          }
    }).catch(err => {
        setAlert(true);
        setLoading(false);
        setMessage(err);
        setTimeout(() => {setAlert(false) }, 1500);
    });
  }
  }
  function SaveUserDetails(id){
      let body = {
        "active":true,
        "logoutDate":Date.now(),
      };
      fetchAPI(config.api+"/editUser/"+id,body,'PATCH')
        .then(data => {
          console.log(data.msg);
        });
  }

  function enterPressed(e){
      var code = e.keyCode || e.which;    
      if(code === 13) {
          e.preventDefault();
          LoginFunction();
      }     
  }

  return (
    <div>    
          {loading && <LinearProgress variant="determinate" value={progress} className="MUILoader"/>}
          <Grid container component="main" className="GridContainer">
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
              <div className={classes.paper}>                
                <Typography component="h1" variant="h5">
                  Welcome
                </Typography>
                  <TextField
                    variant="outlined" fullWidth label="Username" margin="normal"
                    value={userName} onChange={(e) => setUserName(e.target.value)}
                  />
                  <TextField
                    variant="outlined" fullWidth label="Password" 
                    margin="normal" type="password"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={enterPressed}
                  />
                  <Button
                    fullWidth variant="contained" color="primary" 
                    onClick={LoginFunction}
                  >
                    Login
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <Link href="#" variant="body2">
                        Forgot password?
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link href="#" variant="body2">
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </Grid>
                  </Grid>
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
  );
}
export default  withRouter(Login);