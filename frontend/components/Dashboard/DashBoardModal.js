import React from 'react';
const DashBoardModal = ({ children, setIsModalShown }) => {
	return (
		<>
			<div
				onClick={() => setIsModalShown(false)}
				className="fixed bg-black bg-opacity-60 h-full w-full overflow-hidden z-50 left-72 top-0 "
			></div>
			<div className="fixed z-50 px-12 py-6 bg-white h-[90%] w-[70%] top-12 rounded-lg">
				{children}
			</div>
		</>
	);
};

export default DashBoardModal;