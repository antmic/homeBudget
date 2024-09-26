import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Expense = {
	id: number;
	description: string;
	amount: string;
	date: string;
	comment?: string;
};

interface ExpenseState {
	expenses: Expense[];
	addExpense: (expense: Expense) => void;
	updateExpense: (id: number, updatedExpense: Expense) => void;
	removeExpense: (id: number) => void;
}

export const useExpenseStore = create(
	persist<ExpenseState>(
		set => ({
			expenses: [],
			addExpense: expense => set(state => ({ expenses: [...state.expenses, expense] })),
			updateExpense: (id, updatedExpense) =>
				set(state => ({
					expenses: state.expenses.map(expense => (expense.id === id ? updatedExpense : expense)),
				})),
			removeExpense: id =>
				set(state => ({
					expenses: state.expenses.filter(expense => expense.id !== id),
				})),
		}),
		{
			name: 'expense-storage', // unique name for the storage
		}
	)
);
