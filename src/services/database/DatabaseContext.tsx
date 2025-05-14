import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import DatabaseService, { Transaction, MonthlySummary, DailyTotal, CategoryTotal } from './DatabaseService';
import { View, Text } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { appColors } from '../../consts/colors';

interface DatabaseContextValue    {
  db: DatabaseService | null;
  isLoading: boolean;
  error: Error | null;
  debug: {
    debugDumpTable: (tableName: string) => Promise<void>;
  };
  transactions: {
    add: (name: string, amount: number, category: string, date: Date, type: 'income' | 'expense') => Promise<number>;
    getAll: () => Promise<Transaction[]>;
    getByMonth: (year: number, month: number) => Promise<Transaction[]>;
    update: (id: number, name: string, amount: number, category: string, date: Date, type: 'income' | 'expense') => Promise<boolean>;
    delete: (id: number) => Promise<boolean>;
  };
  summaries: {
    getMonthly: (year: number, month: number) => Promise<MonthlySummary>;
    getDailyTotals: (year: number, month: number) => Promise<DailyTotal[]>;
    getCategoryTotals: (year: number, month: number, type: 'income' | 'expense') => Promise<CategoryTotal[]>;
  };
}

const DatabaseContext = createContext<DatabaseContextValue | null>(null);

interface DatabaseProviderProps {
  children: ReactNode;
}

const DatabaseLoading = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: appColors.viewBackground }}>
      <ActivityIndicator animating={true} size={100} color={appColors.widgetGradien2} />
      <Text style={{ marginTop: 10, fontSize: 16 }}>Loading...</Text>
    </View>
  );
};

const DatabaseError = ({ message }: { message: string }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: 'red', marginBottom: 10 }}>Database Error</Text>
      <Text>{message}</Text>
    </View>
  );
};

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {

  const [dbService] = useState<DatabaseService>(new DatabaseService());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        await dbService.initDatabase();
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown database error'));
        setIsLoading(false);
      }
    };

    initDatabase();

    return () => {
      dbService.closeDatabase();
    };
  }, [dbService]);

  const contextValue: DatabaseContextValue = {
    db: dbService,
    isLoading,
    error,
    debug: {debugDumpTable: async(tableName: string) => await dbService.debugDumpTable(tableName)},
    transactions: {
      add: async (name, amount, category, date, type) => {
        return await dbService.addTransaction(name, amount, category, date, type);
      },
      getAll: async () => {
        return await dbService.getAllTransactions();
      },
      getByMonth: async (year, month) => {
        return await dbService.getTransactionsByMonth(year, month);
      },
      update: async (id, name, amount, category, date, type) => {
        return await dbService.updateTransaction(id, name, amount, category, date, type);
      },
      delete: async (id) => {
        return await dbService.deleteTransaction(id);
      }
    },
    summaries: {
      getMonthly: async (year, month) => {
        return await dbService.getMonthlySummary(year, month);
      },
      getDailyTotals: async (year, month) => {
        return await dbService.getDailyTotalsForMonth(year, month);
      },
      getCategoryTotals: async (year, month, type) => {
        return await dbService.getCategoryTotalsForMonth(year, month, type);
      }
    }
  };

  if (isLoading) {
    return <DatabaseLoading />;
  }

  if (error) {
    return <DatabaseError message={error.message} />;
  }

  return (
    <DatabaseContext.Provider value={contextValue}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = (): DatabaseContextValue => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }

  context.db!.debugSqlResultsEnabled = true;

  return context;
};