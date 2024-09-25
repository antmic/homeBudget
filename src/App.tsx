import { useExpenseStore } from './useExpenseStore';
import './App.css';
import RemoveExpense from './components/RemoveExpense';
import ExpenseForm from './components/ExpenseForm';

function App() {
	const expenses = useExpenseStore(state => state.expenses);

	return (
		<>
			<h1>Home Budget</h1>
			<div className='card'>
				<ExpenseForm />
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
									<RemoveExpense expense={expense} />
									<ExpenseForm expense={expense.id} action='edit' />
									<ExpenseForm expense={expense.id} action='copy' />
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
