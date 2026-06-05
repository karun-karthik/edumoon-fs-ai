import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface Transaction {
    id: string;
    date: string;
    description: string;
    category: string;
    account: string;
    type: string;
    amount: number;
}

interface TransactionModalProps {
    show: boolean;
    onHide: () => void;
    onSave: (transaction: Transaction) => void;
    editingTransaction?: Transaction | null;
}

const TransactionModal = ({ show, onHide, onSave, editingTransaction }: TransactionModalProps) => {
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Groceries');
    const [account, setAccount] = useState('Checking Account');
    const [type, setType] = useState('Debit');
    const [amount, setAmount] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const categories = ['Groceries', 'Transport', 'Dining', 'Entertainment', 'Utilities', 'Income', 'Other'];
    const accounts = ['Checking Account', 'Savings Account', 'Credit Card'];

    useEffect(() => {
        if (editingTransaction) {
            setDate(editingTransaction.date);
            setDescription(editingTransaction.description);
            setCategory(editingTransaction.category);
            setAccount(editingTransaction.account);
            setType(editingTransaction.type);
            setAmount(editingTransaction.amount.toString());
        } else {
            const today = new Date();
            const formattedDate = today.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            });
            setDate(formattedDate);
            setDescription('');
            setCategory('Groceries');
            setAccount('Checking Account');
            setType('Debit');
            setAmount('');
        }
        setErrors({});
    }, [editingTransaction, show]);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!date.trim()) {
            newErrors.date = 'Date is required';
        }

        if (!description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!category) {
            newErrors.category = 'Category is required';
        }

        if (!account) {
            newErrors.account = 'Account is required';
        }

        if (!type) {
            newErrors.type = 'Type is required';
        }

        if (!amount || isNaN(parseFloat(amount))) {
            newErrors.amount = 'Valid amount is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateForm()) {
            const newTransaction: Transaction = {
                id: editingTransaction?.id || Date.now().toString(),
                date,
                description,
                category,
                account,
                type,
                amount: parseFloat(amount),
            };
            onSave(newTransaction);
            handleClose();
        }
    };

    const handleClose = () => {
        setDate('');
        setDescription('');
        setCategory('Groceries');
        setAccount('Checking Account');
        setType('Debit');
        setAmount('');
        setErrors({});
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg" className="transaction-modal">
            <Modal.Header closeButton className="transaction-modal-header">
                <Modal.Title className="transaction-modal-title">
                    {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="transaction-modal-body">
                <Form>
                    <div className="form-row">
                        <Form.Group className="mb-4 form-col" controlId="formDate">
                            <Form.Label className="transaction-form-label">Date</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="DD-MMM-YYYY"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className={`transaction-form-control ${errors.date ? 'is-invalid' : ''}`}
                                isInvalid={!!errors.date}
                            />
                            {errors.date && (
                                <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-4 form-col" controlId="formType">
                            <Form.Label className="transaction-form-label">Type</Form.Label>
                            <Form.Select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className={`transaction-form-control ${errors.type ? 'is-invalid' : ''}`}
                            >
                                <option>Debit</option>
                                <option>Credit</option>
                            </Form.Select>
                            {errors.type && (
                                <div className="invalid-feedback d-block">{errors.type}</div>
                            )}
                        </Form.Group>
                    </div>

                    <Form.Group className="mb-4" controlId="formDescription">
                        <Form.Label className="transaction-form-label">Description</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={`transaction-form-control ${errors.description ? 'is-invalid' : ''}`}
                            isInvalid={!!errors.description}
                        />
                        {errors.description && (
                            <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                        )}
                    </Form.Group>

                    <div className="form-row">
                        <Form.Group className="mb-4 form-col" controlId="formCategory">
                            <Form.Label className="transaction-form-label">Category</Form.Label>
                            <Form.Select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className={`transaction-form-control ${errors.category ? 'is-invalid' : ''}`}
                            >
                                {categories.map((cat) => (
                                    <option key={cat}>{cat}</option>
                                ))}
                            </Form.Select>
                            {errors.category && (
                                <div className="invalid-feedback d-block">{errors.category}</div>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-4 form-col" controlId="formAccount">
                            <Form.Label className="transaction-form-label">Account</Form.Label>
                            <Form.Select
                                value={account}
                                onChange={(e) => setAccount(e.target.value)}
                                className={`transaction-form-control ${errors.account ? 'is-invalid' : ''}`}
                            >
                                {accounts.map((acc) => (
                                    <option key={acc}>{acc}</option>
                                ))}
                            </Form.Select>
                            {errors.account && (
                                <div className="invalid-feedback d-block">{errors.account}</div>
                            )}
                        </Form.Group>
                    </div>

                    <Form.Group className="mb-4" controlId="formAmount">
                        <Form.Label className="transaction-form-label">Amount</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className={`transaction-form-control ${errors.amount ? 'is-invalid' : ''}`}
                            isInvalid={!!errors.amount}
                            step="0.01"
                        />
                        {errors.amount && (
                            <Form.Control.Feedback type="invalid">{errors.amount}</Form.Control.Feedback>
                        )}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="transaction-modal-footer">
                <Button variant="outline-secondary" onClick={handleClose} className="transaction-cancel-btn">
                    Cancel
                </Button>
                <Button variant="dark" onClick={handleSave} className="transaction-save-btn">
                    {editingTransaction ? 'Update' : 'Add'} Transaction
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TransactionModal;
