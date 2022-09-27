import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import React from "react";

export default function CustomButton(props) {


    return <Button
        style={{
            fontFamily : "OpenSans-SemiBold",
            ...props.style,
        }}
        {...props}
        onMouseDown={e => e.preventDefault()}>
        {
            props.children
        }
    </Button>

}
