import React from "react";
import Form from "../Components/Form"
export default function Photowalk(props){
    return(
    <>
        <Form
        category ="photowalk"
        handleUpload={props.handleUpload}
        />
    </>    
    )
}