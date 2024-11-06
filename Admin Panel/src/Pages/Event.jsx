import React from "react";
import Form from "../Components/Form"
export default function Event(props){
    return(
    <>
        <Form
        category ="event"
        handleUpload={props.handleUpload}
        />
    </>    
    )
}