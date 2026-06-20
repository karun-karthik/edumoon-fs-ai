import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface Account {
    _id: string;
    name: string;
    type: string;
    balance: number;
}

interface AccountModalProps {
    show: boolean;
    onHide: () => void;
    onSave: (account: Account) => void;
    editingAccount?: Account | null;
}

const AccountModal = ({ show, onHide, onSave, editingAccount }: AccountModalProps) => {
    const [accountName, setAccountName] = useState('');
    const [accountType, setAccountType] = useState('Checking Account');
    const [currentBalance, setCurrentBalance] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (editingAccount) {
            setAccountName(editingAccount.name);
            setAccountType(editingAccount.type);
            setCurrentBalance(editingAccount.balance.toString());
        } else {
            setAccountName('');
            setAccountType('Checking Account');
            setCurrentBalance('');
        }
        setErrors({});
    }, [editingAccount, show]);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!accountName.trim()) {
            newErrors.name = 'Account name is required';
        }

        if (!accountType) {
            newErrors.type = 'Account type is required';
        }

        if (!currentBalance || isNaN(parseFloat(currentBalance))) {
            newErrors.balance = 'Valid balance is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateForm()) {
            const newAccount: Account = {
                _id: editingAccount?._id || '',
                name: accountName,
                type: accountType,
                balance: parseFloat(currentBalance),
            };
            onSave(newAccount);
            handleClose();
        }
    };

    const handleClose = () => {
        setAccountName('');
        setAccountType('Checking Account');
        setCurrentBalance('');
        setErrors({});
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg" className="account-modal">
            <Modal.Header closeButton className="account-modal-header">
                <Modal.Title className="account-modal-title">
                    {editingAccount ? 'Edit Account' : 'Add Account'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="account-modal-body">
                <Form>
                    <Form.Group className="mb-4" controlId="formAccountName">
                        <Form.Label className="account-form-label">Account Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter account name"
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                            className={`account-form-control ${errors.name ? 'is-invalid' : ''}`}
                            isInvalid={!!errors.name}
                        />
                        {errors.name && (
                            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="formAccountType">
                        <Form.Label className="account-form-label">Type</Form.Label>
                        <Form.Select
                            value={accountType}
                            onChange={(e) => setAccountType(e.target.value)}
                            className={`account-form-control ${errors.type ? 'is-invalid' : ''}`}
                        >
                            <option>Checking Account</option>
                            <option>Savings Account</option>
                            <option>Credit Card</option>
                            <option>Investment Account</option>
                            <option>Loan Account</option>
                        </Form.Select>
                        {errors.type && (
                            <div className="invalid-feedback d-block">{errors.type}</div>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="formCurrentBalance">
                        <Form.Label className="account-form-label">Current Balance</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter balance"
                            value={currentBalance}
                            onChange={(e) => setCurrentBalance(e.target.value)}
                            className={`account-form-control ${errors.balance ? 'is-invalid' : ''}`}
                            isInvalid={!!errors.balance}
                            step="0.01"
                        />
                        {errors.balance && (
                            <Form.Control.Feedback type="invalid">{errors.balance}</Form.Control.Feedback>
                        )}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="account-modal-footer">
                <Button variant="outline-secondary" onClick={handleClose} className="account-cancel-btn">
                    Cancel
                </Button>
                <Button variant="dark" onClick={handleSave} className="account-save-btn">
                    {editingAccount ? 'Update' : 'Add'} Account
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AccountModal;
