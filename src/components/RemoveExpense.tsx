import React, { useState } from 'react';
import { useExpenseStore, Expense } from '../useExpenseStore';
import Modal from './Modal';

interface RemoveExpenseProps {
	expense: Expense;
}

const RemoveExpense: React.FC<RemoveExpenseProps> = ({ expense }) => {
	const removeExpense = useExpenseStore(state => state.removeExpense);
	const [showModal, setShowModal] = useState(false);

	return (
		<div>
			<button onClick={() => setShowModal(true)}>Remove</button>
			<Modal show={showModal} onClose={() => setShowModal(false)}>
				<span>Remove expense?</span>
				<button
					onClick={() => {
						removeExpense(expense.id);
						setShowModal(false);
					}}>
					Remove
				</button>
			</Modal>
		</div>
	);
};

export default RemoveExpense;
