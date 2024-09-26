import React, { useEffect } from 'react';
import './Modal.css';

interface ModalProps {
	show: boolean;
	onClose: () => void;
	children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, children }) => {

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};

		if (show) {
			document.addEventListener('keydown', handleKeyDown);
		}

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [show, onClose]);

	if (!show) {
		return null;
	}

	return (
		<div className='modal-overlay'>
			<div className='modal-content'>
				<button className='close-button' onClick={onClose}>
					X
				</button>
				{children}
			</div>
		</div>
	);
};

export default Modal;
