import { Paper, CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import classNames from 'classnames'
import useSWR from 'swr'
import MaterialTable from 'material-table'
import styles from '../../assets/jss/nextjs-material-kit/pages/patrol-report.page.style'
import SiteLayout from '../../components/Layout/SiteLayout'
import Loader from '../../components/Loader/Loader'
import PatroliService from '../../services/patroli.service'
import useAuth, { ProtectRoute } from '../../context/auth'

const column = [
	{ title: 'Tanggal', field: 'patrolDate' },
	{ title: 'Daerah Operasi', field: 'operationRegion' },
	{ title: 'Daerah Patroli', field: 'patrolRegion' }
]

function PatroliTerpaduPage() {
	const useStyles = makeStyles(styles)
	const { isAuthenticated } = useAuth()
	const classes = useStyles()
	const [terpadu, setTerpadu] = React.useState()
	// TODO: change endpoint with endpoint for fetching all terpadu patrol data
	const { data, isValidating } = useSWR(
		isAuthenticated ? '/list' : null,
		PatroliService.getAllPatroliRutin
	)
	React.useEffect(() => {
		setTerpadu(data)
	}, [data])

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
				<h2>Data Patroli Terpadu</h2>
				{isValidating ? (
					<CircularProgress />
				) : (
					<MaterialTable
						title="5 Hari Terakhir"
						columns={column}
						components={{
							Container: (props) => (
								<Paper {...props} elevation={0} />
							)
						}}
						data={terpadu}
						options={{
							search: true,
							actionsColumnIndex: -1
						}}
						actions={[
							{
								icon: CloudDownloadIcon,
								tooltip: 'Download Laporan',
								onClick: (event, rowData) =>
									window.open(rowData.reportLink)
							}
						]}
					/>
				)}
			</div>
		</SiteLayout>
	)
}

export default ProtectRoute(PatroliTerpaduPage)
