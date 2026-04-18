import { useState, useEffect } from 'react';
import customerApi from '../api/customerApi';
import { Customer } from '../interfaces/Customer';

export const useCustomer = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);

    // Obtiene clientes activos o eliminados según el estado del Switch
    const fetchCustomers = async (showDeleted: boolean = false) => {
        setLoading(true);
        try {
            const endpoint = showDeleted ? '/deleted' : '';
            const { data } = await customerApi.get<Customer[]>(endpoint);
            setCustomers(data);
        } catch (error) {
            console.error("Error en fetchCustomers:", error);
        } finally {
            setLoading(false);
        }
    };

    const saveCustomer = async (customer: Customer) => {
        try {
            const payload = { ...customer };
            // Si el cliente es nuevo, eliminamos el ID para que MongoDB lo genere
            if (!payload.id) delete payload.id;

            payload.id
                ? await customerApi.put(`/${payload.id}`, payload)
                : await customerApi.post('', payload);

            await fetchCustomers(false);
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };

    const deleteCustomer = async (id: string) => {
        try {
            // Llama al borrado lógico del backend
            await customerApi.patch(`/logical/${id}`);
            await fetchCustomers(false);
        } catch (error) {
            console.error("Error en eliminación lógica:", error);
        }
    };

    const restoreCustomer = async (id: string) => {
        try {
            // Llama a la restauración del backend
            await customerApi.patch(`/restore/${id}`);
            await fetchCustomers(true);
        } catch (error) {
            console.error("Error al restaurar:", error);
        }
    };

    useEffect(() => {
        fetchCustomers(false);
    }, []);

    return {
        customers,
        loading,
        saveCustomer,
        deleteCustomer,
        restoreCustomer,
        fetchCustomers
    };
};