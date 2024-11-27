import React, { useState } from 'react';
import { Search, UserPlus, Edit2, X, Trash2 } from 'lucide-react';
import { useAppointmentStore } from '../../store/appointmentStore';
import { Client } from '../../types';

interface ClientFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  notes: string;
}

const ClientManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const clients = useAppointmentStore((state) => state.clients);
  const stats = useAppointmentStore((state) => state.getClientStats());
  const addClient = useAppointmentStore((state) => state.addClient);
  const updateClient = useAppointmentStore((state) => state.updateClient);
  const deleteClient = useAppointmentStore((state) => state.deleteClient);
  const appointments = useAppointmentStore((state) => state.appointments);

  const [formData, setFormData] = useState<ClientFormData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    notes: '',
  });

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phoneNumber.includes(searchTerm)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clientData = {
      id: editingClient?.id || Date.now().toString(),
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      phoneNumber: formData.phoneNumber,
      notes: formData.notes,
      lastVisit: editingClient?.lastVisit || new Date(),
      totalVisits: editingClient?.totalVisits || 0,
      preferredServices: editingClient?.preferredServices || [],
      loyaltyPoints: editingClient?.loyaltyPoints || 0,
    };

    if (editingClient) {
      updateClient(editingClient.id, clientData);
    } else {
      addClient(clientData as Client);
    }

    setShowForm(false);
    setEditingClient(null);
    setFormData({ firstName: '', lastName: '', phoneNumber: '', notes: '' });
  };

  const handleEdit = (client: Client) => {
    const [firstName, lastName] = client.name.split(' ');
    setFormData({
      firstName,
      lastName: lastName || '',
      phoneNumber: client.phoneNumber,
      notes: client.notes || '',
    });
    setEditingClient(client);
    setShowForm(true);
  };

  const getClientStats = (clientId: string) => {
    const clientAppointments = appointments.filter(apt => apt.clientId === clientId);
    const totalSpent = clientAppointments.reduce((sum, apt) => sum + apt.service.price, 0);
    
    const serviceCounts = clientAppointments.reduce((acc, apt) => {
      acc[apt.service.name] = (acc[apt.service.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const preferredService = Object.entries(serviceCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

    return { totalSpent, preferredService };
  };

  const ClientForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={() => {
            setShowForm(false);
            setEditingClient(null);
            setFormData({ firstName: '', lastName: '', phoneNumber: '', notes: '' });
          }}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold mb-6">
          {editingClient ? 'Edit Client' : 'New Client'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#8f00ff]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#8f00ff]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#8f00ff]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#8f00ff] min-h-[100px] resize-y"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#8f00ff] text-white py-2 px-4 rounded-lg hover:bg-[#7a00d9] transition-colors"
          >
            {editingClient ? 'Update Client' : 'Add Client'}
          </button>
        </form>
      </div>
    </div>
  );

  const ClientDetails = () => {
    if (!selectedClient) return null;
    const stats = getClientStats(selectedClient.id);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md relative">
          <button
            onClick={() => setSelectedClient(null)}
            className="absolute right-4 top-4 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-xl font-bold mb-6">{selectedClient.name}</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-gray-400 text-sm">Total Visits</div>
                <div className="text-xl font-bold">{selectedClient.totalVisits}</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-gray-400 text-sm">Total Spent</div>
                <div className="text-xl font-bold">£{stats.totalSpent}</div>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-gray-400 text-sm">Preferred Service</div>
              <div className="font-semibold">{stats.preferredService}</div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-gray-400 text-sm">Last Visit</div>
              <div className="font-semibold">
                {new Date(selectedClient.lastVisit).toLocaleDateString()}
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-gray-400 text-sm">Contact</div>
              <div className="font-semibold">{selectedClient.phoneNumber}</div>
            </div>

            {selectedClient.notes && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-gray-400 text-sm">Notes</div>
                <div className="mt-1">{selectedClient.notes}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const DeleteConfirmation = ({ clientId }: { clientId: string }) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold mb-4">Delete Client</h3>
          <p className="mb-6">
            Are you sure you want to delete {client.name}? This will also delete all their appointments.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => {
                deleteClient(clientId);
                setShowDeleteConfirm(null);
              }}
              className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(null)}
              className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Clients</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg">
            <span className="text-gray-400">Total:</span>
            <span className="font-semibold">{stats.totalClients}</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg">
            <span className="text-gray-400">Active:</span>
            <span className="font-semibold">{stats.activeClients}</span>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#8f00ff] text-white px-4 py-2 rounded-lg hover:bg-[#7a00d9] transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Add Client
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#8f00ff]"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors group relative"
            onClick={() => setSelectedClient(client)}
          >
            <div className="flex justify-between items-start">
              <h4 className="font-semibold">{client.name}</h4>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(client);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-[#8f00ff]"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(client.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-sm space-y-1">
              <p className="text-gray-400">
                Phone: <span className="text-white">{client.phoneNumber}</span>
              </p>
              <p className="text-gray-400">
                Last Visit:{' '}
                <span className="text-white">
                  {new Date(client.lastVisit).toLocaleDateString()}
                </span>
              </p>
              <p className="text-gray-400">
                Total Visits:{' '}
                <span className="text-white">{client.totalVisits}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {showForm && <ClientForm />}
      {selectedClient && <ClientDetails />}
      {showDeleteConfirm && <DeleteConfirmation clientId={showDeleteConfirm} />}
    </div>
  );
};

export default ClientManager;