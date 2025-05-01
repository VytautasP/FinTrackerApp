import { formatDate } from 'date-fns';
import SQLite from 'react-native-sqlite-storage';

// Enable debugging in development
SQLite.DEBUG(true);
SQLite.enablePromise(true);

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: number;
  name: string;
  amount: number;
  category: string;
  date: Date;
  type: TransactionType;
}

export interface MonthlySummary {
  income: number;
  expense: number;
  balance: number;
}

export interface DailyTotal {
  date: string;
  income: number;
  expense: number;
}

export interface CategoryTotal {
  category: string;
  total: number;
}

const dateFormat = "yyyy-MM-dd";
export default class DatabaseService {
  /**
   * Database property declaration
   * @type {SQLite.SQLiteDatabase | null}
   */
  database: SQLite.SQLiteDatabase | null = null;

  /**
   * Initialize the database
   * @returns {Promise<SQLite.SQLiteDatabase>} The initialized database
   */
  async initDatabase(): Promise<SQLite.SQLiteDatabase> {
    try {
      // Open or create database
      this.database = await SQLite.openDatabase({
        name: 'FinanceTracker.db',
        location: 'default',
      });
      
      console.log('Database initialized');
      await this.createTables();
      return this.database;
    } catch (error: any) {
      console.error('Error initializing database:', error);
      throw new Error('Failed to initialize database');
    }
  }

  /**
   * Create necessary tables if they don't exist
   * @returns {Promise<void>}
   */
  async createTables(): Promise<void> {
    if (!this.database) {
      throw new Error('Database not initialized');
    }
    
    try {
      await this.database.executeSql(`
        CREATE TABLE IF NOT EXISTS transactions(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          amount REAL NOT NULL,
          category TEXT NOT NULL,
          date TEXT NOT NULL,
          type TEXT NOT NULL
        );
      `);
      console.log('Tables created successfully');
    } catch (error: any) {
      console.error('Error creating tables:', error);
      throw new Error('Failed to create tables');
    }
  }

  /**
   * Close the database connection
   * @returns {Promise<void>}
   */
  async closeDatabase(): Promise<void> {
    if (this.database) {
      await this.database.close();
      this.database = null;
      console.log('Database closed');
    }
  }

  /**
   * Add a new transaction
   * @param {string} name - Transaction name/description
   * @param {number} amount - Transaction amount (positive number)
   * @param {string} category - Transaction category
   * @param {Date} date - Transaction date in YYYY-MM-DD format
   * @param {TransactionType} type - Transaction type ('income' or 'expense')
   * @returns {Promise<number>} The ID of the new transaction
   */
  async addTransaction(
    name: string, 
    amount: number, 
    category: string, 
    date: Date, 
    type: TransactionType
  ): Promise<number> {
    if (!this.database) {
      throw new Error('Database not initialized');
    }
    
    try {
      const [result] = await this.database.executeSql(
        `INSERT INTO transactions (name, amount, category, date, type) 
         VALUES (?, ?, ?, ?, ?)`,
        [name, amount, category, formatDate(date, dateFormat), type]
      );
      
      const insertId: number = result.insertId || -1;
      console.log('Transaction added with ID:', insertId);
      return insertId;
    } catch (error: any) 
    {
      console.error('Error adding transaction:', error);
      throw new Error('Failed to add transaction');
    }
  }

  /**
   * Get all transactions
   * @returns {Promise<Transaction[]>} Array of transactions
   */
  async getAllTransactions(): Promise<Transaction[]> {
    if (!this.database) {
      throw new Error('Database not initialized');
    }
    
    try {
      const [results] = await this.database.executeSql(
        'SELECT * FROM transactions ORDER BY date DESC'
      );
      
      const transactions: Transaction[] = [];
      for (let i = 0; i < results.rows.length; i++) {
        transactions.push(results.rows.item(i) as Transaction);
      }
      
      return transactions;
    } catch (error: any) {
      console.error('Error getting transactions:', error);
      throw new Error('Failed to get transactions');
    }
  }

  /**
   * Get transactions for a specific month
   * @param {number} year - Year (YYYY)
   * @param {number} month - Month (1-12)
   * @returns {Promise<Transaction[]>} Array of transactions
   */
  async getTransactionsByMonth(year: number, month: number): Promise<Transaction[]> {
    if (!this.database) {
      throw new Error('Database not initialized');
    }
    
    try {
  
      const monthFormatted: string = month.toString().padStart(2, '0');
      const startDate: string = `${year}-${monthFormatted}-01`;
      
      let nextMonth: string;
      let nextYear: number;
      if (month === 12) {
        nextMonth = '01';
        nextYear = year + 1;
      } else {
        nextMonth = (month + 1).toString().padStart(2, '0');
        nextYear = year;
      }
      const endDate: string = `${nextYear}-${nextMonth}-01`;
      
      const [results] = await this.database.executeSql(
        'SELECT * FROM transactions WHERE date >= ? AND date < ? ORDER BY date ASC',
        [startDate, endDate]
      );
      
      const transactions: Transaction[] = [];
      for (let i = 0; i < results.rows.length; i++) {
        transactions.push(results.rows.item(i) as Transaction);
      }
      
      return transactions;
    } catch (error: any) {
      console.error('Error getting transactions by month:', error);
      throw new Error('Failed to get transactions by month');
    }
  }

  /**
   * Get daily totals for a specific month (for charts)
   * @param {number} year - Year (YYYY)
   * @param {number} month - Month (1-12)
   * @returns {Promise<DailyTotal[]>} Daily totals for income and expense
   */
  async getDailyTotalsForMonth(year: number, month: number): Promise<DailyTotal[]> {
    if (!this.database) {
      throw new Error('Database not initialized');
    }
    
    try {
      const monthFormatted: string = month.toString().padStart(2, '0');
      const startDate: string = `${year}-${monthFormatted}-01`;
      
      // Calculate end date
      let nextMonth: string;
      let nextYear: number;
      if (month === 12) {
        nextMonth = '01';
        nextYear = year + 1;
      } else {
        nextMonth = (month + 1).toString().padStart(2, '0');
        nextYear = year;
      }
      const endDate: string = `${nextYear}-${nextMonth}-01`;
      
      // First query to get income totals by day
      const [incomeResults] = await this.database.executeSql(
        `SELECT date, SUM(amount) as total 
         FROM transactions 
         WHERE date >= ? AND date < ? AND type = 'income' 
         GROUP BY date 
         ORDER BY date ASC`,
        [startDate, endDate]
      );
      
      // Second query to get expense totals by day
      const [expenseResults] = await this.database.executeSql(
        `SELECT date, SUM(amount) as total 
         FROM transactions 
         WHERE date >= ? AND date < ? AND type = 'expense' 
         GROUP BY date 
         ORDER BY date ASC`,
        [startDate, endDate]
      );
      
      // Create a map of date -> { income, expense }
      const dailyTotals: Record<string, { income: number, expense: number }> = {};
      
      // Initialize with all days in the month having zero values
      const daysInMonth: number = new Date(year, month, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr: string = `${year}-${monthFormatted}-${day.toString().padStart(2, '0')}`;
        dailyTotals[dateStr] = { income: 0, expense: 0 };
      }
      
      // Fill in income data
      for (let i = 0; i < incomeResults.rows.length; i++) {
        const row = incomeResults.rows.item(i);
        dailyTotals[row.date].income = parseFloat(row.total);
      }
      
      // Fill in expense data
      for (let i = 0; i < expenseResults.rows.length; i++) {
        const row = expenseResults.rows.item(i);
        dailyTotals[row.date].expense = parseFloat(row.total);
      }
      
      // Convert to array for easier use with charts
      const chartData: DailyTotal[] = Object.keys(dailyTotals).map(date => ({
        date,
        income: dailyTotals[date].income,
        expense: dailyTotals[date].expense
      }));
      
      return chartData;
    } catch (error: any) {
      console.error('Error getting daily totals:', error);
      throw new Error('Failed to get daily totals');
    }
  }

  /**
   * Get monthly summary (total income, total expense)
   * @param {number} year - Year (YYYY)
   * @param {number} month - Month (1-12)
   * @returns {Promise<MonthlySummary>} Monthly summary with income, expense, and balance
   */
  async getMonthlySummary(year: number, month: number): Promise<MonthlySummary> {
    if (!this.database) {
      throw new Error('Database not initialized');
    }
    
    try {
      const monthFormatted: string = month.toString().padStart(2, '0');
      const startDate: string = `${year}-${monthFormatted}-01`;
      
      // Calculate end date
      let nextMonth: string;
      let nextYear: number;
      if (month === 12) {
        nextMonth = '01';
        nextYear = year + 1;
      } else {
        nextMonth = (month + 1).toString().padStart(2, '0');
        nextYear = year;
      }
      const endDate: string = `${nextYear}-${nextMonth}-01`;
      
      // Get total income
      const [incomeResult] = await this.database.executeSql(
        `SELECT SUM(amount) as total 
         FROM transactions 
         WHERE date >= ? AND date < ? AND type = 'income'`,
        [startDate, endDate]
      );
      
      // Get total expense
      const [expenseResult] = await this.database.executeSql(
        `SELECT SUM(amount) as total 
         FROM transactions 
         WHERE date >= ? AND date < ? AND type = 'expense'`,
        [startDate, endDate]
      );
      
      const totalIncome: number = parseFloat(incomeResult.rows.item(0).total || 0);
      const totalExpense: number = parseFloat(expenseResult.rows.item(0).total || 0);
      
      return {
        income: totalIncome,
        expense: totalExpense,
        balance: totalIncome - totalExpense
      };
    } catch (error: any) {
      console.error('Error getting monthly summary:', error);
      throw new Error('Failed to get monthly summary');
    }
  }

  /**
   * Update an existing transaction
   * @param {number} id - Transaction ID
   * @param {string} name - Transaction name/description
   * @param {number} amount - Transaction amount
   * @param {string} category - Transaction category
   * @param {Date} date - Transaction date in YYYY-MM-DD format
   * @param {TransactionType} type - Transaction type ('income' or 'expense')
   * @returns {Promise<boolean>} True if transaction was updated
   */
  async updateTransaction(
    id: number, 
    name: string, 
    amount: number, 
    category: string, 
    date: Date, 
    type: TransactionType
  ): Promise<boolean> {
    if (!this.database) {
      throw new Error('Database not initialized');
    }
    
    try {
      await this.database.executeSql(
        `UPDATE transactions 
         SET name = ?, amount = ?, category = ?, date = ?, type = ? 
         WHERE id = ?`,
        [name, amount, category, formatDate(date, dateFormat), type, id]
      );
      
      console.log('Transaction updated:', id);
      return true;
    } catch (error: any) {
      console.error('Error updating transaction:', error);
      throw new Error('Failed to update transaction');
    }
  }

  /**
   * Delete a transaction
   * @param {number} id - Transaction ID
   * @returns {Promise<boolean>} True if transaction was deleted
   */
  async deleteTransaction(id: number): Promise<boolean> {
    if (!this.database) {
      throw new Error('Database not initialized');
    }
    
    try {
      await this.database.executeSql(
        'DELETE FROM transactions WHERE id = ?',
        [id]
      );
      
      console.log('Transaction deleted:', id);
      return true;
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      throw new Error('Failed to delete transaction');
    }
  }

  /**
   * Get transactions grouped by category for a specific month
   * @param {number} year - Year (YYYY)
   * @param {number} month - Month (1-12)
   * @param {TransactionType} type - Transaction type ('income' or 'expense')
   * @returns {Promise<CategoryTotal[]>} Category totals
   */
  async getCategoryTotalsForMonth(
    year: number, 
    month: number, 
    type: TransactionType
  ): Promise<CategoryTotal[]> {
    if (!this.database) {
      throw new Error('Database not initialized');
    }
    
    try {
      const monthFormatted: string = month.toString().padStart(2, '0');
      const startDate: string = `${year}-${monthFormatted}-01`;
      
      // Calculate end date
      let nextMonth: string;
      let nextYear: number;
      if (month === 12) {
        nextMonth = '01';
        nextYear = year + 1;
      } else {
        nextMonth = (month + 1).toString().padStart(2, '0');
        nextYear = year;
      }
      const endDate: string = `${nextYear}-${nextMonth}-01`;
      
      const [results] = await this.database.executeSql(
        `SELECT category, SUM(amount) as total 
         FROM transactions 
         WHERE date >= ? AND date < ? AND type = ? 
         GROUP BY category 
         ORDER BY total DESC`,
        [startDate, endDate, type]
      );
      
      const categoryTotals: CategoryTotal[] = [];
      for (let i = 0; i < results.rows.length; i++) {
        const row = results.rows.item(i);
        categoryTotals.push({
          category: row.category,
          total: parseFloat(row.total)
        });
      }
      
      return categoryTotals;
    } catch (error: any) {
      console.error('Error getting category totals:', error);
      throw new Error('Failed to get category totals');
    }
  }
}