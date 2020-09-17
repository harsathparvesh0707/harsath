import React,{useState,useEffect} from 'react';
// Import Fetch Method
import fetchAPI from '../fetchAPI/fetchAPI';
import {config} from '../fetchAPI/config';
// List Import
import Grid from '@material-ui/core/Grid';
import { fade, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
// Header
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import InputBase from '@material-ui/core/InputBase'; 
const useStyles = makeStyles((theme) => ({
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    }
  }));

export default function UserList(props){
	const classes = useStyles();
	const [userData,setUserData]= useState([]);
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


	useEffect(() => {
		LoadUsers();
	},[]);

	function LoadUsers(){
		props.loading(true);
			fetchAPI(config.api+"/getUser",{},'POST')
		    .then(data => {
		          setUserData(data);
		          props.loading(false);
		    });
	}
	function UserClick(id){
		props.UserMsgID(id);
	}

	const Listitem = userData.map((val,i) => {
		if(val._id !== localStorage.getItem('userID')){
			return (
				<ListItem alignItems="flex-start" key={i} className="BorderBottom" onClick={() => UserClick(val)}>
					<ListItemAvatar>
					  <Avatar alt={val.name} src={val.profile} />
					</ListItemAvatar>
					<ListItemText
					  primary={val.name}
					  secondary={
						<React.Fragment>
							<div className="Ellipse">{" How you Doing? "}</div>
						</React.Fragment>						
					  }
					/> 		
					<ListItemSecondaryAction>
					  <Badge badgeContent={99} className="Badge" color="secondary"/>
					</ListItemSecondaryAction>
				</ListItem>
				  
			);
		}		
	});
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
		<div className="UserBox">
			<div className="UserBoxHeader">
            		<div style={{width:"15%"}}>
		        		<Avatar className="UserProfile" alt={"yas"} src={localStorage.getItem('userProfile')} />
		        	</div>
		        	<div style={{width:"73%"}}></div>
		        	<div style={{width:"12%"}}>
		  				<div className="MoreIcon"> 
				            <IconButton
				              edge="end" color="inherit"
				              onClick={handleProfileMenuOpen}				              
				            >
				              <MoreVertIcon />
				            </IconButton>
			          	</div> 
			        </div>
      			{renderMenu}
			</div>

			<List className="UserListItems"> 
				{Listitem}					     
	    	</List>
	    </div>
	);
}