import React, { useContext, useRef, useState } from 'react';
import { FaGlobeEurope, FaTrash } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';
import { FiCheck } from 'react-icons/fi';
import { BiEdit } from 'react-icons/bi';

import DashBoardModal from '../DashBoardModal';

import { Oval } from 'react-loader-spinner';
// import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import { format, formatDistance, subDays } from 'date-fns';
import { AllNewsContext } from '../../../context/Context';
import axios from 'axios';
import ConfirmationPopup from '../../Confirmation/ConfirmationPopup';
import ConfirmationBackdrop from '../../Confirmation/ConfirmationBackdrop';

const DashboardNewsForm = ({ currentShownArticle, setIsModalShown }) => {
	const [isSaving, setIsSaving] = useState(false);
	const { articles, setArticles } = useContext(AllNewsContext);
	const [isEditMode, setIsEditMode] = useState({
		title: false,
		subtitle: false,
		publishDate: false,
		recommended: false,
		publisher: false,
		url: false,
	});

	const [isConfirmationPopup, setIsConfirmationPopup] = useState(false);

	const [title, setTitle] = useState(currentShownArticle.title);
	const [subtitle, setSubtitle] = useState(currentShownArticle.subtitle);
	const [url, setUrl] = useState(currentShownArticle.url);
	const [publisher, setPublisher] = useState(currentShownArticle.publisher);
	const [publisherUrl, setPublisherUrl] = useState(
		currentShownArticle.publisherUrl
	);

	const [publishDate, setPublishDate] = useState(
		new Date(currentShownArticle.publishDate).toISOString()
	);
	const [updatedAt, setUpdatedAt] = useState(
		new Date(currentShownArticle.updatedAt)
	);
	const [recommended, setRecommended] = useState(
		currentShownArticle.recommended
	);

	// const [publishDate, setPublishDate] = useState(
	// 	currentShownArticle.publishDate.toISOString()
	// );
	const [type, setType] = useState(currentShownArticle.type);

	const [status, setStatus] = useState(currentShownArticle.status);
	const formData = {
		id: currentShownArticle.id,
		title,
		subtitle,
		url,
		publisher,
		publisherUrl,
		publishDate,
		type,
		status,
		recommended,
		updatedAt: Date.now(),
	};

	async function onSubmitForm() {
		try {
			const res = await axios.put('http://localhost:8000/api/news', formData);
			console.log(res);
			if (res.status === 200) {
				setIsSaving(false);
				const newArticles = articles.filter(
					(article) => currentShownArticle.id !== article.id
				);
				setArticles([...newArticles, formData]);
				setUpdatedAt(Date.now());
				console.log('ARTICLE UPDATED');
			} else {
				setIsSaving(false);
				throw new Error(res.status);
			}
		} catch (e) {
			console.log('ERROR');
			console.log(e);
		}
	}

	async function onDeleteArticle(id) {
		try {
			const res = await axios.delete('http://localhost:8000/api/news', id);
			console.log(res);
			if (res.status === 200) {
				setIsConfirmationPopup(false);
				setIsModalShown(false);
			}
		} catch (e) {
			console.log(e);
		}
	}

	const titleText = useRef();
	const subTitleText = useRef();

	async function saveOnClick() {
		setIsSaving(true);
		await onSubmitForm();
	}

	function activateEditMode(title) {
		switch (title) {
			case 'title':
				setIsEditMode((prevState) => ({ ...prevState, title: true }));
				break;
			case 'subtitle':
				setIsEditMode((prevState) => ({ ...prevState, subtitle: true }));
				break;
		}
		// setIsEditMode();
	}
	function deactivateEditMode(title) {
		switch (title) {
			case 'title':
				setIsEditMode((prevState) => ({ ...prevState, title: false }));
				break;
			case 'subtitle':
				setIsEditMode((prevState) => ({ ...prevState, subtitle: false }));
				break;
		}
	}

	function onClickAcceptChange(ref, setterFunc) {
		setterFunc(ref.current.value);
		setIsEditMode(false);
	}

	return (
		<>
			<section className="bg-white px-12 py-6 rounded-lg">
				<div className="flex items-center gap-4 mb-8 border-b-[1px] pb-3">
					<p className="font-bold">{currentShownArticle.id}</p>
					{status === 'PENDING' && (
						<span
							onClick={() => setStatus('APPROVED')}
							className="p-1 px-4 bg-[#FEF8E8] text-[#F4C745] font-bold text-xs rounded-full flex items-center gap-1 w-[100px] justify-center cursor-pointer select-none"
						>
							{status}
						</span>
					)}

					{status === 'APPROVED' && (
						<span
							onClick={() => setStatus('REJECTED')}
							className="p-1 px-4 bg-[#EBF9EB] text-[#3EC13D] font-bold text-xs rounded-full flex items-center gap-1 w-[100px] justify-center cursor-pointer select-none"
						>
							{status}
						</span>
					)}

					{status === 'REJECTED' && (
						<span
							onClick={() => setStatus('PENDING')}
							className="p-1 px-4 bg-[#FDEBEB] text-[#F14546] font-bold text-xs rounded-full flex items-center justify-center gap-1 w-[100px] cursor-pointe select-none cursor-pointer"
						>
							{status}
						</span>
					)}

					<a className="" href={currentShownArticle.url} target="_blank">
						<FaGlobeEurope />
					</a>
					<div className="ml-auto flex gap-4 items-center">
						<FaTrash
							onClick={() => setIsConfirmationPopup(true)}
							className="cursor-pointer"
						/>
						{isConfirmationPopup && (
							<ConfirmationBackdrop>
								<ConfirmationPopup
									setIsConfirmationPopup={setIsConfirmationPopup}
									onDeleteArticle={onDeleteArticle}
									id={currentShownArticle.id}
								/>
							</ConfirmationBackdrop>
						)}

						<p className="italic flex text-sm">
							<p className="not-italic font-bold inline-block">
								Last edited: &nbsp;
							</p>
							{formatDistance(subDays(new Date(updatedAt), 0), new Date(), {
								addSuffix: true,
							})}
						</p>
					</div>
				</div>

				<form className="flex" action="">
					<section className="grid w-full grid-cols-4 gap-x-12">
						<div className="col-span-2">
							<div className="mb-4">
								{isEditMode.title ? (
									<>
										<h3 className="text-2xl uppercase font-bold mb-2">Title</h3>

										<div className="flex items-start gap-2">
											<textarea
												className="w-full"
												// onBlur={(e) => deactivateEditMode(e)}
												// onChange={(e) => setTitle(e.target.value)}
												defaultValue={title}
												// value={title}
												ref={titleText}
											/>
											<button
												onClick={() => onClickAcceptChange(titleText, setTitle)}
												className="bg-green-800 hover:bg-green-700 text-white py-1 px-4 text-lg flex items-center justify-center"
											>
												<FiCheck />
											</button>
											<button
												onClick={() => deactivateEditMode('title')}
												className="bg-red-700 hover:bg-red-600 text-white py-1 px-4 text-lg flex items-center justify-center"
											>
												<IoCloseSharp />
											</button>
										</div>
									</>
								) : (
									<>
										<div className="flex gap-2 items-center">
											<h3 className="text-2xl uppercase font-bold mb-2">
												title
											</h3>
											<BiEdit
												onClick={(e) => activateEditMode('title')}
												size="1.2em"
												className="cursor-pointer hover:text-zinc-700"
											/>
										</div>
										<p>{title}</p>
									</>
								)}
							</div>
							<div className="mb-4">
								{isEditMode.subtitle ? (
									<>
										<h3 className="text-2xl uppercase font-bold mb-2">
											subtitle
										</h3>

										<div className="flex items-start gap-2">
											<textarea
												className="w-full"
												// onBlur={(e) => deactivateEditMode(e)}
												// onChange={(e) => setTitle(e.target.value)}
												defaultValue={subtitle}
												// value={title}
												ref={subTitleText}
											/>
											<button
												onClick={() =>
													onClickAcceptChange(subTitleText, setSubtitle)
												}
												className="bg-green-800 hover:bg-green-700 text-white py-1 px-4 text-lg flex items-center justify-center"
											>
												<FiCheck />
											</button>
											<button
												onClick={(e) => deactivateEditMode('subtitle')}
												className="bg-red-700 hover:bg-red-600 text-white py-1 px-4 text-lg flex items-center justify-center"
											>
												<IoCloseSharp />
											</button>
										</div>
									</>
								) : (
									<>
										<div className="flex gap-2 items-center">
											<h3 className="text-2xl uppercase font-bold mb-2">
												subtitle
											</h3>
											<BiEdit
												onClick={(e) => activateEditMode('subtitle')}
												size="1.2em"
												className="cursor-pointer hover:text-zinc-700"
											/>
										</div>
										<p>{subtitle}</p>
									</>
								)}
							</div>
							<div className="mb-4">
								<h3 className="text-xl uppercase font-bold mb-2">
									Publish Date
								</h3>
								<p>{format(new Date(publishDate), 'dd/MM/yyyy')}</p>
							</div>
							<div className="flex items-center gap-2">
								<label className="font-bold" htmlFor="recommended">
									Recommended:
								</label>
								<input
									type="checkbox"
									id="recommended"
									checked={recommended}
									onChange={() => setRecommended((prevState) => !prevState)}
								/>
							</div>
						</div>
						<div className="col-span-2">
							<div className="mb-4">
								<h4 className="text-xl uppercase font-bold mb-2">PUBLISHER</h4>

								{!currentShownArticle.publisher ? (
									<p className="bg-[#FDEBEB] text-[#F14546] rounded-full px-3 font-bold py-1 inline-block">
										MISSING
									</p>
								) : (
									<div className="flex gap-4 justify-start items-center">
										{currentShownArticle.publisher.map((el) => (
											<input type="text" className="text-sm" value={el} />
										))}
									</div>
								)}
							</div>
							<div className="mb-4">
								<h4 className="text-xl uppercase font-bold mb-2">URL</h4>
								<h1>
									{!currentShownArticle.url ? (
										<p className="bg-[#FDEBEB] text-[#F14546] rounded-full px-3 font-bold py-1 inline-block">
											MISSING
										</p>
									) : (
										<input
											type="text"
											className="w-full text-blue-400 text-sm truncate ..."
											value={currentShownArticle.url}
										/>
									)}
								</h1>
							</div>
						</div>
					</section>
				</form>
				<div className="flex gap-4 mt-auto justify-end">
					<button
						className="bg-green-800 text-white font-bold py-1 px-4 rounded-md tracking-wide flex items-center gap-2 hover:bg-green-700"
						onClick={saveOnClick}
					>
						SAVE
						{isSaving ? (
							<Oval
								height={15}
								width={15}
								color="#fff"
								ariaLabel="oval-loading"
								strokeWidth={5}
								strokeWidthSecondary={4}
							/>
						) : (
							''
						)}
					</button>
					<button
						className="bg-red-700 text-white font-bold py-1 px-4 rounded-md flex items-center gap-1 justify-center hover:bg-red-600"
						onClick={() => setIsModalShown(false)}
					>
						<IoCloseSharp
							color="white"
							size="1.4em"
							style={{ fontWeight: 'bold' }}
						/>
					</button>
				</div>
			</section>
		</>
	);
};

export default DashboardNewsForm;
