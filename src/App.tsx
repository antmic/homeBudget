import React, { useMemo, useState } from 'react';
import { Expense, useExpenseStore } from './useExpenseStore';
import './App.css';
import ExpenseForm from './components/ExpenseForm';
import RemoveExpense from './components/RemoveExpense';

interface GroupedExpenses {
	[key: string]: Expense[];
}

const App: React.FC = () => {
	console.log('App component rendered');

	const expenses = useExpenseStore(state => state.expenses);
	const [visibleForms, setVisibleForms] = useState<{
		[key: number]: { edit: boolean; copy: boolean; remove: boolean; add: boolean };
	}>({});
	const addId = 0; // fake id for the add form to conform to the structure of visibleForms

	const setVisibilityOn = (id: number, type: 'edit' | 'copy' | 'remove' | 'add') => {
		setVisibleForms(prevState => ({
			...prevState,
			[id]: {
				...prevState[id],
				[type]: true,
			},
		}));
	};

	const setVisibilityOff = (id: number, type: 'edit' | 'copy' | 'remove' | 'add') => {
		setVisibleForms(prevState => ({
			...prevState,
			[id]: {
				...prevState[id],
				[type]: false,
			},
		}));
	};

	const groupedExpenses = useMemo(() => {
		console.log('groupedExpenses rendered');

		// Group expenses by month using ISO date format
		const grouped = expenses.reduce<GroupedExpenses>((acc, expense) => {
			const month = new Date(expense.date).toISOString().slice(0, 7); // YYYY-MM format
			if (!acc[month]) {
				acc[month] = [];
			}
			acc[month].push(expense);
			return acc;
		}, {});

		// Sort the groups by month in descending order
		const sortedGrouped: GroupedExpenses = {};
		Object.keys(grouped)
			.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
			.forEach(key => {
				sortedGrouped[key] = grouped[key];
			});

		return sortedGrouped;
	}, [expenses]);

	const sumMonthlyExpenses = useMemo(() => {
		console.log('sumMonthlyExpenses computed');
		return Object.keys(groupedExpenses).reduce<{ [key: string]: number }>((acc, month) => {
			acc[month] = groupedExpenses[month].reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
			return acc;
		}, {});
	}, [groupedExpenses]);

	return (
		<>
			<h1>Home Budget</h1>
			<div>
				<button onClick={() => setVisibilityOn(addId, 'add')}>Add Expense</button>
				{visibleForms[addId]?.add && <ExpenseForm onClose={() => setVisibilityOff(0, 'add')} />}
				{Object.keys(groupedExpenses).map(month => (
					<div key={month}>
						<h2>{month}</h2>
						<p>Total: {sumMonthlyExpenses[month]}</p>
						<table>
							<thead>
								<tr>
									<th>Description</th>
									<th>Amount</th>
									<th>Date</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{groupedExpenses[month].map(expense => (
									<tr key={expense.id}>
										<td>{expense.description}</td>
										<td>{expense.amount}</td>
										<td>{expense.date}</td>
										<td>
											<button onClick={() => setVisibilityOn(expense.id, 'remove')}>Remove</button>
											{visibleForms[expense.id]?.remove && (
												<RemoveExpense expense={expense} onClose={() => setVisibilityOff(expense.id, 'remove')} />
											)}

											<button onClick={() => setVisibilityOn(expense.id, 'edit')}>Edit</button>
											{visibleForms[expense.id]?.edit && (
												<ExpenseForm
													expenseId={expense.id}
													action='edit'
													onClose={() => setVisibilityOff(expense.id, 'edit')}
												/>
											)}

											<button onClick={() => setVisibilityOn(expense.id, 'copy')}>Copy</button>
											{visibleForms[expense.id]?.copy && (
												<ExpenseForm
													expenseId={expense.id}
													action='copy'
													onClose={() => setVisibilityOff(expense.id, 'copy')}
												/>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				))}
			</div>
		</>
	);
};

export default App;
