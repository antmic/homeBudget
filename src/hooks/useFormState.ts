import { useState } from 'react';
import { Expense, useExpenseStore } from '../useExpenseStore';

const useFormState = (expenseId?: Expense['id']) => {
	const expenses = useExpenseStore(state => state.expenses);

	let initialFormState = {
		description: '',
		amount: '',
		date: '',
	};

	if (expenseId) {
		const currentExpense = expenses.find(exp => exp.id === expenseId);
		if (currentExpense) {
			initialFormState = {
				description: currentExpense.description,
				amount: currentExpense.amount,
				date: currentExpense.date,
			};
		}
	}

	const [formState, setFormState] = useState({
		description: initialFormState.description,
		amount: initialFormState.amount,
		date: initialFormState.date,
	});

	return [formState, setFormState] as const;
};

export default useFormState;
