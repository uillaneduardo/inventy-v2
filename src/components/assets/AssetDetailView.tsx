import React, { useState } from 'react';
import { useInventy } from '../../context/InventyContext';
import { AssetStatusBadge, MovementTypeBadge } from '../common/Badge';
import { ApplyPackageModal } from './ApplyPackageModal';
import { AssetMovementModal } from './AssetMovementModal';
import {
  Laptop,
  ArrowLeft,
  Calendar,
  User,
  MapPin,
  Tag as TagIcon,
  Package,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  Plus,
  ArrowLeftRight,
  ShieldCheck,
  FileText,
  Clock,
  Building,
  Info,
} from 'lucide-react';

interface AssetDetailViewProps {
  assetId: string;
  onBack: () => void;
}

export const AssetDetailView: React.FC<AssetDetailViewProps> = ({ assetId, onBack }) => {
  const { assets, packageApplications, movements, collaborators, addToast } = useInventy();

  const [activeSubTab, setActiveSubTab] = useState<
    'geral' | 'pacotes' | 'credenciais' | 'movimentacoes' | 'observacoes'
  >('geral');

  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [movementModalOpen, setMovementModalOpen] = useState(false);

  // Masked credentials visibility state
  const [revealedCreds, setRevealedCreds] = useState<Record<string, boolean>>({});
  const [copiedCredId, setCopiedCredId] = useState<string | null>(null);

  const asset = assets.find((a) => a.id === assetId);

  if (!asset) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-sm font-semibold text-slate-700">Ativo não encontrado.</p>
        <button
          onClick={onBack}
          className="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg"
        >
          Voltar para Lista
        </button>
      </div>
    );
  }

  // Applications for this asset
  const assetPackageApps = packageApplications.filter((pa) => pa.assetId === asset.id);

  // Movements for this asset
  const assetMovements = movements.filter((m) => m.assetId === asset.id);

  // All credentials collected across applied package snapshots on this asset
  const allAssetCredentials = assetPackageApps.flatMap((pa) =>
    pa.credenciais.map((c) => ({
      ...c,
      packageName: pa.packageName,
      packageVersao: pa.packageVersao,
      dataAplicacao: pa.dataAplicacao,
    }))
  );

  const toggleReveal = (credId: string) => {
    setRevealedCreds((prev) => ({ ...prev, [credId]: !prev[credId] }));
  };

  const copyCredential = (credId: string, val: string, name: string) => {
    navigator.clipboard.writeText(val);
    setCopiedCredId(credId);
    addToast('success', 'Credencial Copiada!', `A credencial "${name}" foi copiada para a área de transferência.`);
    setTimeout(() => setCopiedCredId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button
          onClick={onBack}
          className="hover:text-slate-900 flex items-center gap-1 font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Ativos
        </button>
        <span>/</span>
        <span className="font-mono text-slate-700">{asset.patrimonio}</span>
        <span>/</span>
        <span className="text-slate-900 font-semibold truncate max-w-xs">{asset.nome}</span>
      </div>

      {/* Header Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Laptop className="w-6 h-6 text-emerald-400" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {asset.patrimonio}
                </span>
                <AssetStatusBadge status={asset.status} />
                <span className="text-xs text-slate-500 font-medium">{asset.categoriaNome}</span>
              </div>
              <h1 className="text-lg font-bold text-slate-900 mt-1">{asset.nome}</h1>
              <p className="text-xs text-slate-500 mt-0.5">{asset.marca} • Modelo {asset.modelo} • S/N: {asset.numeroSerie}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setApplyModalOpen(true)}
              className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs rounded-lg px-3 py-2 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Package className="w-3.5 h-3.5 text-emerald-600" />
              Aplicar Pacote
            </button>
            <button
              onClick={() => setMovementModalOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white shadow-xs rounded-lg px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
              Movimentar Ativo
            </button>
          </div>
        </div>

        {/* Quick Context Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <User className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">
              <strong>Responsável:</strong> {asset.responsavelNome || 'Nenhum (Disponível no estoque)'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate" title={asset.locationPath}>
              <strong>Localização:</strong> {asset.locationPath.split('>').pop()?.trim() || asset.locationPath}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Package className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              <strong>Pacotes Aplicados:</strong> {assetPackageApps.length} registros
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-4">
          {[
            { id: 'geral', label: 'Visão Geral', icon: FileText },
            {
              id: 'pacotes',
              label: `Pacotes de Aplicação (${assetPackageApps.length})`,
              icon: Package,
            },
            {
              id: 'credenciais',
              label: `Credenciais (${allAssetCredentials.length})`,
              icon: Key,
            },
            {
              id: 'movimentacoes',
              label: `Histórico de Movimentações (${assetMovements.length})`,
              icon: ArrowLeftRight,
            },
            { id: 'observacoes', label: 'Observações & Garantia', icon: Info },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`py-2.5 px-1 border-b-2 font-semibold text-xs flex items-center gap-2 transition-all ${
                  isActive
                    ? 'border-slate-900 text-slate-900 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab 1: Visão Geral */}
      {activeSubTab === 'geral' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Especificações Técnicas
            </h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
              <div>
                <dt className="text-slate-400 font-medium">Nome do Ativo</dt>
                <dd className="font-semibold text-slate-800">{asset.nome}</dd>
              </div>
              <div>
                <dt className="text-slate-400 font-medium">Código Patrimonial</dt>
                <dd className="font-mono font-bold text-slate-900">{asset.patrimonio}</dd>
              </div>
              <div>
                <dt className="text-slate-400 font-medium">Marca</dt>
                <dd className="font-semibold text-slate-800">{asset.marca}</dd>
              </div>
              <div>
                <dt className="text-slate-400 font-medium">Modelo</dt>
                <dd className="font-semibold text-slate-800">{asset.modelo}</dd>
              </div>
              <div>
                <dt className="text-slate-400 font-medium">Número de Série</dt>
                <dd className="font-mono font-semibold text-slate-800">{asset.numeroSerie}</dd>
              </div>
              <div>
                <dt className="text-slate-400 font-medium">Categoria</dt>
                <dd className="font-semibold text-slate-800">{asset.categoriaNome}</dd>
              </div>
            </dl>

            <div>
              <dt className="text-slate-400 text-xs font-medium mb-1">Descrição</dt>
              <dd className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 leading-relaxed">
                {asset.descricao}
              </dd>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Status & Localização
            </h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
              <div>
                <dt className="text-slate-400 font-medium">Status Atual</dt>
                <dd className="mt-0.5">
                  <AssetStatusBadge status={asset.status} />
                </dd>
              </div>
              <div>
                <dt className="text-slate-400 font-medium">Inventário Associado</dt>
                <dd className="font-semibold text-slate-800">{asset.inventoryName}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-slate-400 font-medium">Caminho da Localização</dt>
                <dd className="font-semibold text-slate-800 bg-slate-50 p-2 rounded border border-slate-200/60 mt-1">
                  {asset.locationPath}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-slate-400 font-medium">Responsável Atual</dt>
                <dd className="font-semibold text-slate-900 flex items-center gap-2 mt-1">
                  <User className="w-4 h-4 text-slate-500" />
                  {asset.responsavelNome || 'Nenhum responsável atribuído'}
                </dd>
              </div>
            </dl>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-medium text-slate-400 block mb-1.5">Tags Vinculadas</span>
              <div className="flex flex-wrap gap-1.5">
                {asset.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    <TagIcon className="w-2.5 h-2.5 text-slate-500" /> {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Pacotes de Aplicação (Historical Snapshots) */}
      {activeSubTab === 'pacotes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Fotografias Históricas de Pacotes de Aplicação
              </h3>
              <p className="text-xs text-slate-500">
                Registros independentes dos pacotes instalados neste ativo. Alterações no modelo original não afetam este histórico.
              </p>
            </div>
            <button
              onClick={() => setApplyModalOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" /> Aplicar Pacote
            </button>
          </div>

          {assetPackageApps.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200/80 p-8 text-center space-y-2">
              <Package className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">Nenhum pacote de aplicação registrado para este ativo.</p>
              <p className="text-[11px] text-slate-400">Clique no botão acima para vincular um pacote de softwares e credenciais.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assetPackageApps.map((pa) => (
                <div key={pa.id} className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
                  <div className="p-4 bg-slate-50/80 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-emerald-600" />
                        <h4 className="text-sm font-bold text-slate-900">{pa.packageName}</h4>
                        <span className="text-[10px] font-mono font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                          v{pa.packageVersao}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Aplicado em <strong>{pa.dataAplicacao}</strong> por <strong>{pa.usuarioResponsavel}</strong>
                      </p>
                    </div>

                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                      ID Snapshot: {pa.id}
                    </span>
                  </div>

                  <div className="p-4 space-y-3">
                    <p className="text-xs text-slate-700 font-medium">
                      <strong>Observação Geral:</strong> {pa.observacaoGeral}
                    </p>

                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                        Itens Instalados (Fotografia Congelada):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {pa.itensAplicados.map((item) => (
                          <div
                            key={item.id}
                            className="p-2.5 rounded-lg border border-slate-200/80 bg-slate-50/50 text-xs space-y-0.5"
                          >
                            <p className="font-semibold text-slate-900 truncate">{item.nome}</p>
                            <p className="text-[10px] text-slate-500">
                              {item.categoria} {item.versao ? `• v${item.versao}` : ''}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Credenciais */}
      {activeSubTab === 'credenciais' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Credenciais de Acesso Protegidas do Ativo
              </h3>
              <p className="text-xs text-slate-500">
                Chaves de acesso, senhas e identificadores vinculados às aplicações de pacotes instaladas neste ativo.
              </p>
            </div>
          </div>

          {allAssetCredentials.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200/80 p-8 text-center space-y-2">
              <Key className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">Nenhuma credencial cadastrada para este ativo.</p>
              <p className="text-[11px] text-slate-400">Aplique um pacote de aplicação informando credenciais (ex: AnyDesk, Licenças) para exibi-las aqui.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allAssetCredentials.map((cred) => {
                const isRevealed = !!revealedCreds[cred.id];
                const isCopied = copiedCredId === cred.id;

                return (
                  <div key={cred.id} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-amber-600 shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{cred.nome}</h4>
                          <span className="text-[10px] text-slate-400 block">Origem: {cred.packageName}</span>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono bg-amber-50 text-amber-800 px-1.5 py-0.2 rounded border border-amber-200/60 font-semibold">
                        Acesso Protegido
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      {cred.identificador && (
                        <div>
                          <span className="text-[10px] text-slate-400 font-medium block">Usuário / ID</span>
                          <span className="font-mono font-semibold text-slate-800 bg-slate-100 px-2 py-1 rounded block mt-0.5">
                            {cred.identificador}
                          </span>
                        </div>
                      )}

                      {/* PROTECTED VALUE FIELD */}
                      <div>
                        <span className="text-[10px] text-slate-400 font-medium block">Senha / Valor Protegido</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="flex-1 font-mono font-bold text-xs bg-slate-900 text-emerald-400 px-2.5 py-1.5 rounded-lg border border-slate-800 truncate">
                            {isRevealed ? cred.valorProtegido : '••••••••••••••••'}
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleReveal(cred.id)}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
                            title={isRevealed ? 'Ocultar Valor' : 'Exibir Valor'}
                          >
                            {isRevealed ? <EyeOff className="w-4 h-4 text-slate-700" /> : <Eye className="w-4 h-4 text-slate-700" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => copyCredential(cred.id, cred.valorProtegido, cred.nome)}
                            className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 text-xs font-semibold ${
                              isCopied
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                            title="Copiar Credencial"
                          >
                            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {cred.observacao && (
                        <p className="text-[11px] text-slate-500 italic pt-1">{cred.observacao}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Histórico de Movimentações */}
      {activeSubTab === 'movimentacoes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Linha do Tempo de Movimentações
              </h3>
              <p className="text-xs text-slate-500">
                Histórico imutável de atribuições, devoluções e transferências deste ativo.
              </p>
            </div>
            <button
              onClick={() => setMovementModalOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" /> Movimentar
            </button>
          </div>

          {assetMovements.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200/80 p-8 text-center space-y-2">
              <Clock className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">Nenhuma movimentação registrada para este ativo.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-4">
              {assetMovements.map((mov, idx) => (
                <div key={mov.id} className="flex items-start gap-3.5 relative pb-4 last:pb-0">
                  {idx !== assetMovements.length - 1 && (
                    <div className="absolute left-3.5 top-8 bottom-0 w-0.5 bg-slate-200" />
                  )}
                  <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center shrink-0 z-10">
                    <ArrowLeftRight className="w-3.5 h-3.5 text-slate-700" />
                  </div>

                  <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-200/70 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MovementTypeBadge tipo={mov.tipo} />
                        <span className="font-semibold text-slate-900">{mov.data}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Por {mov.usuarioRegistro}</span>
                    </div>

                    <p className="text-slate-800 font-medium mt-1">
                      {mov.novoResponsavel ? (
                        <>
                          <strong>Novo Responsável:</strong> {mov.novoResponsavel}
                        </>
                      ) : (
                        <>
                          <strong>Responsável Anterior:</strong> {mov.responsavelAnterior || 'Nenhum'}
                        </>
                      )}
                    </p>

                    <p className="text-slate-600 text-[11px]">
                      <strong>Motivo:</strong> {mov.motivo}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Observações & Documentos */}
      {activeSubTab === 'observacoes' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            Observações Gerais & Informações Financeiras
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-medium block">Valor de Aquisição</span>
              <span className="text-sm font-bold text-slate-900 block mt-0.5">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(asset.valor)}
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">Data de Aquisição</span>
              <span className="font-semibold text-slate-800 block mt-0.5">{asset.dataAquisicao}</span>
            </div>

            {asset.dataGarantia && (
              <div>
                <span className="text-slate-400 font-medium block">Vencimento da Garantia</span>
                <span className="font-semibold text-emerald-700 block mt-0.5">{asset.dataGarantia}</span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <span className="text-slate-400 font-medium block text-xs mb-1">Notas do Ativo</span>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
              {asset.observacoes || 'Nenhuma observação registrada para este ativo.'}
            </p>
          </div>
        </div>
      )}

      {/* Modals */}
      <ApplyPackageModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        asset={asset}
      />

      <AssetMovementModal
        isOpen={movementModalOpen}
        onClose={() => setMovementModalOpen(false)}
        asset={asset}
      />
    </div>
  );
};
