import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { TermTemplate, MovementType, TermAlign } from '../../types';
import { FileText, Sliders, Layout, Eye } from 'lucide-react';

interface ResponsibilityTermTemplateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateToEdit?: TermTemplate | null;
  onSave: (data: Omit<TermTemplate, 'id' | 'orgId' | 'updatedAt'>) => void;
}

export const ResponsibilityTermTemplateFormModal: React.FC<ResponsibilityTermTemplateFormModalProps> = ({
  isOpen,
  onClose,
  templateToEdit,
  onSave,
}) => {
  const [nome, setNome] = useState('');
  const [titulo, setTitulo] = useState('');
  const [tiposMovimentacao, setTiposMovimentacao] = useState<MovementType[]>(['Atribuição']);
  const [textoPadrao, setTextoPadrao] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoAlign, setLogoAlign] = useState<TermAlign>('esquerda');
  const [logoWidth, setLogoWidth] = useState(120);
  const [tituloAlign, setTituloAlign] = useState<TermAlign>('centro');
  const [rodape, setRodape] = useState('');
  const [ativo, setAtivo] = useState(true);

  const [camposVisiveis, setCamposVisiveis] = useState({
    showCpf: true,
    showPhone: true,
    showEmail: true,
    showRole: true,
    showDepartment: true,
    showAddress: true,
    showBrandModel: true,
    showSerial: true,
    showPatrimonio: true,
    showAccessories: true,
    showObservations: true,
  });

  useEffect(() => {
    if (templateToEdit) {
      setNome(templateToEdit.nome);
      setTitulo(templateToEdit.titulo);
      setTiposMovimentacao(templateToEdit.tiposMovimentacao);
      setTextoPadrao(templateToEdit.textoPadrao);
      setLogoUrl(templateToEdit.logoUrl || '');
      setLogoAlign(templateToEdit.logoAlign);
      setLogoWidth(templateToEdit.logoWidth || 120);
      setTituloAlign(templateToEdit.tituloAlign);
      setRodape(templateToEdit.rodape || '');
      setAtivo(templateToEdit.ativo);
      setCamposVisiveis(templateToEdit.camposVisiveis);
    } else {
      setNome('');
      setTitulo('TERMO DE RESPONSABILIDADE E GUARDA DE EQUIPAMENTO');
      setTiposMovimentacao(['Atribuição']);
      setTextoPadrao(
        `Pelo presente instrumento, a empresa {{organization.name}} (CNPJ {{organization.cnpj}}) entrega nesta data ao(à) colaborador(a) {{collaborator.name}}, portador(a) do CPF nº {{collaborator.cpf}}, o equipamento {{asset.name}} (Patrimônio {{asset.patrimonio}}), para uso exclusivamente profissional.\n\nO(A) colaborador(a) compromete-se a zelar pelo ativo, não instalar softwares não autorizados e devolvê-lo mediante solicitação.`
      );
      setLogoUrl('');
      setLogoAlign('esquerda');
      setLogoWidth(120);
      setTituloAlign('centro');
      setRodape('Documento emitido pelo Sistema Inventy.');
      setAtivo(true);
      setCamposVisiveis({
        showCpf: true,
        showPhone: true,
        showEmail: true,
        showRole: true,
        showDepartment: true,
        showAddress: true,
        showBrandModel: true,
        showSerial: true,
        showPatrimonio: true,
        showAccessories: true,
        showObservations: true,
      });
    }
  }, [templateToEdit, isOpen]);

  const toggleType = (tipo: MovementType) => {
    if (tiposMovimentacao.includes(tipo)) {
      if (tiposMovimentacao.length > 1) {
        setTiposMovimentacao(tiposMovimentacao.filter((t) => t !== tipo));
      }
    } else {
      setTiposMovimentacao([...tiposMovimentacao, tipo]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !titulo.trim() || !textoPadrao.trim()) return;

    onSave({
      nome,
      titulo,
      tiposMovimentacao,
      textoPadrao,
      logoUrl: logoUrl.trim() || undefined,
      logoAlign,
      logoWidth: Number(logoWidth) || 120,
      tituloAlign,
      rodape: rodape.trim() || undefined,
      camposVisiveis,
      ativo,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={templateToEdit ? 'Editar Modelo de Termo' : 'Novo Modelo de Termo (A4)'}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">
              Nome de Identificação do Modelo *
            </label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Termo Padrão de Notebooks & Kits"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Título Impresso no Cabeçalho (A4) *
            </label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: TERMO DE RESPONSABILIDADE E GUARDA"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Alinhamento do Título
            </label>
            <select
              value={tituloAlign}
              onChange={(e) => setTituloAlign(e.target.value as TermAlign)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="esquerda">Esquerda</option>
              <option value="centro">Centralizado</option>
              <option value="direita">Direita</option>
            </select>
          </div>
        </div>

        {/* Movement Types Trigger */}
        <div>
          <label className="block font-bold text-slate-700 mb-1">
            Gatilho Automático para Tipos de Movimentação
          </label>
          <div className="flex flex-wrap gap-2">
            {(['Atribuição', 'Devolução', 'Transferência'] as MovementType[]).map((tipo) => {
              const active = tiposMovimentacao.includes(tipo);
              return (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => toggleType(tipo)}
                  className={`px-3 py-1.5 rounded-lg border font-bold text-xs transition cursor-pointer ${
                    active
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {tipo}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interpolated Text Content */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-bold text-slate-700">Cláusulas e Texto Jurídico *</label>
            <span className="text-[10px] text-emerald-800 font-mono">
              Tags: &#123;&#123;collaborator.name&#125;&#125;, &#123;&#123;asset.patrimonio&#125;&#125;, &#123;&#123;organization.name&#125;&#125;
            </span>
          </div>
          <textarea
            required
            rows={6}
            value={textoPadrao}
            onChange={(e) => setTextoPadrao(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-[11px] leading-relaxed"
          />
        </div>

        {/* Logo Configuration */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
          <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
            <Layout className="w-4 h-4 text-emerald-600" />
            <span>Configuração do Logotipo e Cabeçalho</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-600 mb-1">URL Personalizada do Logo (Opcional)</label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://suaempresa.com.br/logo.png"
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1">Alinhamento do Logo</label>
              <select
                value={logoAlign}
                onChange={(e) => setLogoAlign(e.target.value as TermAlign)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
              >
                <option value="esquerda">Esquerda</option>
                <option value="centro">Centro</option>
                <option value="direita">Direita</option>
              </select>
            </div>
          </div>
        </div>

        {/* Visible Fields Toggle */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
          <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <span>Campos Visíveis no Documento A4</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries({
              showCpf: 'CPF do Colaborador',
              showPhone: 'Telefone do Colaborador',
              showEmail: 'E-mail do Colaborador',
              showRole: 'Cargo do Colaborador',
              showDepartment: 'Departamento',
              showAddress: 'Endereço Completo',
              showBrandModel: 'Marca / Modelo do Ativo',
              showSerial: 'Número de Série',
              showPatrimonio: 'Código de Patrimônio',
              showAccessories: 'Checklist de Acessórios',
              showObservations: 'Motivo / Observações',
            }).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer bg-white p-2 rounded border border-slate-200">
                <input
                  type="checkbox"
                  checked={(camposVisiveis as any)[key]}
                  onChange={(e) =>
                    setCamposVisiveis({
                      ...camposVisiveis,
                      [key]: e.target.checked,
                    })
                  }
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-[11px] font-medium text-slate-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Footer Text */}
        <div>
          <label className="block font-bold text-slate-700 mb-1">
            Texto do Rodapé do Documento (A4)
          </label>
          <input
            type="text"
            value={rodape}
            onChange={(e) => setRodape(e.target.value)}
            placeholder="Ex: Documento emitido eletronicamente pelo Sistema Inventy."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Active Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="templateAtivo"
            checked={ativo}
            onChange={(e) => setAtivo(e.target.checked)}
            className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
          />
          <label htmlFor="templateAtivo" className="font-bold text-slate-800 cursor-pointer">
            Ativar este modelo para emissão automática
          </label>
        </div>

        {/* Modal Controls */}
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition cursor-pointer shadow-xs"
          >
            Salvar Modelo
          </button>
        </div>
      </form>
    </Modal>
  );
};
