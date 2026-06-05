import { type ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
    title?: string;
}

const AuthLayout = ({ children, title }: AuthLayoutProps) => {
    return (
        <div className="auth-page">
            <div className="auth-info-section">
                <div className="info-content">
                    <div className="app-logo">
                        <div className="logo-icon">📊</div>
                        <h1>Budget Tracker</h1>
                    </div>
                    <div className="app-description">
                        <h2>Track your finances</h2>
                        <p>Manage your budget, monitor expenses, and achieve your financial goals with ease.</p>
                        <ul className="features-list">
                            <li>📈 Real-time budget tracking</li>
                            <li>💰 Expense categorization</li>
                            <li>📊 Visual analytics</li>
                            <li>🎯 Financial insights</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="auth-form-section">
                <div className="form-wrapper">
                    {title && <h2 className="form-title">{title}</h2>}
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
