import React, { useState, useContext } from 'react';

import { motion } from 'framer-motion';

import { AiFillCaretDown } from 'react-icons/ai';
import { NewsContext } from '../../../context/NewsContext';

// TODO A1) - turn these functions into ranges instead, right now we are only getting a date.
function getMondayOfCurrentWeek() {
	const today = new Date();
	const first = today.getDate() - today.getDay() + 1;

	const monday = new Date(today.setDate(first));
	return {
		text: 'Added this week',
		range: monday,
	};
}

function getMondayOfLastWeek() {
	const today = new Date();
	const first = today.getDate() - today.getDay() + 1;

	const monday = new Date(today.setDate(first - 7));
	return monday;
}

function getFirstDayOfCurrentMonth() {
	const now = new Date();
	const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
	const lastDayOfCurrentMonth = new Date(
		now.getFullYear(),
		now.getMonth() + 1,
		0
	);

	return { text: 'Added this month', range: firstDayOfCurrentMonth };
}

function getFirstDayPreviousMonth() {
	const now = new Date();
	const firstDayOfPreviousMonth = new Date(
		now.getFullYear(),
		now.getMonth() - 1,
		1
	);

	return firstDayOfPreviousMonth;
}

function getFirstDayThreePreviousMonth() {
	const now = new Date();
	const firstDayOfThreePreviousMonth = new Date(
		now.getFullYear(),
		now.getMonth() - 3,
		1
	);

	return firstDayOfThreePreviousMonth;
}

function getFirstDayOfYear(year) {
	return new Date(year, 0, 1);
}

const currentYear = new Date().getFullYear();

getFirstDayOfCurrentMonth();
getFirstDayPreviousMonth();
getFirstDayThreePreviousMonth();
getFirstDayOfYear(currentYear);

const DashboardHeaderAddedWhen = () => {
	const { articles, setArticles } = useContext(NewsContext);
	// get initial date for range

	const [articlesDateRange, setArticlesDateRange] = useState(
		getMondayOfCurrentWeek()
	);

	// TODO A2) - these should filter a range instead of just from 1 date until now
	const articlesLastAdded = articles.filter((article) => {
		return Date.parse(article.createdAt) > articlesDateRange.range;
	});

	const articlesLastAddedApproved = articles.filter((article) => {
		return (
			Date.parse(article.createdAt) > articlesDateRange.range &&
			article.status === 'APPROVED'
		);
	});

	const articlesLastAddedPending = articles.filter((article) => {
		return (
			Date.parse(article.createdAt) > articlesDateRange.range &&
			article.status === 'PENDING'
		);
	});
	const articlesLastAddedRejected = articles.filter((article) => {
		return (
			Date.parse(article.createdAt) > articlesDateRange.range &&
			article.status === 'REJECTED'
		);
	});

	return (
		<div className="bg-white py-4 px-8 rounded-lg w-[300px] flex flex-col justify-between shadow-md">
			{' '}
			<h3 className="font-bold text-2xl mb-4 flex items-center gap-2">
				{articlesDateRange.text}
				<AiFillCaretDown
					style={{ marginTop: '5px', cursor: 'pointer' }}
					size="0.8em"
				/>
			</h3>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 1.5 }}
				className="flex gap-5"
			>
				<p className="text-green-600 font-bold">
					{articlesLastAddedApproved.length}
				</p>
				<p className="text-orange-300 font-bold">
					{articlesLastAddedPending.length}
				</p>
				<p className="text-red-600 font-bold">
					{articlesLastAddedRejected.length}
				</p>
				<p className="font-bold ml-auto">{articlesLastAdded.length}</p>
			</motion.div>
		</div>
	);
};

export default DashboardHeaderAddedWhen;
