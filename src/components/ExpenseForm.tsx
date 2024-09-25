import React from 'react';
import { useExpenseStore, Expense } from '../useExpenseStore';
import Modal from './Modal';
import useExpenseForm from '../hooks/useExpenseForm';

interface ExpenseFormProps {
	expense?: Expense['id'] | undefined;
	action?: 'edit' | 'copy';
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ expense, action }) => {
	const addExpense = useExpenseStore(state => state.addExpense);
	const updateExpense = useExpenseStore(state => state.updateExpense);

	const {
		description,
		setDescription,
		amount,
		setAmount,
		date,
		setDate,
		showModal,
		handleOpenModal,
		handleCloseModal,
	} = useExpenseForm(expense);

	const handleAddExpense = () => {
		const newExpense: Expense = {
			id: Date.now(),
			description,
			amount: typeof amount === 'string' ? parseFloat(amount) : amount,
			date,
		};
		addExpense(newExpense);
		handleCloseModal();
	};

	const handleEditExpense = () => {
		const updatedExpense: Expense = {
			id: expense!,
			description,
			amount: typeof amount === 'string' ? parseFloat(amount) : amount,
			date,
		};
		updateExpense(expense!, updatedExpense);
		handleCloseModal();
	};

	const handleCopyExpense = () => {
		const newExpense: Expense = {
			id: Date.now(),
			description,
			amount: typeof amount === 'string' ? parseFloat(amount) : amount,
			date,
		};
		addExpense(newExpense);
		handleCloseModal();
	};

	let handleExpense;
	let buttonText;
	switch (action) {
		case 'edit': {
			handleExpense = handleEditExpense;
			buttonText = 'Edit';
			break;
		}
		case 'copy': {
			handleExpense = handleCopyExpense;
			buttonText = 'Copy and edit';
			break;
		}
		default: {
			handleExpense = handleAddExpense;
			buttonText = 'Add expense';
			break;
		}
	}

	return (
		<div>
			<button onClick={handleOpenModal}>{buttonText}</button>
			<Modal show={showModal} onClose={handleCloseModal}>
				<input
					type='text'
					placeholder='Description'
					value={description}
					onChange={e => setDescription(e.target.value)}
				/>
				<input
					type='number'
					placeholder='Amount'
					value={amount}
					onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
				/>
				<input type='date' value={date} onChange={e => setDate(e.target.value)} />
				<button onClick={handleExpense}>Save</button>
			</Modal>
		</div>
	);
};

export default ExpenseForm;
