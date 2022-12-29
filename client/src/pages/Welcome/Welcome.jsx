import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Box, Typography, Button, Fade } from '@mui/material'
import PepitosLogo from '../../assets/img/png/pepitos-logo.png';

import './Welcome.css'

const Welcome = () => {
	return(
		<>
			<Helmet>
				<title>Hola | Rotisería Pepitos</title>
				<meta 
					name='description'
					content='Welcome | Rotisería Pepitos'
					data-react-helmet='true'
				/>
			</Helmet>
			<Fade in={true}>
				<Box className='welcome'>
					<header>
						<p>(Esto no existe, es un ejemplo)</p>
						<div className='title-logo'>
							<h1>Rotisería <span style={{display: 'none'}}>Pepitos</span></h1>
							<img src={PepitosLogo} width={300} alt='pepitos-logo' />
						</div>
						<h2>
							Antes hacíamos masitas, ahora vendemos empanadas.
						</h2>
					</header>
					<section className='info'>
						<Typography variant='h5'>
							¿Cómo funciona?
						</Typography>
						<Typography>(No tenés que iniciar sesión)</Typography>
						<ol className='list'>
							<li>
								<Typography variant='h6'>
									Llenás tu carrito
								</Typography>
							</li>
							<li>
								<Typography variant='h6'>
									Confirmás tu pedido
								</Typography>
							</li>
							<li>
								<Typography variant='h6'>
									Esperás que se abra el chat de WhatsApp
								</Typography>
							</li>
							<li>
								<Typography variant='h6'>	
									Mandás el mensaje autogenerado, y listo.
								</Typography>
							</li>
						</ol>
						<Link to='/products'>
							<Button
								variant='contained'
								className='btn-welcome'
								autoFocus={true}
							>
								De acuerdo
							</Button>
						</Link>
					</section>
				</Box>
			</Fade>
		</>
	)
}

export default Welcome