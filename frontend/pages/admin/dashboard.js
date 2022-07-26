import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { motion } from 'framer-motion';
import { GiHamburgerMenu } from 'react-icons/gi';

// CSS
import styles from '../../styles/Dashboard.module.css';

// session
import { getSession } from 'next-auth/react';

// Modules
import DashboardAside from '../../components/Dashboard/DashboardAside';
import DashboardNewsContent from '../../components/Dashboard/News/DashboardNewsContent';
import { SkeletonTheme } from 'react-loading-skeleton';
import DashboardHeaderSkeleton from '../../components/Dashboard/Skeletons/DashboardHeaderSkeleton';
import { NewsContext } from '../../context/NewsContext';
import { ToastContainer, Slide } from 'react-toastify';

import { articleSort } from '../../helper/articleSort';
import { useRouter } from 'next/router';

const AdminDashboard = ({ session }) => {
	const [articles, setArticles] = useState([]);

	// states used for filtering
	const [sortingOrder, setSortingOrder] = useState('desc');
	const [status, setStatus] = useState('ALL');
	const [isRecommendedActive, setIsRecommendedActive] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState('dashboard');

	const [isAsideOpen, setIsAsideOpen] = useState(true);

	// computed state, when state changes (like filtering keyword, we will applyfilters again - which is why it works)

	const filteredArticles = articleSort.applyArticleFiltersDashboard(
		articles,
		status,
		isRecommendedActive
	);

	useEffect(() => {
		async function fetchArticles() {
			const res = await axios.get(
				'https://alzh-info-api.up.railway.app/api/news'
			);

			const data = await res.data;

			setArticles(data);
			setIsLoading(false);
		}

		fetchArticles();
	}, []);

	function onToggleSort() {
		setSortingOrder((prevState) => {
			if (prevState === 'desc') {
				return 'asc';
			}
			return 'desc';
		});
	}

	return (
		// TODO - HOW TO MAKE THIS BETTER, SEEMS WACK TO USE THE PROVIDER LIKE THIS AND THEN JUST ADDING ON TO IT...
		// TODO - NO NEED TO SSR ARTICLES IN THE DASHBOARD. THESE SHOULD JUST BE FETCHED ON THE CLIENT INSTEAD
		<NewsContext.Provider
			value={{
				articles,
				filteredArticles,
				setArticles,
				status,
				setStatus,
				isRecommendedActive,
				setIsRecommendedActive,
			}}
		>
			<Head>
				<title>ALZH.INFO - DASHBOARD</title>
			</Head>

			<main className="flex max-h-screen w-full ">
				<motion.aside
					animate={isAsideOpen ? { width: 288 } : { width: 64 }}
					transition={{ duration: 0.1 }}
					className={`bg-black h-screen flex relative z-50 ${
						isAsideOpen
							? 'py-8 px-12 w-72  flex-col flex-shrink-0 '
							: 'w-16 justify-center'
					}`}
				>
					{isAsideOpen ? (
						<DashboardAside
							currentPage={currentPage}
							setCurrentPage={setCurrentPage}
							setIsAsideOpen={setIsAsideOpen}
						/>
					) : (
						<>
							<GiHamburgerMenu
								className="text-white text-3xl cursor-pointer mt-8 hover:text-gray-200 duration-150"
								onClick={() => setIsAsideOpen(true)}
							/>
						</>
					)}
				</motion.aside>
				<section
					className={`${styles.dashboardContent} relative py-8 w-full overflow-auto bg-gray-200 px-12`}
				>
					<ToastContainer
						transition={Slide}
						position="top-right"
						pauseOnFocusLoss={false}
					/>
					{currentPage === 'dashboard' && <p>dashboard</p>}
					{currentPage === 'news' && (
						<SkeletonTheme baseColor="#C2C2C2" highlightColor="#DBDBDB">
							{isLoading ? (
								<DashboardHeaderSkeleton />
							) : (
								<DashboardNewsContent />
							)}
						</SkeletonTheme>
					)}
					{currentPage === 'journals' && <p>journals</p>}
					{currentPage === 'settings' && <p>settings</p>}
				</section>
			</main>
		</NewsContext.Provider>
	);
};

export default AdminDashboard;

export async function getServerSideProps({ req }) {
	const session = await getSession({ req });

	if (!session) {
		return {
			redirect: {
				destination: '/auth',
				permanent: false,
			},
		};
	}

	if (session.user.role !== 'admin') {
		return {
			redirect: {
				destination: '/dashboard',
				permanent: false,
			},
		};
	}

	return {
		props: {
			session,
		},
	};
}
