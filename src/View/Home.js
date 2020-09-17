import React, {useState, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import LinearProgress from '@material-ui/core/LinearProgress';
// for using history.push
import { withRouter } from 'react-router-dom';

import UserList from './UserList'; 
import SettingsComponent from './Settings';

// Message
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

function Home(props){
	const [alert, setAlert] = useState(false);
	const [message, setMessage] = useState("");
	const [progress,setProgress] = useState(false);
	const [loading,setLoading] = useState(false);
	const [SettingsView,setSettingsView]=useState(false);
	const [UserMsgID,setUserMsgID]=useState("");
	const [RecieverName,setRecieverName]=useState("");
	const [RecieverProfile,setRecieverProfile]=useState("");
	const [MessageView,setMessageView]=useState("");

	useEffect(() => {
	    const timer = setInterval(() => {
	      setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
	    }, 300);
	    return () => {
	      clearInterval(timer);
	    };
	}, [loading]);

	const Components = () => {
		if(SettingsView){
			return (
				<SettingsComponent load={SettingsView} loading={setLoading}/>
			);
		}else if(MessageView){
			return (
				<div>
					<div className="MessageBoxHeader">
		              <div style={{width:"25%",display:"flex"}}>
		                <ArrowBackIcon className="ArrowBack"/>
		                <Avatar alt={RecieverName} src={RecieverProfile} />
		                <h2 className="HeaderTitle">{RecieverName}</h2>
		              </div>
		              <div style={{width:"67%"}}></div>
		              <div style={{width:"8%"}} className="MoreIcon">
		                    
		              </div>
		          </div>
		            <div className="MessageBody"> 
		                <Paper square className="Height">
		                    hi
		                </Paper> 
		            </div>
				</div>	
			)
		}else{
			return (
				<div>
					MessageBox
				</div>
			)
		}
	}
	function ShowMessage(data){
		setUserMsgID(data._id);
		setRecieverName(data.name);
		setRecieverProfile(data.profile);
		setMessageView(true);
		setSettingsView(false);
	}

    return (
        <div>
        		{loading && <LinearProgress variant="determinate" value={progress}/>}
		          <Grid container component="main" className="GridContainer">
		            <CssBaseline /> 		            
		            <Grid item xs={12} sm={4} md={4} lg={4} className="UserGrid">
		            	<UserList loading={setLoading} settings={setSettingsView} UserMsgID={(val) => {ShowMessage(val)}}/>
		            </Grid>
		            <Grid item xs={12} sm={8} md={8} component={Paper} className="MessageBox">						
						<Components/>
		            </Grid>
		        </Grid>		            
        </div>
    )
}

export default withRouter(Home);