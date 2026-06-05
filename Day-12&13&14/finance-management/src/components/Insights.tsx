import { useState, useEffect, useMemo } from 'react';

interface Transaction {
    id: string;
    date: string;
    description: string;
    category: string;
    account: string;
    type: string;
    amount: number;
}

interface Budget {
    id: string;
    category: string;
    limit: number;
}

interface FilterState {
    dateRange: 'today' | 'week' | 'month' | 'lastMonth' | 'custom';
    customStartDate: string;
    customEndDate: string;
    selectedAccount: string;
    selectedCategory: string;
    transactionType: 'all' | 'income' | 'expense';
}

interface CategorySpendingData {
    category: string;
    amount: number;
    percentage: number;
    count: number;
}

interface MonthlyTrendData {
    date: string;
    amount: number;
    label: string;
}

interface BudgetUtilizationData {
    category: string;
    budget: number;
    actual: number;
    percentage: number;
    status: 'under' | 'warning' | 'exceeded';
}

const Insights = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [filters, setFilters] = useState<FilterState>({
        dateRange: 'month',
        customStartDate: '',
        customEndDate: '',
        selectedAccount: 'all',
        selectedCategory: 'all',
        transactionType: 'all',
    });

    // Load data from localStorage
    useEffect(() => {
        const savedTransactions = localStorage.getItem('transactions');
        const savedBudgets = localStorage.getItem('budgets');

        if (savedTransactions) {
            setTransactions(JSON.parse(savedTransactions));
        }
        if (savedBudgets) {
            setBudgets(JSON.parse(savedBudgets));
        }
    }, []);

    // Parse date string in format "DD-Mon-YYYY" or "YYYY-MM-DD"
    const parseDate = (dateStr: string): Date => {
        // Try parsing "DD-Mon-YYYY" format first
        const parts = dateStr.split('-');
        if (parts.length === 3 && isNaN(Number(parts[0]))) {
            // Likely "DD-Mon-YYYY" format from old data
            return new Date(dateStr);
        }
        return new Date(dateStr);
    };

    // Get date range based on filter (memoized to avoid recalculation)
    const getDateRange = useMemo(() => {
        return (): { start: Date; end: Date } => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            let start = new Date(today);
            let end = new Date(today);
            end.setHours(23, 59, 59, 999);

            // eslint-disable-next-line no-case-declarations
            switch (filters.dateRange) {
                case 'today':
                    break;
                case 'week': {
                    start.setDate(today.getDate() - today.getDay());
                    end.setDate(start.getDate() + 6);
                    end.setHours(23, 59, 59, 999);
                    break;
                }
                case 'month': {
                    start.setDate(1);
                    end.setMonth(today.getMonth() + 1, 0);
                    end.setHours(23, 59, 59, 999);
                    break;
                }
                case 'lastMonth': {
                    const lastMonth = new Date(today);
                    lastMonth.setMonth(today.getMonth() - 1);
                    start.setMonth(lastMonth.getMonth(), 1);
                    end.setMonth(lastMonth.getMonth() + 1, 0);
                    end.setHours(23, 59, 59, 999);
                    break;
                }
                case 'custom': {
                    if (filters.customStartDate) start = new Date(filters.customStartDate);
                    if (filters.customEndDate) {
                        end = new Date(filters.customEndDate);
                        end.setHours(23, 59, 59, 999);
                    }
                    break;
                }
                default:
                    break;
            }

            return { start, end };
        };
    }, [filters]);

    // Memoized filtered transactions
    const filteredTransactions = useMemo(() => {
        const range = getDateRange();

        return transactions.filter(tx => {
            const txDate = parseDate(tx.date);
            txDate.setHours(0, 0, 0, 0);

            const dateInRange = txDate >= range.start && txDate <= range.end;
            const accountMatch = filters.selectedAccount === 'all' || tx.account === filters.selectedAccount;
            const categoryMatch = filters.selectedCategory === 'all' || tx.category === filters.selectedCategory;
            const typeMatch =
                filters.transactionType === 'all' ||
                (filters.transactionType === 'income' && tx.type === 'Credit') ||
                (filters.transactionType === 'expense' && tx.type === 'Debit');

            return dateInRange && accountMatch && categoryMatch && typeMatch;
        });
    }, [transactions, filters, getDateRange]);

    // Calculate KPIs
    const kpis = useMemo(() => {
        const income = filteredTransactions
            .filter(tx => tx.type === 'Credit')
            .reduce((sum, tx) => sum + tx.amount, 0);

        const expenses = filteredTransactions
            .filter(tx => tx.type === 'Debit')
            .reduce((sum, tx) => sum + tx.amount, 0);

        const netSavings = income - expenses;

        // Get date range for day calculation
        const range = getDateRange();
        const daysInRange = Math.max(1, Math.ceil((range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
        const averageDailyExpense = expenses / daysInRange;

        return {
            totalIncome: income,
            totalExpenses: expenses,
            netSavings: netSavings,
            averageDailyExpense: averageDailyExpense,
            transactionCount: filteredTransactions.length,
        };
    }, [filteredTransactions, getDateRange]);

    // Calculate category spending (exclude income)
    const categorySpending = useMemo(() => {
        const expenses = filteredTransactions.filter(tx => tx.type === 'Debit');
        const categoryMap: { [key: string]: number } = {};

        expenses.forEach(tx => {
            categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
        });

        const totalExpenses = Object.values(categoryMap).reduce((a, b) => a + b, 0);

        return Object.entries(categoryMap)
            .map(([category, amount]) => ({
                category,
                amount,
                percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
                count: expenses.filter(tx => tx.category === category).length,
            } as CategorySpendingData))
            .sort((a, b) => b.amount - a.amount);
    }, [filteredTransactions]);

    // Calculate monthly spending trend
    const monthlyTrend = useMemo(() => {
        const range = getDateRange();
        const expenses = filteredTransactions.filter(tx => tx.type === 'Debit');

        // Determine aggregation type based on date range
        const daysInRange = Math.ceil((range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        let aggregationType: 'day' | 'week' | 'month' = 'day';
        if (daysInRange > 60) aggregationType = 'month';
        else if (daysInRange > 14) aggregationType = 'week';

        const trendMap: { [key: string]: number } = {};
        const dateLabels: { [key: string]: string } = {};

        expenses.forEach(tx => {
            const txDate = parseDate(tx.date);

            let key: string;
            let label: string;

            if (aggregationType === 'day') {
                key = txDate.toISOString().split('T')[0];
                label = txDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            } else if (aggregationType === 'week') {
                const weekStart = new Date(txDate);
                weekStart.setDate(txDate.getDate() - txDate.getDay());
                key = weekStart.toISOString().split('T')[0];
                label = `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
            } else {
                key = txDate.toISOString().split('T')[0].substring(0, 7);
                label = txDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            }

            trendMap[key] = (trendMap[key] || 0) + tx.amount;
            dateLabels[key] = label;
        });

        return Object.entries(trendMap)
            .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
            .map(([date, amount]) => ({
                date,
                amount,
                label: dateLabels[date],
            } as MonthlyTrendData));
    }, [filteredTransactions, getDateRange]);

    // Get top spending categories
    const topSpendingCategories = useMemo(() => {
        return categorySpending.slice(0, 5);
    }, [categorySpending]);

    // Calculate budget utilization
    const budgetUtilization = useMemo(() => {
        const range = getDateRange();

        return budgets.map(budget => {
            const categoryExpenses = filteredTransactions
                .filter(
                    tx =>
                        tx.type === 'Debit' &&
                        tx.category === budget.category &&
                        parseDate(tx.date) >= range.start &&
                        parseDate(tx.date) <= range.end
                )
                .reduce((sum, tx) => sum + tx.amount, 0);

            const percentage = (categoryExpenses / budget.limit) * 100;
            let status: 'under' | 'warning' | 'exceeded' = 'under';
            if (percentage > 100) status = 'exceeded';
            else if (percentage > 80) status = 'warning';

            return {
                category: budget.category,
                budget: budget.limit,
                actual: categoryExpenses,
                percentage: Math.round(percentage),
                status,
            } as BudgetUtilizationData;
        });
    }, [budgets, filteredTransactions, getDateRange]);

    // Get all unique categories for filter
    const allCategories = useMemo(() => {
        const categories = [...new Set(transactions.map(tx => tx.category))].sort();
        return categories;
    }, [transactions]);

    // Get all unique accounts for filter
    const allAccountNames = useMemo(() => {
        const names = [...new Set(transactions.map(tx => tx.account))].sort();
        return names;
    }, [transactions]);

    const handleFilterChange = (key: keyof FilterState, value: string | number | boolean) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(value);
    };

    return (
        <div className="insights-page">
            <div className="insights-header">
                <div className="insights-title-section">
                    <h1 className="insights-title">Insights & Analytics</h1>
                </div>
            </div>

            {/* Filters Section */}
            <div className="filters-section">
                <div className="filter-group">
                    <label className="filter-label">Date Range</label>
                    <select
                        className="filter-select"
                        value={filters.dateRange}
                        onChange={e => handleFilterChange('dateRange', e.target.value)}
                    >
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="lastMonth">Last Month</option>
                        <option value="custom">Custom Range</option>
                    </select>
                </div>

                {filters.dateRange === 'custom' && (
                    <>
                        <div className="filter-group">
                            <label className="filter-label">From</label>
                            <input
                                type="date"
                                className="filter-input"
                                value={filters.customStartDate}
                                onChange={e => handleFilterChange('customStartDate', e.target.value)}
                            />
                        </div>
                        <div className="filter-group">
                            <label className="filter-label">To</label>
                            <input
                                type="date"
                                className="filter-input"
                                value={filters.customEndDate}
                                onChange={e => handleFilterChange('customEndDate', e.target.value)}
                            />
                        </div>
                    </>
                )}

                <div className="filter-group">
                    <label className="filter-label">Account</label>
                    <select
                        className="filter-select"
                        value={filters.selectedAccount}
                        onChange={e => handleFilterChange('selectedAccount', e.target.value)}
                    >
                        <option value="all">All Accounts</option>
                        {allAccountNames.map(account => (
                            <option key={account} value={account}>
                                {account}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Category</label>
                    <select
                        className="filter-select"
                        value={filters.selectedCategory}
                        onChange={e => handleFilterChange('selectedCategory', e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        {allCategories
                            .filter(cat => cat !== 'Income')
                            .map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Type</label>
                    <select
                        className="filter-select"
                        value={filters.transactionType}
                        onChange={e => handleFilterChange('transactionType', e.target.value)}
                    >
                        <option value="all">Both</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="kpi-cards-section">
                <div className="kpi-card">
                    <div className="kpi-label">Total Income</div>
                    <div className="kpi-value">{formatCurrency(kpis.totalIncome)}</div>
                    <div className="kpi-meta">{kpis.transactionCount} transactions</div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-label">Total Expenses</div>
                    <div className="kpi-value">{formatCurrency(kpis.totalExpenses)}</div>
                    <div className="kpi-meta">
                        {((kpis.totalExpenses / (kpis.totalIncome || 1)) * 100).toFixed(0)}% of income
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-label">Net Savings</div>
                    <div className={`kpi-value ${kpis.netSavings < 0 ? 'negative' : 'positive'}`}>
                        {formatCurrency(kpis.netSavings)}
                    </div>
                    <div className="kpi-meta">
                        {kpis.netSavings >= 0 ? '+' : ''}{((kpis.netSavings / (kpis.totalIncome || 1)) * 100).toFixed(1)}%
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-label">Avg Daily Expense</div>
                    <div className="kpi-value">{formatCurrency(kpis.averageDailyExpense)}</div>
                    <div className="kpi-meta">per day</div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-section">
                {/* Spending by Category - Donut Chart */}
                {categorySpending.length > 0 ? (
                    <div className="chart-card">
                        <div className="chart-title">Spending by Category</div>
                        <div className="chart-content">
                            <div className="chart-visualization">
                                <svg viewBox="0 0 200 200" className="donut-chart">
                                    {categorySpending.map((_item, index) => {
                                        const colors = [
                                            '#000000',
                                            '#333333',
                                            '#666666',
                                            '#999999',
                                            '#cccccc',
                                        ];
                                        const startAngle = (index * 360) / categorySpending.length;
                                        const endAngle = ((index + 1) * 360) / categorySpending.length;
                                        const startRad = (startAngle * Math.PI) / 180;
                                        const endRad = (endAngle * Math.PI) / 180;

                                        const x1 = 100 + 80 * Math.cos(startRad);
                                        const y1 = 100 + 80 * Math.sin(startRad);
                                        const x2 = 100 + 80 * Math.cos(endRad);
                                        const y2 = 100 + 80 * Math.sin(endRad);

                                        const largeArc = endAngle - startAngle > 180 ? 1 : 0;

                                        const path = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;

                                        return (
                                            <path
                                                key={index}
                                                d={path}
                                                fill={colors[index % colors.length]}
                                                stroke="white"
                                                strokeWidth="2"
                                            />
                                        );
                                    })}
                                </svg>
                            </div>
                            <div className="chart-legend">
                                {categorySpending.map((item, idx) => (
                                    <div key={item.category} className="legend-item">
                                        <div
                                            className="legend-color"
                                            style={{
                                                backgroundColor: ['#000000', '#333333', '#666666', '#999999', '#cccccc'][
                                                    idx % 5
                                                ],
                                            }}
                                        ></div>
                                        <div className="legend-label">
                                            <div className="legend-category">{item.category}</div>
                                            <div className="legend-value">
                                                {formatCurrency(item.amount)} ({item.percentage.toFixed(1)}%)
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="chart-card">
                        <div className="chart-title">Spending by Category</div>
                        <div className="empty-state">No expense data available</div>
                    </div>
                )}

                {/* Monthly Spending Trend - Bar Chart */}
                {monthlyTrend.length > 0 ? (
                    <div className="chart-card">
                        <div className="chart-title">Spending Trend</div>
                        <div className="chart-content">
                            <div className="bar-chart">
                                <div className="chart-bars">
                                    {monthlyTrend.map((item, index) => {
                                        const maxAmount = Math.max(...monthlyTrend.map(m => m.amount), 1);
                                        const height = (item.amount / maxAmount) * 100;

                                        return (
                                            <div key={index} className="bar-item">
                                                <div className="bar-container">
                                                    <div
                                                        className="bar"
                                                        style={{ height: `${height}%` }}
                                                        title={`${item.label}: ${formatCurrency(item.amount)}`}
                                                    ></div>
                                                </div>
                                                <div className="bar-label">{item.label.split(' ')[0]}</div>
                                                <div className="bar-value">{formatCurrency(item.amount)}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="chart-card">
                        <div className="chart-title">Spending Trend</div>
                        <div className="empty-state">No trend data available</div>
                    </div>
                )}
            </div>

            {/* Top Spending Categories */}
            {topSpendingCategories.length > 0 && (
                <div className="section">
                    <div className="section-title">Top Spending Categories</div>
                    <div className="top-categories-list">
                        {topSpendingCategories.map((item, index) => (
                            <div key={index} className="category-row">
                                <div className="category-rank">{index + 1}</div>
                                <div className="category-info">
                                    <div className="category-name">{item.category}</div>
                                    <div className="category-count">{item.count} transactions</div>
                                </div>
                                <div className="category-stats">
                                    <div className="category-amount">{formatCurrency(item.amount)}</div>
                                    <div className="category-percentage">{item.percentage.toFixed(1)}%</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Budget Utilization */}
            {budgetUtilization.length > 0 && (
                <div className="section">
                    <div className="section-title">Budget Utilization</div>
                    <div className="budget-list">
                        {budgetUtilization.map((item, index) => (
                            <div key={index} className="budget-item">
                                <div className="budget-header">
                                    <div className="budget-name">{item.category}</div>
                                    <div className={`budget-status ${item.status}`}>
                                        {item.status === 'under' && '✓ Under Budget'}
                                        {item.status === 'warning' && '⚠ Near Limit'}
                                        {item.status === 'exceeded' && '✕ Exceeded'}
                                    </div>
                                </div>
                                <div className="budget-progress">
                                    <div className="progress-bar-background">
                                        <div
                                            className={`progress-bar ${item.status}`}
                                            style={{ width: `${Math.min(item.percentage, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="budget-footer">
                                    <div className="budget-actual">
                                        {formatCurrency(item.actual)} / {formatCurrency(item.budget)}
                                    </div>
                                    <div className="budget-percentage">{item.percentage}%</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {filteredTransactions.length === 0 && (
                <div className="empty-state-full">
                    <div className="empty-state-icon">📊</div>
                    <div className="empty-state-title">No Data Available</div>
                    <div className="empty-state-message">
                        Add transactions to see your insights and analytics
                    </div>
                </div>
            )}
        </div>
    );
};

export default Insights;
