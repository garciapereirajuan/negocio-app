import React from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import './ModalMui.css'

const ModalMui = ({ openModal, setOpenModal, contentModal }) => {
    return (
        <Modal
            open={openModal}
            onClose={() => setOpenModal(false)}
        >
            <Box className='modal-mui'>
                {contentModal}
            </Box>
        </Modal>
    )
}

export default ModalMui
