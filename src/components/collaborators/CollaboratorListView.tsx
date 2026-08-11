import React, { useState } from 'react';
import { useInventy } from '../../context/InventyContext';
import { Modal } from '../common/Modal';
import { Collaborator } from '../../types';
import { formatCollaboratorAddress } from '../../utils/termUtils';
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Laptop,
  CheckCircle2,
  UserCheck,
  MapPin,
} from 'lucide-react';

export const CollaboratorListView: React.FC = () => {
  const { collaborators, assets, addCollaborator, currentOrg, setSelectedAssetId, setActiveTab } = useInventy();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollabForModal, setSelectedCollabForModal] = useState<Collaborator | null>(null);
  const [isNewCollabModalOpen, setIsNewCollabModalOpen] = useState(false);

  // New Collaborator Form
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [cargo, setCargo] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [unidade, setUnidade] = useState('Unidade São Paulo (Sede)');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [status, setStatus] = useState<'Ativo' | 'Inativo' | 'Licença'>('Ativo');

  // Address fields
  const [enderecoLogradouro, setEnderecoLogradouro] = useState('');
  const [enderecoNumero, setEnderecoNumero] = useState('');
  const [enderecoComplemento, setEnderecoComplemento] = useState('');
  const [enderecoBairro, setEnderecoBairro] = useState('');
  const [enderecoCidade, setEnderecoCidade] = useState('');
  const [enderecoEstado, setEnderecoEstado] = useState('');
  const [enderecoCep, setEnderecoCep] = useState('');

  const filteredCollaborators = collaborators.filter((c) => {
    const query = searchTerm.toLowerCase();
    return (
      c.nome.toLowerCase().includes(query) ||
      c.cpf.includes(query) ||
      c.cargo.toLowerCase().includes(query) ||
      c.departamento.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query)
    );
  });

  const handleCreateCollaborator = (e: React.FormEvent) => {
    e.preventDefault();
    addCollaborator({
      nome,
      cpf: cpf || '000.000.000-00',
      cargo: cargo || 'Analista',
      departamento: departamento || 'Operações',
      unidade,
      email: email || 'colaborador@techcorp.com.br',
      telefone: telefone || '(11) 90000-0000',
      status,
      foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      enderecoLogradouro: enderecoLogradouro || undefined,
      enderecoNumero: enderecoNumero || undefined,
      enderecoComplemento: enderecoComplemento || undefined,
      enderecoBairro: enderecoBairro || undefined,
      enderecoCidade: enderecoCidade || undefined,
      enderecoEstado: enderecoEstado || undefined,
      enderecoCep: enderecoCep || undefined,
    });

    setIsNewCollabModalOpen(false);
    // Reset
    setNome('');
    setCpf('');
    setCargo('');
    setDepartamento('');
    setEmail('');
    setTelefone('');
    setEnderecoLogradouro('');
    setEnderecoNumero('');
    setEnderecoComplemento('');
    setEnderecoBairro('');
    setEnderecoCidade('');
    setEnderecoEstado('');
    setEnderecoCep('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Cadastro de Colaboradores</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestão de pessoas e custódia de ativos em <strong className="text-slate-700">{currentOrg.name}</strong>
          </p>
        </div>

        <button
          onClick={() => setIsNewCollabModalOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white shadow-xs rounded-lg px-3.5 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-emerald-400" /> Cadastrar Colaborador
        </button>
      </div>

      {/* Info Callout */}
      <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-xs text-slate-600 flex items-center gap-3">
        <Users className="w-5 h-5 text-indigo-600 shrink-0" />
        <p>
          <strong>Nota de Arquitetura:</strong> Colaboradores são os detentores/custodiantes finais dos ativos na empresa. Um colaborador não precisa necessariamente possuir login de usuário na plataforma Inventy.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3">
        <div className="relative w-full max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, CPF, cargo, departamento, e-mail..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Colaborador</th>
                <th className="py-3 px-4">Cargo / Departamento</th>
                <th className="py-3 px-4">Unidade</th>
                <th className="py-3 px-4">Contato</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ativos em Posse</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCollaborators.map((c) => {
                const assignedAssets = assets.filter((a) => a.responsavelId === c.id);

                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCollabForModal(c)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    {/* Name / CPF */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={c.foto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                          alt={c.nome}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{c.nome}</p>
                          <p className="text-[10px] text-slate-400 font-mono">CPF: {c.cpf}</p>
                        </div>
                      </div>
                    </td>

                    {/* Cargo / Dept */}
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{c.cargo}</p>
                      <p className="text-[10px] text-slate-500">{c.departamento}</p>
                    </td>

                    {/* Unidade */}
                    <td className="py-3 px-4 text-slate-700 font-medium">{c.unidade}</td>

                    {/* Contato */}
                    <td className="py-3 px-4 space-y-0.5 text-[11px]">
                      <div className="flex items-center gap-1 text-slate-600">
                        <Mail className="w-3 h-3 text-slate-400" /> {c.email}
                      </div>
                      <div className="flex items-center gap-1 text-slate-500">
                        <Phone className="w-3 h-3 text-slate-400" /> {c.telefone}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                          c.status === 'Ativo'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : c.status === 'Licença'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            c.status === 'Ativo'
                              ? 'bg-emerald-500'
                              : c.status === 'Licença'
                              ? 'bg-amber-500'
                              : 'bg-slate-400'
                          }`}
                        />
                        {c.status}
                      </span>
                    </td>

                    {/* Ativos */}
                    <td className="py-3 px-4 text-right">
                      <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {assignedAssets.length} ativo(s)
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Detalhes do Colaborador & Ativos Vinculados */}
      {selectedCollabForModal && (
        <Modal
          isOpen={!!selectedCollabForModal}
          onClose={() => setSelectedCollabForModal(null)}
          title={
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Ficha do Colaborador</span>
            </div>
          }
          subtitle={`Informações e equipamentos sob guarda de ${selectedCollabForModal.nome}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <img
                src={selectedCollabForModal.foto}
                alt={selectedCollabForModal.nome}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-xs shrink-0"
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedCollabForModal.nome}</h3>
                <p className="text-xs text-slate-600 font-medium">
                  {selectedCollabForModal.cargo} • {selectedCollabForModal.departamento}
                </p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  CPF: {selectedCollabForModal.cpf} • Unidade: {selectedCollabForModal.unidade}
                </p>
                {formatCollaboratorAddress(selectedCollabForModal) && (
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{formatCollaboratorAddress(selectedCollabForModal)}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Ativos atualmente em posse */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Ativos em Posse Atualmente:
              </h4>

              {assets.filter((a) => a.responsavelId === selectedCollabForModal.id).length === 0 ? (
                <p className="text-xs text-slate-400 bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                  Nenhum ativo atribuído a este colaborador no momento.
                </p>
              ) : (
                <div className="space-y-2">
                  {assets
                    .filter((a) => a.responsavelId === selectedCollabForModal.id)
                    .map((asset) => (
                      <div
                        key={asset.id}
                        onClick={() => {
                          setSelectedCollabForModal(null);
                          setSelectedAssetId(asset.id);
                          setActiveTab('ativos');
                        }}
                        className="p-3 rounded-lg border border-slate-200 hover:border-slate-400 bg-white cursor-pointer transition-colors flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <Laptop className="w-4 h-4 text-slate-600 shrink-0" />
                          <div>
                            <p className="font-bold text-slate-900">{asset.nome}</p>
                            <span className="font-mono text-[10px] text-slate-500">{asset.patrimonio}</span>
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-indigo-600 hover:underline">
                          Ver Ficha do Ativo →
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Novo Colaborador */}
      <Modal
        isOpen={isNewCollabModalOpen}
        onClose={() => setIsNewCollabModalOpen(false)}
        title="Cadastrar Novo Colaborador"
        subtitle="Registrar nova pessoa na base da organização"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateCollaborator} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Nome Completo *</label>
            <input
              type="text"
              placeholder="Ex: Lucas Gabriel Albuquerque"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">CPF *</label>
              <input
                type="text"
                placeholder="Ex: 123.456.789-01"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
                className="w-full font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Cargo *</label>
              <input
                type="text"
                placeholder="Ex: Engenheiro de Software"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Departamento *</label>
              <input
                type="text"
                placeholder="Ex: Desenvolvimento & P&D"
                value={departamento}
                onChange={(e) => setDepartamento(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Unidade *</label>
              <select
                value={unidade}
                onChange={(e) => setUnidade(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none"
              >
                <option value="Unidade São Paulo (Sede)">Unidade São Paulo (Sede)</option>
                <option value="Unidade Rio de Janeiro">Unidade Rio de Janeiro</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">E-mail Corporativo *</label>
              <input
                type="email"
                placeholder="colaborador@techcorp.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Telefone / Ramal</label>
              <input
                type="text"
                placeholder="(11) 98765-4321"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Endereço Residencial (Opcional) */}
          <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200 space-y-2 mt-2">
            <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              Endereço Residencial (Opcional - Usado nos Termos A4)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-2">
                <label className="block text-[11px] text-slate-600 mb-0.5">Logradouro / Rua</label>
                <input
                  type="text"
                  placeholder="Ex: Av. Paulista"
                  value={enderecoLogradouro}
                  onChange={(e) => setEnderecoLogradouro(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">Número</label>
                <input
                  type="text"
                  placeholder="Ex: 1000"
                  value={enderecoNumero}
                  onChange={(e) => setEnderecoNumero(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">Complemento</label>
                <input
                  type="text"
                  placeholder="Ex: Apto 42 / Bloco B"
                  value={enderecoComplemento}
                  onChange={(e) => setEnderecoComplemento(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">Bairro</label>
                <input
                  type="text"
                  placeholder="Ex: Bela Vista"
                  value={enderecoBairro}
                  onChange={(e) => setEnderecoBairro(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">Cidade</label>
                <input
                  type="text"
                  placeholder="Ex: São Paulo"
                  value={enderecoCidade}
                  onChange={(e) => setEnderecoCidade(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">Estado (UF)</label>
                <input
                  type="text"
                  placeholder="Ex: SP"
                  value={enderecoEstado}
                  onChange={(e) => setEnderecoEstado(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">CEP</label>
                <input
                  type="text"
                  placeholder="Ex: 01310-100"
                  value={enderecoCep}
                  onChange={(e) => setEnderecoCep(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsNewCollabModalOpen(false)}
              className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Salvar Colaborador
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
