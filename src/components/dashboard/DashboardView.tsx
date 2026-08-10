import React from 'react';
import { useInventy } from '../../context/InventyContext';
import { AssetStatusBadge, MovementTypeBadge } from '../common/Badge';
import {
  Laptop,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Plus,
  ArrowLeftRight,
  Package,
  TrendingUp,
  DollarSign,
  ChevronRight,
  ShieldAlert,
  Building2,
  Users,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { assets, movements, inventories, categories, setActiveTab, setSelectedAssetId, currentOrg, addToast } =
    useInventy();

  const totalAssets = assets.length;
  const emUso = assets.filter((a) => a.status === 'Em uso').length;
  const disponivel = assets.filter((a) => a.status === 'Disponível').length;
  const emManutencao = assets.filter((a) => a.status === 'Em manutenção').length;
  const descartado = assets.filter((a) => a.status === 'Descartado').length;

  const alocacaoRate = totalAssets > 0 ? Math.round((emUso / totalAssets) * 100) : 0;
  const valorTotal = assets.reduce((sum, a) => sum + (a.valor || 0), 0);

  const formattedValorTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(valorTotal);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Visão Geral do Inventário</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Métricas estratégicas e controle patrimonial para <strong className="text-slate-700">{currentOrg.name}</strong>
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('ativos')}
            className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-slate-600" />
            Novo Ativo
          </button>
          <button
            onClick={() => setActiveTab('movimentacoes')}
            className="bg-slate-900 hover:bg-slate-800 text-white shadow-xs rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
            Registrar Movimentação
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Assets */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Total de Ativos</span>
            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
              <Laptop className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">{totalAssets}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Cadastrados no sistema</p>
        </div>

        {/* Em Uso */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-blue-700">Em Uso</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-900 mt-2 tracking-tight">{emUso}</p>
          <p className="text-[10px] text-blue-600/70 mt-0.5">{alocacaoRate}% taxa de alocação</p>
        </div>

        {/* Disponíveis */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-emerald-700">Disponíveis</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-900 mt-2 tracking-tight">{disponivel}</p>
          <p className="text-[10px] text-emerald-600/70 mt-0.5">Prontos no estoque</p>
        </div>

        {/* Em Manutenção */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-amber-700">Em Manutenção</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-900 mt-2 tracking-tight">{emManutencao}</p>
          <p className="text-[10px] text-amber-600/70 mt-0.5">Em reparo / chamado</p>
        </div>

        {/* Descartados */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Descartados</span>
            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-700 mt-2 tracking-tight">{descartado}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Baixados / sucateados</p>
        </div>

        {/* Total Portfolio Value */}
        <div className="bg-slate-900 text-white p-3.5 rounded-xl border border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300">Valor Patrimonial</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-lg font-bold mt-2 tracking-tight text-white truncate">{formattedValorTotal}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Ativos de TI calculados</p>
        </div>
      </div>

      {/* Active Inventory Audit Banner */}
      {inventories.length > 0 && (
        <div className="bg-linear-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-xl p-4 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Auditoria em Andamento
            </div>
            <h3 className="text-sm font-bold text-white">{inventories[0].nome}</h3>
            <p className="text-xs text-slate-300">
              Unidade: {inventories[0].unidade} • Responsável: {inventories[0].responsavel}
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="space-y-1 min-w-[140px]">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Progresso</span>
                <span className="font-semibold text-white">
                  {Math.round((inventories[0].itensVerificados / inventories[0].totalItens) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-700/80 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-400 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(inventories[0].itensVerificados / inventories[0].totalItens) * 100}%`,
                  }}
                />
              </div>
              <p className="text-[10px] text-slate-400">
                {inventories[0].itensVerificados} de {inventories[0].totalItens} itens conferidos
              </p>
            </div>

            <button
              onClick={() => setActiveTab('inventarios')}
              className="bg-white hover:bg-slate-100 text-slate-900 font-semibold px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors shadow-xs"
            >
              Ver Detalhes
            </button>
          </div>
        </div>
      )}

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Categorias & Ativos em Destaque */}
        <div className="lg:col-span-2 space-y-6">
          {/* Categorias Distribution */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Ativos por Categoria</h3>
              <button
                onClick={() => setActiveTab('ativos')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
              >
                Ver todos <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {categories.map((cat) => {
                const count = assets.filter((a) => a.categoriaId === cat.id).length;
                const percentage = totalAssets > 0 ? Math.round((count / totalAssets) * 100) : 0;
                return (
                  <div key={cat.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 font-bold text-xs"
                      style={{ backgroundColor: cat.cor }}
                    >
                      {cat.nome.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-semibold text-slate-800 truncate">{cat.nome}</p>
                        <span className="text-xs font-bold text-slate-900">{count}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1.5">
                        <div
                          className="h-1.5 rounded-full transition-all"
                          style={{ backgroundColor: cat.cor, width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ativos Recentes */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Ativos Recentes</h3>
              <button
                onClick={() => setActiveTab('ativos')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
              >
                Ver todos <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {assets.slice(0, 4).map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => {
                    setSelectedAssetId(asset.id);
                    setActiveTab('ativos');
                  }}
                  className="p-3.5 hover:bg-slate-50/80 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0">
                      <Laptop className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-slate-900 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                          {asset.patrimonio}
                        </span>
                        <p className="text-xs font-semibold text-slate-900 truncate">{asset.nome}</p>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                        {asset.responsavelNome ? `Atribuído a ${asset.responsavelNome}` : 'Sem responsável direto'} • {asset.categoriaNome}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <AssetStatusBadge status={asset.status} />
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Movimentações Recentes */}
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Últimas Movimentações</h3>
              <button
                onClick={() => setActiveTab('movimentacoes')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Ver mais
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {movements.slice(0, 4).map((mov) => (
                <div key={mov.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-slate-700 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                      {mov.assetPatrimonio}
                    </span>
                    <MovementTypeBadge tipo={mov.tipo} />
                  </div>
                  <p className="text-xs font-semibold text-slate-900">{mov.assetName}</p>
                  <p className="text-[11px] text-slate-600">
                    {mov.novoResponsavel ? `Novo responsável: ${mov.novoResponsavel}` : mov.motivo}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/50">
                    <span>{mov.data}</span>
                    <span>Por {mov.usuarioRegistro}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
