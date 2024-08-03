'use client';

import { CirclePlus, MinusCircle } from 'lucide-react';
import { Button } from '../button';

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
	const handleFirstPage = () => onPageChange(1);
	const handleLastPage = () => onPageChange(totalPages);
	const handlePreviousPage = () => onPageChange(currentPage - 1);
	const handleNextPage = () => onPageChange(currentPage + 1);

	return (
		<div className="flex justify-between items-center mt-6">
			<Button
				className="bg-blue-600 hover:bg-blue-700"
				onClick={handleFirstPage}
				disabled={currentPage === 1}
			>
				Primera
			</Button>
			<div className="flex space-x-4 items-center">
				<Button
					variant={'ghost'}
					className="p-0 h-0"
					onClick={handlePreviousPage}
					disabled={currentPage === 1}
				>
					<MinusCircle size={20} className="hover:text-blue-400" />
				</Button>
				<span>
					Página {currentPage} de {totalPages}
				</span>
				<Button
					variant={'ghost'}
					className="p-0 h-0"
					onClick={handleNextPage}
					disabled={currentPage === totalPages}
				>
					<CirclePlus size={20} className="hover:text-blue-400" />
				</Button>
			</div>
			<Button
				className="bg-blue-600 hover:bg-blue-700"
				onClick={handleLastPage}
				disabled={currentPage === totalPages}
			>
				Última
			</Button>
		</div>
	);
};
