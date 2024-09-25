import { useState, useEffect } from 'react';
import { Expense, useExpenseStore } from '../useExpenseStore';

const useExpenseForm = (expenseId: Expense['id'] | undefined) => {
	const expenses = useExpenseStore(state => state.expenses);

	const [description, setDescription] = useState('');
	const [amount, setAmount] = useState<string | number>('');
	const [date, setDate] = useState('');
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		if (expenseId) {
			const currentExpense = expenses.find(expense => expense.id === expenseId);
			if (currentExpense) {
				setDescription(currentExpense.description);
				setAmount(currentExpense.amount);
				setDate(currentExpense.date);
			}
		}
	}, [expenseId, expenses]);

	const resetForm = () => {
		setDescription('');
		setAmount('');
		setDate('');
	};

	const handleOpenModal = () => setShowModal(true);
	const handleCloseModal = () => {
		resetForm();
		setShowModal(false);
	};

	return {
		description,
		setDescription,
		amount,
		setAmount,
		date,
		setDate,
		showModal,
		handleOpenModal,
		handleCloseModal,
	};
};

export default useExpenseForm;
