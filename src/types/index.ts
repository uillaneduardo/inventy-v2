export type Role = 'admin' | 'operator' | 'manager' | 'viewer';

export interface Organization {
  id: string;
  name: string;
  cnpj: string;
  code: string;
  logo?: string;
  plan: 'Enterprise' | 'Pro' | 'Starter';
  totalAssets: number;
  totalCollaborators: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  avatar?: string;
  status: 'Ativo' | 'Inativo';
  orgId: string;
}

export type AssetStatus = 'Disponível' | 'Em uso' | 'Em manutenção' | 'Descartado';

export interface Asset {
  id: string;
  patrimonio: string;
  nome: string;
  descricao: string;
  categoriaId: string;
  categoriaNome: string;
  marca: string;
  modelo: string;
  numeroSerie: string;
  tags: string[];
  status: AssetStatus;
  inventoryId: string;
  inventoryName: string;
  locationId: string;
  locationPath: string;
  responsavelId?: string;
  responsavelNome?: string;
  observacoes?: string;
  valor: number;
  dataAquisicao: string;
  dataGarantia?: string;
  orgId: string;
  appliedPackagesCount?: number;
  acessorios?: { id: string; nome: string; inclusoPadrao?: boolean }[];
}

export interface Collaborator {
  id: string;
  nome: string;
  cpf: string;
  cargo: string;
  departamento: string;
  unidade: string;
  email: string;
  telefone: string;
  status: 'Ativo' | 'Inativo' | 'Licença';
  foto?: string;
  orgId: string;
  assignedAssetsCount?: number;
  enderecoLogradouro?: string;
  enderecoNumero?: string;
  enderecoBairro?: string;
  enderecoCidade?: string;
  enderecoEstado?: string;
}

export type LocationType = 'unidade' | 'predio' | 'andar' | 'sala';

export interface LocationItem {
  id: string;
  nome: string;
  tipo: LocationType;
  parentId?: string;
  endereco?: string;
  responsavel?: string;
  assetCount?: number;
  orgId: string;
  latitude?: number;
  longitude?: number;
  children?: LocationItem[];
}

export type PackageCategory = 
  | 'SO' 
  | 'Produtividade' 
  | 'Navegador' 
  | 'Acesso Remoto' 
  | 'Segurança / Backup' 
  | 'CAD / Engenharia' 
  | 'Desenvolvimento'
  | 'Utilitários';

export interface PackageItem {
  id: string;
  nome: string;
  categoria: PackageCategory;
  versao?: string;
  obrigatorio: boolean;
  observacao?: string;
}

export interface ApplicationPackage {
  id: string;
  nome: string;
  descricao: string;
  versao: string;
  itens: PackageItem[];
  orgId: string;
  updatedAt: string;
  appliedCount?: number;
}

export interface Credential {
  id: string;
  packageApplicationId: string;
  nome: string;
  identificador?: string;
  valorProtegido: string;
  observacao?: string;
  updatedAt?: string;
}

export interface PackageApplication {
  id: string;
  assetId: string;
  assetName: string;
  assetPatrimonio: string;
  packageId: string;
  packageName: string;
  packageVersao: string;
  dataAplicacao: string;
  usuarioResponsavel: string;
  itensAplicados: PackageItem[];
  observacaoGeral: string;
  credenciais: Credential[];
}

export type MovementType = 'Atribuição' | 'Devolução' | 'Transferência';

export interface Movement {
  id: string;
  assetId: string;
  assetName: string;
  assetPatrimonio: string;
  tipo: MovementType;
  data: string;
  responsavelAnterior?: string;
  novoResponsavel?: string;
  localizacaoAnterior?: string;
  novaLocalizacao?: string;
  usuarioRegistro: string;
  motivo: string;
  orgId: string;
  responsibilityTermId?: string;
  acessoriosEnvolvidos?: string[];
}

export type TermAlign = 'esquerda' | 'centro' | 'direita';

export interface TermFieldOptions {
  showCpf: boolean;
  showPhone: boolean;
  showEmail: boolean;
  showRole: boolean;
  showDepartment: boolean;
  showAddress: boolean;
  showBrandModel: boolean;
  showSerial: boolean;
  showPatrimonio: boolean;
  showAccessories: boolean;
  showObservations: boolean;
}

export interface TermTemplate {
  id: string;
  nome: string;
  titulo: string;
  tiposMovimentacao: MovementType[];
  textoPadrao: string;
  logoUrl?: string;
  logoAlign: TermAlign;
  logoWidth?: number;
  tituloAlign: TermAlign;
  rodape?: string;
  camposVisiveis: TermFieldOptions;
  ativo: boolean;
  orgId: string;
  updatedAt: string;
}

export interface TermSnapshotData {
  organization: {
    name: string;
    cnpj: string;
    logo?: string;
  };
  collaborator: {
    id: string;
    name: string;
    cpf: string;
    role: string;
    department: string;
    unidade?: string;
    phone?: string;
    email?: string;
    fullAddress?: string;
  };
  asset: {
    id: string;
    patrimonio: string;
    name: string;
    marca: string;
    modelo: string;
    numeroSerie: string;
    categoriaNome: string;
    valor?: number;
  };
  movement: {
    type: MovementType;
    date: string;
    location: string;
    motivo: string;
  };
  accessoriesDelivered: {
    id: string;
    nome: string;
    incluso: boolean;
  }[];
  template: {
    titulo: string;
    textoInterpolado: string;
    logoUrl?: string;
    logoAlign: TermAlign;
    logoWidth?: number;
    tituloAlign: TermAlign;
    rodapeInterpolado?: string;
    camposVisiveis: TermFieldOptions;
  };
  signers: {
    operatorName: string;
    operatorTitle: string;
    collaboratorName: string;
    collaboratorTitle: string;
  };
}

export interface ResponsibilityTerm {
  id: string;
  codigo: string;
  movementId: string;
  assetId: string;
  collaboratorId: string;
  templateId: string;
  createdBy: string;
  createdAt: string;
  snapshot: TermSnapshotData;
  orgId: string;
}

export interface Inventory {
  id: string;
  nome: string;
  codigo: string;
  status: 'Em andamento' | 'Concluído' | 'Planejado';
  totalItens: number;
  itensVerificados: number;
  unidade: string;
  responsavel: string;
  dataInicio: string;
  dataPrevisao?: string;
  orgId: string;
}

export interface AssetCategory {
  id: string;
  nome: string;
  icone: string;
  cor: string;
  descricao: string;
  totalAssets: number;
  orgId: string;
}

export interface Tag {
  id: string;
  nome: string;
  cor: string;
  orgId: string;
}

export interface PermissionGroup {
  id: string;
  nome: string;
  descricao: string;
  usuariosCount: number;
  permissoes: string[];
}
