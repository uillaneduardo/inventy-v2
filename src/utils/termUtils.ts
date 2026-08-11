import {
  Organization,
  Collaborator,
  Asset,
  MovementType,
  TermTemplate,
  TermSnapshotData,
} from '../types';

export function interpolateText(
  templateText: string,
  data: {
    organization: Organization;
    collaborator: Collaborator;
    asset: Asset;
    movementType: MovementType;
    movementDate: string;
    operatorName: string;
  }
): string {
  const { organization, collaborator, asset, movementType, movementDate, operatorName } = data;

  const fullAddress = [
    collaborator.enderecoLogradouro,
    collaborator.enderecoNumero ? `nº ${collaborator.enderecoNumero}` : '',
    collaborator.enderecoBairro ? `- ${collaborator.enderecoBairro}` : '',
    collaborator.enderecoCidade ? `${collaborator.enderecoCidade}/${collaborator.enderecoEstado || 'SP'}` : '',
  ]
    .filter(Boolean)
    .join(', ');

  const replacements: Record<string, string> = {
    '{{organization.name}}': organization.name || 'Empresa',
    '{{organization.cnpj}}': organization.cnpj || '00.000.000/0001-00',
    '{{collaborator.name}}': collaborator.nome || 'Colaborador',
    '{{collaborator.cpf}}': collaborator.cpf || '000.000.000-00',
    '{{collaborator.role}}': collaborator.cargo || 'Cargo',
    '{{collaborator.department}}': collaborator.departamento || 'Departamento',
    '{{collaborator.unidade}}': collaborator.unidade || 'Unidade',
    '{{collaborator.phone}}': collaborator.telefone || '',
    '{{collaborator.email}}': collaborator.email || '',
    '{{collaborator.address}}': fullAddress || 'Não informado',
    '{{asset.name}}': asset.nome || 'Ativo',
    '{{asset.patrimonio}}': asset.patrimonio || '00000',
    '{{asset.marca}}': asset.marca || '',
    '{{asset.modelo}}': asset.modelo || '',
    '{{asset.serial}}': asset.numeroSerie || 'S/N',
    '{{movement.type}}': movementType,
    '{{movement.date}}': movementDate.substring(0, 10),
    '{{operator.name}}': operatorName,
  };

  let result = templateText;
  Object.entries(replacements).forEach(([key, val]) => {
    result = result.replace(new RegExp(key.replace(/[{()}]/g, '\\$&'), 'g'), val);
  });

  return result;
}

export function createTermSnapshot(params: {
  organization: Organization;
  collaborator: Collaborator;
  asset: Asset;
  movementType: MovementType;
  movementDate: string;
  locationPath: string;
  motivo: string;
  operatorName: string;
  accessoriesDelivered: { id: string; nome: string; incluso: boolean }[];
  template: TermTemplate;
}): TermSnapshotData {
  const {
    organization,
    collaborator,
    asset,
    movementType,
    movementDate,
    locationPath,
    motivo,
    operatorName,
    accessoriesDelivered,
    template,
  } = params;

  const interpolatedBody = interpolateText(template.textoPadrao, {
    organization,
    collaborator,
    asset,
    movementType,
    movementDate,
    operatorName,
  });

  const interpolatedFooter = template.rodape
    ? interpolateText(template.rodape, {
        organization,
        collaborator,
        asset,
        movementType,
        movementDate,
        operatorName,
      })
    : '';

  const fullAddress = [
    collaborator.enderecoLogradouro,
    collaborator.enderecoNumero ? `nº ${collaborator.enderecoNumero}` : '',
    collaborator.enderecoBairro ? `- ${collaborator.enderecoBairro}` : '',
    collaborator.enderecoCidade ? `${collaborator.enderecoCidade}/${collaborator.enderecoEstado || 'SP'}` : '',
  ]
    .filter(Boolean)
    .join(', ');

  return {
    organization: {
      name: organization.name,
      cnpj: organization.cnpj,
      logo: organization.logo,
    },
    collaborator: {
      id: collaborator.id,
      name: collaborator.nome,
      cpf: collaborator.cpf,
      role: collaborator.cargo,
      department: collaborator.departamento,
      unidade: collaborator.unidade,
      phone: collaborator.telefone,
      email: collaborator.email,
      fullAddress,
    },
    asset: {
      id: asset.id,
      patrimonio: asset.patrimonio,
      name: asset.nome,
      marca: asset.marca,
      modelo: asset.modelo,
      numeroSerie: asset.numeroSerie,
      categoriaNome: asset.categoriaNome,
      valor: asset.valor,
    },
    movement: {
      type: movementType,
      date: movementDate,
      location: locationPath,
      motivo,
    },
    accessoriesDelivered,
    template: {
      titulo: template.titulo,
      textoInterpolado: interpolatedBody,
      logoUrl: template.logoUrl || organization.logo,
      logoAlign: template.logoAlign,
      logoWidth: template.logoWidth || 120,
      tituloAlign: template.tituloAlign,
      rodapeInterpolado: interpolatedFooter,
      camposVisiveis: template.camposVisiveis,
    },
    signers: {
      operatorName,
      operatorTitle: 'Gestão de Tecnologia / Ativos',
      collaboratorName: collaborator.nome,
      collaboratorTitle: `${collaborator.cargo} — ${collaborator.departamento}`,
    },
  };
}
