export interface StockItem {
  id: string;
  codigo: string;
  nome: string;
  categoria: string;
  quantidade: number;
  unidade: string;
  localizacao: string;
  valorUnitario: number;
  dataAtualizacao: string;
}

export interface Movement {
  id: string;
  itemId: string;
  itemNome: string;
  tipo: "entrada" | "saida";
  quantidade: number;
  data: string;
  responsavel: string;
  observacao?: string;
}

export interface SolicitacaoPeca {
  id: string;
  itemId: string;
  itemNome: string;
  quantidade: number;
  solicitante: string;
  matricula: string;
  data: string;
  status: "pendente" | "aprovada" | "rejeitada";
  observacao?: string;
}

const STORAGE_KEYS = {
  STOCK: "stock_items",
  MOVEMENTS: "stock_movements",
  REQUESTS: "stock_requests",
};

// ------------------
// Inicialização base
// ------------------

const initializeData = () => {
  // ESTOQUE
  if (!localStorage.getItem(STORAGE_KEYS.STOCK)) {
    const sampleStock: StockItem[] = [
      {
        id: "1",
        codigo: "PC001",
        nome: "Cabo de Rede",
        categoria: "Cabos",
        quantidade: 45,
        unidade: "UN",
        localizacao: "A1-P3",
        valorUnitario: 15.0,
        dataAtualizacao: new Date().toISOString(),
      },
      {
        id: "2",
        codigo: "PC002",
        nome: "Mouse",
        categoria: "Periféricos",
        quantidade: 120,
        unidade: "UN",
        localizacao: "B2-P1",
        valorUnitario: 35.0,
        dataAtualizacao: new Date().toISOString(),
      },
      {
        id: "3",
        codigo: "PC003",
        nome: "Monitor 24'",
        categoria: "Componentes",
        quantidade: 78,
        unidade: "UN",
        localizacao: "C3-P2",
        valorUnitario: 680.0,
        dataAtualizacao: new Date().toISOString(),
      },
    ];

    localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(sampleStock));
  }

  // MOVIMENTAÇÕES
  if (!localStorage.getItem(STORAGE_KEYS.MOVEMENTS)) {
    const sampleMovements: Movement[] = [
      {
        id: "1",
        itemId: "1",
        itemNome: "Cabo de Rede",
        tipo: "entrada",
        quantidade: 20,
        data: new Date(Date.now() - 86400000).toISOString(),
        responsavel: "Hebert",
        observacao: "Compra programada",
      },
      {
        id: "2",
        itemId: "2",
        itemNome: "Mouse",
        tipo: "saida",
        quantidade: 10,
        data: new Date(Date.now() - 43200000).toISOString(),
        responsavel: "Lucas",
        observacao: "Reposição para setor de TI",
      },
    ];

    localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(sampleMovements));
  }

  // SOLICITAÇÕES
  if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify([]));
  }
};

initializeData();

// ------------------------------
// CRUD — ESTOQUE
// ------------------------------

export const getStockItems = (): StockItem[] =>
  JSON.parse(localStorage.getItem(STORAGE_KEYS.STOCK) || "[]");

export const getStockItem = (id: string): StockItem | undefined =>
  getStockItems().find((item) => item.id === id);

export const createStockItem = (
  item: Omit<StockItem, "id" | "dataAtualizacao">
): StockItem => {
  const items = getStockItems();
  const newItem: StockItem = {
    ...item,
    id: Date.now().toString(),
    dataAtualizacao: new Date().toISOString(),
  };

  items.push(newItem);
  localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(items));
  return newItem;
};

export const updateStockItem = (
  id: string,
  updates: Partial<StockItem>
): StockItem | null => {
  const items = getStockItems();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;

  items[index] = {
    ...items[index],
    ...updates,
    dataAtualizacao: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(items));
  return items[index];
};

export const deleteStockItem = (id: string): boolean => {
  const items = getStockItems();
  const updated = items.filter((item) => item.id !== id);

  if (updated.length === items.length) return false;

  localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(updated));
  return true;
};

// ------------------------------
// CRUD — MOVIMENTAÇÃO
// ------------------------------

export const getMovements = (): Movement[] =>
  JSON.parse(localStorage.getItem(STORAGE_KEYS.MOVEMENTS) || "[]");

export const createMovement = (
  movement: Omit<Movement, "id" | "data">
): Movement => {
  const movements = getMovements();

  const newMovement: Movement = {
    ...movement,
    id: Date.now().toString(),
    data: new Date().toISOString(),
  };

  // Atualiza quantidade
  const items = getStockItems();
  const index = items.findIndex((i) => i.id === movement.itemId);

  if (index !== -1) {
    const delta =
      movement.tipo === "entrada"
        ? movement.quantidade
        : -movement.quantidade;

    items[index].quantidade = Math.max(0, items[index].quantidade + delta);
    items[index].dataAtualizacao = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(items));
  }

  movements.push(newMovement);
  localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(movements));

  return newMovement;
};

// ------------------------------
// CRUD — SOLICITAÇÕES DE PEÇAS
// ------------------------------

export const getRequests = (): SolicitacaoPeca[] =>
  JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || "[]");

export const createRequest = (
  request: Omit<SolicitacaoPeca, "id" | "data" | "status">
): SolicitacaoPeca => {
  const requests = getRequests();

  const newRequest: SolicitacaoPeca = {
    ...request,
    id: Date.now().toString(),
    data: new Date().toISOString(),
    status: "pendente",
  };

  requests.push(newRequest);
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));

  return newRequest;
};

export const updateRequestStatus = (
  id: string,
  status: "aprovada" | "rejeitada"
): boolean => {
  const requests = getRequests();
  const index = requests.findIndex((r) => r.id === id);

  if (index === -1) return false;

  requests[index].status = status;

  if (status === "aprovada") {
    const req = requests[index];

    createMovement({
      itemId: req.itemId,
      itemNome: req.itemNome,
      tipo: "saida",
      quantidade: req.quantidade,
      responsavel: req.solicitante,
      observacao: `Solicitação aprovada ${req.observacao ? `- ${req.observacao}` : ""}`,
    });
  }

  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  return true;
};

// ------------------------------
// MÉTRICAS
// ------------------------------

export const getStockMetrics = () => {
  const items = getStockItems();
  const movements = getMovements();

  const totalItems = items.reduce((s, i) => s + i.quantidade, 0);
  const totalValue = items.reduce(
    (s, i) => s + i.quantidade * i.valorUnitario,
    0
  );

  const last30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const recent = movements.filter((m) => new Date(m.data) > last30);

  const entradas = recent
    .filter((m) => m.tipo === "entrada")
    .reduce((s, m) => s + m.quantidade, 0);

  const saidas = recent
    .filter((m) => m.tipo === "saida")
    .reduce((s, m) => s + m.quantidade, 0);

  return {
    totalItems,
    totalValue,
    entradas,
    saidas,
    itemsCount: items.length,
  };
};
