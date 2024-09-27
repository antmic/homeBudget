import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { useExpenseStore, Expense } from '../useExpenseStore';
import { validateMoney } from '../lib/validation';
import useFormState from '../hooks/useFormState';
import './Modal.css';

interface ExpenseFormProps {
	expenseId?: Expense['id'] | undefined;
	action?: 'edit' | 'copy';
	onClose: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ expenseId, action, onClose }) => {
	const addExpense = useExpenseStore(state => state.addExpense);
	const updateExpense = useExpenseStore(state => state.updateExpense);
	const [formState, setFormState] = useFormState(expenseId);
	const descriptionInputRef = useRef<HTMLInputElement>(null);

	// count the number of times the component renders and log it to the console
	const renderCount = useRef(0);
	console.log('ExpenseForm rendered', renderCount.current++);

	const handleExpense = useCallback(() => {
		const expense: Expense = {
			id: action === 'edit' ? expenseId! : Date.now(),
			...formState,
		};

		if (action === 'edit') {
			updateExpense(expenseId!, expense);
		} else {
			addExpense(expense);
		}

		onClose();
	}, [action, expenseId, formState, onClose, updateExpense, addExpense]);

	useEffect(() => {
		if (descriptionInputRef.current) {
			descriptionInputRef.current.focus();
		}
	}, []);

	const isButtonDisabled = useMemo(() => {
		const { description, amount, date } = formState;
		return !(description && amount && date);
	}, [formState]);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const { name, value } = e.target;
			setFormState(prevState => ({
				...prevState,
				[name]: name === 'amount' ? validateMoney(value) : value,
			}));
		},
		[setFormState]
	);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Enter' && !isButtonDisabled) {
				handleExpense();
			}
		};
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [isButtonDisabled, handleExpense]);

	return (
		<div className='modal-overlay'>
			<div className='modal-content'>
				<input
					type='text'
					name='description'
					placeholder='Description'
					value={formState.description}
					onChange={handleChange}
					ref={descriptionInputRef}
				/>
				<input
					name='amount'
					placeholder='Amount'
					value={formState.amount}
					onChange={handleChange}
					onBlur={e => {
						if (e.target.value === '0.') {
							setFormState(prevState => ({ ...prevState, amount: '0' }));
						}
					}}
				/>
				<input type='date' name='date' value={formState.date} onChange={handleChange} />
				<button disabled={isButtonDisabled} onClick={handleExpense}>
					Save
				</button>
				<button className='close-button' onClick={onClose}>
					X
				</button>
			</div>
		</div>
	);
};

export default ExpenseForm;
