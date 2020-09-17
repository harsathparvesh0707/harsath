import React, { useState, useEffect,useRef } from "react"; 
import Add from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";

export default function ImageUpload(props) { 

    const [showIcon,setShowIcon]=useState(true);
    const [value,setValue]=useState("#"); 

    useEffect(() => {
        setValue(props.value);
    },[props.value]);
    const OnChange = (e) => { 
        
        let file = document.getElementById(props.id);  
        let size="";let name="";
        if (file.files.length > 0) { 
                size = Math.round((file.files.item(0).size / 1024)); 
                name = file.files.item(0).name;
        }
        if(size){
            let files=e.target.files; 
            let reader=new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload = (e) => { 
                setShowIcon(false);
                document.getElementById(props.id+"Prev").src = e.target.result;                
                document.getElementById(props.id+"Prev").style.visibility = "visible";
                let split=e.target.result.split(','); 
                if(split[1]){
                    if(props.type == "full"){
                        props.onChange(files[0],name,size);
                    }else{
                        props.onChange(files[0],name,size);
                    }
                }else{
                    props.message('Invalid File Format')
                }           
            }
        }else{
            props.message("Image Size is more than 500 KB");
            return false;
        }  
    } 
    function realImgDimension(img) {
        var i = new Image();
        i.src = img.src;
        return {
            naturalWidth: i.width, 
            naturalHeight: i.height
        };
    }
      
    
    const ClearImage = () => {
        setValue("#");
        setShowIcon(true);
        props.onChange(null,null);
    } 
    return (
        <div className="ImageDiv">
            <input className="ImageID" id={props.id} type="file" name="file" accept=" image/jpeg, image/png" {...props.multiple} onChange={OnChange} /> 
            <div className="ImageUploadPreview">
                {((showIcon) && (value == "#" || !value)) ?
                    <div className="ImgNew">
                        <Add />
                        <span>Choose Image</span> 
                    </div>
                 : 
                    <div>
                        <img id={props.id+"Prev"} className="ImagePreview" src={value} alt="No Image"/>
                        <div className="ImgClose" onClick={ClearImage}>
                            <CloseIcon className="CloseIconImg"/>
                        </div> 
                    </div> 
                }
            </div>           
        </div>
        
        
    )

}
