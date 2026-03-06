import type { Client, ClientVisit, FormulaResult } from "./types";

const STORAGE_KEY = "hair-formula-clients";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getClients(): Client[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveClients(clients: Client[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

export function saveFormulaToClient(
  clientName: string,
  formula: FormulaResult,
  notes: string
): Client {
  const clients = getClients();
  const normalized = clientName.trim();
  let client = clients.find(
    (c) => c.name.toLowerCase() === normalized.toLowerCase()
  );

  const visit: ClientVisit = {
    id: generateId(),
    date: new Date().toISOString(),
    formula,
    notes,
  };

  if (client) {
    client.visits.unshift(visit);
  } else {
    client = {
      id: generateId(),
      name: normalized,
      visits: [visit],
      createdAt: new Date().toISOString(),
    };
    clients.unshift(client);
  }

  saveClients(clients);
  return client;
}

export function deleteClient(clientId: string) {
  const clients = getClients().filter((c) => c.id !== clientId);
  saveClients(clients);
}

export function deleteVisit(clientId: string, visitId: string) {
  const clients = getClients();
  const client = clients.find((c) => c.id === clientId);
  if (client) {
    client.visits = client.visits.filter((v) => v.id !== visitId);
    if (client.visits.length === 0) {
      saveClients(clients.filter((c) => c.id !== clientId));
    } else {
      saveClients(clients);
    }
  }
}
