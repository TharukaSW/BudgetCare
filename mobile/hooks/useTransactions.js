import { useCallback, useState } from "react";
import { Alert } from "react-native";

const API_URL = "http://10.0.2.2:5001/api/transactions";


export const useTransactions = (userId) => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({
        balance: 0,
        income: 0,
        expenses: 0,
    });

    const [isLoading, setLoading] = useState(false);


    const fetchTransactions = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/${userId}`);
            const data = await response.json();
            setTransactions(data);
            
        } catch (error) {
            console.error("Error fetching transactions:", error);
            
        }
    },[userId]);


    const fetchSummary = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/summary/${userId}`);
            const data = await response.json();
            setSummary(data);
        } catch (error) {
            console.error("Error fetching summary:", error);
        }
    }, [userId]);


    const loadData = useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        try {
            await Promise.all([
                fetchTransactions(),
                fetchSummary(),
            ])
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }   
    },[fetchTransactions, fetchSummary, userId]);

    
    const deleteTransaction = useCallback(async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete transaction");
            }
            await loadData();
            Alert.alert("Transaction deleted successfully");
        } catch (error) {
            console.error("Error deleting transaction:", error);
            Alert.alert("Error deleting transaction", error.message);
        }finally {
            setLoading(false);
        }
    }, [loadData]);

    return {
        transactions,
        summary,
        isLoading,
        loadData,
        deleteTransaction,
    };
}