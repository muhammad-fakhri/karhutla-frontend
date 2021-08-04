import styles from '@asset/jss/nextjs-material-kit/pages/penugasan/create-penugasan.page.style'
import GridItem from '@component/Grid/GridItem'
import SiteLayout from '@component/Layout/SiteLayout'
import Loader from '@component/Loader/Loader'
import useAuth, { ProtectRoute } from '@context/auth'
import {
	Button,
	CircularProgress,
	Grid,
	Link,
	MenuItem,
	TextField,
	Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import { Alert } from '@material-ui/lab'
import { uploadPenugasan } from '@service'
import classNames from 'classnames'
import 'date-fns'
import { ChangeEvent, useState } from 'react'

const useStyles = makeStyles(styles)

const workTypes = [
	{
		value: 'mandiri',
		label: 'Mandiri'
	},
	{
		value: 'rutin',
		label: 'Rutin'
	},
	{
		value: 'terpadu',
		label: 'Terpadu'
	}
]

type AlertElemenPropType = {
	text: string[]
}

const AlertElement = (props: AlertElemenPropType) => {
	return (
		<>
			{props.text.map((str, index) => (
				<p key={index}>{str}</p>
			))}
		</>
	)
}

function BerkasPenugasanPage() {
	const classes = useStyles()
	const { isAuthenticated } = useAuth()
	const [workFile, setWorkFile] = useState<File | null>(null)
	const [workType, setWorkType] = useState('')
	const [alertMessage, setAlertMessage] = useState<string[]>([])
	const [show, setShow] = useState(false)
	const [alertSuccess, setAlertSuccess] = useState(true)
	const [loading, setLoading] = useState(false)

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) setWorkFile(event.target.files[0])
	}

	const handleWorkTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
		setWorkType(event.target.value)
	}

	const handleClick = async () => {
		setLoading(true)
		const result = await uploadPenugasan(workFile as File, workType)
		setLoading(false)

		if (!result.success) setAlertSuccess(false)
		else {
			setAlertSuccess(true)
			setWorkFile(null)
			setWorkType('')
		}
		setAlertMessage(result.message as string[])
		setShow(true)
	}

	return !isAuthenticated ? (
		<Loader />
	) : (
		<SiteLayout headerColor="info">
			<div
				className={classNames(
					classes.main,
					classes.mainRaised,
					classes.textCenter
				)}
			>
				<h2>Upload Berkas Excel Penugasan</h2>
				<form noValidate autoComplete="off" className={classes.form}>
					<Grid container justify="center">
						<GridItem sm={6} xs={10}>
							{show ? (
								<Alert
									severity={
										alertSuccess ? 'success' : 'error'
									}
									variant="filled"
									onClose={() => {
										setShow(false)
									}}
									hidden={true}
									className={classes.alert}
								>
									<AlertElement text={alertMessage} />
								</Alert>
							) : null}
						</GridItem>
					</Grid>
					<Grid container justify="center">
						<Grid item sm={10} xs={10}>
							<Typography variant="body1" gutterBottom>
								Gunakan File EXCEL dengan format yang dapat
								diunduh{' '}
								<Link
									href="/file/contoh_template.xlsx"
									className={classes.downloadButton}
								>
									disini
								</Link>
								<br></br>
								pastikan SEMUA kolom TERISI dan format penulisan
								telah sesuai
							</Typography>
						</Grid>
					</Grid>
					<Grid container justify="center">
						<Grid item lg={3} md={4} sm={10}>
							<Grid item sm={12}>
								<TextField
									id="outlined-number"
									margin="normal"
									label="Berkas Excel"
									type="file"
									InputLabelProps={{
										shrink: true
									}}
									variant="outlined"
									required
									fullWidth
									name="file"
									onChange={handleFileChange}
									className={classes.textAlignLeft}
								/>
							</Grid>
							<Grid item sm={12}>
								<TextField
									id="outlined-number"
									select
									margin="normal"
									label="Kategori Penugasan"
									InputLabelProps={{
										shrink: true
									}}
									variant="outlined"
									required
									fullWidth
									name="type"
									onChange={handleWorkTypeChange}
									value={workType}
									className={classes.textAlignLeft}
								>
									{workTypes.map((option) => (
										<MenuItem
											key={option.value}
											value={option.value}
										>
											{option.label}
										</MenuItem>
									))}
								</TextField>
							</Grid>
						</Grid>
					</Grid>
					<Grid container justify="center">
						<Grid item lg={3} md={4} sm={10} xs={8}>
							{loading ? (
								<CircularProgress />
							) : (
								<Button
									variant="contained"
									color="primary"
									size="large"
									startIcon={<CloudUploadIcon />}
									onClick={handleClick}
									fullWidth
								>
									Upload
								</Button>
							)}
						</Grid>
					</Grid>
				</form>
			</div>
		</SiteLayout>
	)
}

export default ProtectRoute(BerkasPenugasanPage)
