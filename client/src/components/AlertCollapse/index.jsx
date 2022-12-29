import Collapse from '@mui/material/Collapse'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

const AlertCollapse = ({ alert, setAlert }) => {
	return (
		<Collapse in={alert.length !== 0}>
	        <Alert
	            action={
	                <IconButton
	                  aria-label="close"
	                  color="inherit"
	                  size="small"
	                  onClick={() => {
	                    setAlert([]);
	                  }}
	                >
	                  <CloseIcon fontSize="inherit" />
	                </IconButton>
	            }
	                sx={{ mb: 2 }}
	                severity={alert[0]}
	            >
	            {alert[1]}
	        </Alert>
	    </Collapse>
    );
}

export default AlertCollapse