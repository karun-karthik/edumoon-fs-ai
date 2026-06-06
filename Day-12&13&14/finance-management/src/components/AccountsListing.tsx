import { useState, useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';
import AccountModal from './AccountModal';

interface Account {
    id: string;
    name: string;
    type: string;
    balance: number;
}

interface DropdownPosition {
    top: number;
    left: number;
}

const AccountsListing = () => {
    const [accounts, setAccounts] = useState<Account[]>([]); // to manage the user accounts
    const [showModal, setShowModal] = useState(false); // to handle show and close modal (popup)
    const [editingAccount, setEditingAccount] = useState<Account | null>(null); // to set the account details that should be edited.
    const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
    const [dropdownPos, setDropdownPos] = useState<DropdownPosition>({ top: 0, left: 0 });
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Load accounts from localStorage on mount
    useEffect(() => {
        const savedAccounts = localStorage.getItem('accounts');
        if (savedAccounts) {
            setAccounts(JSON.parse(savedAccounts));
        }
    }, []);

    // Save accounts to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('accounts', JSON.stringify(accounts));
    }, [accounts]);

    const handleShowModal = () => {
        setEditingAccount(null);
        setShowModal(true);
    };

    const handleEditAccount = (account: Account) => {
        setEditingAccount(account);
        setShowModal(true);
        setShowActionsMenu(null);
    };

    const handleDeleteAccount = (id: string) => {
        if (window.confirm('Are you sure you want to delete this account?')) {
            setAccounts(accounts.filter(account => account.id !== id));
            setShowActionsMenu(null);
        }
    };

    const handleSaveAccount = (account: Account) => {
        if (editingAccount) {
            // Update existing account
            setAccounts(accounts.map(acc => acc.id === account.id ? account : acc));
        } else {
            // Add new account
            setAccounts([...accounts, account]);
        }
        setShowModal(false);
    };

    const toggleActionsMenu = (accountId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        
        if (showActionsMenu === accountId) {
            setShowActionsMenu(null);
        } else {
            // Calculate position of the dropdown
            const button = (e.target as HTMLElement).closest('.actions-btn') as HTMLElement;
            if (button) {
                const rect = button.getBoundingClientRect();
                const dropdownHeight = 80; // Approximate height of dropdown (2 items)
                const viewportHeight = window.innerHeight;
                
                // Check if there's enough space below, otherwise position above
                let top = rect.bottom + window.scrollY;
                if (rect.bottom + dropdownHeight > viewportHeight - 20) {
                    top = rect.top + window.scrollY - dropdownHeight;
                }
                
                const left = rect.left + window.scrollX - 100; // Align dropdown to the right
                
                setDropdownPos({ top, left });
            }
            
            setShowActionsMenu(accountId);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowActionsMenu(null);
            }
        };

        if (showActionsMenu) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [showActionsMenu]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <div className="accounts-container">
            <div className="accounts-header">
                <h1 className="accounts-title">Accounts</h1>
                <Button 
                    className="add-account-btn" 
                    onClick={handleShowModal}
                >
                    + Add Account
                </Button>
            </div>

            {accounts.length > 0 ? (
                <div className="accounts-table-wrapper">
                    <table className="accounts-table">
                        <thead>
                            <tr className="table-header-row">
                                <th className="table-header-cell">Account Name</th>
                                <th className="table-header-cell">Type</th>
                                <th className="table-header-cell">Current Balance</th>
                                <th className="table-header-cell">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.map((account) => (
                                <tr key={account.id} className="table-body-row">
                                    <td className="table-body-cell">{account.name}</td>
                                    <td className="table-body-cell">{account.type}</td>
                                    <td className="table-body-cell balance-cell">{formatCurrency(account.balance)}</td>
                                    <td className="table-body-cell actions-cell">
                                        <div className="actions-menu-container" ref={dropdownRef}>
                                            <button
                                                className="actions-btn"
                                                onClick={(e) => toggleActionsMenu(account.id, e)}
                                            >
                                                ⋮
                                            </button>
                                            {showActionsMenu === account.id && (
                                                <div
                                                    className="actions-dropdown"
                                                    style={{
                                                        top: `${dropdownPos.top}px`,
                                                        left: `${dropdownPos.left}px`,
                                                    }}
                                                >
                                                    <button
                                                        className="action-item edit-action"
                                                        onClick={() => handleEditAccount(account)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="action-item delete-action"
                                                        onClick={() => handleDeleteAccount(account.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="accounts-empty-state">
                    <p>No accounts found. Click "Add Account" to get started.</p>
                </div>
            )}

            <AccountModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onSave={handleSaveAccount}
                editingAccount={editingAccount}
            />
        </div>
    );
};

export default AccountsListing;
