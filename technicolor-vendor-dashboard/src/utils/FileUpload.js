import Dropzone, {useDropzone} from "react-dropzone";
import {FaPlus} from "react-icons/fa";
import {MdEdit} from "react-icons/md";
import {Row, Spinner} from "react-bootstrap";
import React, {useState} from "react";
import CustomButton from "./CustomButton";

export default function FileUpload(props) {

    const isLoading = props.isLoading

    const onDrop = (image) => {

        console.log(image)
        console.log(image[0].type)

        if(props.allowedType){
            if(!props.allowedType.includes(image[0].type)){
                alert("Harap Unggah File dengan Tipe  : " + props.allowedType)
                return
            }
        }

        props.onDrop(image)

    }

    return (
        <>

            <Dropzone
                noDrag={true}
                onDrop={onDrop}>
                {({getRootProps, getInputProps}) => (
                    <div
                        style={{
                            display : "flex",
                            flexDirection : "row",
                            alignItems : "center",
                        }}
                        {...getRootProps()}>

                        <CustomButton
                            style={{
                                fontSize : "0.8em",
                                fontFamily : "Poppins",
                                textTransform : "none",
                                ...props.buttonStyle
                            }}
                            disabled={isLoading}
                            variant={"outlined"}>
                            <input {
                                       ...getInputProps()
                                   }
                            />
                            {props.text ? props.text : "+ Upload File"}
                        </CustomButton>

                        {
                            props.hideSpinner ?
                                null
                                :
                                <Spinner
                                    size={"sm"}
                                    style={{
                                        marginLeft : " 0.5em", display: isLoading ? "inline" : "none"
                                    }}
                                    animation="border"/>
                        }


                    </div>
                )}
            </Dropzone>

        </>

    )
}
