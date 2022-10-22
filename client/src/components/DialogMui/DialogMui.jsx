import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

const DialogMui = ({ openDialog, setOpenDialog, titleDialog, contentDialog, actionsDialog }) => {
    return (
        <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
        >
            <DialogTitle>
                {titleDialog}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {contentDialog}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                {actionsDialog}
            </DialogActions>
        </Dialog>
    )
}

export default DialogMui
