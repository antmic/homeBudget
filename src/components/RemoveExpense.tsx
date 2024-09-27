import React from 'react';
import { useExpenseStore, Expense } from '../useExpenseStore';
import './Modal.css';

interface RemoveExpenseProps {
	expense: Expense;
	onClose: () => void;
}

const RemoveExpense: React.FC<RemoveExpenseProps> = ({ expense, onClose }) => {
	const removeExpense = useExpenseStore(state => state.removeExpense);

	return (
		<div className='modal-overlay'>
			<div className='modal-content'>
				<span>Remove expense?</span>
				<button
					onClick={() => {
						removeExpense(expense.id);
						onClose();
					}}>
					Remove
				</button>
				<button className='close-button' onClick={onClose}>
					x
				</button>
			</div>
		</div>
	);
};

export default RemoveExpense;
