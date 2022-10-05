import React from 'react';
import Link from 'next/link';
import NavArrow from '../UI/NavArrow';

const NavDropDown = () => {
	return (
		<>
			<div className="absolute top-10">
				<NavArrow className="-top-2 left-[110px]" />
				<ul className="bg-black font-semibold text-white p-8 rounded-md relative   shadow-md flex flex-col z-50 gap-4 items-start select-none">
					<div className="flex gap-8">
						<div className="flex flex-col gap-2">
							<li>
								<Link
									href="/dashboard/liked-articles"
									className="cursor-pointer"
								>
									<a className="flex items-center gap-2 hover:text-gray-400">
										<p className="">What is Alzheimer's Disease?</p>
									</a>
								</Link>
							</li>
							<li>
								<Link
									href="/dashboard/liked-articles"
									className="cursor-pointer"
								>
									<a className="flex items-center gap-2 hover:text-gray-400">
										<p className="">How is Alzheimer's Disease Diagnosed?</p>
									</a>
								</Link>
							</li>
							<li>
								<Link
									href="/dashboard/liked-articles"
									className="cursor-pointer"
								>
									<a className="flex items-center gap-2 hover:text-gray-400">
										<p className="">Know the 10 Signs</p>
									</a>
								</Link>
							</li>

							<li>
								<Link
									href="/dashboard/liked-articles"
									className="cursor-pointer"
								>
									<a className="flex items-center gap-2 hover:text-gray-400">
										<p>Treatments</p>
									</a>
								</Link>
							</li>
						</div>
						<div className="flex flex-col gap-2">
							<li>
								<Link
									href="/dashboard/liked-articles"
									className="cursor-pointer"
								>
									<a className="flex items-center gap-2 hover:text-gray-400">
										<p>What is Dementia?</p>
									</a>
								</Link>
							</li>
						</div>
					</div>
				</ul>
			</div>
		</>
	);
};

export default NavDropDown;
