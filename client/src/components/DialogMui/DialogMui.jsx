import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

import "./DialogMui.css"

const DialogMui = ({ openDialog, setOpenDialog, titleDialog, contentDialog, actionsDialog }) => {
    return (
        <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
        >
            <DialogTitle style={{textAlign: "center", backgroundColor: "#373737", color: "#d95d39"}}>
                {titleDialog}
            </DialogTitle>
            <DialogContent style={{textAlign: "center", backgroundColor: "#373737"}}>
                <DialogContentText style={{color: "#d2d2d2"}}>
                    {contentDialog}
                </DialogContentText>
            </DialogContent>
            <DialogActions style={{width: "100%", padding: "20px 0", display: "flex", justifyContent: "center", textAlign: "center", backgroundColor: "#373737"}}>
                {actionsDialog}
            </DialogActions>
        </Dialog>
    )
}

export default DialogMui
