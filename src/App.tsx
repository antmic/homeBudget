import { useState } from 'react';
import { useExpenseStore } from './useExpenseStore';
import './App.css';
import ExpenseForm from './components/ExpenseForm';
import RemoveExpense from './components/RemoveExpense';

function App() {
	const expenses = useExpenseStore(state => state.expenses);
	const [showForm, setShowForm] = useState(false);
	const [visibleForms, setVisibleForms] = useState<{
		[key: number]: { edit: boolean; copy: boolean; remove: boolean };
	}>({});

	const setFormVisibilityOn = () => {
		setShowForm(true);
	};

	const setFormVisibilityOff = () => {
		setShowForm(false);
	};

	const setVisibilityOn = (id: number, type: 'edit' | 'copy' | 'remove') => {
		setVisibleForms(prevState => ({
			...prevState,
			[id]: {
				...prevState[id],
				[type]: true,
			},
		}));
	};

	const setVisibilityOff = (id: number, type: 'edit' | 'copy' | 'remove') => {
		setVisibleForms(prevState => ({
			...prevState,
			[id]: {
				...prevState[id],
				[type]: false,
			},
		}));
	};

	return (
		<>
			<h1>Home Budget</h1>
			<div>
				<button onClick={setFormVisibilityOn}>Add Expense</button>
				{showForm && <ExpenseForm onClose={setFormVisibilityOff} />}
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
						{expenses.map(expense => (
							<tr key={expense.id}>
								<td>{expense.description}</td>
								<td>{expense.amount}</td>
								<td>{expense.date}</td>
								<td>
									<button onClick={() => setVisibilityOn(expense.id, 'remove')}>Remove Expense</button>
									{visibleForms[expense.id]?.remove && (
										<RemoveExpense expense={expense} onClose={() => setVisibilityOff(expense.id, 'remove')} />
									)}

									<button onClick={() => setVisibilityOn(expense.id, 'edit')}>Edit Expense</button>
									{visibleForms[expense.id]?.edit && (
										<ExpenseForm
											expenseId={expense.id}
											action='edit'
											onClose={() => setVisibilityOff(expense.id, 'edit')}
										/>
									)}

									<button onClick={() => setVisibilityOn(expense.id, 'copy')}>Copy Expense</button>
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
		</>
	);
}

export default App;
