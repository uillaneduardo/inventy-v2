import React from 'react';
import { TermSnapshotData } from '../../types';
import { ShieldCheck, FileCheck2, Building2 } from 'lucide-react';

interface ResponsibilityTermDocumentProps {
  snapshot: TermSnapshotData;
  code?: string;
}

export const ResponsibilityTermDocument: React.FC<ResponsibilityTermDocumentProps> = ({
  snapshot,
  code,
}) => {
  const {
    organization,
    collaborator,
    asset,
    movement,
    accessoriesDelivered,
    template,
    signers,
  } = snapshot;

  const getLogoJustify = () => {
    if (template.logoAlign === 'centro') return 'justify-center';
    if (template.logoAlign === 'direita') return 'justify-end';
    return 'justify-start';
  };

  const getTitleAlign = () => {
    if (template.tituloAlign === 'esquerda') return 'text-left';
    if (template.tituloAlign === 'direita') return 'text-right';
    return 'text-center';
  };

  return (
    <div className="bg-white text-slate-900 font-sans p-8 sm:p-12 max-w-[210mm] min-h-[297mm] mx-auto shadow-lg print:shadow-none print:p-0 print:m-0 border border-slate-200 print:border-none flex flex-col justify-between selection:bg-slate-200">
      <div>
        {/* Header Org + Logo */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <div className={`flex items-center ${getLogoJustify()} mb-3`}>
            {template.logoUrl ? (
              <img
                src={template.logoUrl}
                alt={organization.name}
                style={{ width: `${template.logoWidth || 120}px` }}
                className="max-h-16 object-contain"
              />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded bg-slate-900 flex items-center justify-center text-white font-black text-lg">
                  <Building2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <span className="text-lg font-black tracking-tight text-slate-900 uppercase block leading-none">
                    {organization.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono tracking-wide">
                    CNPJ: {organization.cnpj}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-end justify-between mt-2">
            <div>
              <p className="text-[11px] font-bold text-slate-700 uppercase">
                {organization.name} — CNPJ: {organization.cnpj}
              </p>
              <p className="text-[10px] text-slate-500">
                Gestão de Ativos & Tecnologia da Informação
              </p>
            </div>
            {code && (
              <div className="text-right">
                <span className="inline-block text-[10px] font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-300">
                  {code}
                </span>
                <p className="text-[9px] text-slate-400 mt-0.5 font-mono">
                  EMISSÃO: {movement.date.substring(0, 10)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1
            className={`text-base sm:text-lg font-black tracking-tight text-slate-900 uppercase ${getTitleAlign()}`}
          >
            {template.titulo}
          </h1>
          <div className="w-16 h-0.5 bg-slate-900 my-2 mx-auto" />
          <p className="text-[11px] text-slate-500 text-center font-medium">
            Movimentação: <strong className="text-slate-900 uppercase">{movement.type}</strong> • Data:{' '}
            {movement.date.substring(0, 10)}
          </p>
        </div>

        {/* Dynamic Interpolated Text Body */}
        <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line mb-6 bg-slate-50/50 p-4 rounded-lg border border-slate-200">
          {template.textoInterpolado}
        </div>

        {/* Section: Employee Details */}
        <div className="mb-6 border border-slate-200 rounded-lg p-3 bg-white">
          <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
            <span>1. Dados do Colaborador / Depositário</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
            <div>
              <span className="text-slate-400 text-[10px] block uppercase font-mono">Nome Completo:</span>
              <strong className="text-slate-900 font-semibold">{collaborator.name}</strong>
            </div>

            {template.camposVisiveis.showCpf && (
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-mono">CPF:</span>
                <strong className="text-slate-800 font-mono">{collaborator.cpf}</strong>
              </div>
            )}

            {template.camposVisiveis.showRole && (
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-mono">Cargo:</span>
                <span className="text-slate-800">{collaborator.role}</span>
              </div>
            )}

            {template.camposVisiveis.showDepartment && (
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-mono">Departamento:</span>
                <span className="text-slate-800">{collaborator.department}</span>
              </div>
            )}

            {collaborator.unidade && (
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-mono">Unidade:</span>
                <span className="text-slate-800">{collaborator.unidade}</span>
              </div>
            )}

            {template.camposVisiveis.showPhone && collaborator.phone && (
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-mono">Telefone:</span>
                <span className="text-slate-800 font-mono">{collaborator.phone}</span>
              </div>
            )}

            {template.camposVisiveis.showEmail && collaborator.email && (
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-mono">E-mail:</span>
                <span className="text-slate-800">{collaborator.email}</span>
              </div>
            )}

            {template.camposVisiveis.showAddress && collaborator.fullAddress && (
              <div className="col-span-2 sm:col-span-3">
                <span className="text-slate-400 text-[10px] block uppercase font-mono">Endereço Residencial:</span>
                <span className="text-slate-800">{collaborator.fullAddress}</span>
              </div>
            )}
          </div>
        </div>

        {/* Section: Equipment Details */}
        <div className="mb-6 border border-slate-200 rounded-lg p-3 bg-white">
          <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-1">
            <FileCheck2 className="w-3.5 h-3.5 text-slate-700" />
            <span>2. Especificações do Ativo de TI</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
            {template.camposVisiveis.showPatrimonio && (
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-mono">Patrimônio / Tombo:</span>
                <strong className="text-slate-900 font-mono text-xs">{asset.patrimonio}</strong>
              </div>
            )}

            <div>
              <span className="text-slate-400 text-[10px] block uppercase font-mono">Equipamento:</span>
              <strong className="text-slate-800">{asset.name}</strong>
            </div>

            {template.camposVisiveis.showBrandModel && (
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-mono">Marca / Modelo:</span>
                <span className="text-slate-800">{asset.marca} {asset.modelo}</span>
              </div>
            )}

            {template.camposVisiveis.showSerial && (
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-mono">Número de Série:</span>
                <span className="text-slate-800 font-mono">{asset.numeroSerie}</span>
              </div>
            )}

            <div>
              <span className="text-slate-400 text-[10px] block uppercase font-mono">Categoria:</span>
              <span className="text-slate-800">{asset.categoriaNome}</span>
            </div>

            {asset.valor && asset.valor > 0 && (
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-mono">Valor Estimado:</span>
                <span className="text-slate-800 font-mono">
                  R$ {asset.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}

            <div className="col-span-2 sm:col-span-3">
              <span className="text-slate-400 text-[10px] block uppercase font-mono">Localização / Alocação:</span>
              <span className="text-slate-800">{movement.location}</span>
            </div>
          </div>
        </div>

        {/* Section: Accessories Checklist */}
        {template.camposVisiveis.showAccessories && accessoriesDelivered && accessoriesDelivered.length > 0 && (
          <div className="mb-6 border border-slate-200 rounded-lg p-3 bg-white">
            <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1">
              3. Checklist de Acessórios Entregues
            </h2>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {accessoriesDelivered.map((acc) => (
                <div key={acc.id} className="flex items-center gap-2">
                  <div
                    className={`w-3.5 h-3.5 rounded border flex items-center justify-center font-bold text-[9px] ${
                      acc.incluso
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-300 bg-slate-100 text-slate-400'
                    }`}
                  >
                    {acc.incluso ? '✓' : ''}
                  </div>
                  <span className={acc.incluso ? 'text-slate-900 font-medium' : 'text-slate-400 line-through'}>
                    {acc.nome}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: Observations */}
        {template.camposVisiveis.showObservations && movement.motivo && (
          <div className="mb-6 border border-slate-200 rounded-lg p-3 bg-white text-xs">
            <span className="text-slate-400 text-[10px] block uppercase font-mono font-bold">
              Observações / Motivo da Operação:
            </span>
            <p className="text-slate-700 italic mt-0.5">{movement.motivo}</p>
          </div>
        )}
      </div>

      {/* Footer Signatures */}
      <div className="pt-8 mt-6 border-t border-slate-200">
        <p className="text-[10px] text-slate-500 text-center mb-8">
          E por estarem de pleno acordo com todas as condições descritas neste instrumento, firmam o presente termo.
        </p>

        <div className="grid grid-cols-2 gap-12 text-center text-xs">
          <div>
            <div className="border-b border-slate-900 pb-1 mb-1" />
            <p className="font-bold text-slate-900">{signers.collaboratorName}</p>
            <p className="text-[10px] text-slate-500">{signers.collaboratorTitle}</p>
            <p className="text-[9px] text-slate-400 font-mono mt-0.5">CPF: {collaborator.cpf}</p>
          </div>

          <div>
            <div className="border-b border-slate-900 pb-1 mb-1" />
            <p className="font-bold text-slate-900">{signers.operatorName}</p>
            <p className="text-[10px] text-slate-500">{signers.operatorTitle}</p>
            <p className="text-[9px] text-slate-400 font-mono mt-0.5">{organization.name}</p>
          </div>
        </div>

        {template.rodapeInterpolado && (
          <div className="mt-8 pt-3 border-t border-slate-100 text-center">
            <p className="text-[9px] text-slate-400 font-mono">{template.rodapeInterpolado}</p>
          </div>
        )}
      </div>
    </div>
  );
};
