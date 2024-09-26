import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useExpenseStore, Expense } from '../useExpenseStore';
import Modal from './Modal';
import { validateMoney } from '../lib/validation';

interface ExpenseFormProps {
	expenseId?: Expense['id'] | undefined;
	action?: 'edit' | 'copy';
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ expenseId, action }) => {
	const addExpense = useExpenseStore(state => state.addExpense);
	const updateExpense = useExpenseStore(state => state.updateExpense);
	const expenses = useExpenseStore(state => state.expenses);
	const [description, setDescription] = useState('');
	const [amount, setAmount] = useState('');
	const [date, setDate] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [buttonDisabled, setButtonDisabled] = useState(true);
	const descriptionInputRef = useRef<HTMLInputElement>(null);

	const handleAddExpense = useCallback(() => {
		const newExpense: Expense = {
			id: Date.now(),
			description,
			amount: amount,
			date,
		};
		addExpense(newExpense);
		setShowModal(false);
	}, [description, amount, date, addExpense]);

	const handleEditExpense = useCallback(() => {
		const updatedExpense: Expense = {
			id: expenseId!,
			description,
			amount: amount,
			date,
		};
		updateExpense(expenseId!, updatedExpense);
		setShowModal(false);
	}, [description, amount, date, expenseId, updateExpense]);

	const handleCopyExpense = useCallback(() => {
		const newExpense: Expense = {
			id: Date.now(),
			description,
			amount: amount,
			date,
		};
		addExpense(newExpense);
		setShowModal(false);
	}, [description, amount, date, addExpense]);

	const { handleExpense, buttonText } = useMemo(() => {
		let handleExpense: () => void;
		let buttonText: string;

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

		return { handleExpense, buttonText };
	}, [action, handleAddExpense, handleEditExpense, handleCopyExpense]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Enter' && !buttonDisabled) {
				handleExpense();
			}
		};

		if (showModal) {
			document.addEventListener('keydown', handleKeyDown);
		}

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [showModal, buttonDisabled, handleExpense]);

	useEffect(() => {
		if (showModal && descriptionInputRef.current) {
			descriptionInputRef.current.focus();
		}
	}, [showModal]);

	useEffect(() => {
		if (expenseId) {
			const currentExpense = expenses.find(exp => exp.id === expenseId);
			if (currentExpense) {
				setDescription(currentExpense.description);
				setAmount(currentExpense.amount);
				setDate(currentExpense.date);
			}
		} else {
			setDescription('');
			setAmount('');
			setDate('');
		}
	}, [expenseId, expenses, showModal]);

	useEffect(() => {
		if (description && amount && date) {
			setButtonDisabled(false);
		} else {
			setButtonDisabled(true);
		}
	}, [description, amount, date]);

	return (
		<div>
			<button onClick={() => setShowModal(true)}>{buttonText}</button>
			<Modal show={showModal} onClose={() => setShowModal(false)}>
				<input
					type='text'
					placeholder='Description'
					value={description}
					onChange={e => setDescription(e.target.value)}
					ref={descriptionInputRef}
				/>
				<input
					placeholder='Amount'
					value={amount}
					// onBlur is used to handle the case when the user enters '0.' and then clicks outside the input as it cannot be handled by the onChange event
					onChange={e => setAmount(validateMoney(e.target.value))}
					onBlur={e => {
						if (e.target.value === '0.') {
							setAmount('0');
						}
					}}
				/>
				<input type='date' value={date} onChange={e => setDate(e.target.value)} />
				<button disabled={buttonDisabled} onClick={handleExpense}>
					Save
				</button>
			</Modal>
		</div>
	);
};

export default ExpenseForm;
