import React from 'react';

import { IconContext } from 'react-icons';
import { RiDashboard2Fill } from 'react-icons/ri';
import { IoNewspaperOutline } from 'react-icons/io5';
import { IoIosJournal } from 'react-icons/io';
import { FaCog, FaUserAlt } from 'react-icons/fa';
import { AiFillCloseCircle } from 'react-icons/ai';
import Link from 'next/link';

import { signOut, useSession } from 'next-auth/react';

const DashboardAside = ({ currentPage, setCurrentPage, setIsAsideOpen }) => {
	const { data: session } = useSession();

	function onClickSetCurrentPage(event) {
		// simply just returning if the page you clicked is already the currentPage (by doing this we are preventing that we are re-rendering if it is not necessary) - Not should if this should be kept, cause we might wanna do the refresh when clicking on the already selected page?
		if (event.target.innerText.toLowerCase() === currentPage) {
			return;
		}

		switch (event.target.innerText.toLowerCase()) {
			case 'dashboard':
				setCurrentPage('dashboard');
				break;
			case 'news':
				setCurrentPage('news');
				break;
			case 'journals':
				setCurrentPage('journals');
				break;
			case 'settings':
				setCurrentPage('settings');
				break;
		}
	}

	return (
		<>
			<IconContext.Provider value={{ size: '1.3em' }}>
				<div>
					<AiFillCloseCircle
						className="text-white absolute right-6 top-8 text-lg cursor-pointer hover:text-gray-200 duration-150"
						onClick={() => setIsAsideOpen(false)}
					/>
					<Link href="/">
						<h2 className="text-white font-bold text-3xl mb-32 cursor-pointer">
							ALZH.info
						</h2>
					</Link>
				</div>
				<ul className="text-zinc-600 flex gap-8 font-semibold flex-col">
					<li
						onClick={onClickSetCurrentPage}
						className={`${
							currentPage === 'dashboard' ? 'text-white' : ''
						} flex items-center gap-5 cursor-pointer hover:text-white duration-100 select-none`}
					>
						<RiDashboard2Fill />
						Dashboard
					</li>
					<li
						onClick={onClickSetCurrentPage}
						className={`${
							currentPage === 'news' ? 'text-white' : ''
						} flex items-center gap-5 cursor-pointer hover:text-white duration-100 select-none`}
					>
						<IoNewspaperOutline />
						News
					</li>
					{/* <li
						onClick={onClickSetCurrentPage}
						className={`${
							currentPage === 'journals' ? 'text-white' : ''
						} flex items-center gap-5 cursor-pointer hover:text-white duration-100 select-none`}
					>
						<IoIosJournal />
						Journals
					</li> */}
					<li
						onClick={onClickSetCurrentPage}
						className={`${
							currentPage === 'settings' ? 'text-white' : ''
						} flex items-center gap-5 cursor-pointer hover:text-white duration-100 select-none`}
					>
						<FaCog />
						Settings
					</li>
				</ul>
				<div className="mt-auto">
					<div
						onClick={() => setCurrentPage('settings')}
						className="flex mb-12 gap-4 items-center cursor-pointer select-none"
					>
						<div className="rounded-full flex p-6 bg-white">
							{/* <FaUserAlt color="white" size="1.4em" /> */}
						</div>
						<div>
							<p className="text-zinc-200 text-sm font-semibold tracking-wider">
								{session?.user.firstName}
							</p>
							<p className="text-zinc-500 font-semibold text-xs tracking-wider">
								{/* TODO - LOOK AT THE OPTIONAL CHAINING, IF THIS IS NOT USED, THEN YOU WILL GET AN ERROR */}
								{session?.user.role === 'admin' && session?.user.role}
							</p>
						</div>
					</div>
					<button
						href="/"
						onClick={() => signOut({ callbackUrl: 'http://localhost:3000/' })}
						className="text-white flex justify-center w-full px-4 py-1 bg-red-800 font-semibold rounded-md hover:bg-red-700 duration-100 select-none"
					>
						LOGOUT
					</button>
				</div>
			</IconContext.Provider>
		</>
	);
};

export default DashboardAside;
